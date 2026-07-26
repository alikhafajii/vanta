import Link from "next/link";
import { HeroGalaxy } from "@/components/sections/HeroGalaxy";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

/**
 * Hero — live galaxy field, a single line of display type, one CTA, and the
 * VANTA mark anchored lower-middle.
 *
 * Layering: black base → Galaxy canvas (z-0) → navbar legibility fade (z-10,
 * pointer-transparent) → copy + mark (z-20). The copy block is bounded to the
 * space *above* the mark so the two can never collide at any viewport height.
 */
export function Hero() {
  return (
    <section id="top" className="relative isolate h-svh overflow-hidden bg-black">
      <HeroGalaxy />

      {/* Ambient top fade — keeps the fixed navbar legible over moving stars */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-linear-to-b from-black/85 via-black/35 to-transparent"
      />

      {/* Copy — optically centred in the field above the mark */}
      <div className="absolute inset-x-0 top-17 bottom-[34%] z-20 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-[16ch] text-[clamp(2.5rem,1.2rem+5.4vw,5.25rem)] leading-[1.04] font-medium tracking-[-0.035em] text-balance text-white">
          Crafted for <span className="emphasis text-white/95">distinction</span>
        </h1>

        <p className="mt-6 max-w-[44ch] text-[0.95rem] leading-relaxed tracking-[-0.01em] text-balance text-white/55 sm:text-base">
          Digital experiences created to make brands impossible to ignore.
        </p>

        <Link
          href="/start-project"
          data-cursor="hover"
          className="group mt-10 inline-flex items-center gap-2.5 rounded-full border border-white/20 font-display bg-white/6 px-7 py-3.5 text-sm font-medium tracking-[-0.01em] text-white backdrop-blur-md transition-[background-color,border-color,color,box-shadow] duration-300 hover:border-white hover:bg-white hover:text-black hover:shadow-[0_0_36px_-4px_rgba(255,255,255,0.35)]"
        >
          <span>Start a Project</span>
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* VANTA mark — transparent asset, so the galaxy reads through it */}
      <img
        src="/brand/newlg.png"
        alt=""
        aria-hidden="true"
        width={1024}
        height={1024}
        fetchPriority="high"
        className="pointer-events-none absolute top-[78%] left-1/2 z-20 w-[clamp(170px,16vw,270px)] -translate-x-1/2 -translate-y-1/2"
      />
    </section>
  );
}
