/**
 * SQL schema for the validator_duties table
 *
 * This table is used for distributed locking and slashing protection across multiple validator nodes.
 * The PRIMARY KEY constraint ensures that only one node can acquire the lock for a given validator,
 * slot, and duty type combination.
 */

/**
 * Current schema version
 */
export const SCHEMA_VERSION = 1;

/**
 * SQL to create the validator_duties table
 */
export const CREATE_VALIDATOR_DUTIES_TABLE = `
CREATE TABLE IF NOT EXISTS validator_duties (
  validator_address VARCHAR(42) NOT NULL,
  slot BIGINT NOT NULL,
  block_number BIGINT NOT NULL,
  duty_type VARCHAR(30) NOT NULL CHECK (duty_type IN ('BLOCK_PROPOSAL', 'ATTESTATION', 'ATTESTATIONS_AND_SIGNERS')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('signing', 'signed', 'failed')),
  signing_root VARCHAR(66) NOT NULL,
  signature VARCHAR(132),
  node_id VARCHAR(255) NOT NULL,
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  error_message TEXT,

  PRIMARY KEY (validator_address, slot, duty_type),
  CHECK (completed_at IS NULL OR completed_at >= started_at)
);
`;

/**
 * SQL to create index on status and started_at for cleanup queries
 */
export const CREATE_STATUS_INDEX = `
CREATE INDEX IF NOT EXISTS idx_validator_duties_status
ON validator_duties(status, started_at);
`;

/**
 * SQL to create index for querying duties by node
 */
export const CREATE_NODE_INDEX = `
CREATE INDEX IF NOT EXISTS idx_validator_duties_node
ON validator_duties(node_id, started_at);
`;

/**
 * SQL to create the schema_version table for tracking migrations
 */
export const CREATE_SCHEMA_VERSION_TABLE = `
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY,
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

/**
 * SQL to initialize schema version
 */
export const INSERT_SCHEMA_VERSION = `
INSERT INTO schema_version (version)
VALUES ($1)
ON CONFLICT (version) DO NOTHING;
`;

/**
 * Complete schema setup - all statements in order
 */
export const SCHEMA_SETUP = [
  CREATE_SCHEMA_VERSION_TABLE,
  CREATE_VALIDATOR_DUTIES_TABLE,
  CREATE_STATUS_INDEX,
  CREATE_NODE_INDEX,
] as const;

/**
 * Query to get current schema version
 */
export const GET_SCHEMA_VERSION = `
SELECT version FROM schema_version ORDER BY version DESC LIMIT 1;
`;

/**
 * Query to check if a duty exists
 */
export const CHECK_DUTY_EXISTS = `
SELECT
  validator_address,
  slot,
  block_number,
  duty_type,
  status,
  signing_root,
  signature,
  node_id,
  started_at,
  completed_at,
  error_message
FROM validator_duties
WHERE validator_address = $1
  AND slot = $2
  AND duty_type = $3;
`;

/**
 * Query to insert a new duty with 'signing' status
 */
export const INSERT_DUTY = `
INSERT INTO validator_duties (
  validator_address,
  slot,
  block_number,
  duty_type,
  status,
  signing_root,
  node_id,
  started_at
) VALUES ($1, $2, $3, $4, 'signing', $5, $6, CURRENT_TIMESTAMP)
RETURNING
  validator_address,
  slot,
  block_number,
  duty_type,
  status,
  signing_root,
  node_id,
  started_at;
`;

/**
 * Query to update a duty to 'signed' status
 */
export const UPDATE_DUTY_SIGNED = `
UPDATE validator_duties
SET status = 'signed',
    signature = $1,
    completed_at = CURRENT_TIMESTAMP
WHERE validator_address = $2
  AND slot = $3
  AND duty_type = $4
  AND status = 'signing';
`;

/**
 * Query to update a duty to 'failed' status
 */
export const UPDATE_DUTY_FAILED = `
UPDATE validator_duties
SET status = 'failed',
    error_message = $1,
    completed_at = CURRENT_TIMESTAMP
WHERE validator_address = $2
  AND slot = $3
  AND duty_type = $4
  AND status = 'signing';
`;

/**
 * Query to delete a failed duty (to allow retry)
 */
export const DELETE_FAILED_DUTY = `
DELETE FROM validator_duties
WHERE validator_address = $1
  AND slot = $2
  AND duty_type = $3
  AND status = 'failed';
`;

/**
 * Query to clean up old duties (for maintenance)
 * Removes duties older than a specified timestamp
 */
export const CLEANUP_OLD_DUTIES = `
DELETE FROM validator_duties
WHERE started_at < $1;
`;

/**
 * Query to get stuck duties (for monitoring/alerting)
 * Returns duties in 'signing' status that have been stuck for too long
 */
export const GET_STUCK_DUTIES = `
SELECT
  validator_address,
  slot,
  block_number,
  duty_type,
  status,
  signing_root,
  node_id,
  started_at,
  EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at)) as age_seconds
FROM validator_duties
WHERE status = 'signing'
  AND started_at < $1
ORDER BY started_at ASC;
`;
