import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/ui/Wordmark";

/** Navbar lockup: the real eclipse mark + a wide-tracked wordmark. No added glow. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <img
        src="/images/projects/logo-icon.png"
        alt=""
        className="h-7 w-7 shrink-0 object-contain"
      />
      <Wordmark className="h-[22px] w-auto" strokeWidth={3.4} title="VANTA" />
    </span>
  );
}
