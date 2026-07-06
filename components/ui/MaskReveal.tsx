"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useInViewOnce } from "@/hooks/useInViewOnce";

/**
 * Masked line reveal: clip the overflow, slide the inner line up into place.
 * The observer is attached to the (unclipped) mask container — observing the
 * translated inner element fails, because its overflow-hidden parent clips it
 * out of view and IntersectionObserver (which respects ancestor clipping)
 * would never fire.
 */
export function MaskReveal({
  children,
  delay = 0,
  duration = 1,
  className,
  as = "span",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "span" | "div";
}) {
  const { ref, inView } = useInViewOnce("0px 0px -8% 0px");
  const maskClass = cn("block overflow-hidden", className);
  const inner = (
    <motion.span
      className="block will-change-transform"
      initial={{ y: "115%" }}
      animate={inView ? { y: 0 } : { y: "115%" }}
      transition={{ duration, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.span>
  );

  return as === "div" ? (
    <div ref={ref} className={maskClass}>
      {inner}
    </div>
  ) : (
    <span ref={ref} className={maskClass}>
      {inner}
    </span>
  );
}
