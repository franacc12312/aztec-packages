import type { EthAddress } from '@aztec/foundation/eth-address';

import type { Pool } from 'pg';

import type { CreateHASignerConfig, SlashingProtectionConfig } from './config.js';
import type {
  CheckAndRecordParams,
  DutyIdentifier,
  RecordFailureParams,
  RecordSuccessParams,
  ValidatorDutyRecord,
} from './db/types.js';
import { DutyStatus, DutyType } from './db/types.js';

export type {
  CheckAndRecordParams,
  CreateHASignerConfig,
  DutyIdentifier,
  RecordFailureParams,
  RecordSuccessParams,
  SlashingProtectionConfig,
  ValidatorDutyRecord,
};
export { DutyStatus, DutyType };

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
 */
export interface SlashingProtectionDatabase {
  /**
   * Find an existing duty record
   */
  findDuty(validatorAddress: EthAddress, slot: bigint, dutyType: DutyType): Promise<ValidatorDutyRecord | null>;

  /**
   * Insert a new duty record with 'signing' status
   * @returns true if insert succeeded, false if a record already exists (unique constraint violation)
   */
  insertDuty(params: CheckAndRecordParams): Promise<boolean>;

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
