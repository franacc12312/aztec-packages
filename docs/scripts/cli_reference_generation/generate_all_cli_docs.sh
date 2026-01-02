#!/bin/bash
# Generate CLI documentation for all configured CLIs
# This script reads from cli_docs_config.json and generates docs for each enabled CLI
#
# Usage:
#   ./generate_all_cli_docs.sh [options]
#
# Options:
#   --version <version>     Target version (e.g., v3.0.0, v3.0.0-nightly.20260101)
#   --output-dir <dir>      Output directory (default: auto-detect from config)
#   --skip-version-check    Skip CLI version verification
#   --cli <name>            Generate docs for specific CLI only (can be repeated)
#   --dry-run               Show what would be done without executing
#
# Examples:
#   ./generate_all_cli_docs.sh                                    # Generate for current docs
#   ./generate_all_cli_docs.sh --version v3.0.0                   # Generate for specific version
#   ./generate_all_cli_docs.sh --cli bb --cli aztec               # Generate for specific CLIs
#   ./generate_all_cli_docs.sh --skip-version-check               # Skip version checks (for CI)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CONFIG_FILE="$SCRIPT_DIR/cli_docs_config.json"

# Default values
TARGET_VERSION=""
OUTPUT_DIR=""
SKIP_VERSION_CHECK=false
SPECIFIC_CLIS=()
DRY_RUN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --version)
      TARGET_VERSION="$2"
      shift 2
      ;;
    --output-dir)
      OUTPUT_DIR="$2"
      shift 2
      ;;
    --skip-version-check)
      SKIP_VERSION_CHECK=true
      shift
      ;;
    --cli)
      SPECIFIC_CLIS+=("$2")
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    -h|--help)
      cat << 'EOF'
Generate CLI documentation for all configured CLIs.
Reads from cli_docs_config.json and generates docs for each enabled CLI.

Usage:
  ./generate_all_cli_docs.sh [options]

Options:
  --version <version>     Target version (e.g., v3.0.0, v3.0.0-nightly.20260101)
  --output-dir <dir>      Output directory (default: auto-detect from config)
  --skip-version-check    Skip CLI version verification
  --cli <name>            Generate docs for specific CLI only (can be repeated)
  --dry-run               Show what would be done without executing
  -h, --help              Show this help message

Examples:
  ./generate_all_cli_docs.sh                          # Generate for current docs
  ./generate_all_cli_docs.sh --version v3.0.0         # Generate for specific version
  ./generate_all_cli_docs.sh --cli bb --cli aztec     # Generate for specific CLIs
  ./generate_all_cli_docs.sh --skip-version-check     # Skip version checks (for CI)
EOF
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Validate config file exists
if [[ ! -f "$CONFIG_FILE" ]]; then
  echo "Error: Config file not found: $CONFIG_FILE"
  exit 1
fi

# Check for jq
if ! command -v jq &> /dev/null; then
  echo "Error: jq is required but not installed"
  exit 1
fi

echo "=============================================="
echo "CLI Documentation Generator"
echo "=============================================="
echo ""
echo "Config file: $CONFIG_FILE"
echo "Docs root: $DOCS_ROOT"
[[ -n "$TARGET_VERSION" ]] && echo "Target version: $TARGET_VERSION"
[[ "$SKIP_VERSION_CHECK" == "true" ]] && echo "Version check: SKIPPED"
[[ "$DRY_RUN" == "true" ]] && echo "Mode: DRY RUN"
echo ""

# Read configuration
CURRENT_DOCS_BASE=$(jq -r '.output.current_docs_base' "$CONFIG_FILE")
VERSIONED_DOCS_BASE=$(jq -r '.output.versioned_docs_base' "$CONFIG_FILE")

