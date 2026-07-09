"use client";

import type { CSSProperties } from "react";
import { HeroScene } from "@/components/hero/HeroScene";
import { Container } from "@/components/ui/Container";
import { ArrowLink } from "@/components/ui/ArrowLink";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-32 pb-10"
    >
      <HeroScene />

      <Container>
        <h1 className="text-display font-medium text-white">
          <span className="block overflow-hidden">
            <span className="rise-line" style={{ "--rise-delay": "80ms" } as CSSProperties}>
              We build
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="rise-line" style={{ "--rise-delay": "170ms" } as CSSProperties}>
              in the <span className="serif text-white/85">dark.</span>
            </span>
          </span>
        </h1>

        <div
          className="fade-up mt-9 h-px w-12 bg-line-strong"
          style={{ "--rise-delay": "420ms" } as CSSProperties}
        />

        <div
          className="fade-up mt-6 space-y-1 font-mono text-[0.78rem] tracking-[0.14em] text-faint uppercase"
          style={{ "--rise-delay": "500ms" } as CSSProperties}
        >
          <p>Premium digital products</p>
          <p>Crafted with obsessive attention.</p>
        </div>

        <div
          className="fade-up mt-9"
          style={{ "--rise-delay": "600ms" } as CSSProperties}
        >
          <ArrowLink
            href="#work"
            className="font-mono text-[0.78rem] tracking-[0.14em] uppercase"
          >
            Explore our work
          </ArrowLink>
        </div>
      </Container>

      <Container className="mt-16 lg:mt-24">
        <div
          className="fade-up flex items-center gap-3 text-faint"
          style={{ "--rise-delay": "760ms" } as CSSProperties}
        >
          <span className="h-6 w-px bg-line-strong" aria-hidden="true" />
          <span className="eyebrow">Scroll</span>
        </div>
      </Container>
    </section>
  );
}
