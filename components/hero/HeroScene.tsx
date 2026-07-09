import { BackgroundStars } from "@/components/hero/BackgroundStars";
import { ShootingStars } from "@/components/hero/ShootingStars";

const HERO_IMAGE = "/images/projects/hero-eclipse.jpg";

/**
 * Hero backdrop: a single photographic plate (the eclipse/horizon scene) with
 * a lightweight animated star layer composited on top in code.
 *
 * Text sits in the left column on desktop but spans full width on mobile, so
 * the plate's focal point and the legibility gradient both need to change
 * shape at the breakpoint rather than just scale.
 */
export function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-[length:auto_200%] bg-[position:68%_93%] sm:bg-cover sm:bg-[position:70%_60%]"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />

      {/* mobile: content is bottom-packed, so keep the plate's glow in the empty
          upper band and darken heavily from ~1/3 down where the text starts */}
      <div
        className="absolute inset-0 sm:hidden"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, transparent 26%, rgba(0,0,0,0.85) 40%, var(--color-void) 54%)",
        }}
      />

      {/* sm+: text lives in the left column, so fade the plate in left-to-right */}
      <div
        className="absolute inset-0 hidden sm:block"
        style={{
          background:
            "linear-gradient(100deg, var(--color-void) 0%, rgba(0,0,0,0.82) 24%, rgba(0,0,0,0.3) 45%, transparent 62%)",
        }}
      />

      <BackgroundStars />
      <ShootingStars />
    </div>
  );
}
