import type { EthAddress } from '@aztec/foundation/eth-address';
import type { Signature } from '@aztec/foundation/eth-signature';

/**
 * Type of validator duty being performed
 */
export enum DutyType {
  BLOCK_PROPOSAL = 'BLOCK_PROPOSAL',
  ATTESTATION = 'ATTESTATION',
  ATTESTATIONS_AND_SIGNERS = 'ATTESTATIONS_AND_SIGNERS',
}

/**
 * Status of a duty in the database
 */
export enum DutyStatus {
  SIGNING = 'signing',
  SIGNED = 'signed',
  FAILED = 'failed',
}

/**
 * Record of a validator duty in the database
 */
export interface ValidatorDutyRecord {
  /** Ethereum address of the validator */
  validatorAddress: EthAddress;
  /** Slot number for this duty */
  slot: bigint;
  /** Block number for this duty */
  blockNumber: bigint;
  /** Type of duty being performed */
  dutyType: DutyType;
  /** Current status of the duty */
  status: DutyStatus;
  /** The signing root (hash) for this duty */
  signingRoot: string;
  /** The signature (populated after successful signing) */
  signature?: string;
  /** Unique identifier for the node that acquired the lock */
  nodeId: string;
  /** When the duty signing was started */
  startedAt: Date;
  /** When the duty signing was completed (success or failure) */
  completedAt?: Date;
  /** Error message if status is 'failed' */
  errorMessage?: string;
}

/**
 * Minimal info needed to identify a unique duty
 */
export interface DutyIdentifier {
  validatorAddress: EthAddress;
  slot: bigint;
  dutyType: DutyType;
}

/**
 * Parameters for checking and recording a new duty
 */
export interface CheckAndRecordParams {
  validatorAddress: EthAddress;
  slot: bigint;
  blockNumber: bigint;
  dutyType: DutyType;
  signingRoot: string;
  nodeId: string;
}

/**
 * Parameters for recording a successful signing
 */
export interface RecordSuccessParams {
  validatorAddress: EthAddress;
  slot: bigint;
  dutyType: DutyType;
  signature: Signature;
  nodeId: string;
}

/**
 * Parameters for recording a failed signing
 */
export interface RecordFailureParams {
  validatorAddress: EthAddress;
  slot: bigint;
  dutyType: DutyType;
  error: string;
}
