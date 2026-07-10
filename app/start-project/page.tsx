import type { Metadata } from "next";
import { StartExperience } from "@/components/start/StartExperience";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Tell us what you're building and we'll prepare a tailored proposal.",
  robots: { index: false, follow: false },
};

export default function StartPage() {
  return <StartExperience />;
}
