/**
 * Programmatic migration runner
 */
import { createLogger } from '@aztec/foundation/log';

import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync } from 'fs';
import { runner } from 'node-pg-migrate';
import { tmpdir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface RunMigrationsOptions {
  /** Migration direction ('up' to apply, 'down' to rollback). Defaults to 'up'. */
  direction?: 'up' | 'down';
  /** Enable verbose output. Defaults to false. */
  verbose?: boolean;
}

/**
 * Run database migrations programmatically
 *
 * @param databaseUrl - PostgreSQL connection string
 * @param options - Migration options (direction, verbose)
 * @returns Array of applied migration names
 */
export async function runMigrations(databaseUrl: string, options: RunMigrationsOptions = {}): Promise<string[]> {
  const direction = options.direction ?? 'up';
  const verbose = options.verbose ?? false;

  const log = createLogger('validator-ha-signer:migrations');

  const dbDir = join(__dirname, 'db');
  const migrationsDir = join(dbDir, 'migrations');
  let tempDir: string | undefined;

  try {
    log.info(`Running migrations ${direction}...`);

    // Filter out .d.ts and .d.ts.map files - node-pg-migrate only needs .js files
    const migrationFiles = readdirSync(migrationsDir);
    const jsMigrationFiles = migrationFiles.filter(
      file => file.endsWith('.js') && !file.endsWith('.d.ts') && !file.endsWith('.d.ts.map'),
    );

    if (jsMigrationFiles.length === 0) {
      log.info('No migration files found');
      return [];
    }

    // Create a temporary directory structure to maintain relative imports
    // Migration files import ../schema.js, so we need to copy schema.js as well
    tempDir = mkdtempSync(join(tmpdir(), 'pg-migrations-'));
    const tempDbDir = join(tempDir, 'db');
    const tempMigrationsDir = join(tempDbDir, 'migrations');
    mkdirSync(tempMigrationsDir, { recursive: true });

    // Copy migration .js files
    for (const file of jsMigrationFiles) {
      copyFileSync(join(migrationsDir, file), join(tempMigrationsDir, file));
    }

    // Copy schema.js which is imported by migrations
    const schemaFile = join(dbDir, 'schema.js');
    try {
      if (statSync(schemaFile).isFile()) {
        copyFileSync(schemaFile, join(tempDbDir, 'schema.js'));
      }
    } catch {
      // schema.js might not exist, that's okay
      log.debug('schema.js not found, skipping');
    }

    const appliedMigrations = await runner({
      databaseUrl,
      dir: tempMigrationsDir,
      direction,
      migrationsTable: 'pgmigrations',
      count: direction === 'down' ? 1 : Infinity,
      verbose,
      log: msg => (verbose ? log.info(msg) : log.debug(msg)),
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
  } finally {
    // Clean up temporary directory
    if (tempDir) {
      try {
        rmSync(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        log.debug('Failed to clean up temporary migration directory', cleanupError);
      }
    }
  }
}
