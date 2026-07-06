import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Page gutter + max width. Whitespace does the heavy lifting. */
export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-14 xl:px-20",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
