import { BlockNumber, SlotNumber } from '@aztec/foundation/branded-types';
import { Buffer32 } from '@aztec/foundation/buffer';
import { EthAddress } from '@aztec/foundation/eth-address';
import type { Signature } from '@aztec/foundation/eth-signature';
import type { EthRemoteSignerConfig } from '@aztec/node-keystore';
import type { AztecAddress } from '@aztec/stdlib/aztec-address';
import { DutyAlreadySignedError, SlashingProtectionError } from '@aztec/validator-ha-signer/errors';
import { DutyType, type SigningContext } from '@aztec/validator-ha-signer/types';
import type { ValidatorHASigner } from '@aztec/validator-ha-signer/validator-ha-signer';

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { TypedDataDefinition } from 'viem';

import { HAKeyStore } from './ha_key_store.js';
import type { ExtendedValidatorKeyStore } from './interface.js';

// Test data constants
const VALIDATOR_ADDRESS = EthAddress.random();
const VALIDATOR_ADDRESS_2 = EthAddress.random();
const SIGNING_ROOT = Buffer32.random();
const NODE_ID = 'test-node-1';
const SIGNATURE_STRING = '0xsignature123';

// Mock signature
const mockSignature = {
  toString: () => SIGNATURE_STRING,
  r: Buffer32.random(),
  s: Buffer32.random(),
  v: 27,
  isEmpty: false,
} as unknown as Signature;

// Mock typed data
const mockTypedData: TypedDataDefinition = {
  domain: {
    name: 'Test',
    version: '1',
    chainId: 1,
  },
  types: {
    Message: [{ name: 'content', type: 'string' }],
  },
  primaryType: 'Message',
  message: {
    content: 'test message',
  },
};