# Get list of CLIs to process
if [[ ${#SPECIFIC_CLIS[@]} -gt 0 ]]; then
  CLI_NAMES=("${SPECIFIC_CLIS[@]}")
else
  # Read all enabled CLIs from config (compatible with bash 3.2+)
  CLI_NAMES=()
  while IFS= read -r cli; do
    CLI_NAMES+=("$cli")
  done < <(jq -r '.clis | to_entries[] | select(.value.enabled == true) | .key' "$CONFIG_FILE")
fi

echo "CLIs to process: ${CLI_NAMES[*]}"
echo ""

# Track results
SUCCESSFUL=()
FAILED=()
SKIPPED=()

# Create temp directory (shared across all CLI processing)
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

# Process each CLI
for cli_name in "${CLI_NAMES[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Processing: $cli_name"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Read CLI config
  CLI_CONFIG=$(jq -r ".clis[\"$cli_name\"]" "$CONFIG_FILE")

  if [[ "$CLI_CONFIG" == "null" ]]; then
    echo "  ⚠️  CLI '$cli_name' not found in config, skipping"
    SKIPPED+=("$cli_name")
    continue
  fi

  ENABLED=$(echo "$CLI_CONFIG" | jq -r '.enabled')
  if [[ "$ENABLED" != "true" ]]; then
    echo "  ⚠️  CLI '$cli_name' is disabled in config, skipping"
    SKIPPED+=("$cli_name")
    continue
  fi

  COMMAND=$(echo "$CLI_CONFIG" | jq -r '.command')
  FORMAT=$(echo "$CLI_CONFIG" | jq -r '.format')
  DISPLAY_NAME=$(echo "$CLI_CONFIG" | jq -r '.display_name')
  TITLE=$(echo "$CLI_CONFIG" | jq -r '.title')
  OUTPUT_FILE=$(echo "$CLI_CONFIG" | jq -r '.output_file')
  SIDEBAR_POSITION=$(echo "$CLI_CONFIG" | jq -r '.sidebar_position')
  DOCS_PATH=$(echo "$CLI_CONFIG" | jq -r '.docs_path')
  DESCRIPTION=$(echo "$CLI_CONFIG" | jq -r '.description')

  # Read tags as comma-separated string
  TAGS=$(echo "$CLI_CONFIG" | jq -r '.tags | join(", ")')

  echo "  Command: $COMMAND"
  echo "  Format: $FORMAT"
  echo "  Output: $OUTPUT_FILE"

  # Check if command exists
  if ! command -v "$COMMAND" &> /dev/null; then
    echo "  ⚠️  Command '$COMMAND' not found, skipping"
    SKIPPED+=("$cli_name")
    continue
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    echo "  [DRY RUN] Would generate docs for $cli_name"
    SUCCESSFUL+=("$cli_name")
    continue
  fi

  # Temp file paths (using shared temp directory)
  TEMP_JSON="$TEMP_DIR/cli_docs.json"
  TEMP_MD="$TEMP_DIR/cli_auto.md"
  TEMP_FINAL="$TEMP_DIR/cli_final.md"

  # Step 1: Scan CLI
  echo "  Scanning CLI..."
  if ! python3 "$SCRIPT_DIR/scan_cli.py" \
    --command "$COMMAND" \
    --cli-format "$FORMAT" \
    --output "$TEMP_JSON" 2>&1; then
    echo "  ❌ Failed to scan CLI"
    FAILED+=("$cli_name")
    continue
  fi

  # Step 2: Generate markdown
  echo "  Generating markdown..."
  if ! python3 "$SCRIPT_DIR/transform_to_markdown.py" \
    --input "$TEMP_JSON" \
    --output "$TEMP_MD" \
    --title "$TITLE" 2>&1; then
    echo "  ❌ Failed to generate markdown"
    FAILED+=("$cli_name")
    continue
  fi

  # Step 3: Add front-matter
  cat > "$TEMP_FINAL" << EOF
---
title: ${TITLE}
description: ${DESCRIPTION}
tags: [${TAGS}]
sidebar_position: ${SIDEBAR_POSITION}
---

# ${TITLE}

*This documentation is auto-generated from the \`${COMMAND}\` CLI help output.*

EOF

  # Append markdown content (skip first line which is duplicate title)
  tail -n +2 "$TEMP_MD" >> "$TEMP_FINAL"

  # Step 4: Deploy to target locations
  deploy_to_version() {
    local version=$1
    local target_dir=""

    if [[ "$version" == "current" ]]; then
      target_dir="$DOCS_ROOT/$CURRENT_DOCS_BASE/$DOCS_PATH"
    else
      target_dir="$DOCS_ROOT/$VERSIONED_DOCS_BASE/version-${version}/$DOCS_PATH"
    fi

    if [[ ! -d "$target_dir" ]]; then
      echo "    ⚠️  Directory not found: $target_dir"
      return 1
    fi

    cp "$TEMP_FINAL" "$target_dir/$OUTPUT_FILE"
    echo "    ✓ Deployed to $version"
    return 0
  }

  echo "  Deploying..."

  if [[ -n "$TARGET_VERSION" ]]; then
    # Deploy to specific version only
    deploy_to_version "$TARGET_VERSION" || true
  else
    # Deploy to current docs
    deploy_to_version "current" || true

    # Deploy to all versioned docs
    VERSIONS_FILE="$DOCS_ROOT/$(jq -r '.output.versions_file' "$CONFIG_FILE")"
    if [[ -f "$VERSIONS_FILE" ]]; then
      # Validate JSON and check for versions
      if ! jq -e '.[]' "$VERSIONS_FILE" &>/dev/null; then
        echo "    ⚠️  Versions file is empty or invalid JSON: $VERSIONS_FILE"
      else
        while IFS= read -r version; do
          deploy_to_version "$version" || true
        done < <(jq -r '.[]' "$VERSIONS_FILE")
      fi
    else
      echo "    ⚠️  Versions file not found: $VERSIONS_FILE"
    fi
  fi

  SUCCESSFUL+=("$cli_name")
  echo "  ✅ Completed"
  echo ""
done

# Summary
echo ""
echo "=============================================="
echo "Summary"
echo "=============================================="
echo ""
echo "Successful: ${#SUCCESSFUL[@]}"
for cli in "${SUCCESSFUL[@]}"; do
  echo "  ✅ $cli"
done

if [[ ${#SKIPPED[@]} -gt 0 ]]; then
  echo ""
  echo "Skipped: ${#SKIPPED[@]}"
  for cli in "${SKIPPED[@]}"; do
    echo "  ⚠️  $cli"
  done
fi

if [[ ${#FAILED[@]} -gt 0 ]]; then
  echo ""
  echo "Failed: ${#FAILED[@]}"
  for cli in "${FAILED[@]}"; do
    echo "  ❌ $cli"
  done
  exit 1
fi

echo ""
echo "✅ CLI documentation generation complete!"
