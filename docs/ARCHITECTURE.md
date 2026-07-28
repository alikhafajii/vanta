# Architecture

## What this system does

VANTA is a marketing/portfolio site for a dev studio. Almost the entire site
is static/client-rendered editorial content (hero, about, services, selected
work, origin story). The one piece of real logic is a conversion flow: a
multi-step onboarding form at `/start-project` that collects a prospective
client's requirements and posts them to a Telegram chat via the site's only
backend route. There is no database — the Telegram chat itself is the lead
log.

## Shape

- `app/(marketing)/page.tsx` composes the homepage from `components/sections/*`
  (Hero, About, Origin, Services, SelectedWork, WorkPlate, FinalCTA, HeroGalaxy)
- `app/start-project/page.tsx` renders `components/start/StartExperience.tsx`,
  a self-contained multi-step form, deliberately outside the marketing chrome
- `app/providers.tsx` wraps the app in `MotionConfig` + `Preloader` +
  `SmoothScroll` (Lenis) + `NetworkStatus`
- Lead data flow: `StartExperience` collects `Answers` client-side → POST JSON
  to `/api/telegram` → the route re-validates everything server-side using the
  _same_ validator functions the client used, imported from
  `lib/data/onboarding.ts` (client and server import one shared implementation,
  so the two can't drift) → on success, `buildTelegramMessage()` formats the
  text and the route calls Telegram's `sendMessage` directly via `fetch`

## Modules

- `app/api/telegram/route.ts` — the only server logic in the repo. Order of
  checks: same-origin guard → Upstash sliding-window rate limit (fails open if
  Redis env is unset) → JSON shape guard → honeypot + timing-trap anti-bot →
  shared format validators → shared step-completeness validators → Telegram
  `sendMessage`. Its only internal dependencies are `lib/data/onboarding.ts`
  and `lib/data/site.ts`.
- `lib/data/*.ts` — copy and onboarding step/validation logic; the single
  source of truth for both UI text and what counts as a valid submission.
- `components/sections/*` — one component per homepage section, each
  independently revealed via `hooks/useInViewOnce.ts`.
- `components/ui/*` — shared primitives (Reveal, MagneticButton, Marquee,
  ArrowLink, Wordmark, …) plus three WebGL/canvas components kept as `.jsx`:
  Galaxy (OGL), Aurora (OGL), ASCIIText (three.js).
- `components/providers/*` — Preloader, SmoothScroll, NetworkStatus —
  app-level concerns, mounted once in `app/providers.tsx`.
- `hooks/useInViewOnce.ts` — the only hook in the repo; a custom
  intersection-observer reveal trigger, built to replace Motion's
  `whileInView` (see docs/DECISIONS.md).

## Data

No database, no ORM. The only persisted state:

- Whatever the client holds in memory during the onboarding flow — reload
  persistence was not checked in this pass, don't assume either behavior
- The Telegram chat — every successful submission becomes a message there;
  that chat is the de facto lead log
- Upstash Redis holds only rate-limit counters (`vanta:start-project` prefix,
  5 requests / 10 min sliding window per IP) — no lead data touches it

## Boundaries

- Marketing chrome (Navbar/Footer) must not leak into `/start-project` —
  enforced structurally by keeping that route outside `app/(marketing)`, not
  by a shared layout flag
- The API route must never log the raw error object or the constructed
  Telegram URL — both can carry `TELEGRAM_BOT_TOKEN` — only `err.message` is
  logged
- Server-side validation must stay in lockstep with client validation by
  importing the shared functions in `lib/data/onboarding.ts`, never
  reimplementing the rules independently

## Known weak points

- No automated tests anywhere — lint/build are the only mechanical checks,
  and neither currently runs in the dev environment this was written in
  (pnpm/corepack is broken and `node_modules` isn't installed — see
  CLAUDE.md Gotchas)
- `animejs` is fully installed with zero usages — dead weight in the
  bundle/lockfile
- Rate limiting fails open by design when Upstash env vars are absent — fine
  for a low-traffic form, but means zero spam protection beyond the
  honeypot/timing trap in that state
