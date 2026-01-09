import type { AztecAsyncKVStore, AztecAsyncMap } from '@aztec/kv-store';
import type { DirectionalAppTaggingSecret } from '@aztec/stdlib/logs';

import type { StagedStore } from '../../job_coordinator/job_coordinator.js';

/**
 * Data provider of tagging data used when syncing the logs as a recipient. The sender counterpart of this class
 * is called SenderTaggingStore. We have the providers separate for the sender and recipient because
 * the algorithms are completely disjoint and there is not data reuse between the two.
 *
 * @dev Chain reorgs do not need to be handled here because both the finalized and aged indexes refer to finalized
 * blocks, which by definition cannot be affected by reorgs.
 *
 * TODO(benesjan): Relocate to yarn-project/pxe/src/storage/tagging_store
 */
export class RecipientTaggingStore implements StagedStore {
  storeName: string = 'recipient_tagging';

  #store: AztecAsyncKVStore;

  #highestAgedIndex: AztecAsyncMap<string, number>;
  #highestFinalizedIndex: AztecAsyncMap<string, number>;

  // jobId => secret => number
  #stagedHighestAgedIndex: Map<string, Map<string, number>>;

  // jobId => secret => number
  #stagedHighestFinalizedIndex: Map<string, Map<string, number>>;

  constructor(store: AztecAsyncKVStore) {
    this.#store = store;

    this.#highestAgedIndex = this.#store.openMap('highest_aged_index');
    this.#highestFinalizedIndex = this.#store.openMap('highest_finalized_index');

    this.#stagedHighestAgedIndex = new Map();
    this.#stagedHighestFinalizedIndex = new Map();
  }

  #getJobStagedHighestAgedIndex(jobId: string): Map<string, number> {
    let jobStagedHighestAgedIndex = this.#stagedHighestAgedIndex.get(jobId);
    if (!jobStagedHighestAgedIndex) {
      jobStagedHighestAgedIndex = new Map();
      this.#stagedHighestAgedIndex.set(jobId, jobStagedHighestAgedIndex);
    }
    return jobStagedHighestAgedIndex;
  }

  async #getHighestFinalizedIndexFromStage(jobId: string, secret: string): Promise<number | undefined> {
    let staged = this.#getJobStagedHighestFinalizedIndex(jobId).get(secret);
    if (staged === undefined) {
      staged = await this.#highestFinalizedIndex.getAsync(secret);
    }
    return staged;
  }

  async #getHighestAgedIndexFromStage(jobId: string, secret: string): Promise<number | undefined> {
    let staged = this.#getJobStagedHighestAgedIndex(jobId).get(secret);
    if (staged === undefined) {
      staged = await this.#highestAgedIndex.getAsync(secret);
    }
    return staged;
  }

  #setHighestAgedIndexOnStage(jobId: string, secret: string, index: number) {
    this.#getJobStagedHighestAgedIndex(jobId).set(secret, index);
  }

  #getJobStagedHighestFinalizedIndex(jobId: string): Map<string, number> {
    let jobStagedHighestFinalizedIndex = this.#stagedHighestFinalizedIndex.get(jobId);
    if (!jobStagedHighestFinalizedIndex) {
      jobStagedHighestFinalizedIndex = new Map();
      this.#stagedHighestFinalizedIndex.set(jobId, jobStagedHighestFinalizedIndex);
    }
    return jobStagedHighestFinalizedIndex;
  }

  #setHighestFinalizedIndexOnStage(jobId: string, secret: string, index: number) {
    this.#getJobStagedHighestFinalizedIndex(jobId).set(secret, index);
  }

  async commit(jobId: string): Promise<void> {
    const stagedHighestAgedIndex = this.#stagedHighestAgedIndex.get(jobId);
    if (stagedHighestAgedIndex) {
      for (const [secret, index] of stagedHighestAgedIndex.entries()) {
        await this.#highestAgedIndex.set(secret, index);
      }
    }

    const stagedHighestFinalizedIndex = this.#stagedHighestFinalizedIndex.get(jobId);
    if (stagedHighestFinalizedIndex) {
      for (const [secret, index] of stagedHighestFinalizedIndex.entries()) {
        await this.#highestFinalizedIndex.set(secret, index);
      }
    }

    this.#stagedHighestAgedIndex.delete(jobId);
    this.#stagedHighestFinalizedIndex.delete(jobId);
  }

  discardStaged(jobId: string): Promise<void> {
    this.#stagedHighestAgedIndex.delete(jobId);
    this.#stagedHighestFinalizedIndex.delete(jobId);
    return Promise.resolve();
  }

  getHighestAgedIndex(secret: DirectionalAppTaggingSecret, jobId: string): Promise<number | undefined> {
    return this.#getHighestAgedIndexFromStage(jobId, secret.toString());
  }

  async updateHighestAgedIndex(secret: DirectionalAppTaggingSecret, index: number, jobId: string): Promise<void> {
    const currentIndex = await this.#getHighestAgedIndexFromStage(jobId, secret.toString());
    if (currentIndex !== undefined && index <= currentIndex) {
      // Log sync should never set a lower highest aged index.
      throw new Error(`New highest aged index (${index}) must be higher than the current one (${currentIndex})`);
    }
    this.#setHighestAgedIndexOnStage(jobId, secret.toString(), index);
  }

  getHighestFinalizedIndex(secret: DirectionalAppTaggingSecret, jobId: string): Promise<number | undefined> {
    return this.#getHighestFinalizedIndexFromStage(jobId, secret.toString());
  }

  async updateHighestFinalizedIndex(secret: DirectionalAppTaggingSecret, index: number, jobId: string): Promise<void> {
    const currentIndex = await this.#getHighestFinalizedIndexFromStage(jobId, secret.toString());
    if (currentIndex !== undefined && index < currentIndex) {
      // Log sync should never set a lower highest finalized index but it can happen that it would try to set the same
      // one because we are loading logs from highest aged index + 1 and not from the highest finalized index.
      throw new Error(`New highest finalized index (${index}) must be higher than the current one (${currentIndex})`);
    }
    this.#setHighestFinalizedIndexOnStage(jobId, secret.toString(), index);
  }
}
