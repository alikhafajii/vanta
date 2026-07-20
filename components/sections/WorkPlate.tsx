"use client";

import { useCallback, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Project } from "@/lib/data/projects";
import { cn } from "@/lib/utils";
import { useInViewOnce } from "@/hooks/useInViewOnce";

export function WorkPlate({ project, order }: { project: Project; order: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const { ref: inViewRef, inView } = useInViewOnce("0px 0px -12% 0px");
  // Merge the parallax target ref (needs a RefObject) with the in-view callback ref.
  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      ref.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );
  const reverse = order % 2 === 1;
  const num = String(order + 1).padStart(2, "0");

  return (
    <motion.article
      ref={setRefs}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: order * 0.09 }}
      className="group grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14"
    >
      <a
        href={project.url || "#contact"}
        target={project.url ? "_blank" : undefined}
        rel={project.url ? "noopener noreferrer" : undefined}
        aria-label={`View the ${project.title} project`}
        data-cursor-label="View"
        className={cn(
          "relative block overflow-hidden rounded-sm lg:col-span-7",
          reverse && "lg:order-2",
        )}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/10]">
          <div className="absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]">
            <motion.div style={{ y }} className="absolute inset-[-8%]">
              {project.cover.image ? (
                <div className="relative h-full w-full">
                  <div
                    className="absolute inset-0 z-0"
                    style={{
                      background: `linear-gradient(145deg, ${project.cover.from}, ${project.cover.to})`,
                    }}
                  />
                  <img
                    src={project.cover.image}
                    alt={project.title}
                    className="relative z-10 h-full w-full object-cover opacity-100 transition-transform duration-[900ms]"
                  />
                </div>
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background: `linear-gradient(145deg, ${project.cover.from}, ${project.cover.to})`,
                  }}
                />
              )}
            </motion.div>
            {project.cover.accent ? (
              <div
                className="absolute inset-0 z-20"
                style={{
                  background:
                    "radial-gradient(120% 90% at 18% 12%, rgba(124,92,255,0.30), transparent 55%)",
                }}
              />
            ) : null}
          </div>
          <div className="absolute inset-0 z-30 rounded-sm border border-white/10" />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/3 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden="true"
          />
          <span
            className="eyebrow absolute top-4 left-4 z-30 text-white/70"
            aria-hidden="true"
          >
            {num}
          </span>
          <span
            className="eyebrow absolute top-4 right-4 z-30 text-white/70"
            aria-hidden="true"
          >
            {project.year}
          </span>
          <div
            className="absolute bottom-4 left-4 z-30 flex translate-y-2 items-center gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
            aria-hidden="true"
          >
            <span className="eyebrow text-white">View project</span>
            <span className="text-white">↗</span>
          </div>
        </div>
      </a>

      <div className={cn("flex flex-col gap-5 lg:col-span-5 w-full min-w-0", reverse && "lg:order-1")}>
        <div className="flex items-center gap-3">
          <span className="relative flex h-1.5 w-1.5 items-center justify-center">
            {project.status === "live" && (
              <span
                className="live-dot-pulse absolute inline-flex h-full w-full rounded-full bg-accent"
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                "relative h-1.5 w-1.5 rounded-full",
                project.status === "live"
                  ? "bg-accent shadow-[0_0_6px_rgba(124,92,255,0.85)]"
                  : "bg-faint",
              )}
            />
          </span>
          <span className="eyebrow">
            {project.status === "live" ? "Live" : "In progress"} · {project.discipline}
          </span>
        </div>
        <h3 className="text-headline font-medium text-white">{project.title}</h3>
        <p className="max-w-full text-muted text-[0.95rem] leading-relaxed">{project.summary}</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {project.services.map((s) => (
            <span
              key={s}
              className="rounded-full border border-line px-3 py-1 font-mono text-[0.7rem] tracking-wider text-faint uppercase"
            >
              {s}
            </span>
          ))}
        </div>

        {project.url && (
          <div className="mt-4">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-2 font-mono text-[0.8rem] tracking-wider text-white uppercase transition-colors hover:text-accent"
            >
              <span>↗ View Project</span>
              <span className="text-accent group-hover/btn:translate-x-0.5 transition-transform duration-300">♦</span>
            </a>
            <div className="mt-4 h-px w-full bg-line" />
          </div>
        )}

        {project.metrics && project.metrics.length > 0 && (
          <>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-4">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className="font-sans text-[clamp(1.2rem,4vw,1.4rem)] font-light text-white tracking-tight leading-none tabular-nums">{m.value}</span>
                  <span className="text-[0.6rem] font-mono tracking-wider text-faint uppercase leading-tight">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-1 text-[0.65rem] text-faint">Client-reported results.</p>
          </>
        )}
      </div>
    </motion.article>
  );
}
