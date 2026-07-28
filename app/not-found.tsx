import ASCIIText from "@/components/ui/ASCIIText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { whatsapp } from "@/lib/data/site";

/**
 * 404 — the ASCII mark sits centred in its own stage, with the message and the
 * two CTAs stacked beneath it. No navbar or footer: this route lives outside
 * the (marketing) group on purpose, so the page stays quiet.
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#050505] px-6 py-20 text-center">
      {/* ASCII 404 — its own bounded, centred stage */}
      <div className="relative h-[30svh] w-full max-w-2xl shrink-0 sm:h-[34svh]">
        <ASCIIText
          text="404"
          asciiFontSize={6}
          textFontSize={210}
          planeBaseHeight={17}
        />
      </div>

      <h1 className="mt-4 text-[clamp(1.9rem,1.2rem+2.6vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.03em] text-balance text-white">
        Page not found
      </h1>

      <p className="mt-5 max-w-[44ch] text-[0.95rem] leading-[1.65] tracking-[-0.005em] text-balance text-white/55 sm:text-base">
        The page you&rsquo;re looking for has drifted into the void.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <MagneticButton href="/" strength={0.5} icon>
          Return Home
        </MagneticButton>

        <MagneticButton
          href={whatsapp.href}
          variant="outline"
          strength={0.5}
          target="_blank"
          rel="noopener noreferrer"
          ariaLabel={`Contact VANTA on WhatsApp at ${whatsapp.number}`}
          icon
        >
          Contact Us
        </MagneticButton>
      </div>
    </main>
  );
}
