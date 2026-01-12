#!/usr/bin/env bash

spartan=$(git rev-parse --show-toplevel)/spartan

function resolve_env_file_path {
  local env_file_input="$1"
  if [[ "$env_file_input" = /* ]]; then
    echo "$env_file_input"
  else
    echo "$spartan/environments/$env_file_input.env"
  fi
}

# Source default.json and export all values as environment variables
# default.json is the canonical source of truth for network defaults
function source_default_json {
  local default_json_file="$spartan/environments/default.json"

  if [[ ! -f "$default_json_file" ]]; then
    echo "Warning: default.json not found at $default_json_file" >&2
    return
  fi

  echo "Loading default environment variables from $default_json_file"

  # Parse JSON with Node.js and source the output
  # Structure: {"timing": {"AZTEC_SLOT_DURATION": 36}, ...} -> export AZTEC_SLOT_DURATION="36"
  # shellcheck disable=SC1090
  source <(node -e "
    const j = require('$default_json_file');
    for (const section of Object.values(j)) {
      if (typeof section === 'object' && section) {
        for (const [k, v] of Object.entries(section)) {
          console.log('export ' + k + '=' + JSON.stringify(String(v)));
        }
      }
    }
  ")
}

function source_env_basic {
  local env_file="$1"
  local actual_env_file=$(resolve_env_file_path "$env_file")

  # Source default.json first (provides sensible defaults for all L2ChainConfig values)
  source_default_json

  # Then source the network-specific env file (overrides defaults)
  if [[ -f "$actual_env_file" ]]; then
    echo "Loading network environment variables from $actual_env_file"
    set -a
    # shellcheck disable=SC1090
    source "$actual_env_file"
    set +a
  else
    echo "Env file not found: $actual_env_file" >&2
    exit 1
  fi
}

# If script is run directly with an argument, source the env file
if [[ "${BASH_SOURCE[0]}" == "${0}" ]] && [[ -n "$1" ]]; then
  source_env_basic "$1"
fi
