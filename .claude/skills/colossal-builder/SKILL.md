---
name: colossal-builder
description: Build and redesign Colossal storefronts — theming, SDK usage, image generation, design library, and redesign execution strategy
license: Complete terms in LICENSE.txt
---

# Colossal Builder

Guide for building and redesigning Colossal storefronts. Covers the SDK, design system, image generation, the design reference library, and the redesign execution strategy.

---

## Colossal Storefront SDK

All commerce data comes from `@colossal-sh/storefront-sdk`. Configured via `STORE_UID` and `API_URL` from `src/lib/constants.ts`.

### Hooks

| Hook | Returns | Usage |
|---|---|---|
| `useProducts(storeUid)` | `{ products: SimpleProduct[] }` | Product listings |
| `useStoreProduct(uid)` | Single product with full detail | Product detail page |
| `useStore({ uid })` | `{ data: { storeDetails: { name } } }` | Store metadata |
| `useCartContext()` | `{ items, addItem, removeItem, openCart }` | Cart state + actions |
| `useCreateCheckoutSession()` | Checkout mutation | Checkout flow |

### Provider hierarchy (in `__root.tsx` → `ClientShell`)

```
QueryClientProvider (TanStack Query)
  └─ CartProvider (storeUid={STORE_UID})
       └─ PageEditor (visual editor, dev-mode only)
```

### Data constraints

Only use data from the SDK. Never add sections requiring a backend you don't have — no contact forms, review forms, newsletter integrations, login/account pages, or wishlists. Never add email inputs or form-like UI even as static elements.

---

## Design System & Theming

### CSS Architecture (3-file split)

| File | Role | When it changes |
|---|---|---|
| `src/styles.css` | **STABLE shell.** Imports, `@theme inline` mappings, `@layer base`. | **Never.** Do not rewrite. |
| `src/theme.css` | **SWAPPABLE theme.** `:root {}` with CSS variable values + `@theme inline {}` for custom tokens. | Replaced wholesale per design. |
| `src/animations.css` | **ADDITIVE animations.** `@keyframes` + `@theme inline` registrations. | Written fresh per design. |

**Never merge them back into a single file. Never rewrite `styles.css`.**

### Applying a theme from the design library

```bash
cp .claude/skills/colossal-store-design/library/<name>/theme.css src/theme.css
```

### Generating a theme from design.json

```bash
python3 .claude/skills/colossal-store-design/scripts/gen-theme.py <design.json> src/theme.css
```

### CRITICAL: No dark mode

**NEVER add a `.dark {}` block.** Dark mode is not supported.

### theme.css format

```css
:root {
  /* Standard semantic tokens (always present) */
  --background: #FFFFFF;
  --foreground: #000000;
  /* ... all standard shadcn tokens ... */
  --radius: 0rem;
  --font-sans: Inter, sans-serif;
  --font-display: "Times New Roman", serif;

  /* Custom tokens (design-specific, vary per theme) */
  --accent-pink: #E91E63;
  --header-dark: #111111;
}

/* Tailwind mappings for custom tokens only */
@theme inline {
  --color-accent-pink: var(--accent-pink);
  --color-header-dark: var(--header-dark);
}
```

### animations.css format

