import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/ui/Logo";

/**
 * Marketing shell — the public site chrome (nav + footer) wraps every route in
 * this group. The immersive /start experience lives outside the group and so
 * renders without any of it.
 */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="fixed top-0 left-0 z-50 px-5 py-6 sm:px-8 lg:px-10">
        <a href="#top" aria-label="VANTA — home" className="text-white">
          <Logo />
        </a>
      </header>
      <main>{children}</main>
      <Footer />
    </>
  );
}
