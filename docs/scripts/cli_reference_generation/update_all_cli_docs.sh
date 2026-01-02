#!/bin/bash
# Script to regenerate auto-generated CLI documentation for all supported CLIs
# Usage: ./scripts/cli_reference_generation/update_all_cli_docs.sh [target_version] [output_dir]
#
# Examples:
#   ./scripts/cli_reference_generation/update_all_cli_docs.sh                    # Updates all versions
#   ./scripts/cli_reference_generation/update_all_cli_docs.sh v2.0.2             # Updates only v2.0.2
#   ./scripts/cli_reference_generation/update_all_cli_docs.sh current            # Updates only main docs folder
#   ./scripts/cli_reference_generation/update_all_cli_docs.sh v2.0.2 /tmp/       # Outputs all to /tmp/

set -euo pipefail

# Get script directory and source shared config
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/cli_config.sh"

TARGET_VERSION="${1:-all}"
OUTPUT_DIR="${2:-}"
readonly SCRIPT_DIR TARGET_VERSION OUTPUT_DIR

echo "=== Update All CLI Documentation Script ==="
echo ""
echo "This script will update documentation for:"
for cli in "${VALID_CLIS[@]}"; do
  echo "  - $cli CLI"
done
echo ""

# Process each CLI using the unified script
for cli in "${VALID_CLIS[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Updating $cli CLI Documentation"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [[ -n "$OUTPUT_DIR" ]]; then
    "$SCRIPT_DIR/update_cli_docs.sh" "$cli" "$TARGET_VERSION" "$OUTPUT_DIR"
  else
    "$SCRIPT_DIR/update_cli_docs.sh" "$cli" "$TARGET_VERSION"
  fi

  echo ""
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All CLI Documentation Updated"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Files updated:"
for cli in "${VALID_CLIS[@]}"; do
  get_cli_config "$cli"
  if [[ -n "$OUTPUT_DIR" ]]; then
    echo "  - $OUTPUT_DIR/$CLI_OUTPUT_FILE"
  else
    echo "  - $CLI_OUTPUT_FILE"
  fi
done
echo ""
if [[ -z "$OUTPUT_DIR" ]]; then
  echo "You can now commit these changes to the repository."
fi