describe('HAKeyStore', () => {
  let mockBaseKeyStore: jest.Mocked<ExtendedValidatorKeyStore>;
  let mockHASigner: jest.Mocked<ValidatorHASigner>;

  beforeEach(() => {
    // Create mock base key store
    mockBaseKeyStore = {
      getAddress: jest.fn<(index: number) => EthAddress>(),
      getAddresses: jest.fn<() => EthAddress[]>(),
      signTypedData: jest.fn<(typedData: TypedDataDefinition) => Promise<Signature[]>>(),
      signTypedDataWithAddress:
        jest.fn<
          (address: EthAddress, typedData: TypedDataDefinition, context?: SigningContext) => Promise<Signature>
        >(),
      signMessage: jest.fn<(message: Buffer32) => Promise<Signature[]>>(),
      signMessageWithAddress:
        jest.fn<(address: EthAddress, message: Buffer32, context?: SigningContext) => Promise<Signature>>(),
      getAttesterAddresses: jest.fn<() => EthAddress[]>(),
      getCoinbaseAddress: jest.fn<(attesterAddress: EthAddress) => EthAddress>(),
      getPublisherAddresses: jest.fn<(attesterAddress: EthAddress) => EthAddress[]>(),
      getFeeRecipient: jest.fn<(attesterAddress: EthAddress) => AztecAddress>(),
      getRemoteSignerConfig: jest.fn<(attesterAddress: EthAddress) => EthRemoteSignerConfig | undefined>(),
      isHAKeyStore: jest.fn() as unknown as jest.MockedFunction<() => this is HAKeyStore>,
    };

    // Create mock HA signer
    mockHASigner = {
      isEnabled: true,
      nodeId: NODE_ID,
      signWithProtection: jest.fn<ValidatorHASigner['signWithProtection']>(),
      start: jest.fn<ValidatorHASigner['start']>(),
      stop: jest.fn<ValidatorHASigner['stop']>(),
    } as unknown as jest.Mocked<ValidatorHASigner>;

    // Default implementations
    mockBaseKeyStore.getAddress.mockReturnValue(VALIDATOR_ADDRESS);
    mockBaseKeyStore.getAddresses.mockReturnValue([VALIDATOR_ADDRESS, VALIDATOR_ADDRESS_2]);
    mockBaseKeyStore.signMessageWithAddress.mockResolvedValue(mockSignature);
    mockBaseKeyStore.signTypedDataWithAddress.mockResolvedValue(mockSignature);
    mockBaseKeyStore.signMessage.mockResolvedValue([mockSignature]);
    mockBaseKeyStore.signTypedData.mockResolvedValue([mockSignature]);
    mockBaseKeyStore.isHAKeyStore.mockReturnValue(true);
    mockHASigner.signWithProtection.mockResolvedValue(mockSignature);
  });

  describe('ValidatorKeyStore interface delegation (no context)', () => {
    let haKeyStore: HAKeyStore;

    beforeEach(() => {
      haKeyStore = new HAKeyStore(mockBaseKeyStore, mockHASigner);
    });

    it('should delegate getAddress to base key store', () => {
      const result = haKeyStore.getAddress(0);
      expect(result).toBe(VALIDATOR_ADDRESS);
      expect(mockBaseKeyStore.getAddress).toHaveBeenCalledWith(0);
    });

    it('should delegate getAddresses to base key store', () => {
      const result = haKeyStore.getAddresses();
      expect(result).toEqual([VALIDATOR_ADDRESS, VALIDATOR_ADDRESS_2]);
      expect(mockBaseKeyStore.getAddresses).toHaveBeenCalled();
    });

    it('should delegate signTypedData to base key store', async () => {
      const result = await haKeyStore.signTypedData(mockTypedData);
      expect(result).toEqual([mockSignature]);
      expect(mockBaseKeyStore.signTypedData).toHaveBeenCalledWith(mockTypedData);
    });

    it('should delegate signMessage to base key store', async () => {
      const result = await haKeyStore.signMessage(SIGNING_ROOT);
      expect(result).toEqual([mockSignature]);
      expect(mockBaseKeyStore.signMessage).toHaveBeenCalledWith(SIGNING_ROOT);
    });

    it('should delegate signTypedDataWithAddress without HA when no context', async () => {
      const result = await haKeyStore.signTypedDataWithAddress(VALIDATOR_ADDRESS, mockTypedData);
      expect(result).toBe(mockSignature);
      expect(mockBaseKeyStore.signTypedDataWithAddress).toHaveBeenCalledWith(VALIDATOR_ADDRESS, mockTypedData);
      expect(mockHASigner.signWithProtection).not.toHaveBeenCalled();
    });

    it('should delegate signMessageWithAddress without HA when no context', async () => {
      const result = await haKeyStore.signMessageWithAddress(VALIDATOR_ADDRESS, SIGNING_ROOT);
      expect(result).toBe(mockSignature);
      expect(mockBaseKeyStore.signMessageWithAddress).toHaveBeenCalledWith(VALIDATOR_ADDRESS, SIGNING_ROOT);
      expect(mockHASigner.signWithProtection).not.toHaveBeenCalled();
    });
  });

  describe('signMessageWithAddress with context (HA enabled)', () => {
    let haKeyStore: HAKeyStore;
    const context: SigningContext = {
      slot: SlotNumber(100),
      blockNumber: BlockNumber(50),
      dutyType: DutyType.BLOCK_PROPOSAL,
      blockIndexWithinCheckpoint: 0,
    };

    beforeEach(() => {
      haKeyStore = new HAKeyStore(mockBaseKeyStore, mockHASigner);
    });

    it('should return signature on successful signing', async () => {
      const result = await haKeyStore.signMessageWithAddress(VALIDATOR_ADDRESS, SIGNING_ROOT, context);

      expect(result).toBe(mockSignature);
      expect(mockHASigner.signWithProtection).toHaveBeenCalledWith(
        VALIDATOR_ADDRESS,
        SIGNING_ROOT,
        {
          slot: context.slot,
          blockNumber: context.blockNumber,
          dutyType: DutyType.BLOCK_PROPOSAL,
          blockIndexWithinCheckpoint: 0,
        },
        expect.any(Function),
      );
    });

    it('should throw DutyAlreadySignedError when duty was already signed', async () => {
      const error = new DutyAlreadySignedError(SlotNumber(100), DutyType.BLOCK_PROPOSAL, 0, 'other-node');
      mockHASigner.signWithProtection.mockRejectedValue(error);

      await expect(haKeyStore.signMessageWithAddress(VALIDATOR_ADDRESS, SIGNING_ROOT, context)).rejects.toThrow(
        DutyAlreadySignedError,
      );
    });

    it('should throw SlashingProtectionError when slashing protection triggers', async () => {
      const error = new SlashingProtectionError(
        SlotNumber(100),
        DutyType.BLOCK_PROPOSAL,
        0,
        '0xexisting',
        '0xattempted',
        'other-node',
      );
      mockHASigner.signWithProtection.mockRejectedValue(error);

      await expect(haKeyStore.signMessageWithAddress(VALIDATOR_ADDRESS, SIGNING_ROOT, context)).rejects.toThrow(
        SlashingProtectionError,
      );
    });

    it('should re-throw unexpected errors', async () => {
      const unexpectedError = new Error('Unexpected error');
      mockHASigner.signWithProtection.mockRejectedValue(unexpectedError);

      await expect(haKeyStore.signMessageWithAddress(VALIDATOR_ADDRESS, SIGNING_ROOT, context)).rejects.toThrow(
        'Unexpected error',
      );
    });

    it('should call base key store through signWithProtection callback', async () => {
      mockHASigner.signWithProtection.mockImplementation((_addr, _root, _ctx, signFn) => {
        return signFn(SIGNING_ROOT);
      });

      await haKeyStore.signMessageWithAddress(VALIDATOR_ADDRESS, SIGNING_ROOT, context);

      expect(mockBaseKeyStore.signMessageWithAddress).toHaveBeenCalledWith(VALIDATOR_ADDRESS, SIGNING_ROOT);
    });
  });

  describe('signTypedDataWithAddress with context', () => {
    let haKeyStore: HAKeyStore;
    const context: SigningContext = {
      slot: SlotNumber(100),
      blockNumber: BlockNumber(50),
      dutyType: DutyType.ATTESTATION,
    };

    beforeEach(() => {
      haKeyStore = new HAKeyStore(mockBaseKeyStore, mockHASigner);
    });

    it('should return signature on successful signing', async () => {
      const result = await haKeyStore.signTypedDataWithAddress(VALIDATOR_ADDRESS, mockTypedData, context);

      expect(result).toBe(mockSignature);
      expect(mockHASigner.signWithProtection).toHaveBeenCalledWith(
        VALIDATOR_ADDRESS,
        expect.any(Buffer32),
        {
          slot: context.slot,
          blockNumber: context.blockNumber,
          dutyType: DutyType.ATTESTATION,
        },
        expect.any(Function),
      );
    });

    it('should throw DutyAlreadySignedError when duty was already signed', async () => {
      const error = new DutyAlreadySignedError(SlotNumber(100), DutyType.ATTESTATION, -1, 'other-node');
      mockHASigner.signWithProtection.mockRejectedValue(error);

      await expect(haKeyStore.signTypedDataWithAddress(VALIDATOR_ADDRESS, mockTypedData, context)).rejects.toThrow(
        DutyAlreadySignedError,
      );
    });

    it('should throw SlashingProtectionError when slashing protection triggers', async () => {
      const error = new SlashingProtectionError(
        SlotNumber(100),
        DutyType.ATTESTATION,
        -1,
        '0xexisting',
        '0xattempted',
        'other-node',
      );
      mockHASigner.signWithProtection.mockRejectedValue(error);

      await expect(haKeyStore.signTypedDataWithAddress(VALIDATOR_ADDRESS, mockTypedData, context)).rejects.toThrow(
        SlashingProtectionError,
      );
    });

    it('should call base key store signTypedDataWithAddress through callback', async () => {
      mockHASigner.signWithProtection.mockImplementation((_addr, _root, _ctx, signFn) => {
        return signFn(Buffer32.random());
      });

      await haKeyStore.signTypedDataWithAddress(VALIDATOR_ADDRESS, mockTypedData, context);

      expect(mockBaseKeyStore.signTypedDataWithAddress).toHaveBeenCalledWith(VALIDATOR_ADDRESS, mockTypedData);
    });
  });

  describe('all duty types', () => {
    it('should handle all duty types', async () => {
      const haKeyStore = new HAKeyStore(mockBaseKeyStore, mockHASigner);

      const dutyTypes = [
        DutyType.BLOCK_PROPOSAL,
        DutyType.ATTESTATION,
        DutyType.ATTESTATIONS_AND_SIGNERS,
        DutyType.CHECKPOINT_PROPOSAL,
      ];

      for (const dutyType of dutyTypes) {
        const context: SigningContext = {
          slot: SlotNumber(100),
          blockNumber: BlockNumber(50),
          dutyType,
          blockIndexWithinCheckpoint: dutyType === DutyType.BLOCK_PROPOSAL ? 0 : -1,
        };
        const result = await haKeyStore.signMessageWithAddress(VALIDATOR_ADDRESS, SIGNING_ROOT, context);
        expect(result).toBe(mockSignature);
      }

      expect(mockHASigner.signWithProtection).toHaveBeenCalledTimes(dutyTypes.length);
    });
  });

  describe('lifecycle methods', () => {
    let haKeyStore: HAKeyStore;

    beforeEach(() => {
      haKeyStore = new HAKeyStore(mockBaseKeyStore, mockHASigner);
    });

    it('should run start() on the HA signer', () => {
      haKeyStore.start();
      expect(mockHASigner.start).toHaveBeenCalledTimes(1);
    });

    it('should run stop() on the HA signer', async () => {
      await haKeyStore.stop();
      expect(mockHASigner.stop).toHaveBeenCalledTimes(1);
    });
  });
});
