import type { EthAddress } from '@aztec/foundation/eth-address';

import {
  type CheckAndRecordParams,
  DutyStatus,
  type DutyType,
  type SlashingProtectionDatabase,
  type TryInsertOrGetResult,
  type ValidatorDutyRecord,
} from '../types.js';

/**
 * Mock database implementation for testing
 */
export class MockDatabase implements SlashingProtectionDatabase {
  private duties = new Map<string, ValidatorDutyRecord>();

  // try to insert a new duty record, or get the existing one if present
  tryInsertOrGetExisting(params: CheckAndRecordParams): Promise<TryInsertOrGetResult> {
    const key = this.getKey(params.validatorAddress, params.slot, params.dutyType);
    const existing = this.duties.get(key);

    if (existing) {
      return Promise.resolve({ isNew: false, record: existing });
    }

    const newRecord: ValidatorDutyRecord = {
      validatorAddress: params.validatorAddress,
      slot: params.slot,
      blockNumber: params.blockNumber,
      dutyType: params.dutyType,
      status: DutyStatus.SIGNING,
      messageHash: params.messageHash,
      nodeId: params.nodeId,
      startedAt: new Date(),
    };
    this.duties.set(key, newRecord);
    return Promise.resolve({ isNew: true, record: newRecord });
  }

  updateDutySigned(validatorAddress: EthAddress, slot: bigint, dutyType: DutyType, signature: string): Promise<void> {
    const key = this.getKey(validatorAddress, slot, dutyType);
    const duty = this.duties.get(key);
    if (duty) {
      duty.status = DutyStatus.SIGNED;
      duty.signature = signature;
      duty.completedAt = new Date();
    }
    return Promise.resolve(undefined);
  }

  updateDutyFailed(
    validatorAddress: EthAddress,
    slot: bigint,
    dutyType: DutyType,
    errorMessage: string,
  ): Promise<void> {
    const key = this.getKey(validatorAddress, slot, dutyType);
    const duty = this.duties.get(key);
    if (duty) {
      duty.status = DutyStatus.FAILED;
      duty.errorMessage = errorMessage;
      duty.completedAt = new Date();
    }
    return Promise.resolve(undefined);
  }

  deleteFailedDuty(validatorAddress: EthAddress, slot: bigint, dutyType: DutyType): Promise<boolean> {
    const key = this.getKey(validatorAddress, slot, dutyType);
    const duty = this.duties.get(key);
    if (duty && duty.status === DutyStatus.FAILED) {
      this.duties.delete(key);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  private getKey(validatorAddress: EthAddress, slot: bigint, dutyType: DutyType): string {
    return `${validatorAddress.toString()}-${slot}-${dutyType}`;
  }

  // Helper methods for testing
  clear() {
    this.duties.clear();
  }

  getAllDuties(): ValidatorDutyRecord[] {
    return Array.from(this.duties.values());
  }

  // Get a specific duty for test assertions
  getDuty(validatorAddress: EthAddress, slot: bigint, dutyType: DutyType): ValidatorDutyRecord | undefined {
    const key = this.getKey(validatorAddress, slot, dutyType);
    return this.duties.get(key);
  }
}
