/**
 * PostgreSQL implementation of SlashingProtectionDatabase
 */
import { EthAddress } from '@aztec/foundation/eth-address';
import { type Logger, createLogger } from '@aztec/foundation/log';

import type { Pool, QueryResult } from 'pg';

import type { SlashingProtectionDatabase, TryInsertOrGetResult } from '../types.js';
import {
  DELETE_FAILED_DUTY,
  INSERT_OR_GET_DUTY,
  SCHEMA_VERSION,
  UPDATE_DUTY_FAILED,
  UPDATE_DUTY_SIGNED,
} from './schema.js';
import type { CheckAndRecordParams, DutyStatus, DutyType, ValidatorDutyRecord } from './types.js';

/**
 * Row type from PostgreSQL query
 */
interface DutyRow {
  validator_address: string;
  slot: string;
  block_number: string;
  duty_type: DutyType;
  status: DutyStatus;
  message_hash: string;
  signature: string | null;
  node_id: string;
  started_at: Date;
  completed_at: Date | null;
  error_message: string | null;
}

/**
 * Row type from INSERT_OR_GET_DUTY query (includes is_new flag)
 */
interface InsertOrGetRow extends DutyRow {
  is_new: boolean;
}

/**
 * PostgreSQL implementation of the slashing protection database
 */
export class PostgresSlashingProtectionDatabase implements SlashingProtectionDatabase {
  private readonly log: Logger;

  constructor(private readonly pool: Pool) {
    this.log = createLogger('slashing-protection:postgres');
  }

  /**
   * Verify that database migrations have been run and schema version matches.
   * Should be called once at startup.
   *
   * @throws Error if migrations haven't been run or schema version is outdated
   */
  async initialize(): Promise<void> {
    let dbVersion: number;

    try {
      const result = await this.pool.query<{ version: number }>(
        `SELECT version FROM schema_version ORDER BY version DESC LIMIT 1`,
      );

      if (result.rows.length === 0) {
        throw new Error('No version found');
      }

      dbVersion = result.rows[0].version;
    } catch {
      throw new Error(
        'Database schema not initialized. Please run migrations first: aztec migrate up --database-url <url>',
      );
    }

    if (dbVersion < SCHEMA_VERSION) {
      throw new Error(
        `Database schema version ${dbVersion} is outdated (expected ${SCHEMA_VERSION}). Please run migrations: aztec migrate up --database-url <url>`,
      );
    }

    if (dbVersion > SCHEMA_VERSION) {
      throw new Error(
        `Database schema version ${dbVersion} is newer than expected (${SCHEMA_VERSION}). Please update your application.`,
      );
    }

    this.log.info('Database schema verified', { version: dbVersion });
  }

  /**
   * Atomically try to insert a new duty record, or get the existing one if present.
   *
   * @returns { isNew: true, record } if we successfully inserted and acquired the lock
   * @returns { isNew: false, record } if a record already exists
   */
  async tryInsertOrGetExisting(params: CheckAndRecordParams): Promise<TryInsertOrGetResult> {
    const result: QueryResult<InsertOrGetRow> = await this.pool.query(INSERT_OR_GET_DUTY, [
      params.validatorAddress.toString(),
      params.slot.toString(),
      params.blockNumber.toString(),
      params.dutyType,
      params.messageHash,
      params.nodeId,
    ]);

    if (result.rows.length === 0) {
      // This shouldn't happen - the query always returns either the inserted or existing row
      throw new Error('INSERT_OR_GET_DUTY returned no rows');
    }

    const row = result.rows[0];
    return {
      isNew: row.is_new,
      record: this.rowToRecord(row),
    };
  }

  /**
   * Update a duty to 'signed' status with the signature
   */
  async updateDutySigned(
    validatorAddress: EthAddress,
    slot: bigint,
    dutyType: DutyType,
    signature: string,
  ): Promise<void> {
    const result = await this.pool.query(UPDATE_DUTY_SIGNED, [
      signature,
      validatorAddress.toString(),
      slot.toString(),
      dutyType,
    ]);

    if (result.rowCount === 0) {
      this.log.warn('No duty found to update to signed status', {
        validatorAddress: validatorAddress.toString(),
        slot: slot.toString(),
        dutyType,
      });
    }
  }

  /**
   * Update a duty to 'failed' status with error message
   */
  async updateDutyFailed(
    validatorAddress: EthAddress,
    slot: bigint,
    dutyType: DutyType,
    errorMessage: string,
  ): Promise<void> {
    const result = await this.pool.query(UPDATE_DUTY_FAILED, [
      errorMessage,
      validatorAddress.toString(),
      slot.toString(),
      dutyType,
    ]);

    if (result.rowCount === 0) {
      this.log.warn('No duty found to update to failed status', {
        validatorAddress: validatorAddress.toString(),
        slot: slot.toString(),
        dutyType,
      });
    }
  }

  /**
   * Delete a failed duty to allow retry
   * @returns true if a record was deleted, false otherwise
   */
  async deleteFailedDuty(validatorAddress: EthAddress, slot: bigint, dutyType: DutyType): Promise<boolean> {
    const result = await this.pool.query(DELETE_FAILED_DUTY, [validatorAddress.toString(), slot.toString(), dutyType]);

    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Convert a database row to a ValidatorDutyRecord
   */
  private rowToRecord(row: DutyRow): ValidatorDutyRecord {
    return {
      validatorAddress: EthAddress.fromString(row.validator_address),
      slot: BigInt(row.slot),
      blockNumber: BigInt(row.block_number),
      dutyType: row.duty_type,
      status: row.status,
      messageHash: row.message_hash,
      signature: row.signature ?? undefined,
      nodeId: row.node_id,
      startedAt: row.started_at,
      completedAt: row.completed_at ?? undefined,
      errorMessage: row.error_message ?? undefined,
    };
  }

  /**
   * Close the database connection pool
   */
  async close(): Promise<void> {
    await this.pool.end();
    this.log.info('Database connection pool closed');
  }
}
