"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { origin, type OriginMarkStep } from "@/lib/data/origin";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Wrap the emphasis phrase within a headline in serif italic — copy stays in data. */
function Emphasized({ text, word }: { text: string; word: string }) {
  const idx = text.indexOf(word);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="serif">{word}</span>
      {text.slice(idx + word.length)}
    </>
  );
}

/** Scroll-triggered fade + slide-up. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInViewOnce("0px 0px -12% 0px");
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function MarkStep({ step, order }: { step: OriginMarkStep; order: number }) {
  const { ref, inView } = useInViewOnce("0px 0px -10% 0px");
  const num = String(order + 1).padStart(2, "0");
  return (
    <motion.figure
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      transition={{ duration: 0.6, ease: EASE, delay: order * 0.12 }}
      className="group/step relative z-10 flex flex-col gap-4"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-line bg-secondary">
        <img
          src={step.image}
          alt={step.label}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover/step:scale-[1.04]"
        />
        <span className="eyebrow absolute top-3 left-3 z-10 text-white/70">{num}</span>
      </div>
      <span className="eyebrow text-center">{step.label}</span>
    </motion.figure>
  );
}

export function Origin() {
  const { sectionIndex, sectionLabel, name, mark, founders, vision, atmosphere } =
    origin;

  return (
    <section
      id="origin"
      className="relative scroll-mt-24 border-t border-line py-24 lg:py-36"
    >
      <Container>
        {/* BLOCK 1 — The name */}
        <SectionHeader index={sectionIndex} label={sectionLabel}>
          <h2 className="text-headline max-w-4xl font-medium text-white">
            <MaskReveal as="div">
              <Emphasized text={name.headline} word={name.emphasis} />
            </MaskReveal>
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-muted text-lead">{name.body}</p>
          </Reveal>
        </SectionHeader>

        <div
          className="mt-16 flex items-center justify-center gap-2 lg:mt-24"
          aria-hidden="true"
        >
          <span className="h-1 w-1 rounded-full bg-accent/40" />
          <span className="h-1 w-1 rounded-full bg-accent/40" />
          <span className="h-1 w-1 rounded-full bg-accent/40" />
        </div>

        {/* BLOCK 2 — The mark */}
        <div className="mt-16 lg:mt-24">
          <Reveal>
            <span className="eyebrow text-accent/70">
              {mark.number} — {mark.eyebrow}
            </span>
          </Reveal>
          <div className="relative mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
            {/* Flow connectors sitting in the column gaps (desktop only) */}
            <span
              className="pointer-events-none absolute left-1/3 top-[42%] z-0 hidden -translate-x-1/2 -translate-y-1/2 text-lg text-accent/40 sm:block"
              aria-hidden="true"
            >
              →
            </span>
            <span
              className="pointer-events-none absolute left-2/3 top-[42%] z-0 hidden -translate-x-1/2 -translate-y-1/2 text-lg text-accent/40 sm:block"
              aria-hidden="true"
            >
              →
            </span>
            {mark.steps.map((step, i) => (
              <MarkStep key={step.image} step={step} order={i} />
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="serif mx-auto mt-10 max-w-xl text-center text-muted text-subtitle">
              {mark.caption}
            </p>
          </Reveal>
        </div>

        <div
          className="mt-16 flex items-center justify-center gap-2 lg:mt-24"
          aria-hidden="true"
        >
          <span className="h-1 w-1 rounded-full bg-accent/40" />
          <span className="h-1 w-1 rounded-full bg-accent/40" />
          <span className="h-1 w-1 rounded-full bg-accent/40" />
        </div>

        {/* BLOCK 3 — The founders */}
        <div className="mt-16 lg:mt-24">
          <Reveal>
            <span className="eyebrow text-accent/70">
              {founders.number} — {founders.eyebrow}
            </span>
            <h2 className="text-title mt-6 max-w-3xl font-medium text-white">
              <Emphasized text={founders.headline} word={founders.emphasis} />
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10">
            {founders.members.map((m, i) => (
              <Reveal key={m.url} delay={0.1 + i * 0.1}>
                <div className="flex items-start gap-5 rounded-sm border border-line p-6 transition-colors duration-[400ms] ease-out hover:border-accent/30 hover:bg-white/[0.02]">
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-accent/30 font-mono text-sm tracking-wider text-white/80"
                    aria-hidden="true"
                  >
                    {m.initials}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-subtitle font-medium text-white">{m.name}</h3>
                    <span className="font-mono text-[0.72rem] tracking-wider text-faint uppercase">
                      {m.role}
                    </span>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${founders.linkLabel} — ${m.name}`}
                      className="mt-3 inline-flex items-center gap-2 font-mono text-[0.8rem] tracking-wider text-white uppercase transition-colors hover:text-accent"
                    >
                      <span>{founders.linkLabel} ↗</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <p className="mt-12 max-w-2xl text-muted text-lead">{founders.body}</p>
          </Reveal>
        </div>

        {/* BLOCK 4 — The vision */}
        <div className="relative mt-28 lg:mt-40">
          <img
            src={atmosphere}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[min(70rem,120%)] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.14]"
          />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <MaskReveal as="div" className="mx-auto" duration={1.1}>
              <span className="serif text-headline text-white">{vision}</span>
            </MaskReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