```css
@theme inline {
  --animate-fade-up: fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Color tokens

- `--background` / `--foreground` — page bg and text
- `--card` / `--card-foreground` — card surfaces
- `--primary` / `--primary-foreground` — primary actions
- `--secondary` / `--secondary-foreground` — secondary actions
- `--muted` / `--muted-foreground` — subdued backgrounds/text
- `--accent` / `--accent-foreground` — highlighted elements
- `--destructive` — error/danger
- `--border`, `--input`, `--ring` — borders and focus rings

### Typography tokens

- `--font-sans` — body, `--font-display` — headings, `--font-mono` — code, `--font-serif` — serif fallback

To change fonts: update `--font-*` in `theme.css`, add font package to `package.json`, import in `main.tsx`.

### Radius

`--radius` base value in `theme.css`. All radius tokens derived in `styles.css`.

---

## Design Reference Library

Location: `.claude/skills/colossal-store-design/library/`

Each entry contains `design.json` (component props, section blueprints, metadata) and `theme.css` (ready-to-use CSS variables).

To list all references: `.claude/skills/colossal-store-design/scripts/list-library.sh`

To create new entries from a screenshot: use `/colossal-store-design`

---

## Image Generation

Generate hero images, editorial photography, lifestyle shots using the Gemini API.

### Prerequisites

**Check before generating**: run `.claude/skills/colossal-builder/check-env.sh GEMINI_API_KEY` first. If it exits non-zero, **skip all image generation** — do not attempt API calls without the key. The design will work without images (components use fallback backgrounds).

### Using the gen-image script

```bash
.claude/skills/colossal-builder/gen-image.sh <output_path> <prompt> [aspect_ratio] [size]
```

- `aspect_ratio` — default `16:9`. Options: `1:1`, `16:9`, `9:16`, `2:3`, `3:2`, `4:3`, `4:5`, `5:4`, `21:9`
- `size` — default `2K`. Options: `512`, `1K`, `2K`, `4K`

### Rules during redesigns

- **Always run in background** — takes 10-30s per image. Launch with `run_in_background: true`.
- **Never block on images** — reference paths in code immediately.
- **Save to `public/images/`** — served at `/images/<filename>`.
- **No text or logos** — always include in prompts.
- **Fewer, high-impact images** — 2-3 strong images over 6 mediocre ones.

### Image editing (with reference image)

```bash
IMG_B64=$(base64 < input.png)
BASE_URL="${GOOGLE_AI_BASE_URL:-https://generativelanguage.googleapis.com}"
curl -s -X POST \
  "$BASE_URL/v1beta/models/gemini-3-pro-image-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"parts": [
      {"text": "Edit instructions here"},
      {"inlineData": {"mimeType": "image/png", "data": "'"$IMG_B64"'"}}
    ]}],
    "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}
  }' | jq -r '.candidates[0].content.parts[] | select(.inlineData) | .inlineData.data' | base64 -d > output.png
```

---

## Design Philosophy

### Initial store design flow

When the user hasn't specified an exact reference to match:

1. **List the library**: run `.claude/skills/colossal-store-design/scripts/list-library.sh` to get all references with metadata
2. **Pick the best matches**: based on the user's context (industry, mood, tone, any style preferences they mentioned), select references to draw from. The final store is typically a **mix** — e.g., theme from one reference, hero section from another, product card style from a third. Don't limit yourself to a single reference.
3. **Copy the theme**: pick the reference whose `theme.css` best matches the desired color/typography direction. Copy it to `src/theme.css`.
4. **Read the design.json files**: for the chosen references, read their `design.json` to get header/footer props, productCard config, and section blueprints.
5. **Compose the landing page**: combine section ideas from multiple references, adapting them to the user's store content. A beauty store might use the hero layout from `glam-hair-extensions`, the product grid style from `soft-luxe-beauty`, and the brand story section from `rugged-heritage-menswear`.

If the user specifies an exact reference (a library entry name, a screenshot, or a specific style/tone), use that as the primary source. But you can still mix in section ideas from other references to fill gaps.

### General principles

**Landing page is the priority**. Expand with sections appropriate to the store type: hero, brand story, featured products, social proof, CTA banner.

**Single-product stores**: Remove the grid. Build a custom single-product landing page using `useStoreProduct()` and `useCartContext()` directly in `index.tsx`.

**Industry awareness**: A skincare brand → Glossier/Aesop aesthetic. A tech store → Nothing/Apple. Let the product drive the design.

**Never create new pages** unless explicitly asked. **Never add footer links to non-existent pages.**

---

## Redesign Execution Strategy

### Scope of changes

By default, a redesign touches **only these files**:

| File | Action | Notes |
|---|---|---|
| `src/theme.css` | Copy from library or generate | Never hand-write. Use `cp` or `gen-theme.py` |
| `src/animations.css` | Write fresh | Small file, design-specific keyframes |
| `src/routes/index.tsx` | **Rewrite** | Landing page — hero, sections, product grid |
| `src/components/system/shell/client-shell.tsx` | **Rewrite** | Configure Header + Footer props, links, colors |
| `index.html` | **Rewrite** | Title, font preloads |
| `src/main.tsx` | **Rewrite** | Font imports |

### Header & Footer — configure, don't rewrite

Header and Footer are **configured via props in `client-shell.tsx`**, not by editing `header.tsx` or `footer.tsx`.

- **When using a design reference**: take props from `design.json` (`header.*` and `footer.*` fields)
- **When no reference exists**: invent appropriate props based on the store's industry and aesthetic
- **Links**: `header.links` and `footer.columns` are added by the user — use empty arrays unless the user specifies links

See CLAUDE.md "Component Props Reference" for the full prop tables.

### Product Card & Grid — configure, don't rewrite

ProductCard is configured via props passed through ProductGrid in `index.tsx`:

```tsx
<ProductGrid
  products={products}
  onAddToCart={addItem}
  hoverEffect="shadow"
  cartButton="ghost"
  cartButtonIcon="bag"
  carousel="none"
