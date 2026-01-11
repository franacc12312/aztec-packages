import { createLogger } from '@aztec/foundation/log';
import { Tx, type TxValidationResult, type TxValidator } from '@aztec/stdlib/tx';

const DefaultMaxTxSizeBytes = 512 * 1024;

export class SizeTxValidator implements TxValidator<Tx> {
  #log = createLogger('sequencer:tx_validator:tx_size');
  constructor(private readonly maxSize: number = DefaultMaxTxSizeBytes) {}
  validateTx(tx: Tx): Promise<TxValidationResult> {
    const txSize = tx.getSize();
    if (txSize > this.maxSize) {
      this.#log.verbose(
        `Rejecting transaction ${tx.getTxHash().toString()}. Reason: size above size limit. ${txSize} > ${this.maxSize}`,
      );
      return Promise.resolve({ result: 'invalid', reason: ['Transaction size above size limit'] });
    }
    return Promise.resolve({ result: 'valid' });
  }
}
