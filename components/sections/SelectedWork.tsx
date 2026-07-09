import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { ScrollSignal } from "@/components/ui/ScrollSignal";
import { WorkPlate } from "@/components/sections/WorkPlate";
import { projects } from "@/lib/data/projects";

export function SelectedWork() {
  return (
    <section
      id="work"
      className="relative scroll-mt-24 pt-10 pb-16 sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-36"
    >
      <Container>
        <ScrollSignal className="mb-10 h-14 sm:h-16 lg:h-20" />

        <SectionHeader index="(01)" label="Selected Work" className="mb-12 lg:mb-24">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="text-headline max-w-3xl font-medium text-white">
              <MaskReveal as="div">Work we are</MaskReveal>
              <MaskReveal as="div" delay={0.08}>
                proud to <span className="serif">sign.</span>
              </MaskReveal>
            </h2>
            <p className="max-w-sm text-muted">
              A small, deliberate portfolio. Fewer projects, more attention — each one
              built to outlast the trend cycle.
            </p>
          </div>
        </SectionHeader>

        <div className="flex flex-col gap-16 sm:gap-20 lg:gap-32">
          {projects.map((p, i) => (
            <WorkPlate key={p.slug} project={p} order={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

