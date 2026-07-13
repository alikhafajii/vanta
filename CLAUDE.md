# CLAUDE.md — Project Brain
# Keep this file under 200 lines. Every line must earn its place.
# If removing a line won't cause mistakes → remove it.

## WHO I AM
Dev: Ali. Vibe coder. Move fast, ship clean.
Workflow: Claude.ai (planner) → Claude Code (executor).
Default model: Sonnet. Use Opus only for hard architecture decisions.

## RESPONSE STYLE
- Talk like caveman unless I say otherwise: /caveman full
- No filler. No "I'd be happy to". No restating the task.
- Code blocks always exact. Paths always exact.
- If something is bad idea → say it straight, then give better option.

## TOKEN RULES (ENFORCE ALWAYS)
- Never read files I didn't reference unless task requires it
- Never run full test suite — run single targeted test file only
- Never cat node_modules, dist, build, .next, .git, coverage, *.lock
- If context > 70% full → stop, run /compact, then resume
- Filter command output: failures only, no verbose success logs
- Summarize findings before editing — never edit blind
- Use subagents for noisy tasks (test runs, log parsing, grep sweeps)

## TOOLS & MCPS (confirmed — full raw stack incl. commands/hooks in STACK.md)
### MCPs
- Context7 — docs for fast-moving libs (Next.js 16, Tailwind v4, Motion,
  Lenis). Trigger: "use context7 to check [lib] docs before writing"
- GitHub MCP — PRs, issues. Trigger: auto on PR/issue commands
- Firecrawl — external URL research / competitor sites only
- 21st.dev Magic — CAUTION: generates generic modern components (shadcn-
  ish cards, generic shadows). VANTA is a bespoke near-black editorial
  system (custom @theme tokens, no shadcn, restrained radius scale).
  Never ship Magic output as-is — scaffold only, then reskin by hand.

### Agents/skills — mostly automatic, two are inactive here
- code-reviewer, react-reviewer, typescript-reviewer, performance-
  optimizer, build-error-resolver, a11y-architect, seo-specialist —
  fully relevant, let them run automatically.
- security-reviewer — keep on, but calibrate: one backend route
  (app/api/telegram), no DB/auth. Surface = that route's input validation
  + the TELEGRAM_BOT_TOKEN secret, plus client-side/deps. Don't expect a
  "deep scan" result that assumes a full server.
- tdd-guide, react-testing, tdd-workflow — INACTIVE for this repo. No
  test runner is configured and we're keeping it that way (marketing
  site, no critical backend logic). Don't let these fire or propose
  adding Vitest unasked.
- api-design, backend-patterns — dormant. No backend exists. Don't let
  these invent an API layer.
- motion-ui, make-interfaces-feel-better, frontend-design-direction,
  UI/UX Pro Max — the primary skills for this repo. Motion- and craft-
  first editorial site; lean on these more than a typical app would.

### Caveman Skill
- Default: /caveman full every session
- Drop to /caveman lite when: explaining something new to me
- Drop to normal when: security warnings, destructive ops, architecture
- Never use caveman for: first explanation of a new concept

## WORKFLOW — ALWAYS FOLLOW THIS ORDER
1. EXPLORE: read only referenced files + direct dependencies
2. PLAN: list exact files changing + why, before touching anything
3. IMPLEMENT: follow existing patterns in the codebase
4. VERIFY: run targeted test / build / specific check — never blind ship
5. COMMIT: conventional commit, ≤50 char subject, why over what

## CODE STYLE
- ESM only (import/export) — never CommonJS (require)
- async/await — never raw .then() chains
- TypeScript strict mode — no `any` unless explicitly told
- Destructure imports: import { x } from 'y'
- No inline styles unless Tailwind isn't available
- Component files: PascalCase. Utils/hooks: camelCase.

## VERIFICATION (REQUIRED BEFORE DONE)
- No test runner is configured — lint + build are the only automated gates
- Run: `pnpm lint` — must pass clean
- Build check: `pnpm build` — must succeed, no type errors
- UI changes: visually check in `pnpm dev`, don't just trust the build
- If a change touches real logic (e.g. lib/data/onboarding.ts step
  validation, summary building) — say explicitly that it's unverified by
  any test, don't imply it's been checked when it hasn't
- If can't verify → flag it, don't ship blind

## ERRORS
- Paste full error → go straight to root cause, no symptom suppression
- Address root cause always — never suppress errors
- No test runner exists — reproduce via `pnpm build` / `pnpm dev` or a
  throwaway script, not a test file, unless Vitest gets added later

## WHAT NOT TO DO
- Never install new packages without asking first
- Never modify .env files
- Never run destructive commands (drop db, delete files) without explicit confirm
- Never use Opus model for routine tasks
- Never read entire codebase on startup — ask what's relevant
- Never skip the plan step for multi-file changes
- Never string together multiple unrelated tasks in one session

## KNOWN GAPS — don't silently "fix" these, ask first
- Journal section (components/sections/Journal.tsx) links to "#" — no
  /journal or /journal/[slug] routes exist. Placeholder, not a bug.
- GSAP + @gsap/react are in package.json but never imported anywhere.
  Don't remove without asking, don't use without asking.
- components/ui/Marquee.tsx is fully built but rendered nowhere.
- StartExperience.tsx's error-fallback mailto link hardcodes
  "hello@vantadevs.com" as a literal string instead of importing
  site.email from lib/data/site.ts. Correct value, wrong pattern — minor
  cleanup, not urgent.

## ARCHITECTURE NOTES
- app/(marketing) route group = Navbar+Footer chrome for the homepage.
  /start-project sits OUTSIDE that group on purpose — no chrome, own
  layout. Don't add Navbar/Footer there.
- hooks/useInViewOnce.ts replaces Motion's whileInView on purpose — it
  was unreliable under React 19 / Next 16. Don't "simplify" it back.
- All copy lives in lib/data/*.ts — never hardcode strings in components.
- Above-the-fold hero reveals are pure CSS keyframes (app/globals.css),
  not Motion — deliberate, so LCP never waits on JS hydration.
- One backend route only: app/api/telegram/route.ts (POST). /start-project
  submits the lead summary there and it's forwarded to Telegram
  (sendMessage). Needs TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID env vars
  (see .env.example). Honeypot-only anti-spam, no DB — Telegram chat is
  the log. No other API routes exist.

## STACK
Framework:     Next.js 16.2.10 (App Router, RSC, Turbopack)
Language:      TypeScript 5, strict mode
Styling:       Tailwind CSS v4 (CSS-first @theme tokens, no shadcn) + clsx + tailwind-merge
Animation:     Motion (GSAP/@gsap/react installed but unused) + Lenis (scroll) + OGL (WebGL, /start-project only)
Database:      None
ORM:           None
Auth:          None
Backend:       One route only — app/api/telegram (POST → Telegram sendMessage)
Deployment:    Vercel (inferred, not pinned in repo)
Package mgr:   pnpm (pnpm-lock.yaml committed)
Test runner:   None configured
Build check:   pnpm build
Lint check:    pnpm lint
Test command:  N/A — none exists
