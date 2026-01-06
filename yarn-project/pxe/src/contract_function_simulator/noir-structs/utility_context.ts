import { Fr } from '@aztec/foundation/curves/bn254';
import type { FieldsOf } from '@aztec/foundation/types';
import { toACVMField } from '@aztec/simulator/client';
import type { AztecAddress } from '@aztec/stdlib/aztec-address';
import type { BlockHeader } from '@aztec/stdlib/tx';
import type { UInt64 } from '@aztec/stdlib/types';

/**
 * TypeScript counterpart of utility_context.nr. Used only as a return value for the utilityGetUtilityContext oracle.
 */
export class UtilityContext {
  private constructor(
    public readonly blockHeader: BlockHeader,
    public readonly timestamp: UInt64,
    public readonly contractAddress: AztecAddress,
    public readonly version: Fr,
    public readonly chainId: Fr,
  ) {}

  static from(fields: FieldsOf<UtilityContext>) {
    return new UtilityContext(
      fields.blockHeader,
      fields.timestamp,
      fields.contractAddress,
      fields.version,
      fields.chainId,
    );
  }

  /**
   * Returns a representation of the utility context as expected by intrinsic Noir deserialization.
   * The order of the fields has to be the same as the order of the fields in the utility_context.nr.
   */
  public toNoirRepresentation(): (string | string[])[] {
    // TODO(#12874): remove the stupid as string conversion by modifying ForeignCallOutput type in acvm.js
    const blockHeaderFields = this.blockHeader.toFields().map(toACVMField);
    return [
      blockHeaderFields,
      new Fr(this.timestamp).toString() as string,
      this.contractAddress.toString() as string,
      this.version.toString() as string,
      this.chainId.toString() as string,
    ];
  }
}
