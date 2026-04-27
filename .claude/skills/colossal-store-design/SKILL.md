---
name: colossal-store-design
description: Browse the design reference library and generate new references from store screenshots for the Colossal storefront template
license: Complete terms in LICENSE.txt
---

# Colossal Design Skill

Two capabilities:

1. **List library** — browse existing design references with metadata for picking the best match
2. **Generate reference** — analyze a store screenshot and produce a new `design.json` + `theme.css`

---

## Feature 1: List Design Library

Returns an array of `{ slug, meta }` objects for every reference in the library, so you can pick the best match for a use case.

```bash
.claude/skills/colossal-store-design/scripts/list-library.sh
```

Output example:
```json
[
  {
    "slug": "soft-luxe-beauty",
    "meta": {
      "description": "A soft, minimal beauty store with pastel pink aesthetic...",
      "industry": "beauty",
      "aesthetic": "soft-pastel",
      "mood": "calm and refined",
      "sectionNames": ["hero", "product-carousel", "promo-banner", ...]
    }
  },
  ...
]
```

Use this to pick a reference when the user describes their store type/mood without naming a specific reference. Match on `industry`, `aesthetic`, and `mood`.

---

## Feature 2: Generate New Reference

Analyze a reference store screenshot using Gemini and produce two artifacts:

- **`theme.css`** — CSS custom properties for the storefront `:root`
- **`design.json`** — component props, section blueprints, and metadata

Output directory: `.claude/skills/colossal-store-design/library/{store-slug}/`

The `store-slug` must be **generic** — no actual store names. Use descriptive slugs like `dark-luxury-fashion`, `minimal-coffee-earth`, `bold-streetwear-neon`.

### Run the script

```bash
.claude/skills/colossal-store-design/scripts/analyze.sh <image-path> <store-slug>

# Example:
.claude/skills/colossal-store-design/scripts/analyze.sh ~/Desktop/reference-store.jpg bold-comfort-basics

# Override model (default: gemini-3.1-pro-preview):
GEMINI_MODEL=gemini-2.5-flash ./scripts/analyze.sh ~/Desktop/ref.png dark-luxury-fashion
```

The script will:
1. Base64-encode the image
2. Send to Gemini with the analysis prompt from `scripts/prompt.txt`
3. Save `design.json` (pretty-printed, validated)
4. Generate `theme.css` from the theme object
5. Copy the reference image

### Verify output

```
library/{store-slug}/
  design.json    ← full analysis JSON
  theme.css      ← CSS custom properties
  reference.*    ← copy of the original reference image
```

Post-processing checks:
1. All hex colors are valid 6-digit hex with `#` prefix
2. `meta.sectionNames` matches `name` fields in `sections` array
3. No real store name appears anywhere in the JSON

### Prerequisites

- `GEMINI_API_KEY` environment variable
- `jq`, `node`, `curl`

---

## Scripts Reference

| File | Purpose |
|---|---|
| `scripts/list-library.sh` | List all references with metadata |
| `scripts/analyze.sh` | Analyze screenshot → design.json + theme.css |
| `scripts/prompt.txt` | The Gemini analysis prompt (edit to change extraction) |
| `scripts/gen-theme.py` | Converts design.json theme → theme.css |

---

## JSON Schema

### Top-level structure

| Key | Type | Purpose |
|---|---|---|
| `meta` | object | Description, industry, aesthetic, mood, section names |
| `theme` | object | Colors, custom colors, radius, radiusButton, fonts, font packages |
| `header` | object | buttonStyle, size, layout, floating, colors, notes |
| `footer` | object | colorScheme, colors, description, notes |
| `productCard` | object | hoverEffect, cartButton, cartButtonIcon, carousel, notes |
| `productGrid` | object | columns (sm/md/lg/xl), gap, notes |
| `featuredProducts` | object | label, heading, notes |
| `sections[]` | array | Section blueprints with layout, design, content |

### Key rules

- **No links in header or footer** — `header.links` and `footer.columns` do not exist in the schema. The `analyze.sh` script strips them if Gemini hallucinates them. Links are added by the customer later.
- **No real store names** — use generic descriptions everywhere
- **No exact promo text** — describe generically ("promotional banner" not "Get 20% Off")
- **Button radius precision** — extract exact radius from CTA buttons: square = `0rem`, slightly rounded = `0.25rem`, rounded = `0.5rem`, pill = `9999px`
- **Only one theme version** — extract what's visible (light or dark), don't generate the opposite
- **Section descriptions are for AI** — descriptive prose, not Tailwind classes
- **Image descriptions** are hints for AI image generation — mood, subject, lighting, composition

### Component prop types

```typescript
// Header
type ButtonStyle = "default" | "icon";
type HeaderSize = "default" | "large";
type HeaderLayout = "standard" | "centered";
interface HeaderColors { bg?, text?, mutedText?, border?: string | false, badgeBg?, badgeText? }

// Footer
type FooterColorScheme = "default" | "inverted" | "custom";
interface FooterColors { bg?, text?, mutedText?, border?: string | false }

// Product Card
type CardHoverEffect = "lift" | "shadow";
type CardCartButton = "outline" | "ghost" | "icon-only" | "overlay";
type CardCartButtonIcon = "bag" | "plus";
type CardCarousel = "none" | "hover";
```

---

## Gemini API Details (for manual use)

Model: `gemini-3.1-pro-preview`

```bash
BASE_URL="${GOOGLE_AI_BASE_URL:-https://generativelanguage.googleapis.com}"
curl -s -X POST \
  "$BASE_URL/v1beta/models/gemini-3.1-pro-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d @payload.json
```

Response: `jq -r '.candidates[0].content.parts[0].text' response.json`

**Important**: Gemini REST API uses camelCase keys: `inlineData`, `mimeType`, `responseMimeType`.
