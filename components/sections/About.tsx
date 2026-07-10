import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

const principles = [
  {
    title: "Quality over quantity",
    body: "We take on fewer projects so each one receives the attention it deserves.",
  },
  {
    title: "Timeless over trendy",
    body: "We design for the long run — work that still looks composed in five years.",
  },
  {
    title: "Craft you can feel",
    body: "Down to the last transition. The details you cannot name are the ones you sense.",
  },
  {
    title: "Partners, not vendors",
    body: "We embed with your team and treat your outcomes as our own.",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="relative scroll-mt-24 border-t border-line py-24 lg:py-36"
    >
      <Container>
        <SectionHeader index="(04)" label="About" className="mb-14 lg:mb-20" />

        <div className="max-w-4xl">
          <p className="text-title font-medium text-balance text-white">
            VANTA is a small studio with a single obsession — making digital work that
            looks <span className="serif">timeless</span> instead of trendy. We choose
            fewer projects, and give them <span className="serif">everything.</span>
          </p>
          <p className="mt-8 max-w-2xl text-lead text-muted">
            We believe confidence is quiet. That the best interface is the one you never
            notice. That performance is a feature, accessibility is a baseline, and
            restraint is the hardest discipline of all. Every pixel earns its place.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06} className="h-full">
              <div className="flex h-full flex-col gap-3 bg-void p-8">
                <span className="eyebrow text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-subtitle font-medium text-white">{p.title}</h3>
                <p className="text-[0.95rem] text-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
