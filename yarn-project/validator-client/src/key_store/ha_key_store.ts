/**
 * High Availability Key Store
 *
 * A ValidatorKeyStore wrapper that adds slashing protection for HA validator setups.
 * When multiple validator nodes are running, only one node will sign for a given duty.
 */
import { Buffer32 } from '@aztec/foundation/buffer';
import type { EthAddress } from '@aztec/foundation/eth-address';
import type { Signature } from '@aztec/foundation/eth-signature';
import { createLogger } from '@aztec/foundation/log';
import type { EthRemoteSignerConfig } from '@aztec/node-keystore';
import type { AztecAddress } from '@aztec/stdlib/aztec-address';
import { DutyAlreadySignedError, SlashingProtectionError } from '@aztec/validator-ha-signer/errors';
import type { SigningContext } from '@aztec/validator-ha-signer/types';
import type { ValidatorHASigner } from '@aztec/validator-ha-signer/validator-ha-signer';

import { type TypedDataDefinition, hashTypedData } from 'viem';

import type { ExtendedValidatorKeyStore } from './interface.js';

/**
 * High Availability Key Store
 *
 * Wraps a base ExtendedValidatorKeyStore and ValidatorHASigner to provide
 * HA-protected signing operations (when context is provided).
 *
 * The extended interface methods (getAttesterAddresses, getCoinbaseAddress, etc.)
 * are pure pass-through since they don't require HA coordination.
 *
 * Usage:
 * ```typescript
 * const baseKeyStore = NodeKeystoreAdapter.fromPrivateKeys(privateKeys);
 * const haSigner = new ValidatorHASigner(db, config);
 * const haKeyStore = new HAKeyStore(baseKeyStore, haSigner);
 *
 * // Without context - signs directly (no HA protection)
 * const sig = await haKeyStore.signMessageWithAddress(addr, msg);
 *
 * // With context - HA protected, throws DutyAlreadySignedError if already signed
 * const result = await haKeyStore.signMessageWithAddress(addr, msg, {
 *   slot: 100n,
 *   blockNumber: 50n,
 *   dutyType: DutyType.BLOCK_PROPOSAL,
 * });
 * ```
 */
export class HAKeyStore implements ExtendedValidatorKeyStore {
  private readonly log = createLogger('ha-key-store');

  constructor(
    private readonly baseKeyStore: ExtendedValidatorKeyStore,
    private readonly haSigner: ValidatorHASigner,
  ) {
    this.log.info('HAKeyStore initialized', {
      nodeId: haSigner.nodeId,
    });
  }

  /**
   * Sign typed data with all addresses.
   * When context is provided and HA is enabled, coordinates across nodes to prevent double-signing.
   * Returns only signatures that were successfully claimed by this node.
   */
  async signTypedData(typedData: TypedDataDefinition, context?: SigningContext): Promise<Signature[]> {
    // No context provided - sign directly
    if (!context) {
      return this.baseKeyStore.signTypedData(typedData);
    }

    // Sign each address with HA protection
    const addresses = this.getAddresses();
    const results = await Promise.all(addresses.map(addr => this.signTypedDataWithAddress(addr, typedData, context)));

    // Filter out nulls (already signed by other nodes)
    return results.filter((sig): sig is Signature => sig !== null);
  }

  /**
   * Sign a message with all addresses.
   * When context is provided and HA is enabled, coordinates across nodes to prevent double-signing.
   * Returns only signatures that were successfully claimed by this node.
   */
  async signMessage(message: Buffer32, context?: SigningContext): Promise<Signature[]> {
    // No context - sign directly
    if (!context) {
      return this.baseKeyStore.signMessage(message);
    }

    // Sign each address with HA protection
    const addresses = this.getAddresses();
    const results = await Promise.all(addresses.map(addr => this.signMessageWithAddress(addr, message, context)));

    // Filter out nulls (already signed by other nodes)
    return results.filter((sig): sig is Signature => sig !== null);
  }

