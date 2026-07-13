# VANTA — Full Toolchain Reference

Companion to [`CLAUDE.md`](./CLAUDE.md). CLAUDE.md keeps only what's
relevant to this repo (its own rule: every line earns its place). This
file is the complete, unfiltered Claude Code stack as confirmed by Ali,
so nothing gets lost even if it's not called out in the project brain.

## MCPs
- Context7 — live library docs (auto on new libs)
- GitHub MCP — PRs, issues, git workflow
- Firecrawl — web scraping + external docs
- 21st.dev Magic — ready-made modern UI components. CAUTION (see
  CLAUDE.md): clashes with VANTA's bespoke design system — scaffold
  only, never ship raw output.

## Plugins
- Caveman — /caveman, token compression
- UI/UX Pro Max — auto-activates on any UI/UX work

## ECC Agents (Auto)
- planner — task breakdown
- code-reviewer — diff review
- tdd-guide — test-first workflow — INACTIVE here, no test runner
  configured (decided 2026-07-10, staying test-free)
- security-reviewer — deep security scan — calibrated down, no
  backend/DB/auth exists, attack surface is client-only
- react-reviewer — React review
- typescript-reviewer — TS review
- performance-optimizer — slow code detection
- refactor-cleaner — safe refactoring
- build-error-resolver — build fixes
- seo-specialist — SEO audit
- a11y-architect — accessibility

## ECC Skills (On-Demand)
- frontend-patterns — component patterns
- frontend-design-direction — design decisions
- motion-ui — scroll animations — PRIMARY skill for this repo
- make-interfaces-feel-better — UX polish — PRIMARY skill for this repo
- react-patterns — React best practices
- react-performance — optimization
- react-testing — testing patterns — INACTIVE (no test runner)
- tdd-workflow — test first dev — INACTIVE (no test runner)
- verification-loop — verify before done
- continuous-learning — learns your codebase
- error-handling — systematic errors
- production-audit — pre-deploy check
- security-review — OWASP scan — calibrated down, see security-reviewer
- api-design — REST/API design — DORMANT, no backend exists
- backend-patterns — API patterns — DORMANT, no backend exists
- coding-standards — code quality

## ECC Commands
- /plan — smart planning
- /feature-dev — full feature workflow
- /code-review — deep review
- /react-review — React specific
- /react-test — React testing
- /react-build — React build fix
- /security-scan — security check
- /refactor-clean — safe refactor
- /quality-gate — pre-deploy quality
- /pr — create PR
- /save-session — save context
- /resume-session — restore context
- /checkpoint — save progress

## ECC Hooks (Always-On)
- post-edit-typecheck — TS check after every edit
- post-edit-format — auto-format after every edit
- pre-bash-commit-quality — quality check before commit
- suggest-compact — context warning (automates CLAUDE.md's "context >
  70% → /compact" rule)
- cost-tracker — token spend tracking
- session-start — auto-loads memory
- session-end — auto-saves memory

## Reconciliation notes
Full reasoning lives in the conversation that produced this file; the
short version enforced in CLAUDE.md:
- tdd-guide / react-testing / tdd-workflow → off. No test runner, marketing
  site, decided to stay that way rather than add Vitest unasked.
- api-design / backend-patterns → dormant until a backend actually exists.
- 21st.dev Magic → scaffold-only, always reskin into the existing
  @theme tokens in app/globals.css.
- security-reviewer / security-review → calibrate expectations, this is
  a static site with no server to deep-scan.
