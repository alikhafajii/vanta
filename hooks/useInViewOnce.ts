"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Reveal-once-when-scrolled-into-view via a native IntersectionObserver.
 * (motion's `whileInView` observer proved unreliable under React 19 / Next 16,
 * so we drive motion's `animate` off this instead.)
 * Returns a callback ref (assignable to any element) and an `inView` flag.
 */
export function useInViewOnce(rootMargin = "0px 0px -12% 0px") {
  const [inView, setInView] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      observer.current?.disconnect();
      if (!node) return;
      if (typeof IntersectionObserver === "undefined") {
        setInView(true);
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setInView(true);
            io.disconnect();
          }
        },
        { rootMargin, threshold: 0.01 },
      );
      io.observe(node);
      observer.current = io;
    },
    [rootMargin],
  );

  useEffect(() => () => observer.current?.disconnect(), []);

  return { ref, inView };
}
