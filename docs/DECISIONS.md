# Decisions

Append-only. Newest first. Never rewrite history here.

## 2026-07-24 — shadcn CLI adopted as a component-scaffolding tool, not a design system

**Context:** Needed to pull in a specific visual component (the "official React
Bits Galaxy") rather than build WebGL from scratch.
**Decision:** Added `components.json` pointing the shadcn CLI at a custom
`@react-bits` registry (reactbits.dev) purely to fetch that component. VANTA's
own design tokens (`app/globals.css` `@theme`) remain the styling system.
**Rejected:** Adopting shadcn/ui's actual component library/design system —
would clash with the bespoke near-black editorial aesthetic.
**Reversible:** Yes — removing `components.json` doesn't affect anything
already vendored in via the CLI.

## 2026-07-13 — Telegram (not a database) as the lead-capture backend

**Context:** `/start-project` needed somewhere to send completed leads.
**Decision:** One API route (`app/api/telegram/route.ts`) validates and
forwards submissions straight to a Telegram chat via `sendMessage`. No DB, no
ORM, no admin panel.
**Rejected:** Any persistent datastore for leads — the Telegram chat itself is
the log.
**Reversible:** No, not cheaply — switching to a real datastore later means
building storage, retrieval, and probably an admin view from scratch.

## 2026-07-08 — Client and server share one onboarding validator module

**Context:** A multi-step form has to agree with its own backend about what
"complete" and "valid" mean, or the two silently drift.
**Decision:** `lib/data/onboarding.ts` exports the step/field validators; both
`components/start/StartExperience.tsx` and `app/api/telegram/route.ts` import
the same functions rather than each having their own copy.
**Rejected:** Duplicating validation logic client- and server-side.
**Reversible:** Yes, but drift risk returns immediately if it's ever split.

## 2026-07-06 — Custom `useInViewOnce` hook instead of Motion's `whileInView`

**Context:** Inferred from the code, not a commit message — `useInViewOnce.ts`
has existed since the initial commit and duplicates functionality Motion
already ships (`whileInView`), which is the kind of thing only built
deliberately.
**Decision:** Every scroll-reveal in the repo uses this hook.
**Rejected:** Motion's built-in `whileInView`, reportedly unreliable under
React 19 (per prior project notes — not independently re-verified here).
**Reversible:** Yes, but re-verify the React 19 reliability claim before
reverting; it may no longer hold on a newer Motion/React patch.
