import { AztecAddress } from '@aztec/aztec.js/addresses';
import { Fr } from '@aztec/aztec.js/fields';
import type { AztecNode } from '@aztec/aztec.js/node';
import { BlockNumber } from '@aztec/foundation/branded-types';
import { EventOnlyContract, type TestEvent } from '@aztec/noir-test-contracts.js/EventOnly';
import type { TestWallet } from '@aztec/test-wallet/server';

import { jest } from '@jest/globals';

import { ensureAccountContractsPublished, setup } from './fixtures/utils.js';

const TIMEOUT = 120_000;

/// Tests that a private event can be obtained for a contract that does not work with notes.
describe('EventOnly', () => {
  let eventOnlyContract: EventOnlyContract;
  jest.setTimeout(TIMEOUT);

  let wallet: TestWallet;
  let aztecNode: AztecNode;
  let defaultAccountAddress: AztecAddress;
  let teardown: () => Promise<void>;

  beforeAll(async () => {
    ({
      teardown,
      wallet,
      aztecNode,
      accounts: [defaultAccountAddress],
    } = await setup(1));
    await ensureAccountContractsPublished(wallet, [defaultAccountAddress], aztecNode);
    eventOnlyContract = await EventOnlyContract.deploy(wallet).send({ from: defaultAccountAddress }).deployed();
  });

  afterAll(() => teardown());

  it('emits and retrieves a private event for a contract with no notes', async () => {
    const value = Fr.random();
    const tx = await eventOnlyContract.methods
      .emit_event_for_msg_sender(value)
      .send({ from: defaultAccountAddress })
      .wait();

    const events = await wallet.getPrivateEvents<TestEvent>(EventOnlyContract.events.TestEvent, {
      contractAddress: eventOnlyContract.address,
      fromBlock: BlockNumber(tx.blockNumber!),
      toBlock: BlockNumber(tx.blockNumber! + 1),
      scopes: [defaultAccountAddress],
    });

    expect(events.length).toBe(1);
    expect(events[0].event.value).toBe(value.toBigInt());
  });
});
