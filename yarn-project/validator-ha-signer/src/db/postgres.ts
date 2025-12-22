/**
 * PostgreSQL implementation of SlashingProtectionDatabase
 */
import { EthAddress } from '@aztec/foundation/eth-address';
import { type Logger, createLogger } from '@aztec/foundation/log';

import type { Pool, QueryResult } from 'pg';

import type { SlashingProtectionDatabase } from '../types.js';
import {
  CHECK_DUTY_EXISTS,
  DELETE_FAILED_DUTY,
  INSERT_DUTY,
  INSERT_SCHEMA_VERSION,
  SCHEMA_SETUP,
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
  signing_root: string;
  signature: string | null;
  node_id: string;
  started_at: Date;
  completed_at: Date | null;
  error_message: string | null;
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
   * Initialize the database schema
   * Should be called once at startup
   */
  async initialize(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Run all schema setup statements
      for (const statement of SCHEMA_SETUP) {
        await client.query(statement);
      }

      // Record schema version
      await client.query(INSERT_SCHEMA_VERSION, [SCHEMA_VERSION]);

      await client.query('COMMIT');
      this.log.info('Database schema initialized', { version: SCHEMA_VERSION });
    } catch (error) {
      await client.query('ROLLBACK');
      this.log.error('Failed to initialize database schema', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Find an existing duty record
   */
  async findDuty(validatorAddress: EthAddress, slot: bigint, dutyType: DutyType): Promise<ValidatorDutyRecord | null> {
    const result: QueryResult<DutyRow> = await this.pool.query(CHECK_DUTY_EXISTS, [
      validatorAddress.toString(),
      slot.toString(),
      dutyType,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.rowToRecord(result.rows[0]);
  }

  /**
   * Insert a new duty record with 'signing' status
   * @returns true if insert succeeded, false if a record already exists
   */
  async insertDuty(params: CheckAndRecordParams): Promise<boolean> {
    try {
      await this.pool.query(INSERT_DUTY, [
        params.validatorAddress.toString(),
        params.slot.toString(),
        params.blockNumber.toString(),
        params.dutyType,
        params.signingRoot,
        params.nodeId,
      ]);
      return true;
    } catch (error: any) {
      // Check for unique constraint violation (PostgreSQL error code 23505)
      if (error.code === '23505') {
        return false;
      }
      throw error;
    }
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
      signingRoot: row.signing_root,
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
