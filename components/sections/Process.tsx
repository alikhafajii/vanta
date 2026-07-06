"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { processSteps } from "@/lib/data/process";

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 65%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <section
      id="process"
      className="relative scroll-mt-24 border-t border-line py-24 lg:py-36"
    >
      <Container>
        <SectionHeader index="(03)" label="Process" className="mb-16 lg:mb-24">
          <h2 className="text-headline max-w-2xl font-medium text-white">
            <MaskReveal as="div">From blank page</MaskReveal>
            <MaskReveal as="div" delay={0.08}>
              to <span className="serif">launch.</span>
            </MaskReveal>
          </h2>
        </SectionHeader>

        <div ref={ref} className="relative">
          <div className="absolute top-0 left-[7px] h-full w-px bg-line md:left-[87px]">
            <motion.div style={{ scaleY }} className="absolute inset-0 origin-top bg-accent" />
          </div>

          <div className="flex flex-col">
            {processSteps.map((step) => (
              <div
                key={step.index}
                className="relative grid grid-cols-1 gap-3 py-9 pl-8 md:grid-cols-[88px_1fr] md:gap-12 md:pl-0 lg:py-14"
              >
                <span className="absolute top-[2.9rem] left-[7px] h-3 w-3 -translate-x-1/2 rounded-full border border-line-strong bg-void md:left-[87px] lg:top-[3.9rem]" />
                <span className="eyebrow md:pt-3">{step.index}</span>
                <Reveal>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-title font-medium text-white">{step.title}</h3>
                    <p className="max-w-xl text-muted">{step.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {step.deliverables.map((d) => (
                        <span
                          key={d}
                          className="rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] tracking-wider text-faint uppercase"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
