import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { articles } from "@/lib/data/journal";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function Journal() {
  return (
    <section
      id="journal"
      className="relative scroll-mt-24 border-t border-line py-24 lg:py-36"
    >
      <Container>
        <SectionHeader index="(05)" label="Journal" className="mb-14 lg:mb-20">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-headline max-w-xl font-medium text-white">
              Notes on <span className="serif">craft.</span>
            </h2>
            <a
              href="#"
              className="link-underline hidden shrink-0 text-muted transition-colors hover:text-white sm:block"
            >
              All articles ↗
            </a>
          </div>
        </SectionHeader>

        <ul>
          {articles.map((a) => (
            <li key={a.slug} className="group border-t border-line last:border-b">
              <a
                href="#"
                data-cursor-label="Read"
                className="grid grid-cols-1 items-baseline gap-3 py-8 md:grid-cols-[140px_1fr_auto] md:gap-8 lg:py-10"
              >
                <span className="eyebrow text-accent">{a.category}</span>
                <div className="flex flex-col gap-3">
                  <h3 className="text-title font-medium text-white transition-transform duration-500 ease-out md:group-hover:translate-x-2">
                    {a.title}
                  </h3>
                  <p className="max-w-xl text-muted">{a.excerpt}</p>
                </div>
                <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-1">
                  <span className="font-mono text-[0.72rem] text-faint">
                    {formatDate(a.date)}
                  </span>
                  <span className="font-mono text-[0.72rem] text-faint">
                    {a.readingTime}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
