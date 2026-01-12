#!/bin/bash
# Source YAML network config as environment variables.
# YAML values override existing env vars EXCEPT for NAMESPACE and AZTEC_DOCKER_IMAGE.
#
# Usage:
#   source source-env.sh staging-public
#   # or with overrides:
#   NAMESPACE=my-ns AZTEC_DOCKER_IMAGE=foo source source-env.sh staging-public
#
# This script uses yq to convert YAML to shell format.
# Install yq: https://github.com/mikefarah/yq

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ $# -lt 1 ]]; then
    echo "Usage: source $0 <network-name>" >&2
    echo "" >&2
    echo "Available networks:" >&2
    for f in "$SCRIPT_DIR"/*.env.yml; do
        basename "$f" .env.yml
    done | grep -v default | sort | sed 's/^/  /' >&2
    return 1 2>/dev/null || exit 1
fi

NETWORK_NAME="$1"
YAML_FILE="$SCRIPT_DIR/$NETWORK_NAME.env.yml"

if [[ ! -f "$YAML_FILE" ]]; then
    echo "Error: Network config not found: $YAML_FILE" >&2
    return 1 2>/dev/null || exit 1
fi

# Save caller's overrides
_SAVED_NAMESPACE="${NAMESPACE:-}"
_SAVED_AZTEC_DOCKER_IMAGE="${AZTEC_DOCKER_IMAGE:-}"

# Source YAML (overrides everything)
while IFS='=' read -r key value; do
    [[ -z "$key" || "$key" =~ ^# ]] && continue
    export "$key=$value"
done < <(yq -o shell "$YAML_FILE" | sed "s/^export //" | sed "s/'//g")

# Restore caller's overrides for NAMESPACE and AZTEC_DOCKER_IMAGE
[[ -n "$_SAVED_NAMESPACE" ]] && export NAMESPACE="$_SAVED_NAMESPACE"
[[ -n "$_SAVED_AZTEC_DOCKER_IMAGE" ]] && export AZTEC_DOCKER_IMAGE="$_SAVED_AZTEC_DOCKER_IMAGE"

echo "Loaded network config: $NETWORK_NAME"
