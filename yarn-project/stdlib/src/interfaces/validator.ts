import type { BlockNumber, CheckpointNumber, SlotNumber } from '@aztec/foundation/branded-types';
import type { SecretValue } from '@aztec/foundation/config';
import { Fr } from '@aztec/foundation/curves/bn254';
import type { EthAddress } from '@aztec/foundation/eth-address';
import type { Signature } from '@aztec/foundation/eth-signature';
import { type ZodFor, schemas, zodFor } from '@aztec/foundation/schemas';
import type { SequencerConfig, SlasherConfig } from '@aztec/stdlib/interfaces/server';
import type { BlockAttestation, BlockProposal, BlockProposalOptions } from '@aztec/stdlib/p2p';
import type { Tx } from '@aztec/stdlib/tx';
import { type ValidatorHASignerConfig, ValidatorHASignerConfigSchema } from '@aztec/validator-ha-signer/config';

import type { PeerId } from '@libp2p/interface';
import { z } from 'zod';

import type { CommitteeAttestationsAndSigners } from '../block/index.js';
import type { CheckpointHeader } from '../rollup/checkpoint_header.js';
import { AllowedElementSchema } from './allowed_element.js';

/**
 * Validator client configuration
 */
export type ValidatorClientConfig = ValidatorHASignerConfig & {
  /** The private keys of the validators participating in attestation duties */
  validatorPrivateKeys?: SecretValue<`0x${string}`[]>;

  /** The addresses of the validators to use with remote signers */
  validatorAddresses?: EthAddress[];

  /** Do not run the validator */
  disableValidator: boolean;

  /** Temporarily disable these specific validator addresses */
  disabledValidators: EthAddress[];

  /** Interval between polling for new attestations from peers */
  attestationPollingIntervalMs: number;

  /** Whether to re-execute transactions in a block proposal before attesting */
  validatorReexecute: boolean;

  /** Will re-execute until this many milliseconds are left in the slot */
  validatorReexecuteDeadlineMs: number;

  /** Whether to always reexecute block proposals, even for non-validator nodes or when out of the currnet committee */
  alwaysReexecuteBlockProposals?: boolean;

  /** Whether to run in fisherman mode: validates all proposals and attestations but does not broadcast attestations or participate in consensus */
  fishermanMode?: boolean;
};

export type ValidatorClientFullConfig = ValidatorClientConfig &
  Pick<SequencerConfig, 'txPublicSetupAllowList' | 'broadcastInvalidBlockProposal'> &
  Pick<SlasherConfig, 'slashBroadcastedInvalidBlockPenalty'> & {
    /**
     * Whether transactions are disabled for this node
     * @remarks This should match the property in P2PConfig. It's not picked from there to avoid circular dependencies.
     */
    disableTransactions?: boolean;
  };

export const ValidatorClientConfigSchema = ValidatorHASignerConfigSchema.extend({
  validatorAddresses: z.array(schemas.EthAddress).optional(),
  disableValidator: z.boolean(),
  disabledValidators: z.array(schemas.EthAddress),
  attestationPollingIntervalMs: z.number().min(0),
  validatorReexecute: z.boolean(),
  validatorReexecuteDeadlineMs: z.number().min(0),
  alwaysReexecuteBlockProposals: z.boolean().optional(),
  fishermanMode: z.boolean().optional(),
}) satisfies ZodFor<Omit<ValidatorClientConfig, 'validatorPrivateKeys'>>;

export const ValidatorClientFullConfigSchema = zodFor<Omit<ValidatorClientFullConfig, 'validatorPrivateKeys'>>()(
  ValidatorClientConfigSchema.extend({
    txPublicSetupAllowList: z.array(AllowedElementSchema).optional(),
    broadcastInvalidBlockProposal: z.boolean().optional(),
    slashBroadcastedInvalidBlockPenalty: schemas.BigInt,
    disableTransactions: z.boolean().optional(),
  }),
);

export interface Validator {
  start(): Promise<void>;
  updateConfig(config: Partial<ValidatorClientFullConfig>): void;

  // Block validation responsibilities
  createBlockProposal(
    blockNumber: number,
    blockIndexWithinCheckpoint: number,
    header: CheckpointHeader,
    archive: Fr,
    txs: Tx[],
    proposerAddress: EthAddress | undefined,
    options: BlockProposalOptions,
  ): Promise<BlockProposal | undefined>;
  attestToProposal(proposal: BlockProposal, sender: PeerId): Promise<BlockAttestation[] | undefined>;

  broadcastBlockProposal(proposal: BlockProposal): Promise<void>;
  collectAttestations(
    proposal: BlockProposal,
    required: number,
    deadline: Date,
    blockNumber: BlockNumber | CheckpointNumber,
  ): Promise<BlockAttestation[]>;
  /**
   * Sign attestations and signers payload
   * @param attestationsAndSigners - The attestations and signers to sign
   * @param proposer - The proposer address to sign with
   * @param slot - The slot number for HA signing context
   * @param blockNumber - The block or checkpoint number for HA signing context
   * @returns signature
   * @throws DutyAlreadySignedError if already signed by another HA node
   * @throws SlashingProtectionError if attempting to sign different data for same slot
   */
  signAttestationsAndSigners(
    attestationsAndSigners: CommitteeAttestationsAndSigners,
    proposer: EthAddress,
    slot: SlotNumber,
    blockNumber: BlockNumber | CheckpointNumber,
  ): Promise<Signature>;
}
