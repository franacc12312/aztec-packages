import { BlockNumber, SlotNumber } from '@aztec/foundation/branded-types';
import { Buffer32 } from '@aztec/foundation/buffer';
import { EthAddress } from '@aztec/foundation/eth-address';

import { PGlite } from '@electric-sql/pglite';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Pool } from '@middle-management/pglite-pg-adapter';

import { PostgresSlashingProtectionDatabase } from './postgres.js';
import {
  DELETE_DUTY,
  INSERT_OR_GET_DUTY,
  INSERT_SCHEMA_VERSION,
  SCHEMA_SETUP,
  SCHEMA_VERSION,
  UPDATE_DUTY_SIGNED,
} from './schema.js';
import { setupTestSchema } from './test_helper.js';
import { type DutyRow, DutyStatus, DutyType, type InsertOrGetRow } from './types.js';

/**
 * Integration tests for PostgreSQL queries using PGlite.
 */
describe('PostgreSQL Queries', () => {
  let db: PGlite;

  const VALIDATOR_ADDRESS = EthAddress.random().toString();
  const SLOT = 100n;
  const BLOCK_NUMBER = 50n;
  const BLOCK_INDEX_WITHIN_CHECKPOINT = 0;
  const DUTY_TYPE = DutyType.BLOCK_PROPOSAL;
  const MESSAGE_HASH = Buffer32.random().toString();
  const NODE_ID = 'node-1';
  const LOCK_TOKEN = 'test-lock-token-12345';
  const SIGNATURE = '0xsignature';

  beforeEach(async () => {
    db = new PGlite();

    await setupTestSchema(db);
  });

  afterEach(async () => {
    await db.close();
  });

  describe('INSERT_OR_GET_DUTY', () => {
    it('should insert new record and return is_new=true', async () => {
      const result = await db.query<InsertOrGetRow>(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DUTY_TYPE,
        MESSAGE_HASH,
        NODE_ID,
        LOCK_TOKEN,
      ]);

      expect(result.rows.length).toBe(1);
      const row = result.rows[0];
      expect(row.is_new).toBe(true);
      expect(row.status).toBe(DutyStatus.SIGNING);
      expect(row.validator_address).toBe(VALIDATOR_ADDRESS.toString());
      expect(BigInt(row.slot)).toBe(SLOT);
      expect(row.node_id).toBe(NODE_ID);
      expect(row.lock_token).toBe(LOCK_TOKEN);
    });

    it('should return existing record with is_new=false on duplicate', async () => {
      // First insert
      await db.query(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DUTY_TYPE,
        MESSAGE_HASH,
        NODE_ID,
        LOCK_TOKEN,
      ]);

      // Second insert attempt with different node
      const result = await db.query<InsertOrGetRow>(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DUTY_TYPE,
        MESSAGE_HASH,
        'node-2', // Different node trying to acquire
        'different-token',
      ]);

      expect(result.rows.length).toBe(1);
      const row = result.rows[0];
      expect(row.is_new).toBe(false);
      expect(row.node_id).toBe(NODE_ID); // Original node still owns it
    });

    it('should not expose lock_token for existing records', async () => {
      // node acquires the lock
      const insertResult = await db.query<InsertOrGetRow>(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DUTY_TYPE,
        MESSAGE_HASH,
        NODE_ID,
        LOCK_TOKEN,
      ]);
      expect(insertResult.rows[0].is_new).toBe(true);
      expect(insertResult.rows[0].lock_token).toBe(LOCK_TOKEN);

      // Second insert attempt - should not get the original lock_token
      const conflictResult = await db.query<InsertOrGetRow>(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DUTY_TYPE,
        MESSAGE_HASH,
        'competing-node',
        'competing-token',
      ]);
      expect(conflictResult.rows[0].is_new).toBe(false);
      expect(conflictResult.rows[0].lock_token).toBe(''); // Empty string, not the original token
    });

    it('should allow different duty types for same slot', async () => {
      // Insert BLOCK_PROPOSAL
      const result1 = await db.query<InsertOrGetRow>(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DutyType.BLOCK_PROPOSAL,
        MESSAGE_HASH,
        NODE_ID,
        LOCK_TOKEN,
      ]);

      // Insert ATTESTATION for same slot
      const result2 = await db.query<InsertOrGetRow>(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        -1,
        DutyType.ATTESTATION,
        MESSAGE_HASH,
        NODE_ID,
        'token-2',
      ]);

      expect(result1.rows[0].is_new).toBe(true);
      expect(result2.rows[0].is_new).toBe(true);
    });

    it('should allow same duty type for different slots', async () => {
      const result1 = await db.query<InsertOrGetRow>(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        '100',
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DUTY_TYPE,
        MESSAGE_HASH,
        NODE_ID,
        'token-1',
      ]);

      const result2 = await db.query<InsertOrGetRow>(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        '101',
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DUTY_TYPE,
        MESSAGE_HASH,
        NODE_ID,
        'token-2',
      ]);

      expect(result1.rows[0].is_new).toBe(true);
      expect(result2.rows[0].is_new).toBe(true);
    });
  });

  describe('UPDATE_DUTY_SIGNED', () => {
    it('should update status to signed and set signature with correct token', async () => {
      // Insert a duty first
      await db.query<InsertOrGetRow>(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DUTY_TYPE,
        MESSAGE_HASH,
        NODE_ID,
        LOCK_TOKEN,
      ]);

      // Update to signed with correct token
      const updateResult = await db.query(UPDATE_DUTY_SIGNED, [
        SIGNATURE,
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        DUTY_TYPE,
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        LOCK_TOKEN,
      ]);

      expect(updateResult.affectedRows).toBe(1);

      // Verify the update
      const selectResult = await db.query<DutyRow>(
        `SELECT status, signature, completed_at FROM validator_duties
         WHERE validator_address = $1 AND slot = $2 AND duty_type = $3 AND block_index_within_checkpoint = $4`,
        [VALIDATOR_ADDRESS.toString(), SLOT.toString(), DUTY_TYPE, BLOCK_INDEX_WITHIN_CHECKPOINT],
      );

      const row = selectResult.rows[0];
      expect(row.status).toBe(DutyStatus.SIGNED);
      expect(row.signature).toBe(SIGNATURE);
      expect(row.completed_at).toBeTruthy();
    });

    it('should not update with wrong token', async () => {
      await db.query<InsertOrGetRow>(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DUTY_TYPE,
        MESSAGE_HASH,
        NODE_ID,
        LOCK_TOKEN,
      ]);

      // Try to update with wrong token
      const updateResult = await db.query<DutyRow>(UPDATE_DUTY_SIGNED, [
        SIGNATURE,
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        DUTY_TYPE,
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        'wrong-token',
      ]);

      expect(updateResult.affectedRows).toBe(0);

      // Verify still in signing state
      const selectResult = await db.query<DutyRow>(
        `SELECT status FROM validator_duties WHERE validator_address = $1 AND slot = $2`,
        [VALIDATOR_ADDRESS.toString(), SLOT.toString()],
      );
      expect(selectResult.rows[0].status).toBe(DutyStatus.SIGNING);
    });

    it('should not update if status is not signing', async () => {
      // Insert and mark as signed
      await db.query<InsertOrGetRow>(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DUTY_TYPE,
        MESSAGE_HASH,
        NODE_ID,
        LOCK_TOKEN,
      ]);
      await db.query<DutyRow>(UPDATE_DUTY_SIGNED, [
        SIGNATURE,
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        DUTY_TYPE,
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        LOCK_TOKEN,
      ]);

      // Try to update again with correct token
      const result = await db.query<DutyRow>(UPDATE_DUTY_SIGNED, [
        'new-signature',
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        DUTY_TYPE,
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        LOCK_TOKEN,
      ]);

      expect(result.affectedRows).toBe(0);

      // Verify signature unchanged
      const selectResult = await db.query<DutyRow>(
        `SELECT signature FROM validator_duties WHERE validator_address = $1 AND slot = $2`,
        [VALIDATOR_ADDRESS.toString(), SLOT.toString()],
      );
      expect(selectResult.rows[0].signature).toBe(SIGNATURE);
    });
  });

  describe('DELETE_DUTY', () => {
    it('should delete a signing duty with correct token', async () => {
      await db.query(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DUTY_TYPE,
        MESSAGE_HASH,
        NODE_ID,
        LOCK_TOKEN,
      ]);

      const deleteResult = await db.query(DELETE_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        DUTY_TYPE,
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        LOCK_TOKEN,
      ]);

      expect(deleteResult.affectedRows).toBe(1);

      // Verify deleted
      const selectResult = await db.query(`SELECT * FROM validator_duties WHERE validator_address = $1 AND slot = $2`, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
      ]);
      expect(selectResult.rows.length).toBe(0);
    });

    it('should not delete with wrong token', async () => {
      await db.query(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DUTY_TYPE,
        MESSAGE_HASH,
        NODE_ID,
        LOCK_TOKEN,
      ]);

      const deleteResult = await db.query(DELETE_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        DUTY_TYPE,
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        'wrong-token',
      ]);

      expect(deleteResult.affectedRows).toBe(0);

      // Verify still exists
      const selectResult = await db.query(`SELECT * FROM validator_duties WHERE validator_address = $1 AND slot = $2`, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
      ]);
      expect(selectResult.rows.length).toBe(1);
    });

    it('should not delete a signed duty', async () => {
      await db.query(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DUTY_TYPE,
        MESSAGE_HASH,
        NODE_ID,
        LOCK_TOKEN,
      ]);
      await db.query(UPDATE_DUTY_SIGNED, [
        SIGNATURE,
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        DUTY_TYPE,
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        LOCK_TOKEN,
      ]);

      // Even with correct token, can't delete a signed duty
      const deleteResult = await db.query(DELETE_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        DUTY_TYPE,
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        LOCK_TOKEN,
      ]);

      expect(deleteResult.affectedRows).toBe(0);

      // Verify still exists
      const selectResult = await db.query(`SELECT * FROM validator_duties WHERE validator_address = $1 AND slot = $2`, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
      ]);
      expect(selectResult.rows.length).toBe(1);
    });
  });

  describe('constraints', () => {
    it('should enforce primary key constraint (validator_address, slot, duty_type, block_index_within_checkpoint)', async () => {
      await db.query(INSERT_OR_GET_DUTY, [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        BLOCK_INDEX_WITHIN_CHECKPOINT,
        DUTY_TYPE,
        MESSAGE_HASH,
        NODE_ID,
        LOCK_TOKEN,
      ]);

      // Direct insert should fail due to primary key constraint
      await expect(
        db.query(
          `INSERT INTO validator_duties (validator_address, slot, block_number, block_index_within_checkpoint, duty_type, status, message_hash, node_id, lock_token)
           VALUES ($1, $2, $3, $4, $5, 'signing', $6, $7, $8)`,
          [
            VALIDATOR_ADDRESS.toString(),
            SLOT.toString(),
            BLOCK_NUMBER.toString(),
            BLOCK_INDEX_WITHIN_CHECKPOINT,
            DUTY_TYPE,
            MESSAGE_HASH,
            'node-2',
            'token-2',
          ],
        ),
      ).rejects.toThrow();
    });

    it('should enforce duty_type check constraint', async () => {
      await expect(
        db.query(
          `INSERT INTO validator_duties (validator_address, slot, block_number, block_index_within_checkpoint, duty_type, status, message_hash, node_id, lock_token)
           VALUES ($1, $2, $3, $4, 'INVALID_TYPE', 'signing', $5, $6, $7)`,
          [
            VALIDATOR_ADDRESS.toString(),
            SLOT.toString(),
            BLOCK_NUMBER.toString(),
            BLOCK_INDEX_WITHIN_CHECKPOINT,
            MESSAGE_HASH,
            NODE_ID,
            LOCK_TOKEN,
          ],
        ),
      ).rejects.toThrow();
    });

    it('should enforce status check constraint', async () => {
      await expect(
        db.query(
          `INSERT INTO validator_duties (validator_address, slot, block_number, block_index_within_checkpoint, duty_type, status, message_hash, node_id, lock_token)
           VALUES ($1, $2, $3, $4, $5, 'invalid_status', $6, $7, $8)`,
          [
            VALIDATOR_ADDRESS.toString(),
            SLOT.toString(),
            BLOCK_NUMBER.toString(),
            BLOCK_INDEX_WITHIN_CHECKPOINT,
            DUTY_TYPE,
            MESSAGE_HASH,
            NODE_ID,
            LOCK_TOKEN,
          ],
        ),
      ).rejects.toThrow();
    });
  });
});

