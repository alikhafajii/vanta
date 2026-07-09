"use client";

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { cn } from "@/lib/utils";

/** Framer-Motion-wrapped Next Link for internal, same-tab client navigation. */
const MotionLink = motion.create(Link);

type Variant = "solid" | "outline" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2.5 rounded-full font-medium tracking-tight transition-[color,background-color,border-color,box-shadow] duration-300 select-none px-7 py-3.5 text-[0.95rem]";

const variants: Record<Variant, string> = {
  solid:
    "bg-white text-void shadow-[0_0_0_rgba(255,255,255,0)] hover:bg-white/90 hover:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.4)]",
  outline:
    "border border-line-strong text-white hover:border-white/60 hover:bg-white/[0.04]",
  ghost: "text-white hover:bg-white/[0.05]",
};

const buttonArrowCls =
  "h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5";

const spring = { stiffness: 220, damping: 18, mass: 0.4 };

/** Magnetic CTA. Renders an anchor when href is given, otherwise a button. */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "solid",
  strength = 0.35,
  className,
  ariaLabel,
  icon = false,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  strength?: number;
  className?: string;
  ariaLabel?: string;
  icon?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const cls = cn(base, variants[variant], className);

  if (href) {
    const commonProps = {
      ref: (n: HTMLElement | null) => {
        ref.current = n;
      },
      "aria-label": ariaLabel,
      onPointerMove: onMove,
      onPointerLeave: reset,
      onClick,
      style: { x: sx, y: sy },
      className: cls,
      "data-cursor": "hover",
    };

    // Internal routes use Next Link (same-tab client navigation); external
    // links and mailto/anchor targets fall back to a plain anchor.
    if (href.startsWith("/")) {
      return (
        <MotionLink href={href} {...commonProps}>
          {children}
          {icon ? <ArrowIcon className={buttonArrowCls} /> : null}
        </MotionLink>
      );
    }

    return (
      <motion.a href={href} {...commonProps}>
        {children}
        {icon ? <ArrowIcon className={buttonArrowCls} /> : null}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      ref={(n) => {
        ref.current = n;
      }}
      aria-label={ariaLabel}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      className={cls}
      data-cursor="hover"
    >
      {children}
      {icon ? <ArrowIcon className={buttonArrowCls} /> : null}
    </motion.button>
  );
}
