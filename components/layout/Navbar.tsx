"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { nav, socials } from "@/lib/data/site";
import { Logo } from "@/components/ui/Logo";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { cn } from "@/lib/utils";

const PRIMARY_NAV_LABELS = ["Work", "Services", "About", "Origin"];
const primaryNav = nav.filter((item) => PRIMARY_NAV_LABELS.includes(item.label));

export function Navbar() {
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLgUp, setIsLgUp] = useState(false);
  const isLgUpRef = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      setIsLgUp(mql.matches);
      isLgUpRef.current = mql.matches;
    };
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 32);
    setHidden(y > lastY.current && y > 420 && !open && isLgUpRef.current);
    lastY.current = y;
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Keep header visible on mobile; hide-on-scroll for desktop lg+.
  const headerHidden = isLgUp && hidden;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: headerHidden ? "-115%" : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-white/10 bg-black/70 backdrop-blur-2xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between px-6 sm:px-10 lg:px-16">
          {/* Logo */}
          <a
            href="#top"
            aria-label="VANTA — home"
            className="relative z-10 flex items-center transition-opacity duration-300 hover:opacity-85"
          >
            <Logo />
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden items-center gap-10 lg:flex">
            {primaryNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="link-underline font-mono text-[0.7rem] tracking-[0.18em] text-white/70 uppercase transition-colors duration-300 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center gap-5">
            <div className="hidden sm:block">
              <Link
                href="/start-project"
                className="group relative inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/6 px-5 py-2 text-[0.72rem] font-medium tracking-[0.14em] text-white uppercase backdrop-blur-md transition-[background-color,border-color,color,box-shadow] duration-300 hover:border-white hover:bg-white hover:text-black hover:shadow-[0_0_28px_-6px_rgba(255,255,255,0.35)]"
                data-cursor="hover"
              >
                <span>Start Project</span>
                <ArrowIcon className="h-3 w-3 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/6 backdrop-blur-md transition-colors duration-300 hover:border-white/40 lg:hidden"
            >
              <span className="flex flex-col gap-[5px]">
                <span
                  className={cn(
                    "h-px w-5 bg-white transition-all duration-300",
                    open && "translate-y-[3px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "h-px w-5 bg-white transition-all duration-300",
                    open && "-translate-y-[3px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-black/95 px-8 pt-28 pb-12 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline justify-between border-b border-white/10 py-5 text-[2.2rem] font-medium tracking-tight text-white transition-colors hover:text-white/80"
                >
                  <span>{item.label}</span>
                  <span className="eyebrow text-white/40">{item.index}</span>
                </motion.a>
              ))}
            </nav>

            <div className="flex items-center justify-between pt-8">
              <div className="flex gap-6">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="font-mono text-xs tracking-wider text-white/50 transition-colors hover:text-white uppercase"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
              <Link
                href="/start-project"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/30 bg-white px-5 py-2 text-xs font-medium tracking-wider text-black uppercase"
              >
                Start Project
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
