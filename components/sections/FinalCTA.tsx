import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { site } from "@/lib/data/site";

export function FinalCTA() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-t border-line py-28 lg:py-44"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div
          className="h-[60vmin] w-[60vmin] rounded-full opacity-[0.12] blur-[130px]"
          style={{ background: "radial-gradient(circle, #7c5cff 0%, transparent 60%)" }}
        />
      </div>
      <Container className="flex flex-col items-center text-center">
        <span className="eyebrow mb-8">(06) — Contact</span>
        <h2 className="text-display font-medium text-white">
          <MaskReveal as="div">Let us make something</MaskReveal>
          <MaskReveal as="div" delay={0.08}>
            that <span className="serif">outlasts</span> the trend.
          </MaskReveal>
        </h2>
        <p className="mt-8 max-w-lg text-lead text-muted">
          Tell us what you are building. We will tell you how we would make it feel
          inevitable.
        </p>
        <div className="mt-12 flex flex-col items-center gap-8">
          <MagneticButton
            href="/start-project"
            strength={0.5}
            className="px-9 py-4 text-base"
          >
            Start a project
          </MagneticButton>
          <a
            href={`mailto:${site.email}`}
            className="link-underline text-subtitle text-white"
            data-cursor-label="Email"
          >
            {site.email}
          </a>
        </div>
      </Container>
    </section>
  );
}
