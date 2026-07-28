"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { NetworkStatus } from "@/components/providers/NetworkStatus";
import { Preloader } from "@/components/providers/Preloader";

/** Client shell: reduced-motion-aware motion config + smooth scroll. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <Preloader />
      <SmoothScroll />
      <NetworkStatus />
      {children}
    </MotionConfig>
  );
}
