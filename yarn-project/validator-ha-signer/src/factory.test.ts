/**
 * Tests for the factory functions
 */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Pool, PoolClient } from 'pg';

import { PostgresSlashingProtectionDatabase } from './db/postgres.js';
import { SCHEMA_VERSION } from './db/schema.js';
import { createHASigner } from './factory.js';
import { ValidatorHASigner } from './validator_ha_signer.js';

describe('createHASigner', () => {
  let mockPool: Pool;
  let mockClient: PoolClient;

  beforeEach(() => {
    // Create mock client
    mockClient = {
      query: jest.fn<(...args: any[]) => Promise<any>>().mockResolvedValue({ rows: [], rowCount: 0 }),
      release: jest.fn<() => void>(),
    } as unknown as PoolClient;

    // Create mock pool that returns correct schema version for initialize()
    mockPool = {
      connect: jest.fn<() => Promise<PoolClient>>().mockResolvedValue(mockClient),
      query: jest.fn<(...args: any[]) => Promise<any>>().mockImplementation((sql: string) => {
        // Return schema version when queried
        if (sql.includes('schema_version')) {
          return Promise.resolve({ rows: [{ version: SCHEMA_VERSION }], rowCount: 1 });
        }
        return Promise.resolve({ rows: [], rowCount: 0 });
      }),
      end: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    } as unknown as Pool;
  });

  it('should create a signer with default configuration', async () => {
    const { signer, db } = await createHASigner(
      {
        databaseUrl: 'postgresql://user:pass@localhost:5432/testdb',
        enabled: true,
        nodeId: 'test-node',
        pollingIntervalMs: 100,
        signingTimeoutMs: 3000,
        maxStuckDutiesAgeMs: 1000,
      },
      { pool: mockPool },
    );

    expect(signer).toBeInstanceOf(ValidatorHASigner);
    expect(db).toBeInstanceOf(PostgresSlashingProtectionDatabase);
    expect(signer.isEnabled).toBe(true);
    expect(signer.nodeId).toBe('test-node');
  });

  it('should create signer with disabled slashing protection', async () => {
    const { signer, db } = await createHASigner(
      {
        databaseUrl: 'postgresql://user:pass@localhost:5432/testdb',
        enabled: false,
        nodeId: 'test-node',
        pollingIntervalMs: 100,
        signingTimeoutMs: 3000,
        maxStuckDutiesAgeMs: 1000,
      },
      { pool: mockPool },
    );

    expect(signer).toBeInstanceOf(ValidatorHASigner);
    expect(db).toBeInstanceOf(PostgresSlashingProtectionDatabase);
    expect(signer.isEnabled).toBe(false);
  });

  it('should allow closing the database connection', async () => {
    const { db } = await createHASigner(
      {
        databaseUrl: 'postgresql://user:pass@localhost:5432/testdb',
        enabled: true,
        nodeId: 'test-node',
        pollingIntervalMs: 100,
        signingTimeoutMs: 3000,
        maxStuckDutiesAgeMs: 1000,
      },
      { pool: mockPool },
    );

    // Cast to PostgresSlashingProtectionDatabase to access close method
    await (db as PostgresSlashingProtectionDatabase).close();
    expect(mockPool.end).toHaveBeenCalled();
  });
});
