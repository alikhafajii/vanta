"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A thin line with a soft light traveling down it — reads as a continuation
 * of the hero's own scroll line, giving the hero-to-section gap some motion
 * instead of sitting as dead space.
 */
export function ScrollSignal({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn("relative w-px overflow-hidden bg-line", className)}
      aria-hidden="true"
    >
      {!reduce && (
        <motion.span
          className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-white/80 to-transparent"
          animate={{ y: ["-100%", "220%"] }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}
