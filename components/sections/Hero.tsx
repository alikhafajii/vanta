import { HeroGalaxy } from "@/components/sections/HeroGalaxy";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ScrollSignal } from "@/components/ui/ScrollSignal";
import { hero } from "@/lib/data/site";

/** Hero = live galaxy + navigation (mounted by the marketing layout) + centered
 *  copy block + the VANTA symbol. The composition works through scale, space,
 *  motion and simplicity.
 *
 *  Layers: black base (section bg) → Galaxy canvas (z-0, receives pointer
 *  events for mouse repulsion) → navbar readability fade (z-10, pointer
 *  transparent) → fixed site navbar (z-50, own file) → VANTA symbol (z-20,
 *  pointer transparent) → copy block + scroll cue (z-30, pointer transparent
 *  except the CTAs). */
export function Hero() {
  return (
    <section id="top" className="relative isolate h-svh overflow-hidden bg-black">
      <HeroGalaxy />

      {/* Near-invisible black fade so the fixed navbar stays readable over
          moving stars — deliberately not a boxed navbar background. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-36 bg-linear-to-b from-black/70 via-black/20 to-transparent"
      />

      {/* The VANTA symbol — same mark asset as the site favicon (its flat
          JPEG background flood-filled to true transparency, geometry
          untouched), lower-middle anchor. Pointer-transparent so the Galaxy
          keeps receiving mouse movement. */}
      <img
        src="/brand/vanta-symbol.png"
        alt=""
        width={1024}
        height={1024}
        fetchPriority="high"
        className="pointer-events-none absolute top-[72%] left-1/2 z-20 w-[clamp(240px,24vw,440px)] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_28px_rgba(255,255,255,0.18)]"
      />

      {/* Centered copy block — sits above the symbol so the mark reads as
          ground beneath the headline. */}
      <div className="pointer-events-none absolute inset-x-0 top-[34%] z-30 flex -translate-y-1/2 flex-col items-center gap-6 px-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
          <span className="font-mono text-[0.72rem] tracking-[0.25em] text-white/55 uppercase">
            {hero.eyebrow}
          </span>
        </div>

        <h1 className="max-w-4xl font-serif text-[clamp(3rem,9vw,7rem)] leading-[0.95] font-normal text-white">
          {hero.headline[0]}
          <span className="serif">{hero.headline[1]}</span>
        </h1>

        <p className="max-w-md text-white/60">{hero.sub}</p>

        <div className="pointer-events-auto mt-2 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton
            href={hero.ctaPrimary.href}
            variant="outline"
            className="border-white/15 shadow-[0_0_24px_-8px_var(--color-accent)] hover:shadow-[0_0_32px_-6px_var(--color-accent)]"
          >
            {hero.ctaPrimary.label}
          </MagneticButton>
          <ArrowLink href={hero.ctaSecondary.href}>{hero.ctaSecondary.label}</ArrowLink>
        </div>
      </div>

      {/* Scroll cue — bottom-center, above the symbol/galaxy. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-30 flex flex-col items-center gap-3">
        <ScrollSignal className="h-10" />
        <span className="font-mono text-[0.65rem] tracking-[0.25em] text-white/40 uppercase">
          {hero.scrollLabel}
        </span>
      </div>
    </section>
  );
}
