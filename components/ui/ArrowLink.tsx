import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { cn } from "@/lib/utils";

/** Bare text link + underline + arrow — no button chrome. Used for understated CTAs. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const cls = cn(
    "group inline-flex items-center gap-2 text-[0.85rem] tracking-[0.02em] text-white",
    className,
  );
  const content = (
    <>
      <span className="link-underline">{children}</span>
      <ArrowIcon className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls} data-cursor="hover">
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={cls} data-cursor="hover">
      {content}
    </a>
  );
}
