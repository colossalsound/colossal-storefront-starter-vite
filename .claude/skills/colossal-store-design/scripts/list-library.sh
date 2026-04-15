#!/usr/bin/env bash
# List all design references in the library with their meta fields.
# Output: JSON array of { slug, meta } objects.
# Usage: list-library.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LIB_DIR="$SCRIPT_DIR/../library"

echo "["
first=true
for dir in "$LIB_DIR"/*/; do
  json="$dir/design.json"
  [ -f "$json" ] || continue
  slug=$(basename "$dir")
  meta=$(jq '.meta' "$json")
  if [ "$first" = true ]; then
    first=false
  else
    echo ","
  fi
  jq -n --arg slug "$slug" --argjson meta "$meta" '{ slug: $slug, meta: $meta }'
done
echo "]"
