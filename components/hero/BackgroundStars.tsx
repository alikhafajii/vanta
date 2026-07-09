import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const STAR_COUNT = 90;

/** Deterministic PRNG so the star field is identical on server and client renders. */
function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkle: boolean;
  glow: boolean;
  delay: number;
  duration: number;
};

const STARS: Star[] = (() => {
  const rand = mulberry32(1337);
  return Array.from({ length: STAR_COUNT }, () => {
    const bright = rand() > 0.88;
    return {
      x: rand() * 100,
      y: rand() * 70, // sky band — stays clear of the ocean/foreground
      size: bright ? 1.6 + rand() * 1 : 0.6 + rand() * 0.7,
      opacity: bright ? 0.55 + rand() * 0.35 : 0.1 + rand() * 0.25,
      twinkle: rand() > 0.68,
      glow: bright && rand() > 0.55,
      delay: -(rand() * 14),
      duration: 5 + rand() * 9,
    };
  });
})();

/** Sparse, mostly-static star field with a handful of soft-glow, slow-twinkle points. */
export function BackgroundStars() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {STARS.map((s, i) => (
        <span
          key={i}
          className={cn("absolute rounded-full bg-white", s.twinkle && "star-twinkle")}
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              boxShadow: s.glow ? `0 0 ${s.size * 3}px rgba(255,255,255,0.75)` : undefined,
              "--star-o": s.opacity,
              "--star-delay": `${s.delay}s`,
              "--star-dur": `${s.duration}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
