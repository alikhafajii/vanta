export type Service = {
  index: string;
  title: string;
  description: string;
  capabilities: string[];
};

export const services: Service[] = [
  {
    index: "01",
    title: "Web Design",
    description:
      "Premium marketing sites built as brand statements — art-directed, editorial, and engineered to feel inevitable.",
    capabilities: ["Art Direction", "Editorial Layout", "Design Systems", "Prototyping"],
  },
  {
    index: "02",
    title: "Web Applications",
    description:
      "Complex products made to feel effortless — considered interfaces, robust architecture, and interactions that reward attention.",
    capabilities: ["Product Design", "Next.js Engineering", "Dashboards", "Design Systems"],
  },
  {
    index: "03",
    title: "UI / UX",
    description:
      "Interfaces designed around intent — clarity, hierarchy, and rhythm that make the right thing the obvious thing.",
    capabilities: ["Interaction Design", "Wireframing", "Usability", "Accessibility"],
  },
  {
    index: "04",
    title: "Branding",
    description:
      "Identity systems with a point of view — typography, tone, and a visual language that stays composed under pressure.",
    capabilities: ["Naming", "Logo & Wordmark", "Visual Identity", "Guidelines"],
  },
  {
    index: "05",
    title: "Motion Design",
    description:
      "Motion as craft, not decoration — transitions and micro-interactions timed to feel invisible yet unmistakably premium.",
    capabilities: ["Interface Motion", "Scroll Choreography", "Prototyping", "3D & WebGL"],
  },
  {
    index: "06",
    title: "Performance",
    description:
      "Speed as a feature — lean, accessible builds that score in the high nineties and load like they weigh nothing.",
    capabilities: ["Core Web Vitals", "SEO", "Accessibility", "Optimization"],
  },
];
