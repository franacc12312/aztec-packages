import { SlotNumber } from '@aztec/foundation/branded-types';
import type { EthAddress } from '@aztec/foundation/eth-address';

import {
  type CheckAndRecordParams,
  DutyStatus,
  DutyType,
  type SlashingProtectionDatabase,
  type ValidatorDutyRecord,
} from '../types.js';

// Mock database implementation
export class MockDatabase implements SlashingProtectionDatabase {
  private duties = new Map<string, ValidatorDutyRecord>();

  findDuty(validatorAddress: EthAddress, slot: SlotNumber, dutyType: DutyType): Promise<ValidatorDutyRecord | null> {
    const key = this.getKey(validatorAddress, slot, dutyType);
    return Promise.resolve(this.duties.get(key) || null);
  }

  insertDuty(params: CheckAndRecordParams): Promise<boolean> {
    const key = this.getKey(params.validatorAddress, params.slot, params.dutyType);
    if (this.duties.has(key)) {
      return Promise.resolve(false);
    }
    this.duties.set(key, {
      validatorAddress: params.validatorAddress,
      slot: params.slot,
      blockNumber: params.blockNumber,
      dutyType: params.dutyType,
      status: DutyStatus.SIGNING,
      signingRoot: params.signingRoot,
      nodeId: params.nodeId,
      startedAt: new Date(),
    });
    return Promise.resolve(true);
  }

  updateDutySigned(
    validatorAddress: EthAddress,
    slot: SlotNumber,
    dutyType: DutyType,
    signature: string,
  ): Promise<void> {
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
    slot: SlotNumber,
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

  deleteFailedDuty(validatorAddress: EthAddress, slot: SlotNumber, dutyType: DutyType): Promise<boolean> {
    const key = this.getKey(validatorAddress, slot, dutyType);
    const duty = this.duties.get(key);
    if (duty && duty.status === DutyStatus.FAILED) {
      this.duties.delete(key);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  private getKey(validatorAddress: EthAddress, slot: SlotNumber, dutyType: DutyType): string {
    return `${validatorAddress.toString()}-${slot}-${dutyType}`;
  }

  // Helper methods for testing
  clear() {
    this.duties.clear();
  }

  getAllDuties(): ValidatorDutyRecord[] {
    return Array.from(this.duties.values());
  }
}
