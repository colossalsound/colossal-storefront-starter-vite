# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## EXECUTION SPEED IS THE #1 PRIORITY

**The moment you have enough information to act, you act. Not after one more check. Now.**

- Re-reading files you already have in context → **forbidden**
- Running searches to "confirm" what you already know → **forbidden**
- Splitting writes into sequential batches when parallel is possible → **forbidden**
- Asking clarifying questions when you have enough to start → **forbidden**

**Correct behavior:** Read needed files once → form plan → execute everything in parallel → verify with `pnpm build`. Four steps total.

## Approach

- Think before acting. Read existing files before writing code.
- Be concise in output but thorough in reasoning.
- Prefer editing over rewriting whole files.
- Do not re-read files you have already read unless the file may have changed.
- Test your code before declaring done.
- No sycophantic openers or closing fluff.
- User instructions always override this file.

## Execution order

Do not run pnpm add when doing tasks, add the deps to package.json and then kick off background task that runs pnpm install, while you do other things.

## Project Overview

Colossal Storefront Vite Template — a React 19 SPA for Colossal-powered e-commerce stores. Connects to the Colossal commerce backend via `@colossal-sh/storefront-sdk` and includes a visual page editor for dev-mode page composition.

## Commands

```bash
pnpm build        # Production build to dist/
pnpm check        # Biome lint only (formatting disabled — use pnpm build to catch real errors)
```

## Architecture

**Routing**: TanStack Router with file-based routing in `src/routes/`. The route tree (`src/routeTree.gen.ts`) is auto-generated — never edit it manually. Dynamic segments use `$paramName` (e.g., `product/$uid.tsx`).

**Component organization**:

- `components/store/` — domain components (product grid, product card, header, footer, cart drawer, search overlay)
- `components/system/` — app infrastructure (shell, product detail)
- `components/ui/` — shadcn/ui library (Base UI Nova style). Relaxed lint rules in `biome.json`

**Visual editor integration**: Components use `data-editable-*` attributes (`data-editable-entity`, `data-editable-id`, `data-editable-field`) for in-place editing. Always preserve these attributes when redesigning components.

## Code Style

- **Formatter/Linter**: Biome (not ESLint/Prettier). Tab indentation, double quotes for JS/TS.
- **Path aliases**: `#/*` and `@/*` both resolve to `./src/*`. The codebase uses `#/` by convention.
- **CSS**: Tailwind CSS 4 with design tokens split across 3 files: `src/styles.css` (stable — never rewrite), `src/theme.css` (swappable), `src/animations.css` (design-specific keyframes). Use `cn()` from `src/lib/utils.ts` to merge Tailwind classes. **Always use hex values for colors** — never oklch. **Never add `.dark {}` blocks.**
- **TypeScript**: Strict mode with `noUnusedLocals` and `noUnusedParameters`.
- **Import order** (enforced by Biome): `@colossal-sh/*` → `@tanstack/*` → `@base-ui/*` → third-party → `react` → local `#/` aliases. `import type` before value imports.
- **Lint pitfalls**: Never use `href="#"` on `<a>` tags. Use `<span>` with `cursor-pointer` or real anchors. `noArrayIndexKey` on `key={\`${val}-${i}\`}` is accepted for image arrays.
- **Never run `pnpm format`**. `pnpm build` is sufficient verification.

## Environment Variables

Set in `.env` (see `.env.example`):

- `VITE_STORE_UID` — required, store identifier
- `VITE_API_URL` — optional, custom API endpoint
- `VITE_PARENT_ORIGIN` — optional, for visual editor iframe communication

## Page & Component Layout Reference

### Global shell (`src/components/system/shell/`)

**`client-shell.tsx`** — Wraps the app. Manages `cartOpen` and `searchOpen` state. Renders: Header → `<main>` → Footer → CartDrawer → SearchOverlay. This is where Header and Footer are configured via props.

### Home page (`src/routes/index.tsx`)

Landing page with product grid and any design-specific sections (hero, featured, promo, etc.).

### Product detail (`src/routes/product/$uid.tsx` → `src/components/system/product-detail/`)

