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
      <div className="flex items-center gap-5">
        <span className="eyebrow text-white/80">{index}</span>
        <span className="hairline w-16 shrink-0 sm:w-24" />
        <span className="eyebrow">{label}</span>
      </div>
      {children}
    </div>
  );
}
