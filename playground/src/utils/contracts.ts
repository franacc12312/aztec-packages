import { AztecAddress } from '@aztec/aztec.js/addresses';
import type { AztecNode } from '@aztec/aztec.js/node';

export async function filterDeployedAliasedContracts(
  aliasedContracts: { alias: string; item: string }[],
  node: AztecNode,
) {
  const deployed = (
    await Promise.all(
      aliasedContracts.map(async contract => {
        const contractInstance = await node.getContract(AztecAddress.fromString(contract.item));
        return { ...contract, deployed: !!contractInstance };
      }),
    )
  ).filter(contract => contract.deployed);
  return deployed;
}
