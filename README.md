# Colossal Storefront (Vite Template)

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcolossalsound%2Fcolossal-storefront-starter-vite&env=VITE_STORE_UID&envDescription=Your%20store%20UID%20from%20the%20Colossal%20dashboard&envLink=https%3A%2F%2Fcolossal.sh"><img src="https://vercel.com/button" alt="Deploy with Vercel"></a>
  <a href="https://stackblitz.com/github/colossalsound/colossal-storefront-starter-vite"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz"></a>
</p>

A storefront template for [colossal.sh](https://colossal.sh) commerce backend. Built with Vite, React 19, TanStack Router, and Tailwind CSS 4.

Uses [`@colossal-sh/storefront-sdk`](https://www.npmjs.com/package/@colossal-sh/storefront-sdk) to communicate with the Colossal backend (products, cart, checkout).

## Quick Start

```bash
pnpm install
```

Set your store UID in `.env`:

```
VITE_STORE_UID=<your-store-uid>
```

Then start the dev server:

```bash
pnpm dev
```

## Environment Variables

| Variable          | Description                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| `VITE_STORE_UID` | Your store UID from the Colossal dashboard (required) |

## Production Build

```bash
pnpm build
pnpm preview  # local preview
```

Outputs a static SPA to `dist/` ready for deployment to Vercel or any static host. For Vercel, set the SPA rewrite so all routes serve `index.html`.

## Project Structure

```
src/
  routes/           # File-based routing (TanStack Router)
    __root.tsx      # Root layout (shell + Puck editor wrapper)
    index.tsx       # Home page
    product/$uid.tsx # Product detail page
  components/
    store/          # Product grid, product card
    system/
      shell/        # Header, footer, cart drawer, search overlay
      product-detail/ # Product gallery, info, price, add-to-cart
      puck/         # Visual page editor (dev-only)
    ui/             # shadcn/ui components
  lib/
    constants.ts    # Store UID + API URL
    utils.ts        # Tailwind merge helper
    puck-defaults.ts # Default page layouts for Puck
  puck.config.tsx   # Puck component definitions
  router.tsx        # TanStack Router setup
  main.tsx          # App entry point
  styles.css        # Tailwind CSS + theme
puck-data/          # Saved page layouts (JSON)
```

## LLM Skills

This template's dependencies include LLM skills (via TanStack's skills system) that provide context to AI assistants like Claude Code. These are bundled with `@tanstack/router-plugin`, `@tanstack/router-core`, and other packages. They help LLMs understand routing patterns, data loading, and framework conventions when working on this codebase.

## Visual Page Editor (Puck)

The template includes a [Puck](https://puckeditor.com) visual page editor for composing page layouts.

**Dev mode only:** In development, an "Edit Page" button appears at the bottom of every page. Click it to enter the visual editor where you can drag/drop components, rearrange layouts, and save changes. Saved layouts are stored as JSON files in `puck-data/`.

**Production:** The editor UI is excluded from the production bundle. Pages render from the saved JSON layout data.

### Available Puck Components

| Component         | Description                                   |
| ----------------- | --------------------------------------------- |
| ProductCollection | Product grid with title                       |
| ProductDetail     | Two-column or single-column product layout    |
| ProductGallery    | Image gallery (grid, carousel, hero, stacked) |
| ProductContent    | Container for product info/price/add-to-cart  |
| ProductInfo       | Product name, tagline, description            |
| ProductPrice      | Price display                                 |
| ProductAddToCart  | Add to cart button                            |
| TextSection       | Heading + body text                           |
| ImageBlock        | Full-width image                              |
| BlockQuote        | Quote with attribution                        |
| CTABanner         | Call-to-action with button                    |

## Stack

- [Vite 7](https://vite.dev) - Build tool
- [React 19](https://react.dev) - UI framework
- [TanStack Router](https://tanstack.com/router) - File-based routing (SPA)
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Tailwind CSS 4](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - UI components (Base UI primitives)
- [Puck](https://puckeditor.com) - Visual page editor (dev-only)
- [Biome](https://biomejs.dev) - Linting & formatting
- [Vitest](https://vitest.dev) - Testing

## Scripts

```bash
pnpm dev       # Start dev server (port 3000)
pnpm build     # Production build
pnpm preview   # Preview production build
pnpm test      # Run tests
pnpm check     # Lint + format check (Biome)
pnpm lint      # Lint only
pnpm format    # Format only
```
