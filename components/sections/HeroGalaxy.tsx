"use client";

import { useEffect, useState } from "react";
import Galaxy from "@/components/Galaxy";

/** Client island for the official React Bits Galaxy background.
 *  Fills its absolutely-positioned wrapper (the hero) and honours
 *  prefers-reduced-motion via the component's official disableAnimation prop
 *  instead of altering the locked visual settings. */
export function HeroGalaxy() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Galaxy
        starSpeed={0.4}
        density={1.5}
        hueShift={0}
        speed={0.1}
        glowIntensity={0.3}
        saturation={0}
        mouseRepulsion={false}
        repulsionStrength={0}
        twinkleIntensity={1}
        rotationSpeed={0.05}
        transparent={false}
        disableAnimation={reducedMotion}
      />
    </div>
  );
}
