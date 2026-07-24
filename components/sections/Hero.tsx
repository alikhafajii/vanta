import { HeroGalaxy } from "@/components/sections/HeroGalaxy";

/** Hero = live galaxy + navigation (mounted by the marketing layout) + the
 *  VANTA symbol. Nothing else — the composition works through scale, space,
 *  motion and simplicity.
 *
 *  Layers: black base (section bg) → Galaxy canvas (z-0, receives pointer
 *  events for mouse repulsion) → navbar readability fade (z-10, pointer
 *  transparent) → fixed site navbar (z-50, own file) → VANTA symbol (z-20,
 *  pointer transparent). */
export function Hero() {
  return (
    <section id="top" className="relative isolate h-svh overflow-hidden bg-black">
      <h1 className="sr-only">VANTA</h1>

      <HeroGalaxy />

      {/* Near-invisible black fade so the fixed navbar stays readable over
          moving stars — deliberately not a boxed navbar background. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-36 bg-linear-to-b from-black/70 via-black/20 to-transparent"
      />

      {/* The VANTA symbol — the real mark asset (background flood-filled to
          true transparency, geometry untouched), lower-middle anchor.
          Pointer-transparent so the Galaxy keeps receiving mouse movement. */}
      <img
        src="/brand/vanta-symbol.png"
        alt=""
        width={623}
        height={623}
        fetchPriority="high"
        className="pointer-events-none absolute top-[65%] left-1/2 z-20 w-[clamp(180px,17vw,280px)] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_28px_rgba(255,255,255,0.18)]"
      />
    </section>
  );
}
