export type Project = {
  slug: string;
  title: string;
  client: string;
  discipline: string;
  year: string;
  services: string[];
  summary: string;
  /** Generative cover treatment — dark duotone; `accent` tints it ultraviolet. */
  cover: { from: string; to: string; accent?: boolean };
  status: "live" | "in-progress";
};

export const projects: Project[] = [
  {
    slug: "sarah-boutique",
    title: "Sarah Boutique",
    client: "Sarah Boutique",
    discipline: "E-Commerce · Fashion",
    year: "2025",
    services: ["Brand Identity", "Web Design", "Development"],
    summary:
      "A quietly luxurious storefront for a modern fashion boutique — editorial product staging, a frictionless checkout, and a brand system that lets the garments speak.",
    cover: { from: "#241b2b", to: "#0d0a11", accent: true },
    status: "live",
  },
  {
    slug: "ek-constructions",
    title: "EK Constructions",
    client: "EK Constructions",
    discipline: "Corporate · Architecture",
    year: "2025",
    services: ["Brand Identity", "Web Design", "Development", "Motion"],
    summary:
      "A commanding digital presence for a construction and development firm — structural typography, weighty imagery, and a case-study engine that turns projects into proof.",
    cover: { from: "#1b2226", to: "#0a0e10" },
    status: "live",
  },
  {
    slug: "halcyon",
    title: "Halcyon",
    client: "Halcyon Retreats",
    discipline: "Hospitality · Web",
    year: "2026",
    services: ["Art Direction", "Web Design", "Development"],
    summary:
      "An immersive booking experience for a collection of design-led retreats — slow, cinematic and calm, engineered to make stillness feel aspirational.",
    cover: { from: "#1f241e", to: "#0a0d09" },
    status: "in-progress",
  },
  {
    slug: "verso",
    title: "Verso",
    client: "Verso Journal",
    discipline: "Editorial · Product",
    year: "2026",
    services: ["Product Design", "Development", "Design System"],
    summary:
      "A reading platform for long-form culture writing — a typographic product where the interface recedes and the words hold the stage.",
    cover: { from: "#26221b", to: "#0d0b08" },
    status: "in-progress",
  },
];
