# Smart Home E-Commerce Checkout

A front-end demo of a multi-step smart-home bundle checkout. Shoppers pick cameras, a monitoring plan, sensors, and optional add-ons, then review a live order summary with pricing before checkout.

This is a **client-only** app: product data lives in JSON, cart state is managed in React, and selections can be saved to the browser's `localStorage`. There is no backend or payment integration.

## What you can do

- Walk through a **4-step wizard**: cameras → plan → sensors → extra protection
- Choose camera **colors and quantities** with per-variant pricing
- Select a **subscription plan** and adjust sensor/accessory quantities
- See a **running order summary** with savings, monthly payment estimate, and totals
- **Save your bundle** to `localStorage` and resume later in the same browser
- **Review and edit** quantities from the final review step before checkout (shows a confirmation dialog)

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 8](https://vite.dev/) for dev server and production builds
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [SweetAlert2](https://sweetalert2.github.io/) for checkout confirmation

## Prerequisites

- **Node.js** `20.19+` or `22.12+` (required by Vite 8)
- **npm** 9+ (comes with Node)

Check your version:

```bash
node --version
npm --version
```

## Getting started

From a fresh clone of the repository:

```bash
# 1. Install dependencies
npm ci

# 2. Start the development server
npm run dev
```

Open the URL printed in the terminal (usually [http://localhost:5173](http://localhost:5173)).

Vite supports hot module replacement, so edits to React components reload automatically.

## Production build

Build optimized static files into `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Then open [http://localhost:4173](http://localhost:4173).

## Available scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start dev server with HMR            |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Serve the `dist/` folder locally     |
| `npm run lint`    | Run ESLint on the project            |

## Project structure

```
src/
├── pages/
│   └── CheckoutPage.tsx      # Main checkout flow and step navigation
├── components/checkout/      # UI: product cards, sidebar, order summary
├── data/
│   └── products.json         # Catalog, steps, pricing, and copy
├── types/
│   └── product.ts            # TypeScript types for product data
├── utils/
│   └── bundleState.ts        # Cart state, totals, localStorage helpers
└── assets/                   # Icons and bundled images

public/
└── images/                   # Product photos and color swatches
```

Product catalog and step copy are driven by `src/data/products.json`, so you can change offerings without touching component code.

## Decisions & tradeoffs

**Data & state** — Product catalog, step copy, and default selections all live in `src/data/products.json`. Cart state is kept in React and derived values (summary sections, totals) are computed with `useMemo` rather than stored separately, so the review panel always reflects the builder.

**Per-variant quantities** — Camera colors are tracked as `{ cameraId: { colorId: quantity } }`. The card stepper edits whichever color chip is active; every variant with quantity > 0 appears as its own line in the review panel.

**Initial load** — Default quantities for cameras, sensors, accessories, and the selected plan are seeded from the `summary` section in JSON, so the app opens matching the Figma starting state (pre-populated review panel included).

**Sense Hub** — When at least one camera is selected, the Wyze Sense Hub is auto-included at quantity 1 and its stepper is locked in both the builder and review panel. Removing all cameras clears the hub.

**Persistence** — "Save my system for later" writes the bundle to `localStorage` under a single key. On return, saved state is merged back onto the current catalog so product metadata stays up to date even if JSON changes. Persistence is browser-local only (no account or server).

**Checkout** — There is no payment flow. Checkout shows a SweetAlert2 confirmation dialog as a placeholder.

**Styling** — Tailwind utility classes with breakpoint-specific layouts for desktop (≥1197px), tablet (768–1196px), and mobile (<768px). DM Sans is the primary typeface; Gilroy is referenced in CSS for elements that match the design spec.

## What I didn't finish / skipped

- **Backend API** — Not implemented; a local JSON file is sufficient for this prototype.
- **Color chip selected styling** — Per the brief, focus was on selection-and-quantity behavior rather than perfect active-chip visuals.
- **Learn More links** — Rendered as inline text; they do not navigate anywhere in this prototype.
- **Pixel-perfect Figma audit** — Layout, spacing, and colors follow the design closely, but I did not run a formal pixel-diff pass against every breakpoint.

## Troubleshooting

**`npm ci` fails** — Make sure you are using Node `20.19+` or `22.12+`. Older versions are not supported by this project's Vite version.

**Port already in use** — Vite picks the next free port automatically, or you can specify one:

```bash
npm run dev -- --port 3000
```

**Stale install** — If dependencies seem out of sync, reinstall from scratch:

```bash
rm -rf node_modules
npm ci
```
