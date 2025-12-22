# Validator HA Signer

Distributed locking and slashing protection for Aztec validators running in high-availability configurations.

## Features

- **Distributed Locking**: Prevents multiple validator nodes from signing the same duty
- **Slashing Protection**: Blocks attempts to sign conflicting data for the same slot
- **Automatic Retry**: Failed signing attempts are cleared, allowing other nodes to retry
- **PostgreSQL Backend**: Shared database for coordination across nodes

## Quick Start

### Option 1: Automatic Migrations (Simplest)

```typescript
import { createHASigner } from '@aztec/validator-ha-signer/factory';

// Migrations run automatically on startup
const { signer, db } = await createHASigner({
  databaseUrl: process.env.DATABASE_URL,
  enabled: true,
  nodeId: 'validator-node-1',
  pollingIntervalMs: 100,
  signingTimeoutMs: 3000,
  runMigrations: true, // Auto-run migrations
});

// Sign with protection
const signature = await signer.signWithProtection(
  validatorAddress,
  signingRoot,
  { slot: 100n, blockNumber: 50n, dutyType: 'BLOCK_PROPOSAL' },
  async root => localSigner.signMessage(root),
);

// Cleanup on shutdown
await db.close();
```

### Option 2: Manual Migrations (Recommended for Production)

```bash
# 1. Run migrations separately (once per deployment)
export DATABASE_URL=postgresql://user:pass@host:port/db
yarn migrate:up
```

```typescript
// 2. Create signer (migrations already applied)
import { createHASigner } from '@aztec/validator-ha-signer/factory';

const { signer, db } = await createHASigner({
  databaseUrl: process.env.DATABASE_URL,
  enabled: true,
  nodeId: 'validator-node-1',
  pollingIntervalMs: 100,
  signingTimeoutMs: 3000,
  // runMigrations defaults to false
});
```

### Advanced: Manual Database Setup

If you need more control over the database connection:

```typescript
import { PostgresSlashingProtectionDatabase, ValidatorHASigner } from '@aztec/validator-ha-signer';

import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = new PostgresSlashingProtectionDatabase(pool);

const signer = new ValidatorHASigner(db, {
  enabled: true,
  nodeId: 'validator-node-1',
});
```

## Configuration

Set via environment variables or config object:

- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:pass@host:port/db`)
- `SLASHING_PROTECTION_NODE_ID`: Unique identifier for this validator node
- `SLASHING_PROTECTION_POLLING_INTERVAL_MS`: How often to check duty status (default: 100)
- `SLASHING_PROTECTION_SIGNING_TIMEOUT_MS`: Max wait for in-progress signing (default: 3000)

## Database Migrations

This package uses `node-pg-migrate` for database schema management.

### Migration Commands

```bash
# Run pending migrations
yarn migrate:up

# Rollback last migration
yarn migrate:down

# Check migration status
DATABASE_URL=postgresql://... npx node-pg-migrate status
```

### Creating New Migrations

```bash
# Generate a new migration file
npx node-pg-migrate create my-migration-name
```

### Production Deployment

Run migrations before starting your application:

```yaml
# Kubernetes example
apiVersion: batch/v1
kind: Job
metadata:
  name: validator-db-migrate
spec:
  template:
    spec:
      containers:
        - name: migrate
          image: your-validator-image
          command: ['yarn', 'migrate:up']
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
      restartPolicy: OnFailure
```

## How It Works

When multiple validator nodes attempt to sign:

1. First node acquires lock and signs
2. Other nodes receive `DutyAlreadySignedError` (expected)
3. If different data detected: `SlashingProtectionError` (critical)
4. Failed attempts are auto-cleaned, allowing retry

## Development

```bash
yarn build    # Build package
yarn test     # Run tests
yarn clean    # Clean build artifacts
```
