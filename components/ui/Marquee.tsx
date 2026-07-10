import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

function ApexSeparator() {
  return (
    <svg
      viewBox="0 0 16 12"
      className="mx-6 h-2 w-auto shrink-0 text-accent md:mx-10"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 11 L8 1 L15 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** CSS-driven infinite marquee. Duplicated track = seamless loop; pauses on hover. */
export function Marquee({
  items,
  duration = 46,
  className,
}: {
  items: string[];
  duration?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "marquee edge-fade-x relative flex w-full overflow-hidden select-none",
        className,
      )}
    >
      <div
        className="marquee-track"
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1 ? "true" : undefined}
          >
            {items.map((item, i) => (
              <div key={i} className="flex items-center">
                <span className="text-muted">{item}</span>
                <ApexSeparator />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
