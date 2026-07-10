import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * VANTA wordmark drawn as thin monoline strokes — faithful to the brand mark,
 * where each "A" is the signature crossbar-less apex (Λ). Vector, so it stays
 * razor-crisp at any size and can be animated (see Preloader).
 */
export const WORDMARK_VIEWBOX = "-4 0 340 60";

export const WORDMARK_PATHS = [
  "M0 8 L17 52 L34 8", // V
  "M74 52 L91 8 L108 52", // Λ
  "M148 52 L148 8 L182 52 L182 8", // N
  "M222 8 L256 8 M239 8 L239 52", // T
  "M296 52 L313 8 L330 52", // Λ
];

export function Wordmark({
  className,
  strokeWidth = 2.4,
  title = "VANTA",
  style,
}: {
  className?: string;
  strokeWidth?: number;
  title?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      className={cn("block w-auto", className)}
      style={style}
      role="img"
      aria-label={title}
      fill="none"
    >
      {WORDMARK_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
