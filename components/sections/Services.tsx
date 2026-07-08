import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { services } from "@/lib/data/services";

export function Services() {
  return (
    <section
      id="services"
      className="relative scroll-mt-24 border-t border-line py-24 lg:py-36"
    >
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeader index="(02)" label="Services">
                <h2 className="text-title max-w-xs font-medium text-white">
                  Six disciplines, <span className="serif">one</span> standard.
                </h2>
                <p className="mt-6 max-w-xs text-muted">
                  Everything we make is held to the same bar: considered, crafted, and
                  quietly technical.
                </p>
              </SectionHeader>
            </div>
          </div>

          <ul className="lg:col-span-8">
            {services.map((s) => (
              <li key={s.index} className="group border-t border-line last:border-b">
                <div className="grid grid-cols-[auto_1fr_auto] items-start gap-5 py-7 lg:py-9">
                  <span className="eyebrow pt-2 text-faint">{s.index}</span>
                  <div>
                    <h3 className="text-title font-medium text-white transition-transform duration-500 ease-out lg:group-hover:translate-x-2">
                      {s.title}
                    </h3>
                    <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 max-lg:grid-rows-[1fr] max-lg:opacity-100">
                      <div className="overflow-hidden">
                        <p className="max-w-md pt-4 text-muted">{s.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {s.capabilities.map((c) => (
                            <span
                              key={c}
                              className="rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] tracking-wider text-faint uppercase"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="pt-2 text-faint transition-all duration-500 group-hover:text-white lg:group-hover:rotate-45">
                    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                      <path
                        d="M7 1v12M1 7h12"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
