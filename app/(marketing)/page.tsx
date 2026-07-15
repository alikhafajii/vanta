import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Origin } from "@/components/sections/Origin";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Services />
      <About />
      <Origin />
      <FinalCTA />
    </>
  );
}
