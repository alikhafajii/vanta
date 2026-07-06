"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/providers/Cursor";

/** Client shell: reduced-motion-aware motion config + smooth scroll + custom cursor. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <Cursor />
      {children}
    </MotionConfig>
  );
}
