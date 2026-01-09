import type { Fr } from '@aztec/foundation/curves/bn254';
import type { Logger } from '@aztec/foundation/log';
import { retryUntil } from '@aztec/foundation/retry';
import type { AztecAddress } from '@aztec/stdlib/aztec-address';
import { siloNullifier } from '@aztec/stdlib/hash';
import type { AztecNode } from '@aztec/stdlib/interfaces/client';

/**
 * Checks if a contract instance is publicly deployed on-chain.
 * @param node - The Aztec node to query.
 * @param address - The address of the contract to check.
 * @returns True if the contract instance is registered on-chain.
 */
export async function isContractPublished(node: AztecNode, address: AztecAddress): Promise<boolean> {
  return !!(await node.getContract(address));
}

/**
 * Checks if a contract class is publicly registered on-chain.
 * @param node - The Aztec node to query.
 * @param classId - The class ID to check.
 * @returns True if the contract class is registered on-chain.
 */
export async function isContractClassPubliclyRegistered(node: AztecNode, classId: Fr): Promise<boolean> {
  return !!(await node.getContractClass(classId));
}

/**
 * Checks if a contract has been initialized (its initialization nullifier exists).
 * @param node - The Aztec node to query.
 * @param address - The address of the contract to check.
 * @returns True if the contract's initialization nullifier has been emitted.
 */
export async function isContractInitialized(node: AztecNode, address: AztecAddress): Promise<boolean> {
  const initNullifier = await siloNullifier(address, address.toField());
  return !!(await node.getNullifierMembershipWitness('latest', initNullifier));
}

export const waitForNode = async (node: AztecNode, logger?: Logger) => {
  await retryUntil(async () => {
    try {
      logger?.verbose('Attempting to contact Aztec node...');
      await node.getNodeInfo();
      logger?.verbose('Contacted Aztec node');
      return true;
    } catch {
      logger?.verbose('Failed to contact Aztec Node');
    }
    return undefined;
  }, 'RPC Get Node Info');
};

export { createAztecNodeClient, type AztecNode } from '@aztec/stdlib/interfaces/client';
