import { OUT_HASH_TREE_LEAF_COUNT } from '@aztec/constants';
import { padArrayEnd } from '@aztec/foundation/collection';
import { Fr } from '@aztec/foundation/curves/bn254';
import { computeBalancedShaRoot, computeUnbalancedShaRoot, computeWonkyShaRoot } from '@aztec/foundation/trees';

// Computes the out hash of a tx. It's the root of the unbalanced tree of all the L2-to-L1 messages emitted by the tx.
// Must match the implementation in `tx_base_public_inputs_composer.nr > compute_kernel_out_hash()`.
export function computeTxOutHash(messages: Fr[]): Fr {
  if (!messages.length) {
    return Fr.ZERO;
  }
  // Zero hashes (which should not happen) are not compressed.
  return Fr.fromBuffer(computeUnbalancedShaRoot(messages.map(msg => msg.toBuffer())));
}

// Computes the out hash of a block. It's the root of the wonky tree of all the tx out hashes.
// See how the tx out hashes are aggregated into a block out hash in `merge_tx_rollups.nr > accumulate_out_hash()`.
export function computeBlockOutHash(messagesPerTx: Fr[][]): Fr {
  const txOutHashes = messagesPerTx.map(messages => computeTxOutHash(messages));
  return Fr.fromBuffer(computeWonkyShaRoot(txOutHashes.map(hash => hash.toBuffer())));
}

// Computes the out hash of a checkpoint. It's the root of the wonky tree of all the block out hashes.
// See how the block out hashes are aggregated into a checkpoint out hash in `merge_block_rollups.nr > accumulate_out_hash()`.
export function computeCheckpointOutHash(messagesPerBlock: Fr[][][]): Fr {
  const blockOutHashes = messagesPerBlock.map(block => computeBlockOutHash(block));
  return Fr.fromBuffer(computeWonkyShaRoot(blockOutHashes.map(hash => hash.toBuffer())));
}

// Computes the accumulated out hash of a checkpoint. It's the root of the balanced tree of all the out hashes from the
// first checkpoint in an epoch to the current checkpoint.
// It's this value that's set to the checkpoint header and validated on L1 instead of the checkpoint out hash.
// See how the checkpoint out hashes are accumulated in `checkpoint_rollup_public_inputs_composer.nr > accumulate_checkpoint_out_hash()`.
export function accumulateCheckpointOutHashes(checkpointOutHashes: Fr[]): Fr {
  const paddedOutHashes = padArrayEnd(
    checkpointOutHashes.map(hash => hash.toBuffer()),
    Buffer.alloc(32),
    OUT_HASH_TREE_LEAF_COUNT,
  );
  return Fr.fromBuffer(computeBalancedShaRoot(paddedOutHashes));
}

// Computes the epoch out hash. It's the root of the balanced tree of all the checkpoint out hashes.
// It should match the **accumulated** out hash of the last checkpoint in the epoch.
// This value will be inserted into the Outbox on L1.
// See how the accumulated out hash is assigned to the root rollup's public inputs in `root_rollup.nr`.
export function computeEpochOutHash(messagesPerCheckpoint: Fr[][][][]): Fr {
  const checkpointOutHashes = messagesPerCheckpoint.map(checkpoint => computeCheckpointOutHash(checkpoint));
  return accumulateCheckpointOutHashes(checkpointOutHashes);
}
