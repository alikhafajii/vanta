# vanta

VANTA — a bespoke, near-black editorial marketing site for a dev studio, with one
lead-capture flow (`/start-project`) that forwards submissions to Telegram.

## Stack

- Next.js 16.2.11 (App Router, RSC, Turbopack), React 19.2.4
- TypeScript 5, strict mode, `@/*` → repo root
- Tailwind CSS v4 (`@tailwindcss/postcss`), `clsx` + `tailwind-merge` (`cn()` in `lib/utils.ts`)
- Motion (`motion/react`, not `framer-motion`) — used across ~13 files
- Lenis — smooth scroll, wired in `components/providers/SmoothScroll.tsx`
- OGL — WebGL, `components/Galaxy.jsx` + `components/start/Aurora.jsx`
- three.js — WebGL, `components/ui/ASCIIText.jsx` only
- `animejs` is installed but imported nowhere — dead dependency
- `@upstash/ratelimit` + `@upstash/redis` — rate limiting in the one API route
- pnpm (`pnpm-lock.yaml`, `pnpm-workspace.yaml`)

## Commands

- `pnpm dev` / `pnpm build` / `pnpm start` / `pnpm lint` (from `package.json`)
- **Unverified here**: `pnpm` itself currently fails on this machine
  (`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`, Node v24.18.0 + corepack 0.24 pnpm
  shim), and `node_modules/` doesn't exist. Fix the pnpm/corepack setup and run
  `pnpm install` before trusting any script here.

## Layout

- `app/(marketing)/` — homepage route group, wraps children in Navbar+Footer
- `app/start-project/` — lead-capture flow; has **no own layout.tsx**, inherits
  only the root layout (skips marketing chrome by living outside the group)
- `app/api/telegram/route.ts` — the only backend route (POST → Telegram sendMessage)
- `lib/data/*.ts` — all site copy lives here, never hardcoded in components
- `components.json` points the shadcn CLI at a custom `@react-bits`
  (reactbits.dev) registry — used to pull one-off components, not shadcn/ui

## Conventions

- Imports via `@/*`; destructured named exports
- PascalCase component files matching their export; camelCase hooks/utils
- `.jsx` reserved for the three WebGL/canvas components; everything else `.tsx`
- No client fetch library — direct `fetch` to `/api/telegram`
- No global state store — local `useState`/`useRef` + Motion's motion values
- API route fails closed on validation, fails open on optional infra (Upstash
  down → log and continue), never logs raw errors/URLs (bot token risk)

## Gotchas

- Rate limiter reads `UPSTASH_REDIS_REST_KV_REST_API_URL` / `_TOKEN` (KV-prefixed,
  not the plain Upstash names) — silently no-ops without them, never errors
- `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` required for the API route to do anything
- `hooks/useInViewOnce.ts` deliberately replaces Motion's `whileInView` —
  don't "simplify" it back without checking why (see docs/DECISIONS.md)
- No test runner configured — lint + build are the only gates, once pnpm works

## Brain

Architecture and reasoning live in @docs/ARCHITECTURE.md — read it before any
change that crosses module boundaries, touches data flow, or adds a dependency.
