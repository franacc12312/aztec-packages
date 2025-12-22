/**
 * Slashing Protection Service
 *
 * Provides distributed locking and slashing protection for validator duties.
 * Uses an external database to coordinate across multiple validator nodes.
 */
import { TimeoutError } from '@aztec/foundation/error';
import { type Logger, createLogger } from '@aztec/foundation/log';
import { retryUntil } from '@aztec/foundation/retry';

import {
  type CheckAndRecordParams,
  DutyStatus,
  type RecordFailureParams,
  type RecordSuccessParams,
} from './db/types.js';
import { DutyAlreadySignedError, SlashingProtectionError } from './errors.js';
import type { SlashingProtectionConfig, SlashingProtectionDatabase, ValidatorDutyRecord } from './types.js';

/**
 * Result of waiting for a signing operation to complete
 */
enum WaitResult {
  /** Duty was signed with the same data - caller should not proceed */
  ALREADY_SIGNED_SAME_DATA = 'ALREADY_SIGNED_SAME_DATA',
  /** Duty was signed with different data (slashing protection) - caller should not proceed */
  ALREADY_SIGNED_DIFFERENT_DATA = 'ALREADY_SIGNED_DIFFERENT_DATA',
  /** Failed duty was cleaned up, caller should acquire the lock */
  READY_TO_ACQUIRE_LOCK = 'READY_TO_ACQUIRE_LOCK',
  /** Timeout waiting for signing to complete */
  TIMEOUT = 'TIMEOUT',
}

/**
 * Slashing Protection Service
 *
 * This service ensures that a validator only signs one block/attestation per slot,
 * even when running multiple redundant nodes (HA setup).
 *
 * All nodes in the HA setup try to sign - the first one wins, others get
 * DutyAlreadySignedError (normal) or SlashingProtectionError (if different data).
 *
 * Flow:
 * 1. checkAndRecord() - Acquire lock by inserting 'signing' status
 * 2. Caller performs the signing operation
 * 3. recordSuccess() - Update to 'signed' status with signature
 *    OR recordFailure() - Update to 'failed' status with error
 */
export class SlashingProtectionService {
  private readonly log: Logger;
  private readonly pollingIntervalMs: number;
  private readonly signingTimeoutMs: number;

  constructor(
    private readonly db: SlashingProtectionDatabase,
    private readonly config: SlashingProtectionConfig,
  ) {
    this.log = createLogger('slashing-protection');
    this.pollingIntervalMs = config.pollingIntervalMs;
    this.signingTimeoutMs = config.signingTimeoutMs;
  }

  /**
   * Check if a duty can be performed and acquire the lock if so.
   *
   * This method should be called BEFORE signing. It will:
   * 1. Check if the duty has already been signed (reject)
   * 2. Check if the duty is in progress (wait for it to complete, then reject or retry)
   * 3. Check if a previous attempt failed (delete and allow retry)
   * 4. Insert a new record with 'signing' status to acquire the lock
   *
   * @throws DutyAlreadySignedError if the duty was already completed
   * @throws SlashingProtectionError if attempting to sign different data for same slot/duty
   */
  async checkAndRecord(params: CheckAndRecordParams): Promise<void> {
    const { validatorAddress, slot, dutyType, nodeId } = params;

    this.log.debug(`Checking duty: ${dutyType} for slot ${slot}`, {
      validatorAddress: validatorAddress.toString(),
      nodeId,
    });

    // Check for existing duty
    const existingDuty = await this.db.findDuty(validatorAddress, slot, dutyType);

    if (existingDuty) {
      // Handle existing duty - may throw or delete failed records
      await this.handleExistingDuty(existingDuty, params);
      // If we reach here, the failed duty was deleted, proceed with insertion
    }

    // Try to acquire the lock by inserting
    let inserted = await this.db.insertDuty(params);

    // Loop until we acquire the lock or get a definitive result
    while (!inserted) {
      // Another node beat us - wait for their signing to complete
      const result = await this.waitForSigningComplete(params);

      // Handle the result based on what happened
      if (result === WaitResult.READY_TO_ACQUIRE_LOCK) {
        // Failed duty was cleaned up, try to acquire the lock
        this.log.debug(`Retrying lock acquisition for duty ${dutyType} at slot ${slot}`, {
          validatorAddress: validatorAddress.toString(),
          nodeId,
        });
        inserted = await this.db.insertDuty(params);
        // If inserted is still false, another node beat us, loop continues
      } else if (result === WaitResult.ALREADY_SIGNED_SAME_DATA) {
        throw new DutyAlreadySignedError(slot, dutyType, 'another node');
      } else if (result === WaitResult.ALREADY_SIGNED_DIFFERENT_DATA) {
        const existingDuty = await this.db.findDuty(validatorAddress, slot, dutyType);
        throw new SlashingProtectionError(slot, dutyType, existingDuty!.signingRoot, params.signingRoot);
      } else if (result === WaitResult.TIMEOUT) {
        throw new DutyAlreadySignedError(slot, dutyType, 'unknown (timeout)');
      }
    }

    this.log.info(`Acquired lock for duty ${dutyType} at slot ${slot}`, {
      validatorAddress: validatorAddress.toString(),
      nodeId,
    });
  }

  /**
   * Record a successful signing operation.
   * Updates the duty status to 'signed' and stores the signature.
   */
  async recordSuccess(params: RecordSuccessParams): Promise<void> {
    const { validatorAddress, slot, dutyType, signature, nodeId } = params;

    await this.db.updateDutySigned(validatorAddress, slot, dutyType, signature.toString());

    this.log.info(`Recorded successful signing for duty ${dutyType} at slot ${slot}`, {
      validatorAddress: validatorAddress.toString(),
      nodeId,
    });
  }

