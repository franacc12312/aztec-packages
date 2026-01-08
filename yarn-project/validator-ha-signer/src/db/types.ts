import type { BlockNumber, CheckpointNumber, SlotNumber } from '@aztec/foundation/branded-types';
import type { EthAddress } from '@aztec/foundation/eth-address';
import type { Signature } from '@aztec/foundation/eth-signature';

/**
 * Row type from PostgreSQL query
 */
export interface DutyRow {
  validator_address: string;
  slot: string;
  block_number: string;
  block_index_within_checkpoint: number;
  duty_type: DutyType;
  status: DutyStatus;
  message_hash: string;
  signature: string | null;
  node_id: string;
  lock_token: string;
  started_at: Date;
  completed_at: Date | null;
  error_message: string | null;
}

/**
 * Row type from INSERT_OR_GET_DUTY query (includes is_new flag)
 */
export interface InsertOrGetRow extends DutyRow {
  is_new: boolean;
}

/**
 * Type of validator duty being performed
 */
export enum DutyType {
  BLOCK_PROPOSAL = 'BLOCK_PROPOSAL',
  CHECKPOINT_PROPOSAL = 'CHECKPOINT_PROPOSAL',
  ATTESTATION = 'ATTESTATION',
  ATTESTATIONS_AND_SIGNERS = 'ATTESTATIONS_AND_SIGNERS',
}

/**
 * Status of a duty in the database
 */
export enum DutyStatus {
  SIGNING = 'signing',
  SIGNED = 'signed',
}

/**
 * Record of a validator duty in the database
 */
export interface ValidatorDutyRecord {
  /** Ethereum address of the validator */
  validatorAddress: EthAddress;
  /** Slot number for this duty */
  slot: SlotNumber;
  /** Block number for this duty */
  blockNumber: BlockNumber;
  /** Block index within checkpoint (0, 1, 2..., or -1 for checkpoint proposal) */
  blockIndexWithinCheckpoint: number;
  /** Type of duty being performed */
  dutyType: DutyType;
  /** Current status of the duty */
  status: DutyStatus;
  /** The signing root (hash) for this duty */
  messageHash: string;
  /** The signature (populated after successful signing) */
  signature?: string;
  /** Unique identifier for the node that acquired the lock */
  nodeId: string;
  /** Secret token for verifying ownership of the duty lock */
  lockToken: string;
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
  slot: SlotNumber;
  blockIndexWithinCheckpoint: number;
  dutyType: DutyType;
}

/**
 * Parameters for checking and recording a new duty
 */
export interface CheckAndRecordParams {
  validatorAddress: EthAddress;
  slot: SlotNumber;
  blockNumber: BlockNumber | CheckpointNumber;
  blockIndexWithinCheckpoint: number;
  dutyType: DutyType;
  messageHash: string;
  nodeId: string;
}

/**
 * Parameters for recording a successful signing
 */
export interface RecordSuccessParams {
  validatorAddress: EthAddress;
  slot: SlotNumber;
  blockIndexWithinCheckpoint: number;
  dutyType: DutyType;
  signature: Signature;
  nodeId: string;
  lockToken: string;
}

/**
 * Parameters for deleting a duty
 */
export interface DeleteDutyParams {
  validatorAddress: EthAddress;
  slot: SlotNumber;
  blockIndexWithinCheckpoint: number;
  dutyType: DutyType;
  lockToken: string;
}
