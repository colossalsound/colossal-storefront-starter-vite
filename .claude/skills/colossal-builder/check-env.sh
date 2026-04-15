#!/usr/bin/env bash
# Check if required environment variables are set.
# Usage: check-env.sh VAR_NAME [VAR_NAME...]
# Exit 0 if all set, exit 1 with message if any missing.

set -euo pipefail

missing=()
for var in "$@"; do
  if [ -z "${!var:-}" ]; then
    missing+=("$var")
  fi
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "Missing: ${missing[*]}" >&2
  exit 1
fi
echo "OK"
