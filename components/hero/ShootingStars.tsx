import type { CSSProperties } from "react";

type Streak = {
  top: string;
  left: string;
  angle: number;
  length: number;
  delay: string;
  duration: string;
};

/** A rare, slow diagonal streak — meant to be noticed only occasionally, never looped tightly. */
const STREAKS: Streak[] = [
  { top: "14%", left: "20%", angle: -26, length: 120, delay: "-2s", duration: "13s" },
  { top: "26%", left: "62%", angle: -22, length: 100, delay: "-7.5s", duration: "16s" },
  { top: "9%", left: "82%", angle: -30, length: 90, delay: "-11s", duration: "19s" },
];

export function ShootingStars() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {STREAKS.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{ top: s.top, left: s.left, transform: `rotate(${s.angle}deg)` }}
        >
          <span
            className="shooting-star block h-px rounded-full bg-gradient-to-r from-white via-white/50 to-transparent"
            style={
              {
                width: s.length,
                "--shoot-delay": s.delay,
                "--shoot-dur": s.duration,
              } as CSSProperties
            }
          />
        </div>
      ))}
    </div>
  );
}
