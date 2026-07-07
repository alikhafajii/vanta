"use client";

import type { CSSProperties } from "react";
import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Hero() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const gx = useSpring(mx, { stiffness: 55, damping: 22 });
  const gy = useSpring(my, { stiffness: 55, damping: 22 });
  const glowX = useTransform(gx, (v) => v * 48);
  const glowY = useTransform(gy, (v) => v * 48);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-32 pb-10"
    >
      {/* Artistic, restrained background: one soft ultraviolet field + a faint grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div style={{ x: glowX, y: glowY }} className="h-[82vmin] w-[82vmin]">
            <div
              className="h-full w-full rounded-full opacity-[0.16] blur-[120px]"
              style={{ background: "radial-gradient(circle, #7c5cff 0%, transparent 60%)" }}
            />
          </motion.div>
        </div>
        <div
          className="absolute inset-0 opacity-40"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse at center, #000 20%, transparent 72%)",
            maskImage: "radial-gradient(ellipse at center, #000 20%, transparent 72%)",
          }}
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.028) 1px, transparent 1px)",
              backgroundSize: "66px 66px",
            }}
          />
        </div>
      </div>

      <Container>
        <div
          className="fade-up mb-9 flex items-center gap-4"
          style={{ "--rise-delay": "40ms" } as CSSProperties}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="eyebrow">Creative Digital Studio — Est. 2025</span>
        </div>

        <h1 className="text-display font-medium text-white">
          <span className="block overflow-hidden">
            <span className="rise-line" style={{ "--rise-delay": "80ms" } as CSSProperties}>
              We build digital
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="rise-line" style={{ "--rise-delay": "170ms" } as CSSProperties}>
              products that feel
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="rise-line" style={{ "--rise-delay": "260ms" } as CSSProperties}>
              inevitable, <span className="serif text-white/85">not made.</span>
            </span>
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-10 lg:mt-14 lg:flex-row lg:items-end lg:justify-between">
          <p
            className="fade-up max-w-md text-lead text-muted"
            style={{ "--rise-delay": "520ms" } as CSSProperties}
          >
            A studio designing premium websites, brands and interfaces for companies
            that refuse to look ordinary.
          </p>
          <div
            className="fade-up flex flex-wrap items-center gap-3"
            style={{ "--rise-delay": "620ms" } as CSSProperties}
          >
            <MagneticButton href="/start-project">Start a project</MagneticButton>
            <MagneticButton href="#work" variant="outline">
              Selected work
            </MagneticButton>
          </div>
        </div>
      </Container>

      <Container className="mt-16 lg:mt-24">
        <div
          className="fade-up flex items-center justify-between border-t border-line pt-6"
          style={{ "--rise-delay": "720ms" } as CSSProperties}
        >
          <div className="flex items-center gap-3 text-faint">
            <motion.svg
              viewBox="0 0 16 10"
              className="h-2.5 w-4"
              fill="none"
              aria-hidden="true"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                d="M1 1 L8 8 L15 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
            <span className="eyebrow">Scroll</span>
          </div>
          <span className="eyebrow hidden sm:block">Worldwide · Available for 2026</span>
        </div>
      </Container>
    </section>
  );
}
