/* eslint-disable camelcase */
import { EthAddress } from '@aztec/foundation/eth-address';

import { beforeEach, describe, expect, it } from '@jest/globals';
import { type MockProxy, mock } from 'jest-mock-extended';
import type { Pool, PoolClient } from 'pg';

import { PostgresSlashingProtectionDatabase } from './postgres.js';
import { DutyStatus } from './types.js';
import { type CheckAndRecordParams, DutyType } from './types.js';

describe('PostgresSlashingProtectionDatabase', () => {
  let mockPool: MockProxy<Pool>;
  let mockClient: MockProxy<PoolClient>;
  let db: PostgresSlashingProtectionDatabase;

  const VALIDATOR_ADDRESS = EthAddress.fromString('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266');
  const SLOT = 100n;
  const BLOCK_NUMBER = 50n;
  const DUTY_TYPE: DutyType = DutyType.BLOCK_PROPOSAL;
  const SIGNING_ROOT = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  const NODE_ID = 'node-1';
  const SIGNATURE = '0xsignature';

  beforeEach(() => {
    // Create mock client
    mockClient = mock<PoolClient>();

    // Create mock pool
    mockPool = mock<Pool>();
    mockPool.connect.mockImplementation(() => Promise.resolve(mockClient));

    db = new PostgresSlashingProtectionDatabase(mockPool);
  });

  describe('initialize', () => {
    it('should initialize database schema successfully', async () => {
      (mockClient.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 0 });

      await db.initialize();

      // Should start transaction
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');

      // Should run all schema setup statements (4 statements)
      const calls = (mockClient.query as jest.Mock).mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(6); // BEGIN + 4 schema statements + version + COMMIT

      // Should commit transaction
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');

      // Should release client
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should rollback on error', async () => {
      const error = new Error('Database error');
      (mockClient.query as jest.Mock).mockRejectedValue(error);

      await expect(db.initialize()).rejects.toThrow('Database error');

      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('findDuty', () => {
    it('should return null when duty not found', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 0 });

      const result = await db.findDuty(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE);

      expect(result).toBeNull();
      expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        DUTY_TYPE,
      ]);
    });

    it('should return duty record when found', async () => {
      const dbRow = {
        validator_address: VALIDATOR_ADDRESS.toString(),
        slot: SLOT.toString(),
        block_number: BLOCK_NUMBER.toString(),
        duty_type: DUTY_TYPE,
        status: DutyStatus.SIGNING,
        signing_root: SIGNING_ROOT,
        signature: null,
        node_id: NODE_ID,
        started_at: new Date('2024-01-01T00:00:00Z'),
        completed_at: null,
        error_message: null,
      };

      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [dbRow], rowCount: 1 });

      const result = await db.findDuty(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE);

      expect(result).not.toBeNull();
      expect(result!.validatorAddress.toString()).toBe(VALIDATOR_ADDRESS.toString());
      expect(result!.slot).toBe(SLOT);
      expect(result!.blockNumber).toBe(BLOCK_NUMBER);
      expect(result!.dutyType).toBe(DUTY_TYPE);
      expect(result!.status).toBe(DutyStatus.SIGNING);
      expect(result!.signingRoot).toBe(SIGNING_ROOT);
      expect(result!.signature).toBeUndefined();
      expect(result!.nodeId).toBe(NODE_ID);
      expect(result!.startedAt).toEqual(new Date('2024-01-01T00:00:00Z'));
      expect(result!.completedAt).toBeUndefined();
      expect(result!.errorMessage).toBeUndefined();
    });

    it('should convert signed duty with all fields', async () => {
      const dbRow = {
        validator_address: VALIDATOR_ADDRESS.toString(),
        slot: SLOT.toString(),
        block_number: BLOCK_NUMBER.toString(),
        duty_type: DUTY_TYPE,
        status: DutyStatus.SIGNED,
        signing_root: SIGNING_ROOT,
        signature: SIGNATURE,
        node_id: NODE_ID,
        started_at: new Date('2024-01-01T00:00:00Z'),
        completed_at: new Date('2024-01-01T00:01:00Z'),
        error_message: null,
      };

      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [dbRow], rowCount: 1 });

      const result = await db.findDuty(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE);

      expect(result).not.toBeNull();
      expect(result!.status).toBe(DutyStatus.SIGNED);
      expect(result!.signature).toBe(SIGNATURE);
      expect(result!.completedAt).toEqual(new Date('2024-01-01T00:01:00Z'));
    });

    it('should convert failed duty with error message', async () => {
      const dbRow = {
        validator_address: VALIDATOR_ADDRESS.toString(),
        slot: SLOT.toString(),
        block_number: BLOCK_NUMBER.toString(),
        duty_type: DUTY_TYPE,
        status: DutyStatus.FAILED,
        signing_root: SIGNING_ROOT,
        signature: null,
        node_id: NODE_ID,
        started_at: new Date('2024-01-01T00:00:00Z'),
        completed_at: new Date('2024-01-01T00:01:00Z'),
        error_message: 'Test error',
      };

      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [dbRow], rowCount: 1 });

      const result = await db.findDuty(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE);

      expect(result).not.toBeNull();
      expect(result!.status).toBe(DutyStatus.FAILED);
      expect(result!.errorMessage).toBe('Test error');
    });
  });

  describe('insertDuty', () => {
    const params: CheckAndRecordParams = {
      validatorAddress: VALIDATOR_ADDRESS,
      slot: SLOT,
      blockNumber: BLOCK_NUMBER,
      dutyType: DUTY_TYPE,
      signingRoot: SIGNING_ROOT,
      nodeId: NODE_ID,
    };

    it('should insert duty successfully and return true', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 1 });

      const result = await db.insertDuty(params);

      expect(result).toBe(true);
      expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        BLOCK_NUMBER.toString(),
        DUTY_TYPE,
        SIGNING_ROOT,
        NODE_ID,
      ]);
    });

    it('should return false on unique constraint violation', async () => {
      const error: any = new Error('duplicate key value');
      error.code = '23505'; // PostgreSQL unique constraint violation

      (mockPool.query as jest.Mock).mockRejectedValue(error);

      const result = await db.insertDuty(params);

      expect(result).toBe(false);
    });

    it('should throw on other database errors', async () => {
      const error: any = new Error('Connection lost');
      error.code = '08006'; // Connection failure

      (mockPool.query as jest.Mock).mockRejectedValue(error);

      await expect(db.insertDuty(params)).rejects.toThrow('Connection lost');
    });
  });

  describe('updateDutySigned', () => {
    it('should update duty to signed status', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 1 });

      await db.updateDutySigned(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE, SIGNATURE);

      expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [
        SIGNATURE,
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        DUTY_TYPE,
      ]);
    });

    it('should not throw when duty not found', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 0 });

      await expect(db.updateDutySigned(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE, SIGNATURE)).resolves.not.toThrow();
    });
  });

  describe('updateDutyFailed', () => {
    it('should update duty to failed status', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 1 });

      await db.updateDutyFailed(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE, 'Test error');

      expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [
        'Test error',
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        DUTY_TYPE,
      ]);
    });

    it('should not throw when duty not found', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 0 });

      await expect(db.updateDutyFailed(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE, 'Test error')).resolves.not.toThrow();
    });
  });

  describe('deleteFailedDuty', () => {
    it('should delete failed duty and return true', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 1 });

      const result = await db.deleteFailedDuty(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE);

      expect(result).toBe(true);
      expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        DUTY_TYPE,
      ]);
    });

    it('should return false when no duty deleted', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 0 });

      const result = await db.deleteFailedDuty(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE);

      expect(result).toBe(false);
    });

    it('should return false when rowCount is null', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: null });

      const result = await db.deleteFailedDuty(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE);

      expect(result).toBe(false);
    });
  });

  describe('close', () => {
    it('should close database connection pool', async () => {
      (mockPool.end as jest.Mock).mockResolvedValue(undefined);

      await db.close();

      expect(mockPool.end).toHaveBeenCalled();
    });

    it('should propagate errors from pool.end', async () => {
      const error = new Error('Failed to close pool');
      (mockPool.end as jest.Mock).mockRejectedValue(error);

      await expect(db.close()).rejects.toThrow('Failed to close pool');
    });
  });

  describe('data type conversions', () => {
    it('should handle large bigint values', async () => {
      const largeSlot = 9007199254740991n;
      const largeBlockNumber = 9007199254740991n;

      const params: CheckAndRecordParams = {
        validatorAddress: VALIDATOR_ADDRESS,
        slot: largeSlot,
        blockNumber: largeBlockNumber,
        dutyType: DUTY_TYPE,
        signingRoot: SIGNING_ROOT,
        nodeId: NODE_ID,
      };

      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 1 });

      await db.insertDuty(params);

      expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [
        VALIDATOR_ADDRESS.toString(),
        largeSlot.toString(),
        largeBlockNumber.toString(),
        DUTY_TYPE,
        SIGNING_ROOT,
        NODE_ID,
      ]);
    });

    it('should handle all duty types', async () => {
      const dutyTypes: DutyType[] = [DutyType.BLOCK_PROPOSAL, DutyType.ATTESTATION, DutyType.ATTESTATIONS_AND_SIGNERS];

      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 0 });

      for (const dutyType of dutyTypes) {
        await db.findDuty(VALIDATOR_ADDRESS, SLOT, dutyType);

        expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [
          VALIDATOR_ADDRESS.toString(),
          SLOT.toString(),
          dutyType,
        ]);
      }
    });

    it('should handle long error messages', async () => {
      const longError = 'x'.repeat(10000); // Very long error message

      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 1 });

      await db.updateDutyFailed(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE, longError);

      expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [
        longError,
        VALIDATOR_ADDRESS.toString(),
        SLOT.toString(),
        DUTY_TYPE,
      ]);
    });

    it('should handle various EthAddress formats', async () => {
      const addresses = [
        EthAddress.fromString('0x0000000000000000000000000000000000000000'),
        EthAddress.fromString('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'),
        EthAddress.fromString('0x1234567890123456789012345678901234567890'),
      ];

      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 0 });

      for (const address of addresses) {
        await db.findDuty(address, SLOT, DUTY_TYPE);

        expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), [
          address.toString(),
          SLOT.toString(),
          DUTY_TYPE,
        ]);
      }
    });
  });
});
