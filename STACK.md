# VANTA — Full Toolchain Reference

Companion to [`CLAUDE.md`](./CLAUDE.md). CLAUDE.md keeps only what's
relevant to this repo; this file is the fuller Claude Code tooling picture.

**2026-07-28 rewrite note:** the previous version of this file described an
"ECC" agent/skill/hook ecosystem (`planner`, `refactor-cleaner`,
`frontend-patterns`, `post-edit-typecheck`, `cost-tracker`, `/feature-dev`,
etc.) that does not match what this Claude Code session actually has
available — none of those names exist in the real agent, skill, or MCP
listings. It looked fabricated or carried over from an unrelated setup and
has been replaced below with what was directly verified in this session.
Tool/skill/agent availability is Claude Code app + plugin state, not
something this repo controls — re-verify if it looks stale again.

## MCPs

- Context7 — confirmed connected. Live library/framework/API docs; prefer it
  over guessing library APIs from training data.
- GitHub MCP, Firecrawl, 21st.dev Magic — **not present** in this session's
  tool list (checked directly, no matching tools found). If these are meant
  to be available, they need to be (re)configured — don't assume they exist.

## Plugins

- `ui-ux-pro-max@ui-ux-pro-max-skill` — confirmed enabled, global
  `~/.claude/settings.json` → `enabledPlugins`.
- Caveman (`/caveman`) — referenced in CLAUDE.md's old response-style rules
  but not present in this session's available-skills listing. Either it's
  installed differently (command, not skill) or it's no longer active —
  unverified, don't assume it fires.

## Agents (via the Agent tool, this session)

- `claude` — general catch-all
- `claude-code-guide` — questions about Claude Code / Agent SDK / Claude API itself
- `Explore` / `explorer` — read-only codebase search
- `general-purpose` — multi-step research/search tasks
- `Plan` — implementation planning
- `security-reviewer` — OWASP-style vulnerability review
- `silent-failure-hunter` — swallowed errors, bad fallbacks
- `statusline-setup` — status line configuration

## Skills (this session's actual listing)

- `bootstrap` — this file's own origin (repo doc setup)
- `security-review`, `security-scan`, `security-bounty-hunter`, `sec-audit`,
  `sec-review`, `threat-model` — security, several overlapping in scope
- `error-handling`, `production-audit`, `verification-loop` — code quality /
  pre-ship checks
- `simplify` — reuse/simplification pass on changed code
- `fewer-permission-prompts`, `update-config`, `keybindings-help` — Claude
  Code configuration itself
- `context-budget`, `strategic-compact` — context-window management
- `dataviz`, `artifact-design`, `artifact-capabilities` — Artifacts / charts
- `loop`, `schedule` — recurring/scheduled runs
- `claude-api` — Claude API/SDK reference
- `claude-in-chrome`, `run` — browser automation / launching the app
- `init`, `review` — CLAUDE.md init, PR review

No skill in this list is TDD-, backend-, or API-design-specific — consistent
with this repo's actual state (no test runner, one thin API route). The
project's own stance stands regardless of what tooling comes and goes:
**no test runner is being added unasked**, backend patterns stay dormant
until a real backend exists.

## Hooks (verified from `~/.claude/settings.json`, the only ones configured)

- `PostToolUse` on `Edit|Write` → `npx prettier --write` — auto-formats
  touched files, swallows its own errors (`|| true`)

That's the only hook currently configured globally. Nothing runs
typecheck-on-edit, tracks cost, or auto-saves/loads session memory via a
Claude Code hook — if any of that happens, it's a different mechanism, not
a hook in `settings.json`.
