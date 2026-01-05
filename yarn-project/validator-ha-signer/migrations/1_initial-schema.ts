/**
 * Initial schema for validator HA slashing protection
 */
import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  // Create schema version table
  pgm.createTable('schema_version', {
    version: {
      type: 'integer',
      primaryKey: true,
    },
    applied_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });

  // Create validator duties table
  pgm.createTable('validator_duties', {
    validator_address: {
      type: 'varchar(42)',
      notNull: true,
    },
    slot: {
      type: 'bigint',
      notNull: true,
    },
    block_number: {
      type: 'bigint',
      notNull: true,
    },
    duty_type: {
      type: 'varchar(30)',
      notNull: true,
      check: "duty_type IN ('BLOCK_PROPOSAL', 'ATTESTATION', 'ATTESTATIONS_AND_SIGNERS')",
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      check: "status IN ('signing', 'signed', 'failed')",
    },
    message_hash: {
      type: 'varchar(66)',
      notNull: true,
    },
    signature: {
      type: 'varchar(132)',
    },
    node_id: {
      type: 'varchar(255)',
      notNull: true,
    },
    started_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    completed_at: {
      type: 'timestamp',
    },
    error_message: {
      type: 'text',
    },
  });

  // Add primary key constraint
  pgm.addConstraint('validator_duties', 'validator_duties_pkey', {
    primaryKey: ['validator_address', 'slot', 'duty_type'],
  });

  // Add check constraint for completed_at
  pgm.addConstraint('validator_duties', 'validator_duties_completed_at_check', {
    check: 'completed_at IS NULL OR completed_at >= started_at',
  });

  // Create indexes
  pgm.createIndex('validator_duties', ['status', 'started_at'], {
    name: 'idx_validator_duties_status',
  });

  pgm.createIndex('validator_duties', ['node_id', 'started_at'], {
    name: 'idx_validator_duties_node',
  });

  // Insert initial schema version
  pgm.sql(`
    INSERT INTO schema_version (version)
    VALUES (1)
    ON CONFLICT (version) DO NOTHING;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('validator_duties');
  pgm.dropTable('schema_version');
}
