import { AztecAddress } from '@aztec/aztec.js/addresses';
import { type AztecNode, isContractPublished } from '@aztec/aztec.js/node';

export async function filterDeployedAliasedContracts(
  aliasedContracts: { alias: string; item: string }[],
  node: AztecNode,
) {
  const deployed = (
    await Promise.all(
      aliasedContracts.map(async contract => {
        return { ...contract, deployed: await isContractPublished(node, AztecAddress.fromString(contract.item)) };
      }),
    )
  ).filter(contract => contract.deployed);
  return deployed;
}
