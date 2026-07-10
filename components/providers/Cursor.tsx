"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/** Blend custom cursor: instant dot + lagged ring with a contextual label. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 40, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 380, damping: 40, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.body.dataset.cursor = "on";

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        "[data-cursor],a,button,input,textarea,[role=button]",
      ) as HTMLElement | null;
      if (!el) {
        setHovering(false);
        setLabel("");
        return;
      }
      setLabel(el.getAttribute("data-cursor-label") ?? "");
      setHovering(true);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      delete document.body.dataset.cursor;
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
        style={{ x, y }}
      />
      <motion.div
        className="absolute left-0 top-0 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: label ? 96 : hovering ? 48 : 30,
          height: label ? 96 : hovering ? 48 : 30,
          backgroundColor: label ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
          borderColor: label ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.6)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        {label ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-void">
            {label}
          </span>
        ) : null}
      </motion.div>
    </div>
  );
}