- `index.tsx` — Two-column grid (7fr / 5fr). Left: gallery. Right: sticky sidebar with info, price, add-to-cart.
- `product-info.tsx` — Name, tagline, description.
- `product-price.tsx` — Extracts `unitPrice` from `LinearProductPriceConfig`, divides by 100, formats as `$X.XX`.
- `product-add-to-cart.tsx` — Full-width button.
- `product-gallery.tsx` — Switches between grid/stack/featured variants via `variant` prop.
- `product-lightbox.tsx` — Full-screen image viewer with keyboard nav.

### Store components (`src/components/store/`)

These components are **configured via props**, not edited directly. Props are set in `client-shell.tsx` (header, footer) or `index.tsx` (product grid/card). Only edit these files if the user explicitly asks to modify a specific component.

- `header.tsx` — Configurable header
- `footer.tsx` — Configurable footer
- `product-card.tsx` — Configurable card
- `product-grid.tsx` — Responsive grid passing card props through
- `featured-products.tsx` — Curated product highlight section
- `cart-drawer.tsx` — Right-side drawer. Prices in floats (dollars), not cents.
- `search-overlay.tsx` — Full-screen search modal. Client-side filtering. Max 6 results.

## Component Props Reference

### Header (`src/components/store/header.tsx`)

Configured in `client-shell.tsx`. Props from design.json `header` field when using a reference.

| Prop | Type | Default | Description |
|---|---|---|---|
| `storeName` | `string` | — | Store name (required) |
| `onSearchClick` | `() => void` | — | Search button callback |
| `buttonStyle` | `"default" \| "icon"` | `"default"` | `"default"`: outlined with text. `"icon"`: ghost icon-only |
| `size` | `"default" \| "large"` | `"default"` | `"default"`: h-14. `"large"`: h-16 |
| `layout` | `"standard" \| "centered"` | `"standard"` | `"standard"`: name left. `"centered"`: name centered |
| `links` | `HeaderLink[]` | `[]` | Nav links: `{ label, href }`. Only use `href: "/"` |
| `floating` | `boolean` | `false` | `true`: contained with rounded corners, fixed positioning |
| `colors` | `HeaderColors` | — | `{ bg, text, mutedText, border, badgeBg, badgeText }` |

### Footer (`src/components/store/footer.tsx`)

Configured in `client-shell.tsx`. Props from design.json `footer` field when using a reference.

| Prop | Type | Default | Description |
|---|---|---|---|
| `storeName` | `string` | — | Required |
| `description` | `string` | — | Below store name in expanded layout |
| `columns` | `FooterColumn[]` | `[]` | When empty → minimal single-row footer |
| `colorScheme` | `"default" \| "inverted" \| "custom"` | `"default"` | `"inverted"` swaps fg/bg |
| `colors` | `FooterColors` | — | Only used with `colorScheme="custom"` |

`FooterColumn` shape: `{ title: string; links?: { label, href }[]; lines?: string[] }`. Use `links` for nav lists and `lines` for plain-text rows (e.g. address, contact info). The two can be combined in one column.

### Product Card (`src/components/store/product-card.tsx`)

Configured via `ProductGrid` props in `index.tsx`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `hoverEffect` | `"lift" \| "shadow"` | `"lift"` | `"lift"`: rises with shadow. `"shadow"`: subtle change + image scale |
| `cartButton` | `"outline" \| "ghost" \| "icon-only" \| "overlay"` | `"outline"` | Cart button style |
| `cartButtonIcon` | `"bag" \| "plus"` | `"bag"` | Icon for ghost/icon-only styles |
| `carousel` | `"none" \| "hover"` | `"hover"` | `"none"`: first image only. `"hover"`: arrows + dots |

Cards stretch to equal heights within a grid row — the content column is a flex column and the price/cart row is pinned to the bottom, so short taglines don't shrink the card.

### Featured Products (`src/components/store/featured-products.tsx`)

Curated 3-column highlight section, typically used on the home page above or below the main product grid.

| Prop | Type | Default | Description |
|---|---|---|---|
| `products` | `SimpleProduct[]` | — | Products to display (required). Renders nothing when empty |
| `label` | `string` | `"Staff Picks"` | Small uppercase label above the heading |
| `heading` | `string` | `"Notable Selections"` | Section heading |
