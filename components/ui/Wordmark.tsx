import { cn } from "@/lib/utils";

/**
 * VANTA wordmark drawn as thin monoline strokes — faithful to the brand mark,
 * where each "A" is the signature crossbar-less apex (Λ). Vector, so it stays
 * razor-crisp at any size and can be animated (see Preloader).
 */
export const WORDMARK_VIEWBOX = "-4 0 266 60";

export const WORDMARK_PATHS = [
  "M0 8 L17 52 L34 8", // V
  "M56 52 L73 8 L90 52", // Λ
  "M112 52 L112 8 L146 52 L146 8", // N
  "M168 8 L202 8 M185 8 L185 52", // T
  "M224 52 L241 8 L258 52", // Λ
];

export function Wordmark({
  className,
  strokeWidth = 2.4,
  title = "VANTA",
}: {
  className?: string;
  strokeWidth?: number;
  title?: string;
}) {
  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      className={cn("block w-auto", className)}
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
