"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { HeroStar } from "@/lib/generateHeroStars";

/** Drives the hero's ambient star pulse with anime.js instead of CSS keyframes.
 *  Positions/shapes are static server-rendered markup (no layout shift); only
 *  the opacity/scale pulse is JS-driven, so it's a small, isolated client
 *  island rather than pulling the whole Hero into "use client". */
export function HeroStarField({ stars }: { stars: HeroStar[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".hero-star"));

    if (reduceMotion) {
      els.forEach((el, i) => {
        el.style.opacity = String(stars[i]?.peak ?? 0.7);
      });
      return;
    }

    let animations: ReturnType<typeof import("animejs").animate>[] = [];
    let cancelled = false;

    import("animejs").then(({ animate }) => {
      if (cancelled) return;
      animations = els.map((el, i) => {
        const star = stars[i];
        const floor = (star?.peak ?? 0.7) * 0.45;
        return animate(el, {
          opacity: [floor, star?.peak ?? 0.7],
          scale: [0.7, 1],
          duration: (star?.duration ?? 3.5) * 1000,
          delay: (star?.delay ?? 0) * 1000,
          loop: true,
          alternate: true,
          ease: "inOutSine",
        });
      });
    });

    return () => {
      cancelled = true;
      animations.forEach((a) => a.revert());
    };
  }, [stars]);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className={`hero-star hero-star--${star.shape}`}
          style={
            {
              left: `${star.left}%`,
              top: `${star.top}%`,
              opacity: star.peak,
              "--star-size": `${star.size}px`,
            } as CSSProperties
          }
        >
          {star.shape === "sparkle" ? <span className="hero-star-spike" /> : null}
        </span>
      ))}
    </div>
  );
}
