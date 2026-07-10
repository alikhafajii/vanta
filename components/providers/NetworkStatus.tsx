"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type Status = "offline" | "online" | null;

const HIDE_AFTER_ONLINE_MS = 4000;

/** Fixed bottom-right toast: red while offline, briefly green when connectivity returns. */
export function NetworkStatus() {
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;

    const goOffline = () => {
      clearTimeout(hideTimer);
      setStatus("offline");
    };
    const goOnline = () => {
      setStatus((prev) => (prev === "offline" ? "online" : prev));
      hideTimer = setTimeout(() => setStatus(null), HIDE_AFTER_ONLINE_MS);
    };

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
      clearTimeout(hideTimer);
    };
  }, []);

  const isOffline = status === "offline";

  return (
    <div className="pointer-events-none fixed right-5 bottom-5 z-[100] sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {status ? (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-line bg-void/90 px-4 py-2.5 backdrop-blur-xl"
            role="status"
            aria-live="polite"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                  isOffline ? "bg-red-500" : "bg-emerald-500",
                )}
              />
              <span
                className={cn(
                  "relative inline-flex h-2 w-2 rounded-full",
                  isOffline ? "bg-red-500" : "bg-emerald-500",
                )}
              />
            </span>
            <span className="text-[0.85rem] text-white">
              {isOffline ? "You're offline" : "Back online"}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
