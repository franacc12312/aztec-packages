/* eslint-disable no-console */
import { Buffer32 } from '@aztec/foundation/buffer';
import { EthAddress } from '@aztec/foundation/eth-address';
import type { Signature } from '@aztec/foundation/eth-signature';
import type { SigningContext } from '@aztec/validator-ha-signer/types';

import type { TypedDataDefinition } from 'viem';

import type { ValidatorKeyStore } from './key_store/interface.js';
import { Web3SignerKeyStore } from './key_store/web3signer_key_store.js';

const ITERATIONS = process.env.ITERATIONS ? parseInt(process.env.ITERATIONS) : 50;
const NETWORK_DELAY_MS = 10; // Simulated network delay in milliseconds

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wrapper around Web3SignerKeyStore that simulates network delay
 */
class Web3SignerKeyStoreWithDelay implements ValidatorKeyStore {
  constructor(
    private keyStore: Web3SignerKeyStore,
    private networkDelayMs: number,
  ) {}

  getAddress(index: number): EthAddress {
    return this.keyStore.getAddress(index);
  }

  getAddresses(): EthAddress[] {
    return this.keyStore.getAddresses();
  }

  async signTypedData(typedData: TypedDataDefinition, context?: SigningContext): Promise<Signature[]> {
    await sleep(this.networkDelayMs);
    return await this.keyStore.signTypedData(typedData, context);
  }

  async signTypedDataWithAddress(
    address: EthAddress,
    typedData: TypedDataDefinition,
    context?: SigningContext,
  ): Promise<Signature> {
    await sleep(this.networkDelayMs);
    return await this.keyStore.signTypedDataWithAddress(address, typedData, context);
  }

  async signMessage(message: Buffer32, context?: SigningContext): Promise<Signature[]> {
    await sleep(this.networkDelayMs);
    return await this.keyStore.signMessage(message, context);
  }

  async signMessageWithAddress(address: EthAddress, message: Buffer32, context?: SigningContext): Promise<Signature> {
    await sleep(this.networkDelayMs);
    return await this.keyStore.signMessageWithAddress(address, message, context);
  }
}

/**
 * Fetch available addresses from Web3Signer
 */
