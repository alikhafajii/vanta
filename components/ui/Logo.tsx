import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/ui/Wordmark";

/** Navbar lockup: the wide-tracked wordmark on its own — no symbol, no glow. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Wordmark className="h-[22px] w-auto" strokeWidth={3.4} title="VANTA" />
    </span>
  );
}
