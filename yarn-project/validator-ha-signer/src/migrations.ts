/**
 * Programmatic migration runner
 */
import { createLogger } from '@aztec/foundation/log';

import { runner } from 'node-pg-migrate';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Run database migrations programmatically
 *
 * @param databaseUrl - PostgreSQL connection string
 * @param direction - Migration direction ('up' to apply, 'down' to rollback)
 * @returns Array of applied migration names
 */
export async function runMigrations(databaseUrl: string, direction: 'up' | 'down' = 'up'): Promise<string[]> {
  const log = createLogger('validator-ha-signer:migrations');

  try {
    log.info(`Running migrations ${direction}...`);

    const appliedMigrations = await runner({
      databaseUrl,
      dir: join(__dirname, '..', 'migrations'),
      direction,
      migrationsTable: 'pgmigrations',
      count: direction === 'down' ? 1 : Infinity,
      verbose: false,
      log: msg => log.debug(msg),
    });

    if (appliedMigrations.length === 0) {
      log.info('No migrations to apply - schema is up to date');
    } else {
      log.info(`Applied ${appliedMigrations.length} migration(s)`, {
        migrations: appliedMigrations.map(m => m.name),
      });
    }

    return appliedMigrations.map(m => m.name);
  } catch (error: any) {
    log.error('Migration failed', error);
    throw error;
  }
}
