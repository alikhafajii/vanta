# VΛNTΛ

**A creative digital studio — portfolio & marketing site.**

An editorial, near‑black design experience built to feel like a premium studio: huge typography, aggressive whitespace, smooth scrolling, and restrained motion. Typography and contrast do the work; the deep‑ultraviolet accent is used sparingly.

**Live:** [vantadevs.com](https://vantadevs.com) · **Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · Motion · Lenis

---

## Highlights

- **Editorial design system** — CSS‑first design tokens (color, fluid type scale, easings) defined in [`app/globals.css`](app/globals.css) via Tailwind v4 `@theme`.
- **Performance‑first** — above‑the‑fold reveals are pure CSS so the hero (LCP element) never waits on JS. Verified **LCP ~114 ms, CLS 0.00**, Lighthouse **100** Accessibility / Best Practices / SEO.
- **RSC architecture** — server components by default; interactivity isolated to small client islands (smooth scroll, custom cursor, motion primitives).
- **Smooth scroll & motion** — [Lenis](https://github.com/darkroomengineering/lenis) driven by its own rAF loop, with reveals via a native `IntersectionObserver` hook. Fully honors `prefers-reduced-motion`.
- **Self‑hosted fonts** — Switzer, Instrument Serif, and JetBrains Mono subset to `woff2` and loaded with `next/font/local` (no layout shift, no external requests).
- **SEO built in** — metadata, Open Graph / Twitter cards, and generated `robots.txt` + `sitemap.xml`.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS‑first `@theme`) |
| Animation | `motion` (Framer Motion successor) |
| Smooth scroll | Lenis |
| Utilities | `clsx` + `tailwind-merge` (`cn()`) |

## Getting started

Requires **Node 20+** and **pnpm** (npm/yarn/bun work too).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
pnpm dev      # start the dev server (Turbopack)
pnpm build    # production build
pnpm start    # serve the production build
pnpm lint     # eslint
```

## Project structure

```
app/
  layout.tsx        # root layout: fonts, metadata, providers
  page.tsx          # homepage composition
  providers.tsx     # MotionConfig + smooth scroll + cursor
  globals.css       # design tokens + base + utility classes
  robots.ts         # /robots.txt
  sitemap.ts        # /sitemap.xml
  fonts/            # self-hosted woff2 + next/font config

components/
  layout/           # Navbar, Footer, SectionHeader
  sections/         # Hero, SelectedWork, Services, Process, About, Journal, FinalCTA
  providers/        # SmoothScroll (Lenis), Cursor
  ui/               # Container, Grain, Wordmark, Marquee, MagneticButton, reveals…

hooks/
  useInViewOnce.ts  # reliable IntersectionObserver reveal hook

lib/
  data/             # content: site, projects, services, process, journal
  utils.ts          # cn() class merge helper
```

## Editing content

All copy lives in [`lib/data/`](lib/data/) — no hard‑coded strings in components:

- `site.ts` — brand, nav, socials, contact email
- `projects.ts` — selected work (each with a generative duotone cover)
- `services.ts` · `process.ts` · `journal.ts`

## Design tokens

Colors, the fluid type scale, and easings are defined once in [`app/globals.css`](app/globals.css):

| Token | Value |
| --- | --- |
| `--color-void` | `#000000` (background) |
| `--color-secondary` | `#141418` |
| `--color-surface` | `#1b1b20` |
| `--color-elevated` | `#26262a` |
| `--color-text` | `#ffffff` |
| `--color-muted` | `#a1a1aa` |
| `--color-faint` | `#8a8a93` |
| `--color-line` | `rgba(255,255,255,0.1)` |
| `--color-line-strong` | `rgba(255,255,255,0.2)` |
| `--color-accent` | `#7c5cff` (deep ultraviolet, used sparingly) |
| `--color-accent-bright` | `#9a80ff` |

## Deploy

Optimized for [Vercel](https://vercel.com) — zero config. `pnpm build` produces a statically‑prerendered homepage.

---

© VΛNTΛ. All rights reserved.
