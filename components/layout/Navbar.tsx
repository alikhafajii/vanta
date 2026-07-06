"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { nav, socials } from "@/lib/data/site";
import { Wordmark } from "@/components/ui/Wordmark";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 32);
    setHidden(y > lastY.current && y > 420 && !open);
    lastY.current = y;
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-115%" : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled
            ? "border-b border-line bg-void/70 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[1680px] items-center justify-between px-5 sm:px-8 lg:px-14 xl:px-20">
          <a href="#top" aria-label="VANTA — home" className="relative z-10 text-white">
            <Wordmark className="h-3.5" strokeWidth={3} />
          </a>

          <nav className="hidden items-center gap-9 lg:flex">
            {nav.slice(0, 5).map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="link-underline text-[0.9rem] text-muted transition-colors duration-300 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <MagneticButton href="#contact" className="px-5 py-2.5 text-[0.85rem]">
                Start Project
              </MagneticButton>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative z-10 flex h-10 w-10 items-center justify-center lg:hidden"
            >
              <span className="flex flex-col gap-[5px]">
                <span
                  className={cn(
                    "h-px w-6 bg-white transition-all duration-300",
                    open && "translate-y-[3px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "h-px w-6 bg-white transition-all duration-300",
                    open && "-translate-y-[3px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-void/95 px-6 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline gap-4 border-b border-line py-4 text-[2rem] font-medium tracking-tight text-white"
                >
                  <span className="eyebrow text-faint">{item.index}</span>
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="text-sm text-muted transition-colors hover:text-white"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
