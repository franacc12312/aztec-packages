# Database Migrations Guide

This package uses [node-pg-migrate](https://github.com/salsita/node-pg-migrate) for managing database schema changes.

## Quick Reference

```bash
# Run pending migrations
yarn migrate:up

# Rollback last migration
yarn migrate:down

# Check migration status
DATABASE_URL=postgresql://... npx node-pg-migrate status
```

## Migration Files

Migrations are located in the `migrations/` directory and are named with timestamps:

```
migrations/
  └── 1_initial-schema.ts
```

## Creating New Migrations

When you need to modify the database schema:

```bash
# Generate a new migration file
npx node-pg-migrate create add-new-field

# This creates: migrations/[timestamp]_add-new-field.ts
```

Edit the generated file:

```typescript
import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Add your schema changes here
  pgm.addColumn('validator_duties', {
    new_field: { type: 'text', notNull: false },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // Reverse the changes
  pgm.dropColumn('validator_duties', 'new_field');
}
```

## Production Deployment

### Option 1: Kubernetes Init Container

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: validator
spec:
  template:
    spec:
      initContainers:
        - name: db-migrate
          image: validator-image:latest
          command: ['yarn', 'migrate:up']
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: connection-string
      containers:
        - name: validator
          image: validator-image:latest
          # ... validator config
```

### Option 2: Separate Migration Job

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: validator-migrate-v1
spec:
  template:
    spec:
      containers:
        - name: migrate
          image: validator-image:latest
          command: ['yarn', 'migrate:up']
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: connection-string
      restartPolicy: Never
```

### Option 3: CI/CD Pipeline

```yaml
# GitHub Actions example
- name: Run Database Migrations
  run: |
    export DATABASE_URL=${{ secrets.DATABASE_URL }}
    cd yarn-project/validator-ha-signer
    yarn migrate:up
```

## High Availability Considerations

The migrations use idempotent SQL operations (`IF NOT EXISTS`, `ON CONFLICT`, etc.), making them safe to run concurrently from multiple nodes. However, for cleaner logs and faster deployments, we recommend:

1. **Run migrations once** from an init container or migration job
2. **Then start** multiple validator nodes

If multiple nodes run migrations simultaneously, they will all succeed, but you'll see redundant log output.

## Development Workflow

```bash
# 1. Create migration
npx node-pg-migrate create my-feature

# 2. Edit migrations/[timestamp]_my-feature.ts

# 3. Test migration locally
export DATABASE_URL=postgresql://localhost:5432/validator_dev
yarn migrate:up

# 4. Test rollback
yarn migrate:down

# 5. Re-apply
yarn migrate:up

# 6. Run tests
yarn test
```

## Troubleshooting

### Migration Failed Midway

If a migration fails partway through:

```bash
# Check the current state
DATABASE_URL=postgresql://... npx node-pg-migrate status

# The failed migration will be marked as running
# Fix the issue and re-run
yarn migrate:up
```

### Reset Development Database

```bash
# Drop all migrations
while yarn migrate:down; do :; done

# Or drop the database entirely
psql -c "DROP DATABASE validator_dev;"
psql -c "CREATE DATABASE validator_dev;"

# Re-run migrations
yarn migrate:up
```

### Check Applied Migrations

```bash
# Query the migrations table
psql $DATABASE_URL -c "SELECT * FROM pgmigrations ORDER BY id;"
```

## Migration Best Practices

1. **Always provide `down()` migrations** for rollback capability
2. **Test migrations on a copy of production data** before deploying
3. **Make migrations backward compatible** when possible
4. **Avoid data migrations in schema migrations** - use separate data migration scripts
5. **Keep migrations small and focused** - one logical change per migration
6. **Never modify committed migrations** - create a new migration instead
