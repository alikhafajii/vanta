import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/ui/Marquee";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Journal } from "@/components/sections/Journal";
import { FinalCTA } from "@/components/sections/FinalCTA";

const marqueeItems = [
  "Branding",
  "Web Design",
  "Motion",
  "UI / UX",
  "Web Applications",
  "Performance",
  "Art Direction",
  "Design Systems",
];

export default function Home() {
  return (
    <>
      <Hero />
      <div className="border-y border-line bg-secondary/30 py-7 text-[clamp(1.4rem,2.6vw,2.4rem)] font-medium tracking-tight lg:py-9">
        <Marquee items={marqueeItems} />
      </div>
      <SelectedWork />
      <Services />
      <Process />
      <About />
      <Journal />
      <FinalCTA />
    </>
  );
}
