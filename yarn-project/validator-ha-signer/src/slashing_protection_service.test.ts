import { Buffer32 } from '@aztec/foundation/buffer';
import { EthAddress } from '@aztec/foundation/eth-address';
import { sleep } from '@aztec/foundation/sleep';

import { MockDatabase } from './db/mock.js';
import { DutyAlreadySignedError, SlashingProtectionError } from './errors.js';
import { SlashingProtectionService } from './slashing_protection_service.js';
import { type CheckAndRecordParams, DutyStatus, DutyType, type SlashingProtectionConfig } from './types.js';

// Test data constants
const VALIDATOR_ADDRESS = EthAddress.random();
const SLOT = 100n;
const BLOCK_NUMBER = 50n;
const DUTY_TYPE: DutyType = DutyType.BLOCK_PROPOSAL;
const SIGNING_ROOT = Buffer32.random().toString();
const SIGNING_ROOT_2 = Buffer32.random().toString();
const NODE_ID = 'node-1';
const NODE_ID_2 = 'node-2';
const SIGNATURE = '0xsignature';

describe('SlashingProtectionService', () => {
  let db: MockDatabase;
  let service: SlashingProtectionService;
  let config: SlashingProtectionConfig;

  beforeEach(() => {
    db = new MockDatabase();
    config = {
      enabled: true,
      nodeId: NODE_ID,
      pollingIntervalMs: 50,
      signingTimeoutMs: 1000,
    };
    service = new SlashingProtectionService(db, config);
  });

  describe('checkAndRecord', () => {
    it('should acquire lock on first attempt', async () => {
      const params: CheckAndRecordParams = {
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        blockNumber: BLOCK_NUMBER,
        dutyType: DUTY_TYPE,
        signingRoot: SIGNING_ROOT,
        nodeId: NODE_ID,
      };

      await service.checkAndRecord(params);

      const duty = await db.findDuty(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE);
      expect(duty).not.toBeNull();
      expect(duty!.status).toBe(DutyStatus.SIGNING);
      expect(duty!.nodeId).toBe(NODE_ID);
      expect(duty!.signingRoot).toBe(SIGNING_ROOT);
    });

    it('should throw DutyAlreadySignedError when duty already signed with same data', async () => {
      const params: CheckAndRecordParams = {
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        blockNumber: BLOCK_NUMBER,
        dutyType: DUTY_TYPE,
        signingRoot: SIGNING_ROOT,
        nodeId: NODE_ID,
      };

      // First node signs
      await service.checkAndRecord(params);
      await service.recordSuccess({
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        dutyType: DUTY_TYPE,
        signature: { toString: () => SIGNATURE } as any,
        nodeId: NODE_ID,
      });

      // Second node tries to sign same data
      const params2 = { ...params, nodeId: NODE_ID_2 };
      await expect(service.checkAndRecord(params2)).rejects.toThrow(DutyAlreadySignedError);
    });

    it('should throw SlashingProtectionError when duty already signed with different data', async () => {
      const params: CheckAndRecordParams = {
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        blockNumber: BLOCK_NUMBER,
        dutyType: DUTY_TYPE,
        signingRoot: SIGNING_ROOT,
        nodeId: NODE_ID,
      };

      // First node signs
      await service.checkAndRecord(params);
      await service.recordSuccess({
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        dutyType: DUTY_TYPE,
        signature: { toString: () => SIGNATURE } as any,
        nodeId: NODE_ID,
      });

      // Second node tries to sign different data
      const params2 = { ...params, signingRoot: SIGNING_ROOT_2, nodeId: NODE_ID_2 };
      await expect(service.checkAndRecord(params2)).rejects.toThrow(SlashingProtectionError);
    });

    it('should allow retry after failed duty', async () => {
      const params: CheckAndRecordParams = {
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        blockNumber: BLOCK_NUMBER,
        dutyType: DUTY_TYPE,
        signingRoot: SIGNING_ROOT,
        nodeId: NODE_ID,
      };

      // First node fails
      await service.checkAndRecord(params);
      await service.recordFailure({
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        dutyType: DUTY_TYPE,
        error: 'Test error',
      });

      // Second node should be able to retry
      const params2 = { ...params, nodeId: NODE_ID_2 };
      await service.checkAndRecord(params2);

      const duty = await db.findDuty(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE);
      expect(duty).not.toBeNull();
      expect(duty!.status).toBe(DutyStatus.SIGNING);
      expect(duty!.nodeId).toBe(NODE_ID_2);
    });

    it('should wait and throw when another node is signing same data', async () => {
      const params: CheckAndRecordParams = {
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        blockNumber: BLOCK_NUMBER,
        dutyType: DUTY_TYPE,
        signingRoot: SIGNING_ROOT,
        nodeId: NODE_ID,
      };

      // First node acquires lock
      await service.checkAndRecord(params);

      // Second node tries to acquire lock
      const params2 = { ...params, nodeId: NODE_ID_2 };
      const promise = service.checkAndRecord(params2);

      // Complete first node's signing after a short delay
      await sleep(100);
      await service.recordSuccess({
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        dutyType: DUTY_TYPE,
        signature: { toString: () => SIGNATURE } as any,
        nodeId: NODE_ID,
      });

      // Second node should get DutyAlreadySignedError
      await expect(promise).rejects.toThrow(DutyAlreadySignedError);
    });

    it('should wait and throw when another node is signing different data', async () => {
      const params: CheckAndRecordParams = {
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        blockNumber: BLOCK_NUMBER,
        dutyType: DUTY_TYPE,
        signingRoot: SIGNING_ROOT,
        nodeId: NODE_ID,
      };

      // First node acquires lock
      await service.checkAndRecord(params);

      // Second node tries to acquire lock with different data
      const params2 = { ...params, signingRoot: SIGNING_ROOT_2, nodeId: NODE_ID_2 };
      const promise = service.checkAndRecord(params2);

      // Complete first node's signing after a short delay
      await sleep(100);
      await service.recordSuccess({
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        dutyType: DUTY_TYPE,
        signature: { toString: () => SIGNATURE } as any,
        nodeId: NODE_ID,
      });

      // Second node should get SlashingProtectionError
      await expect(promise).rejects.toThrow(SlashingProtectionError);
    });

    it('should acquire lock after other node completes with failure', async () => {
      const params: CheckAndRecordParams = {
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        blockNumber: BLOCK_NUMBER,
        dutyType: DUTY_TYPE,
        signingRoot: SIGNING_ROOT,
        nodeId: NODE_ID,
      };

      // First node acquires lock
      await service.checkAndRecord(params);

      // First node fails
      await service.recordFailure({
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        dutyType: DUTY_TYPE,
        error: 'Test error',
      });

      // Verify duty is in failed state
      let duty = await db.findDuty(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE);
      expect(duty!.status).toBe(DutyStatus.FAILED);

      // Second node should be able to acquire the lock (retry)
      const params2 = { ...params, nodeId: NODE_ID_2 };
      await service.checkAndRecord(params2);

      duty = await db.findDuty(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE);
      expect(duty).not.toBeNull();
      expect(duty!.status).toBe(DutyStatus.SIGNING);
      expect(duty!.nodeId).toBe(NODE_ID_2);
    });

    it('should timeout if signing takes too long', async () => {
      const shortTimeoutConfig = { ...config, signingTimeoutMs: 200 };
      const serviceWithShortTimeout = new SlashingProtectionService(db, shortTimeoutConfig);

      const params: CheckAndRecordParams = {
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        blockNumber: BLOCK_NUMBER,
        dutyType: DUTY_TYPE,
        signingRoot: SIGNING_ROOT,
        nodeId: NODE_ID,
      };

      // First node acquires lock but never completes
      await serviceWithShortTimeout.checkAndRecord(params);

      // Second node tries to acquire lock
      const params2 = { ...params, nodeId: NODE_ID_2 };
      await expect(serviceWithShortTimeout.checkAndRecord(params2)).rejects.toThrow(DutyAlreadySignedError);
    });
  });

  describe('recordSuccess', () => {
    it('should update duty to signed status', async () => {
      const params: CheckAndRecordParams = {
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        blockNumber: BLOCK_NUMBER,
        dutyType: DUTY_TYPE,
        signingRoot: SIGNING_ROOT,
        nodeId: NODE_ID,
      };

      await service.checkAndRecord(params);
      await service.recordSuccess({
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        dutyType: DUTY_TYPE,
        signature: { toString: () => SIGNATURE } as any,
        nodeId: NODE_ID,
      });

      const duty = await db.findDuty(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE);
      expect(duty).not.toBeNull();
      expect(duty!.status).toBe(DutyStatus.SIGNED);
      expect(duty!.signature).toBe(SIGNATURE);
      expect(duty!.completedAt).toBeDefined();
    });
  });

  describe('recordFailure', () => {
    it('should update duty to failed status', async () => {
      const params: CheckAndRecordParams = {
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        blockNumber: BLOCK_NUMBER,
        dutyType: DUTY_TYPE,
        signingRoot: SIGNING_ROOT,
        nodeId: NODE_ID,
      };

      await service.checkAndRecord(params);
      await service.recordFailure({
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        dutyType: DUTY_TYPE,
        error: 'Test error',
      });

      const duty = await db.findDuty(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE);
      expect(duty).not.toBeNull();
      expect(duty!.status).toBe(DutyStatus.FAILED);
      expect(duty!.errorMessage).toBe('Test error');
      expect(duty!.completedAt).toBeDefined();
    });
  });

  describe('concurrent operations', () => {
    it('should handle multiple nodes competing for the same duty', async () => {
      const params1: CheckAndRecordParams = {
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        blockNumber: BLOCK_NUMBER,
        dutyType: DUTY_TYPE,
        signingRoot: SIGNING_ROOT,
        nodeId: 'node-1',
      };
      const params2 = { ...params1, nodeId: 'node-2' };
      const params3 = { ...params1, nodeId: 'node-3' };

      // All three nodes try to acquire lock simultaneously
      const promises = [
        service.checkAndRecord(params1),
        service.checkAndRecord(params2),
        service.checkAndRecord(params3),
      ];

      // First one should succeed, let it complete signing
      await sleep(50);
      const duty = await db.findDuty(VALIDATOR_ADDRESS, SLOT, DUTY_TYPE);
      const winnerNodeId = duty!.nodeId;
      await service.recordSuccess({
        validatorAddress: VALIDATOR_ADDRESS,
        slot: SLOT,
        dutyType: DUTY_TYPE,
        signature: { toString: () => SIGNATURE } as any,
        nodeId: winnerNodeId,
      });

      // Wait for all promises to complete
      const results = await Promise.allSettled(promises);

      // Exactly one should succeed
      const successes = results.filter(r => r.status === 'fulfilled').length;
      const failures = results.filter(r => r.status === 'rejected').length;

      expect(successes).toBe(1);
      expect(failures).toBe(2);

      // Both failures should be DutyAlreadySignedError
      results.forEach(result => {
        if (result.status === 'rejected') {
          expect(result.reason).toBeInstanceOf(DutyAlreadySignedError);
        }
      });
    });

    it('should handle multiple different duties concurrently', async () => {
      const promises = [];

      for (let i = 0; i < 5; i++) {
        const params: CheckAndRecordParams = {
          validatorAddress: VALIDATOR_ADDRESS,
          slot: BigInt(100 + i),
          blockNumber: BigInt(50 + i),
          dutyType: DUTY_TYPE,
          signingRoot: SIGNING_ROOT,
          nodeId: NODE_ID,
        };
        promises.push(service.checkAndRecord(params));
      }

      await Promise.all(promises);

      const duties = db.getAllDuties();
      expect(duties.length).toBe(5);
      duties.forEach(duty => {
        expect(duty.status).toBe(DutyStatus.SIGNING);
        expect(duty.nodeId).toBe(NODE_ID);
      });
    });
  });

  describe('nodeId', () => {
    it('should return the configured node ID', () => {
      expect(service.nodeId).toBe(NODE_ID);
    });
  });
});