describe('PostgresSlashingProtectionDatabase', () => {
  let pglite: PGlite;
  // pool needs to be 'any' due to some low-level discrepancies
  // between pg's Pool & the adapter's implementation
  let pool: any;

  beforeEach(() => {
    pglite = new PGlite();
    pool = new Pool({ pglite });
  });

  afterEach(async () => {
    await pool.end();
  });

  describe('initialize', () => {
    it('should succeed when schema_version table exists with correct version', async () => {
      // Set up schema with correct version
      for (const statement of SCHEMA_SETUP) {
        await pglite.query(statement);
      }
      await pglite.query(INSERT_SCHEMA_VERSION, [SCHEMA_VERSION]);

      const db = new PostgresSlashingProtectionDatabase(pool);

      await expect(db.initialize()).resolves.not.toThrow();
    });

    it('should throw when schema_version table does not exist', async () => {
      const db = new PostgresSlashingProtectionDatabase(pool);

      await expect(db.initialize()).rejects.toThrow(
        'Database schema not initialized. Please run migrations first: aztec migrate-ha-db up --database-url <url>',
      );
    });

    it('should throw when schema_version table is empty', async () => {
      // Create schema_version table but don't insert any version
      await pglite.query(`
        CREATE TABLE schema_version (
          version INTEGER PRIMARY KEY,
          applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);

      const db = new PostgresSlashingProtectionDatabase(pool);

      await expect(db.initialize()).rejects.toThrow(
        'Database schema not initialized. Please run migrations first: aztec migrate-ha-db up --database-url <url>',
      );
    });

    it('should throw when schema version is lower than expected', async () => {
      // Set up schema with outdated version
      for (const statement of SCHEMA_SETUP) {
        await pglite.query(statement);
      }
      await pglite.query(INSERT_SCHEMA_VERSION, [SCHEMA_VERSION - 1]);

      const db = new PostgresSlashingProtectionDatabase(pool);

      await expect(db.initialize()).rejects.toThrow(
        `Database schema version ${SCHEMA_VERSION - 1} is outdated (expected ${SCHEMA_VERSION}). Please run migrations: aztec migrate-ha-db up --database-url <url>`,
      );
    });

    it('should throw when schema version is higher than expected', async () => {
      // Set up schema with newer version
      for (const statement of SCHEMA_SETUP) {
        await pglite.query(statement);
      }
      await pglite.query(INSERT_SCHEMA_VERSION, [SCHEMA_VERSION + 1]);

      const db = new PostgresSlashingProtectionDatabase(pool);

      await expect(db.initialize()).rejects.toThrow(
        `Database schema version ${SCHEMA_VERSION + 1} is newer than expected (${SCHEMA_VERSION}). Please update your application.`,
      );
    });

    it('should allow closing the database connection', async () => {
      const db = new PostgresSlashingProtectionDatabase(pool);

      const endSpy = jest.spyOn(pool, 'end');
      await db.close();
      expect(endSpy).toHaveBeenCalled();
    });
  });

  describe('tryInsertOrGetExisting retry logic', () => {
    const VALIDATOR_ADDRESS = EthAddress.random();
    const SLOT = SlotNumber(100);
    const BLOCK_NUMBER = BlockNumber(50);
    const MESSAGE_HASH = Buffer32.random().toString();
    const NODE_ID = 'node-1';

    beforeEach(async () => {
      for (const statement of SCHEMA_SETUP) {
        await pglite.query(statement);
      }
      await pglite.query(INSERT_SCHEMA_VERSION, [SCHEMA_VERSION]);
    });

    it('should retry when query returns no rows initially', async () => {
      const db = new PostgresSlashingProtectionDatabase(pool);
      let callCount = 0;

      // Mock pool.query to return no rows on first call, then rows on second call
      const originalQuery = pool.query.bind(pool);
      jest.spyOn(pool, 'query').mockImplementation(async (...args: any[]) => {
        callCount++;
        if (callCount === 1) {
          // First call: simulate race condition - no rows returned
          return { rows: [] };
        }
        // Subsequent calls: return actual result
        return await originalQuery(...args);
      });

      const result = await db.tryInsertOrGetExisting({
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        blockNumber: BLOCK_NUMBER,
        blockIndexWithinCheckpoint: 0,
        dutyType: DutyType.BLOCK_PROPOSAL,
        messageHash: MESSAGE_HASH,
        nodeId: NODE_ID,
      });

      // Should have retried (called at least twice)
      expect(callCount).toBeGreaterThanOrEqual(2);
      // Should eventually succeed
      expect(result.isNew).toBe(true);
      expect(result.record.validatorAddress).toEqual(VALIDATOR_ADDRESS);
      expect(result.record.slot).toBe(SLOT);

      // Restore original query
      jest.restoreAllMocks();
    });

    it('should retry multiple times if needed', async () => {
      const db = new PostgresSlashingProtectionDatabase(pool);
      let callCount = 0;

      // Mock pool.query to return no rows on first two calls, then rows on third call
      const originalQuery = pool.query.bind(pool);
      jest.spyOn(pool, 'query').mockImplementation(async (...args: any[]) => {
        callCount++;
        if (callCount <= 2) {
          // First two calls: simulate race condition - no rows returned
          return { rows: [] };
        }
        // Third call: return actual result
        return await originalQuery(...args);
      });

      const result = await db.tryInsertOrGetExisting({
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        blockNumber: BLOCK_NUMBER,
        blockIndexWithinCheckpoint: 0,
        dutyType: DutyType.BLOCK_PROPOSAL,
        messageHash: MESSAGE_HASH,
        nodeId: NODE_ID,
      });

      // Should have retried multiple times
      expect(callCount).toBeGreaterThanOrEqual(3);
      // Should eventually succeed
      expect(result.isNew).toBe(true);

      // Restore original query
      jest.restoreAllMocks();
    });

    it('should throw error after all retries are exhausted', async () => {
      const db = new PostgresSlashingProtectionDatabase(pool);

      // Mock pool.query to always return no rows
      jest.spyOn(pool, 'query').mockResolvedValue({ rows: [] });

      await expect(
        db.tryInsertOrGetExisting({
          validatorAddress: VALIDATOR_ADDRESS,
          slot: SLOT,
          blockNumber: BLOCK_NUMBER,
          blockIndexWithinCheckpoint: 0,
          dutyType: DutyType.BLOCK_PROPOSAL,
          messageHash: MESSAGE_HASH,
          nodeId: NODE_ID,
        }),
      ).rejects.toThrow('INSERT_OR_GET_DUTY returned no rows');

      // Restore original query
      jest.restoreAllMocks();
    });
  });

  describe('large numbers handling', () => {
    const VALIDATOR_ADDRESS = EthAddress.random();
    const SLOT = SlotNumber(100);
    const BLOCK_NUMBER = BlockNumber(50);
    const MESSAGE_HASH = Buffer32.random().toString();
    const NODE_ID = 'node-1';

    beforeEach(async () => {
      for (const statement of SCHEMA_SETUP) {
        await pglite.query(statement);
      }
      await pglite.query(INSERT_SCHEMA_VERSION, [SCHEMA_VERSION]);
    });

    it('should handle large slot numbers correctly', async () => {
      const largeSlot = SlotNumber(Number.MAX_SAFE_INTEGER); // Max safe integer

      const db = new PostgresSlashingProtectionDatabase(pool);
      const result = await db.tryInsertOrGetExisting({
        validatorAddress: VALIDATOR_ADDRESS,
        slot: largeSlot,
        blockNumber: BLOCK_NUMBER,
        blockIndexWithinCheckpoint: 0,
        dutyType: DutyType.BLOCK_PROPOSAL,
        messageHash: MESSAGE_HASH,
        nodeId: NODE_ID,
      });

      expect(result.isNew).toBe(true);
      expect(result.record.slot).toBe(largeSlot);
    });

    it('should handle large block numbers correctly', async () => {
      const largeBlockNumber = BlockNumber(Number.MAX_SAFE_INTEGER);

      const db = new PostgresSlashingProtectionDatabase(pool);
      const result = await db.tryInsertOrGetExisting({
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        blockNumber: largeBlockNumber,
        blockIndexWithinCheckpoint: 0,
        dutyType: DutyType.BLOCK_PROPOSAL,
        messageHash: MESSAGE_HASH,
        nodeId: NODE_ID,
      });

      expect(result.isNew).toBe(true);
      expect(result.record.blockNumber).toBe(largeBlockNumber);
    });
  });
});
