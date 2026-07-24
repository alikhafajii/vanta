"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { services, type Service } from "@/lib/data/services";
import { useInViewOnce } from "@/hooks/useInViewOnce";

const EASE = [0.22, 1, 0.36, 1] as const;

function ServiceRow({
  service,
  order,
  onHover,
}: {
  service: Service;
  order: number;
  onHover: (index: number | null) => void;
}) {
  const { ref, inView } = useInViewOnce("0px 0px -10% 0px");

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.55, ease: EASE, delay: order * 0.06 }}
      onMouseEnter={() => onHover(order)}
      className="group relative border-t border-line transition-colors duration-[400ms] ease-out last:border-b lg:group-hover:border-accent/30"
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-5 py-7 transition-colors duration-[400ms] ease-out lg:py-9 lg:group-hover:bg-white/[0.015]">
        <span className="eyebrow pt-2 text-faint transition-colors duration-300 ease-out lg:group-hover:text-accent/60">
          {service.index}
        </span>
        <div>
          <h3 className="text-title font-medium text-white transition-transform duration-500 ease-out lg:group-hover:translate-x-2">
            {service.title}
          </h3>
          <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 max-lg:grid-rows-[1fr] max-lg:opacity-100">
            <div className="overflow-hidden">
              <p className="max-w-md pt-4 text-muted">{service.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {service.capabilities.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] tracking-wider text-faint uppercase"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <span className="pt-2 text-faint transition-all duration-300 ease-out lg:group-hover:rotate-45 lg:group-hover:text-accent/70">
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <path
              d="M7 1v12M1 7h12"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
    </motion.li>
  );
}

export function Services() {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered !== null ? services[hovered] : null;

  return (
    <section
      id="services"
      className="relative scroll-mt-24 border-t border-line py-24 lg:py-36"
    >
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeader index="(02)" label="Services">
                <h2 className="text-title max-w-xs font-medium text-white">
                  Five disciplines, <span className="serif">one</span> standard.
                </h2>
                <p className="mt-6 max-w-xs text-muted">
                  Everything we make is held to the same bar: considered, crafted, and
                  quietly technical.
                </p>
              </SectionHeader>

              {/* Reactive index — mirrors the currently-hovered discipline (desktop only) */}
              <div className="mt-10 hidden h-5 lg:block" aria-hidden="true">
                <AnimatePresence>
                  {active && (
                    <motion.span
                      key={active.index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="eyebrow block text-faint/70"
                    >
                      {active.index}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <ul className="lg:col-span-8" onMouseLeave={() => setHovered(null)}>
            {services.map((s, i) => (
              <ServiceRow key={s.index} service={s} order={i} onHover={setHovered} />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
