import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/ui/Wordmark";
import { LocalTime } from "@/components/ui/LocalTime";
import { nav, socials, site } from "@/lib/data/site";

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="eyebrow">{title}</p>
      <ul className="flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="link-underline text-[0.95rem] text-muted transition-colors hover:text-white"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-void">
      <Container className="pt-20 pb-10 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="flex flex-col gap-7 lg:col-span-5">
            <a href="#top" aria-label="VANTA — home" className="w-fit text-white">
              <Wordmark className="h-5" strokeWidth={2.6} />
            </a>
            <p className="max-w-xs text-lead text-muted">
              A creative digital studio building work that looks timeless instead of
              trendy.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-underline w-fit text-subtitle text-white"
              data-cursor-label="Email"
            >
              {site.email}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <FooterCol title="Sitemap" links={nav} />
            <FooterCol title="Social" links={socials} />
            <div className="flex flex-col gap-4">
              <p className="eyebrow">Studio</p>
              <p className="text-[0.95rem] text-muted">Worldwide</p>
              <p className="text-[0.95rem] text-muted">
                <LocalTime className="tabular-nums" /> Local
              </p>
              <p className="text-[0.95rem] text-muted">Available for 2026</p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none mt-20 select-none" aria-hidden="true">
          <Wordmark
            className="h-24 w-auto text-white/[0.05] sm:h-32 lg:h-44"
            strokeWidth={1.4}
          />
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="eyebrow">© 2026 VANTA — All rights reserved</p>
          <a href="#top" className="eyebrow link-underline">
            Back to top ↑
          </a>
        </Container>
      </div>
    </footer>
  );
}
