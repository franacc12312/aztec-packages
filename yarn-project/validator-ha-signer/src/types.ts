import type { EthAddress } from '@aztec/foundation/eth-address';

import type { Pool } from 'pg';

import type { CreateHASignerConfig, SlashingProtectionConfig } from './config.js';
import type {
  CheckAndRecordParams,
  DutyIdentifier,
  DutyType,
  RecordFailureParams,
  RecordSuccessParams,
  ValidatorDutyRecord,
} from './db/types.js';

export type {
  CheckAndRecordParams,
  CreateHASignerConfig,
  DutyIdentifier,
  RecordFailureParams,
  RecordSuccessParams,
  SlashingProtectionConfig,
  ValidatorDutyRecord,
};
export { DutyStatus, DutyType } from './db/types.js';

/**
 * Result of tryInsertOrGetExisting operation
 */
export interface TryInsertOrGetResult {
  /** True if we inserted a new record, false if we got an existing record */
  isNew: boolean;
  /** The record (either newly inserted or existing) */
  record: ValidatorDutyRecord;
}

/**
 * deps for creating an HA signer
 */
export interface CreateHASignerDeps {
  /**
   * Optional PostgreSQL connection pool
   * If provided, databaseUrl and poolConfig are ignored
   */
  pool?: Pool;
}

/**
 * Context required for slashing protection during signing operations
 */
export interface SigningContext {
  /** Slot number for this duty */
  slot: bigint;
  /** Block number for this duty */
  blockNumber: bigint;
  /** Type of duty being performed */
  dutyType: DutyType;
}

/**
 * Database interface for slashing protection operations
 * This abstraction allows for different database implementations (PostgreSQL, SQLite, etc.)
 *
 * The interface is designed around 3 core operations:
 * 1. tryInsertOrGetExisting - Atomically insert or get existing record (eliminates race conditions)
 * 2. updateDutySigned - Update to signed status on success
 * 3. deleteFailedDuty - Delete failed record to allow retry
 * 4. updateDutyFailed - Update to failed status with error message (allows other nodes to see and clean up).
 */
export interface SlashingProtectionDatabase {
  /**
   * Atomically try to insert a new duty record, or get the existing one if present.
   *
   * @returns { isNew: true, record } if we successfully inserted and acquired the lock
   * @returns { isNew: false, record } if a record already exists (caller should handle based on status)
   */
  tryInsertOrGetExisting(params: CheckAndRecordParams): Promise<TryInsertOrGetResult>;

  /**
   * Update a duty to 'signed' status with the signature
   */
  updateDutySigned(validatorAddress: EthAddress, slot: bigint, dutyType: DutyType, signature: string): Promise<void>;

  /**
   * Update a duty to 'failed' status with error message
   */
  updateDutyFailed(validatorAddress: EthAddress, slot: bigint, dutyType: DutyType, errorMessage: string): Promise<void>;

  /**
   * Delete a failed duty to allow retry
   */
  deleteFailedDuty(validatorAddress: EthAddress, slot: bigint, dutyType: DutyType): Promise<boolean>;
}
