import { Buffer32 } from '@aztec/foundation/buffer';
import { keccak256 } from '@aztec/foundation/crypto/keccak';
import { Fr } from '@aztec/foundation/curves/bn254';
import type { EthAddress } from '@aztec/foundation/eth-address';
import type { Signature } from '@aztec/foundation/eth-signature';
import { createLogger } from '@aztec/foundation/log';
import type { CommitteeAttestationsAndSigners } from '@aztec/stdlib/block';
import {
  BlockAttestation,
  BlockProposal,
  type BlockProposalOptions,
  ConsensusPayload,
  SignatureDomainSeparator,
} from '@aztec/stdlib/p2p';
import type { CheckpointHeader } from '@aztec/stdlib/rollup';
import type { Tx } from '@aztec/stdlib/tx';
import { DutyAlreadySignedError, SlashingProtectionError } from '@aztec/validator-ha-signer/errors';

import type { ValidatorKeyStore } from '../key_store/interface.js';

export class ValidationService {
  constructor(
    private keyStore: ValidatorKeyStore,
    private log = createLogger('validator:validation-service'),
  ) {}

  /**
   * Create a block proposal with the given header, archive, and transactions
   *
   * @param header - The block header
   * @param archive - The archive of the current block
   * @param txs - TxHash[] ordered list of transactions
   * @param options - Block proposal options (including broadcastInvalidBlockProposal for testing)
   *
   * @returns A block proposal signing the above information
   * @throws DutyAlreadySignedError if HA signer indicates duty already signed by another node
   * @throws SlashingProtectionError if attempting to sign different data for same slot
   */
  async createBlockProposal(
    header: CheckpointHeader,
    archive: Fr,
    txs: Tx[],
    proposerAttesterAddress: EthAddress | undefined,
    options: BlockProposalOptions,
  ): Promise<BlockProposal> {
    let payloadSigner: (payload: Buffer32) => Promise<Signature>;
    if (proposerAttesterAddress !== undefined) {
      payloadSigner = (payload: Buffer32) => this.keyStore.signMessageWithAddress(proposerAttesterAddress, payload);
    } else {
      // if there is no proposer attester address, just use the first signer
      const signer = this.keyStore.getAddress(0);
      payloadSigner = (payload: Buffer32) => this.keyStore.signMessageWithAddress(signer, payload);
    }
    // TODO: check if this is calculated earlier / can not be recomputed
    const txHashes = await Promise.all(txs.map(tx => tx.getTxHash()));

    // For testing: change the new archive to trigger state_mismatch validation failure
    if (options.broadcastInvalidBlockProposal) {
      archive = Fr.random();
      this.log.warn(`Creating INVALID block proposal for slot ${header.slotNumber}`);
    }

    return BlockProposal.createProposalFromSigner(
      new ConsensusPayload(header, archive),
      txHashes,
      options.publishFullTxs ? txs : undefined,
      payloadSigner,
    );
  }

  /**
   * Attest with selection of validators to the given block proposal, constructed by the current sequencer
   *
   * NOTE: This is just a blind signing.
   *       We assume that the proposal is valid and DA guarantees have been checked previously.
   *
   * @param proposal - The proposal to attest to
   * @param attestors - The validators to attest with
   * @returns attestations (only includes attestations that were successfully signed; excludes any already signed by other HA nodes)
   */
  async attestToProposal(proposal: BlockProposal, attestors: EthAddress[]): Promise<BlockAttestation[]> {
    const buf = Buffer32.fromBuffer(
      keccak256(proposal.payload.getPayloadToSign(SignatureDomainSeparator.blockAttestation)),
    );

    // Sign each attestor individually, catching HA errors per-attestor
    const attestations: BlockAttestation[] = [];
    for (const attestor of attestors) {
      try {
        const sig = await this.keyStore.signMessageWithAddress(attestor, buf);
        attestations.push(new BlockAttestation(proposal.payload, sig, proposal.signature));
      } catch (error) {
        if (error instanceof DutyAlreadySignedError || error instanceof SlashingProtectionError) {
          this.log.debug(
            `Attestation for slot ${proposal.slotNumber} by ${attestor} already signed by another High-Availability node`,
          );
          // Continue with remaining attestors
        } else {
          throw error;
        }
      }
    }

    return attestations;
  }

  /**
   * Sign attestations and signers payload
   * @param attestationsAndSigners - The attestations and signers to sign
   * @param proposer - The proposer address to sign with
   * @returns signature
   * @throws DutyAlreadySignedError if already signed by another HA node
   * @throws SlashingProtectionError if attempting to sign different data for same slot
   */
  signAttestationsAndSigners(
    attestationsAndSigners: CommitteeAttestationsAndSigners,
    proposer: EthAddress,
  ): Promise<Signature> {
    const buf = Buffer32.fromBuffer(
      keccak256(attestationsAndSigners.getPayloadToSign(SignatureDomainSeparator.attestationsAndSigners)),
    );
    return this.keyStore.signMessageWithAddress(proposer, buf);
  }
}