  /**
   * Record a failed signing operation.
   * Updates the duty status to 'failed' with the error message.
   * A future attempt can retry after this.
   */
  async recordFailure(params: RecordFailureParams): Promise<void> {
    const { validatorAddress, slot, dutyType, error } = params;

    await this.db.updateDutyFailed(validatorAddress, slot, dutyType, error);

    this.log.warn(`Recorded failed signing for duty ${dutyType} at slot ${slot}`, {
      validatorAddress: validatorAddress.toString(),
      error,
    });
  }

  /**
   * Wait for an in-progress signing operation to complete.
   * Polls the database until the status changes from 'signing' to 'signed' or 'failed'.
   * Returns a status indicating what happened and what the caller should do next.
   * This function only observes state - it doesn't acquire locks (except deleting failed duties).
   */
  private async waitForSigningComplete(params: CheckAndRecordParams): Promise<WaitResult> {
    const { validatorAddress, slot, dutyType, signingRoot } = params;

    this.log.debug(`Waiting for signing to complete for duty ${dutyType} at slot ${slot}`, {
      validatorAddress: validatorAddress.toString(),
    });

    try {
      const result = await retryUntil(
        async () => {
          const duty = await this.db.findDuty(validatorAddress, slot, dutyType);

          if (!duty) {
            // Record disappeared (shouldn't happen, but handle gracefully)
            // Signal caller to try acquiring the lock
            return WaitResult.READY_TO_ACQUIRE_LOCK;
          }

          if (duty.status === DutyStatus.SIGNED) {
            // Signing completed - check if same or different data
            if (duty.signingRoot !== signingRoot) {
              return WaitResult.ALREADY_SIGNED_DIFFERENT_DATA;
            }
            return WaitResult.ALREADY_SIGNED_SAME_DATA;
          } else if (duty.status === DutyStatus.FAILED) {
            // Signing failed - delete and signal caller to acquire lock
            this.log.info(`Other node's signing failed for duty ${dutyType} at slot ${slot}, allowing retry`, {
              validatorAddress: validatorAddress.toString(),
              failedNode: duty.nodeId,
            });
            await this.db.deleteFailedDuty(validatorAddress, slot, dutyType);
            // Signal caller to try acquiring the lock
            return WaitResult.READY_TO_ACQUIRE_LOCK;
          } else if (duty.status === DutyStatus.SIGNING) {
            // Still in progress, continue polling
            return undefined;
          }

          return undefined;
        },
        `signing completion for duty ${dutyType} at slot ${slot}`,
        this.signingTimeoutMs / 1000,
        this.pollingIntervalMs / 1000,
      );
      return result;
    } catch (err) {
      if (err instanceof TimeoutError) {
        // Timeout - treat the signing as stuck
        this.log.warn(`Timeout waiting for signing to complete for duty ${dutyType} at slot ${slot}`, {
          validatorAddress: validatorAddress.toString(),
          timeoutMs: this.signingTimeoutMs,
        });
        return WaitResult.TIMEOUT;
      }
      throw err;
    }
  }

  /**
   * Handle an existing duty record.
   * Either throws an error (duty already signed) or returns to allow insertion (failed duty deleted).
   * For in-progress duties, waits and then either throws or returns.
   */
  private async handleExistingDuty(existingDuty: ValidatorDutyRecord, params: CheckAndRecordParams): Promise<void> {
    const { validatorAddress, slot, dutyType, signingRoot } = params;

    if (existingDuty.status === DutyStatus.SIGNED) {
      // Duty completed - check if same or different signing root
      if (existingDuty.signingRoot !== signingRoot) {
        this.log.verbose(`Slashing protection triggered for duty ${dutyType} at slot ${slot}`, {
          validatorAddress: validatorAddress.toString(),
          existingSigningRoot: existingDuty.signingRoot,
          attemptedSigningRoot: signingRoot,
          existingNodeId: existingDuty.nodeId,
          attemptingNodeId: params.nodeId,
        });
        throw new SlashingProtectionError(slot, dutyType, existingDuty.signingRoot, signingRoot);
      }
      throw new DutyAlreadySignedError(slot, dutyType, existingDuty.nodeId);
    } else if (existingDuty.status === DutyStatus.SIGNING) {
      // In progress - wait for completion and handle the result
      const result = await this.waitForSigningComplete(params);

      if (result === WaitResult.READY_TO_ACQUIRE_LOCK) {
        // Failed duty was cleaned up, caller should try to acquire lock
        return;
      } else if (result === WaitResult.ALREADY_SIGNED_SAME_DATA) {
        throw new DutyAlreadySignedError(slot, dutyType, existingDuty.nodeId);
      } else if (result === WaitResult.ALREADY_SIGNED_DIFFERENT_DATA) {
        throw new SlashingProtectionError(slot, dutyType, existingDuty.signingRoot, signingRoot);
      } else if (result === WaitResult.TIMEOUT) {
        throw new DutyAlreadySignedError(slot, dutyType, 'unknown (timeout)');
      }
    } else if (existingDuty.status === DutyStatus.FAILED) {
      // Previous attempt failed - delete and allow retry
      this.log.info(`Previous attempt for duty ${dutyType} at slot ${slot} failed, allowing retry`, {
        validatorAddress: validatorAddress.toString(),
        previousNodeId: existingDuty.nodeId,
        previousError: existingDuty.errorMessage,
        newNodeId: params.nodeId,
      });
      await this.db.deleteFailedDuty(validatorAddress, slot, dutyType);
      // Return to allow INSERT to proceed
      return;
    }
  }

  /**
   * Get the node ID for this service
   */
  get nodeId(): string {
    return this.config.nodeId;
  }
}
