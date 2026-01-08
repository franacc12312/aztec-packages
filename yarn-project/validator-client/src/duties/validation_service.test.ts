import { getAddressFromPrivateKey } from '@aztec/ethereum/account';
import { BlockNumber } from '@aztec/foundation/branded-types';
import { Buffer32 } from '@aztec/foundation/buffer';
import { EthAddress } from '@aztec/foundation/eth-address';
import { makeBlockProposal } from '@aztec/stdlib/testing';
import { Tx } from '@aztec/stdlib/tx';

import { generatePrivateKey } from 'viem/accounts';

import { LocalKeyStore } from '../key_store/local_key_store.js';
import { ValidationService } from './validation_service.js';

describe('ValidationService', () => {
  let service: ValidationService;
  let store: LocalKeyStore;
  let keys: `0x${string}`[];
  let addresses: EthAddress[];

  beforeEach(() => {
    keys = [generatePrivateKey(), generatePrivateKey()];
    addresses = keys.map(key => EthAddress.fromString(getAddressFromPrivateKey(key)));
    store = new LocalKeyStore(keys.map(key => Buffer32.fromString(key)));
    service = new ValidationService(store);
  });

  it('creates a proposal with txs appended', async () => {
    const txs = await Promise.all([Tx.random(), Tx.random()]);
    const {
      payload: { header, archive },
    } = makeBlockProposal({ txs });
    const blockNumber = BlockNumber(50);
    const proposal = await service.createBlockProposal(
      header,
      archive,
      txs,
      addresses[0],
      {
        publishFullTxs: true,
      },
      blockNumber,
      0,
    );
    expect(proposal!.getSender()).toEqual(store.getAddress(0));
    expect(proposal!.txs).toBeDefined();
    expect(proposal!.txs).toBe(txs);
  });

  it('creates a proposal without txs appended', async () => {
    const txs = await Promise.all([Tx.random(), Tx.random()]);
    const {
      payload: { header, archive },
    } = makeBlockProposal({ txs });
    const blockNumber = BlockNumber(50);
    const proposal = await service.createBlockProposal(
      header,
      archive,
      txs,
      addresses[0],
      {
        publishFullTxs: false,
      },
      blockNumber,
      0,
    );
    expect(proposal!.getSender()).toEqual(addresses[0]);
    expect(proposal!.txs).toBeUndefined();
  });

  it('attests to proposal', async () => {
    const txs = await Promise.all([Tx.random(), Tx.random()]);
    const proposal = makeBlockProposal({ txs });
    const blockNumber = BlockNumber(50);
    const attestations = await service.attestToProposal(proposal, addresses, blockNumber);
    expect(attestations.length).toBe(2);
    expect(attestations[0].getSender()).toEqual(addresses[0]);
    expect(attestations[1].getSender()).toEqual(addresses[1]);
  });
});
