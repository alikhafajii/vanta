import type { CSSProperties } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Looping eclipse background — encoded from the supplied frame sequence.
          Translated down (with a soft top mask) so the eclipse sits low like the
          mockup; further down on mobile so it rises clear of the stacked copy. */}
      <video
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full translate-y-[16%] object-cover max-md:translate-y-[42%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_16%)]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero/eclipse-poster.jpg"
        aria-hidden="true"
      >
        <source src="/hero/eclipse.mp4" type="video/mp4" />
      </video>

      <div className="flex flex-1 flex-col items-center px-6 pt-[calc(10svh+72px)] text-center">
        <span
          className="fade-up mb-5 inline-block h-1.5 w-1.5 rounded-full bg-accent"
          style={delay(60)}
          aria-hidden="true"
        />
        <p className="eyebrow fade-up" style={delay(140)}>
          Creative Digital Studio — Est. 2025
        </p>

        <h1
          className="fade-up mt-7 font-serif text-[clamp(3rem,1.4rem+5.6vw,6.25rem)] leading-[1.02] tracking-[-0.01em] text-white"
          style={delay(240)}
        >
          We build in the <span className="italic">dark.</span>
        </h1>

        <p
          className="fade-up mt-7 max-w-md text-base leading-relaxed text-muted sm:text-lg"
          style={delay(360)}
        >
          Premium websites, brands and digital experiences crafted with obsessive
          attention to detail.
        </p>

        <div
          className="fade-up mt-11 flex flex-col items-center gap-6 sm:flex-row sm:gap-8"
          style={delay(470)}
        >
          <MagneticButton
            href="/start-project"
            variant="outline"
            className="border-accent/40 px-7 py-3.5 font-mono text-xs tracking-[0.18em] uppercase hover:border-accent/80 hover:bg-accent/10"
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
        style={delay(680)}
      >
        <span className="h-5 w-px bg-white/30" aria-hidden="true" />
        <span className="eyebrow">Scroll</span>
      </div>
    </section>
  );
}
