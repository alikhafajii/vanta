export type ProcessStep = {
  index: string;
  title: string;
  description: string;
  deliverables: string[];
};

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Discover",
    description:
      "We interrogate the brief — audience, ambition, and the tension worth designing around. No assumptions survive this stage.",
    deliverables: ["Workshops", "Research", "Audit", "Creative Brief"],
  },
  {
    index: "02",
    title: "Strategy",
    description:
      "We shape the narrative and structure — positioning, sitemap, and the single idea the whole experience will orbit.",
    deliverables: ["Positioning", "Sitemap", "Content Strategy", "Direction"],
  },
  {
    index: "03",
    title: "Design",
    description:
      "We design in high fidelity from day one — typography, motion, and every state — until it feels inevitable rather than invented.",
    deliverables: ["Art Direction", "UI Design", "Prototypes", "Design System"],
  },
  {
    index: "04",
    title: "Development",
    description:
      "We build it properly — accessible, performant, type-safe, and maintainable. Craft you can't see is still craft.",
    deliverables: ["Next.js Build", "CMS", "Motion", "QA"],
  },
  {
    index: "05",
    title: "Launch",
    description:
      "We ship with intent and stay close — measuring, refining, and handing over something built to last.",
    deliverables: ["Deployment", "Analytics", "Handover", "Iteration"],
  },
];
