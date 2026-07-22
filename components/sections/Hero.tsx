import type { CSSProperties } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HeroStarField } from "@/components/sections/HeroStarField";
import { generateHeroStars } from "@/lib/generateHeroStars";

const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

const stars = generateHeroStars();

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex h-svh flex-col overflow-hidden bg-black"
    >
      {/* Background plate — deep-space photo with the VANTA eclipse mark baked in */}
      <img
        src="/hero/hero-bg.jpg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-[center_72%]"
      />

      {/* Star field — pulsing glow layer, sits above the photo, behind content.
          Anime.js-driven (client island); positions/shapes still render as
          static server markup so there's no layout shift before hydration. */}
      <HeroStarField stars={stars} />

      <div className="flex flex-1 flex-col items-center px-6 pt-[calc(10svh+72px)] text-center">
        <h1
          className="fade-up font-serif text-[clamp(3rem,1.4rem+5.6vw,6.25rem)] leading-[1.02] tracking-[-0.01em] text-white"
          style={delay(80)}
        >
          We build in the <span className="italic">dark.</span>
        </h1>

        <p
          className="fade-up mt-7 max-w-md text-base leading-relaxed text-muted sm:text-lg"
          style={delay(220)}
        >
          Premium websites, brands and digital experiences crafted with obsessive
          attention to detail.
        </p>

        <div
          className="fade-up mt-11 flex flex-col items-center gap-6 sm:flex-row sm:gap-8"
          style={delay(360)}
        >
          <MagneticButton
            href="/start-project"
            variant="outline"
            className="px-7 py-3.5 font-mono text-xs tracking-[0.18em] uppercase"
          >
            Start a Project <span aria-hidden="true">→</span>
          </MagneticButton>
          <a
            href="#work"
            data-cursor="hover"
            className="group font-mono text-xs tracking-[0.18em] uppercase text-white transition-colors duration-300 hover:text-muted"
          >
            See Our Work{" "}
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </div>

      <div
        className="fade-up absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-3"
        style={delay(520)}
      >
        <span className="h-5 w-px bg-white/30" aria-hidden="true" />
        <span className="eyebrow">Scroll</span>
      </div>
    </section>
  );
}
