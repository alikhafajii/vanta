import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Editorial section label: mono index + hairline + label, with optional lead-in. */
export function SectionHeader({
  index,
  label,
  className,
  children,
}: {
  index: string;
  label: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-5">
        <span className="eyebrow text-white/80">{index}</span>
        <span className="hairline" />
        <span className="eyebrow text-right">{label}</span>
      </div>
      {children}
    </div>
  );
}