async function fetchWeb3SignerAddresses(baseUrl: string): Promise<EthAddress[]> {
  // const response = await fetch(`${baseUrl}/api/v1/eth1/addresses`);
  const response = await fetch(baseUrl, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_accounts',
      params: [],
      id: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch addresses: ${response.status} ${response.statusText}`);
  }

  const publicKeys = (await response.json()).result as string[];
  console.log(`Found ${publicKeys.length} addresses in Web3Signer`);

  console.log('Public keys:', publicKeys);

  // Convert public keys to addresses (Web3Signer returns Ethereum addresses)
  return publicKeys.map(addr => EthAddress.fromString(addr));
}

/**
 * Run signing requests sequentially - sign with each address one by one
 */
async function signSequentially(keyStore: ValidatorKeyStore, addresses: EthAddress[]): Promise<number> {
  const message = Buffer32.random();
  const startTime = Date.now();

  for (const address of addresses) {
    await keyStore.signMessageWithAddress(address, message);
  }

  const duration = Date.now() - startTime;
  return duration;
}

/**
 * Run signing requests in parallel - sign with all addresses at once using Promise.all
 */
async function signInParallel(keyStore: ValidatorKeyStore, addresses: EthAddress[]): Promise<number> {
  const message = Buffer32.random();
  const startTime = Date.now();

  await Promise.all(addresses.map(address => keyStore.signMessageWithAddress(address, message)));

  const duration = Date.now() - startTime;
  return duration;
}

/**
 * Calculate statistics for an array of numbers
 */
function calculateStats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const median =
    values.length % 2 === 0
      ? (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2
      : sorted[Math.floor(values.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  // Calculate standard deviation
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return { total: sum, mean, median, min, max, stdDev };
}

/**
 * Main function to compare sequential vs parallel signing
 */
async function main() {
  const web3SignerUrl = 'http://localhost:9000';
  const iterations = ITERATIONS;

  console.log('=== Web3Signer Performance Comparison ===\n');
  console.log(`Web3Signer URL: ${web3SignerUrl}`);
  console.log(`Iterations: ${iterations}\n`);

  try {
    // Fetch available addresses
    console.log('Fetching addresses from Web3Signer...');
    const addresses = await fetchWeb3SignerAddresses(web3SignerUrl);

    if (addresses.length === 0) {
      throw new Error('No addresses found in Web3Signer');
    }

    console.log('Addresses:');
    addresses.forEach((addr, idx) => {
      console.log(`  [${idx}] ${addr.toString()}`);
    });
    console.log(`\nSigning with ${addresses.length} addresses per iteration`);
    console.log(`Network delay simulation: ${NETWORK_DELAY_MS}ms per request\n`);

    // Create keystore with network delay simulation
    const baseKeyStore = new Web3SignerKeyStore(addresses, web3SignerUrl);
    const keyStore = new Web3SignerKeyStoreWithDelay(baseKeyStore, NETWORK_DELAY_MS);

    // Test sequential signing multiple times
    console.log(`Testing sequential signing (${iterations} iterations)...`);
    const sequentialDurations: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const duration = await signSequentially(keyStore, addresses);
      sequentialDurations.push(duration);
      if ((i + 1) % 10 === 0) {
        console.log(`  Completed ${i + 1}/${iterations} iterations`);
      }
    }
    const seqStats = calculateStats(sequentialDurations);
    console.log('\nSequential Results:');
    console.log(`  Total:  ${seqStats.total.toFixed(2)}ms`);
    console.log(
      `  Mean:   ${seqStats.mean.toFixed(2)}ms (${(seqStats.mean / addresses.length).toFixed(2)}ms per sign)`,
    );
    console.log(`  Median: ${seqStats.median.toFixed(2)}ms`);
    console.log(`  Min:    ${seqStats.min.toFixed(2)}ms`);
    console.log(`  Max:    ${seqStats.max.toFixed(2)}ms`);
    console.log(`  StdDev: ${seqStats.stdDev.toFixed(2)}ms\n`);

    // Test parallel signing multiple times
    console.log(`Testing parallel signing (${iterations} iterations)...`);
    const parallelDurations: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const duration = await signInParallel(keyStore, addresses);
      parallelDurations.push(duration);
      if ((i + 1) % 10 === 0) {
        console.log(`  Completed ${i + 1}/${iterations} iterations`);
      }
    }
    const parStats = calculateStats(parallelDurations);
    console.log('\nParallel Results:');
    console.log(`  Total:  ${parStats.total.toFixed(2)}ms`);
    console.log(
      `  Mean:   ${parStats.mean.toFixed(2)}ms (${(parStats.mean / addresses.length).toFixed(2)}ms per sign)`,
    );
    console.log(`  Median: ${parStats.median.toFixed(2)}ms`);
    console.log(`  Min:    ${parStats.min.toFixed(2)}ms`);
    console.log(`  Max:    ${parStats.max.toFixed(2)}ms`);
    console.log(`  StdDev: ${parStats.stdDev.toFixed(2)}ms\n`);

    // Summary
    const speedup = (seqStats.mean / parStats.mean).toFixed(2);
    const improvement = (((seqStats.mean - parStats.mean) / seqStats.mean) * 100).toFixed(1);
    const totalSpeedup = (seqStats.total / parStats.total).toFixed(2);

    console.log('=== Summary ===');
    console.log(`Total Time - Sequential: ${seqStats.total.toFixed(2)}ms, Parallel: ${parStats.total.toFixed(2)}ms`);
    console.log(`Total Speedup: ${totalSpeedup}x`);
    console.log(`Average Speedup: ${speedup}x`);
    console.log(`Average Improvement: ${improvement}%`);
    console.log(`Sequential: ${seqStats.mean.toFixed(2)}ms ± ${seqStats.stdDev.toFixed(2)}ms`);
    console.log(`Parallel:   ${parStats.mean.toFixed(2)}ms ± ${parStats.stdDev.toFixed(2)}ms`);

    if (parStats.mean < seqStats.mean) {
      console.log('\n✓ Parallel signing is faster on average');
    } else {
      console.log('\n✗ Sequential signing is faster on average (unexpected)');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the comparison
main().catch(console.error);
