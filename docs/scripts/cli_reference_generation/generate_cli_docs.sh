#!/bin/bash
# Unified convenience script to generate CLI documentation in one step
# Usage: ./scripts/cli_reference_generation/generate_cli_docs.sh <cli_name> [output_dir]
#
# Examples:
#   ./scripts/cli_reference_generation/generate_cli_docs.sh aztec
#   ./scripts/cli_reference_generation/generate_cli_docs.sh aztec-wallet /tmp
#   ./scripts/cli_reference_generation/generate_cli_docs.sh bb

set -euo pipefail

# Get script directory and source shared config
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/cli_config.sh"

# Validate arguments
if [[ $# -lt 1 ]]; then
  echo "Error: CLI name is required"
  echo "Usage: $0 <cli_name> [output_dir]"
  echo "  cli_name: ${VALID_CLIS[*]}"
  echo "  output_dir: Output directory (default: current directory)"
  exit 1
fi

CLI_NAME="$1"
OUTPUT_DIR="${2:-.}"

# Validate and load CLI config
validate_cli_name "$CLI_NAME" || exit 1
get_cli_config "$CLI_NAME"

readonly OUTPUT_DIR CLI_NAME

# Derived paths
JSON_FILE="$OUTPUT_DIR/${CLI_OUTPUT_FILE%.md}.json"
MD_FILE="$OUTPUT_DIR/$CLI_OUTPUT_FILE"

echo "=== ${CLI_DISPLAY_NAME} Documentation Generator ==="
echo ""

echo "Step 1: Scanning ${CLI_COMMAND} CLI commands (format: ${CLI_FORMAT})..."
python3 "$SCRIPT_DIR/scan_cli.py" --command "$CLI_COMMAND" --cli-format "$CLI_FORMAT" --output "$JSON_FILE"

echo ""
echo "Step 2: Generating markdown documentation..."
python3 "$SCRIPT_DIR/transform_to_markdown.py" \
  --input "$JSON_FILE" \
  --output "$MD_FILE" \
  --title "$CLI_TITLE"

echo ""
echo "=== Documentation Generated ==="
echo "  JSON: $JSON_FILE"
echo "  Markdown: $MD_FILE"
echo ""
echo "To customize the output, use the scripts directly:"
echo "  python3 $SCRIPT_DIR/scan_cli.py --help"
echo "  python3 $SCRIPT_DIR/transform_to_markdown.py --help"