/>
```

- **When using a design reference**: take from `design.json` `productCard.*` and `productGrid.*`
- **When no reference**: choose props that match the aesthetic

### All other files — do not touch

Everything else is **untouched** unless the user explicitly asks to modify a specific component:

- `src/components/store/header.tsx` — do not edit
- `src/components/store/footer.tsx` — do not edit
- `src/components/store/product-card.tsx` — do not edit
- `src/components/store/product-grid.tsx` — do not edit
- `src/components/store/cart-drawer.tsx` — do not edit
- `src/components/store/search-overlay.tsx` — do not edit
- `src/components/system/product-detail/*` — do not edit
- `src/components/ui/*` — do not edit
- `src/styles.css` — **NEVER** edit

If the user explicitly requests changes to a specific component (e.g., "update the header to support a new layout" or "change the product card image ratio"), then and only then edit that file.

### Parallelization plan

**Step 1 — Kick off slow work in parallel:**
- Add fonts to `package.json` + `pnpm install` in background
- Copy theme: `cp .claude/skills/colossal-store-design/library/<name>/theme.css src/theme.css`
- Check `.claude/skills/colossal-builder/check-env.sh GEMINI_API_KEY` — only if OK, fire `.claude/skills/colossal-builder/gen-image.sh` calls with `run_in_background: true`

**Step 2 — One parallel call with ALL file writes** (max ~5 files): `animations.css`, `main.tsx`, `index.html`, `client-shell.tsx`, `index.tsx`. Reference image paths in code even if generation hasn't finished.

**Step 3 — `pnpm build`** (single verification).

### Checklist

1. **Theme** — copy from library or generate. Never edit `styles.css`. Never add `.dark {}`.
2. **Animations** — fresh keyframes + `@theme inline`.
3. **Fonts** — `--font-*` in theme.css, packages in `package.json`, imports in `main.tsx`.
4. **`client-shell.tsx`** — Header props, Footer props, links, colors.
5. **`index.tsx`** — Landing page sections, ProductGrid props.
6. **`index.html`** — Title.
7. **Images** — check `GEMINI_API_KEY` first; skip if not set. Generate in background, reference paths immediately.
8. **Verify no dead internal links** — after implementation, check that every `href` and `<Link to=...>` in the output points to a route that exists (`/` and `/product/$uid` by default). Never add links to `/about`, `/faq`, `/contact`, etc. unless those pages exist. External links (https://...) are fine and don't need checking. If the user explicitly asks for a link to a non-existent page, add it — but don't invent them.

Preserve all `data-editable-*`, `data-editor-ignore`, `data-component-type`, and `data-editor-variant` attributes.