  /**
   * Sign typed data with a specific address.
   * When context is provided and HA is enabled, coordinates across nodes to prevent double-signing.
   * @throws DutyAlreadySignedError if the duty was already signed by another node
   * @throws SlashingProtectionError if attempting to sign different data for the same slot
   */
  async signTypedDataWithAddress(
    address: EthAddress,
    typedData: TypedDataDefinition,
    context?: SigningContext,
  ): Promise<Signature> {
    // No context provided - sign directly
    if (!context) {
      return this.baseKeyStore.signTypedDataWithAddress(address, typedData);
    }

    // Compute signing root from typed data for HA tracking
    const digest = hashTypedData(typedData);
    const signingRoot = Buffer32.fromString(digest);

    try {
      return await this.haSigner.signWithProtection(
        address,
        signingRoot,
        context,
        () => this.baseKeyStore.signTypedDataWithAddress(address, typedData) as Promise<Signature>,
      );
    } catch (error) {
      this.logSigningError(error, context);
      throw error;
    }
  }

  /**
   * Sign a message with a specific address.
   * When context is provided and HA is enabled, coordinates across nodes to prevent double-signing.
   * @throws DutyAlreadySignedError if the duty was already signed by another node
   * @throws SlashingProtectionError if attempting to sign different data for the same slot
   */
  async signMessageWithAddress(address: EthAddress, message: Buffer32, context?: SigningContext): Promise<Signature> {
    // No context provided - sign directly
    if (!context) {
      return this.baseKeyStore.signMessageWithAddress(address, message);
    }

    try {
      return await this.haSigner.signWithProtection(
        address,
        message,
        context,
        signingRoot => this.baseKeyStore.signMessageWithAddress(address, signingRoot) as Promise<Signature>,
      );
    } catch (error) {
      this.logSigningError(error, context);
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // pass-through methods (no HA logic needed)
  // ─────────────────────────────────────────────────────────────────────────────

  getAddress(index: number): EthAddress {
    return this.baseKeyStore.getAddress(index);
  }

  getAddresses(): EthAddress[] {
    return this.baseKeyStore.getAddresses();
  }

  getAttesterAddresses(): EthAddress[] {
    return this.baseKeyStore.getAttesterAddresses();
  }

  getCoinbaseAddress(attesterAddress: EthAddress): EthAddress {
    return this.baseKeyStore.getCoinbaseAddress(attesterAddress);
  }

  getPublisherAddresses(attesterAddress: EthAddress): EthAddress[] {
    return this.baseKeyStore.getPublisherAddresses(attesterAddress);
  }

  getFeeRecipient(attesterAddress: EthAddress): AztecAddress {
    return this.baseKeyStore.getFeeRecipient(attesterAddress);
  }

  getRemoteSignerConfig(attesterAddress: EthAddress): EthRemoteSignerConfig | undefined {
    return this.baseKeyStore.getRemoteSignerConfig(attesterAddress);
  }

  /**
   * Log signing errors from the HA signer.
   * Logs expected HA errors (already signed) at appropriate levels.
   * Re-throws unexpected errors.
   */
  private logSigningError(error: unknown, context: SigningContext) {
    if (error instanceof DutyAlreadySignedError) {
      this.log.debug(`Duty already signed by another node with the same payload`, {
        dutyType: context.dutyType,
        slot: context.slot,
        signedByNode: error.signedByNode,
      });
      return;
    }

    if (error instanceof SlashingProtectionError) {
      this.log.warn(`Duty already signed by another node with different payload`, {
        dutyType: context.dutyType,
        slot: context.slot,
        existingMessageHash: error.existingMessageHash,
        attemptedMessageHash: error.attemptedMessageHash,
      });
      return;
    }

    // Re-throw errors
    throw error;
  }

  /**
   * Is high-availability key store
   * @returns true
   */
  isHAKeyStore(): this is HAKeyStore {
    return true;
  }

  /**
   * Start the high-availability key store
   */
  public start() {
    this.haSigner.start();
  }

  /**
   * Stop the high-availability key store
   */
  public async stop() {
    await this.haSigner.stop();
  }
}
