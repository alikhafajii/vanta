"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import FlickerSpinner from "@/components/ui/FlickerSpinner";

const MIN_VISIBLE_MS = 1000;
const MAX_VISIBLE_MS = 3000;

/**
 * Full-screen curtain shown while the page (images, fonts, etc.) finishes
 * loading. Waits for window "load" but is clamped to 1–3s either way, so a
 * slow connection never blocks longer and a fast one never just flashes.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = Date.now();
    let settled = false;
    let hideTimer: ReturnType<typeof setTimeout>;

    const finish = () => {
      if (settled) return;
      settled = true;
      const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - start));
      hideTimer = setTimeout(() => setVisible(false), remaining);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    const maxTimer = setTimeout(finish, MAX_VISIBLE_MS);

    return () => {
      window.removeEventListener("load", finish);
      clearTimeout(maxTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = visible ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-void"
          aria-hidden="true"
        >
          <FlickerSpinner size={24} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
