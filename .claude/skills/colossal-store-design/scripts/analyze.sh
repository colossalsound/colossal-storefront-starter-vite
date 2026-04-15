#!/usr/bin/env bash
# Usage: ./analyze.sh <image-path>... <store-slug>
# Examples:
#   ./analyze.sh ~/Desktop/ref-store.jpg bold-comfort-basics
#   ./analyze.sh ~/Desktop/page1.jpg ~/Desktop/page2.jpg ~/Desktop/page3.jpg soft-luxe-beauty
#
# Multiple images are sent as separate parts in one Gemini request,
# allowing the model to see the full site across multiple screenshots.
#
# Requires: GEMINI_API_KEY env var, jq, python3
# Output: library/<store-slug>/{design.json, theme.css}

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
PROMPT_FILE="$SCRIPT_DIR/prompt.txt"

if [ $# -lt 2 ]; then
  echo "Usage: $0 <image-path>... <store-slug>" >&2
  echo "  Last argument is the store slug, all preceding arguments are image paths." >&2
  exit 1
fi

if [ -z "${GEMINI_API_KEY:-}" ]; then
  echo "ERROR: GEMINI_API_KEY is not set" >&2
  exit 1
fi

if [ ! -f "$PROMPT_FILE" ]; then
  echo "ERROR: Prompt file not found: $PROMPT_FILE" >&2
  exit 1
fi

# Last argument is the slug, everything else is an image path
STORE_SLUG="${!#}"
IMAGE_PATHS=()
COUNT=0
TOTAL=$#
for arg in "$@"; do
  COUNT=$((COUNT + 1))
  if [ "$COUNT" -lt "$TOTAL" ]; then
    IMAGE_PATHS+=("$arg")
  fi
done

# Validate all images exist
for img in "${IMAGE_PATHS[@]}"; do
  if [ ! -f "$img" ]; then
    echo "ERROR: Image not found: $img" >&2
    exit 1
  fi
done

MODEL="${GEMINI_MODEL:-gemini-3.1-pro-preview}"
OUTPUT_DIR="$SKILL_DIR/library/$STORE_SLUG"
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

mkdir -p "$OUTPUT_DIR"

echo "=> Encoding ${#IMAGE_PATHS[@]} image(s)..."

# Build payload with multiple images via python
python3 -c "
import json, sys, base64, os

prompt_file = sys.argv[1]
output_file = sys.argv[2]
image_paths = sys.argv[3:]

with open(prompt_file) as f:
    prompt = f.read()

if len(image_paths) > 1:
    prompt += '\n\nNOTE: You are receiving multiple screenshots of the SAME store/website. They show different sections of the same page or different pages. Combine them into a SINGLE unified design.json — one meta, one theme, one header, one footer, one productCard, one productGrid, one featuredProducts, and one combined sections array covering ALL visible sections across all images. Do NOT produce separate analyses per image.'

parts = [{'text': prompt}]

for img_path in image_paths:
    ext = os.path.splitext(img_path)[1].lower().lstrip('.')
    mime_map = {'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'webp': 'image/webp'}
    mime = mime_map.get(ext, 'image/jpeg')

    with open(img_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('ascii')

    parts.append({'inlineData': {'mimeType': mime, 'data': b64}})

payload = {
    'contents': [{'parts': parts}],
    'generationConfig': {
        'responseMimeType': 'application/json'
    }
}

with open(output_file, 'w') as f:
    json.dump(payload, f)
" "$PROMPT_FILE" "$TMP_DIR/payload.json" "${IMAGE_PATHS[@]}"

echo "=> Sending to Gemini ($MODEL)..."
RESPONSE=$(curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/$MODEL:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d @"$TMP_DIR/payload.json")

# Check for errors
ERROR=$(echo "$RESPONSE" | jq -r '.error.message // empty')
if [ -n "$ERROR" ]; then
  echo "ERROR from Gemini: $ERROR" >&2
  exit 1
fi

# Extract JSON result
RESULT=$(echo "$RESPONSE" | jq -r '.candidates[0].content.parts[0].text')
if [ -z "$RESULT" ] || [ "$RESULT" = "null" ]; then
  echo "ERROR: No text in response" >&2
  echo "$RESPONSE" | jq . >&2
  exit 1
fi

# Save design.json (pretty-printed, unwrap array if needed, strip links)
echo "$RESULT" | python3 -c "
import json, sys
data = json.load(sys.stdin)
if isinstance(data, list):
    data = data[0]
# Strip links — these are never extracted, added by customer later
if 'header' in data:
    data['header'].pop('links', None)
if 'footer' in data:
    data['footer'].pop('columns', None)
with open(sys.argv[1], 'w') as f:
    json.dump(data, f, indent=2)
" "$OUTPUT_DIR/design.json"
echo "=> Saved design.json"

# Generate theme.css
python3 "$SCRIPT_DIR/gen-theme.py" "$OUTPUT_DIR/design.json" "$OUTPUT_DIR/theme.css"
echo "=> Saved theme.css"

echo ""
echo "Done! Output: $OUTPUT_DIR"
echo "  design.json  $(wc -c < "$OUTPUT_DIR/design.json" | tr -d ' ') bytes"
echo "  theme.css    $(wc -c < "$OUTPUT_DIR/theme.css" | tr -d ' ') bytes"

# Print summary
python3 -c "
import json
d = json.load(open('$OUTPUT_DIR/design.json'))
m = d['meta']
print(f\"  Industry:  {m['industry']}\")
print(f\"  Aesthetic: {m['aesthetic']}\")
print(f\"  Mood:      {m['mood']}\")
print(f\"  Sections:  {', '.join(m['sectionNames'])}\")
"
