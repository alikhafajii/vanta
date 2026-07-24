export type ProjectMetric = {
  value: string;
  label: string;
};

export type Project = {
  slug: string;
  title: string;
  client: string;
  discipline: string;
  year: string;
  services: string[];
  summary: string;
  /** Generative cover treatment — dark duotone; `accent` tints it ultraviolet. */
  cover: { from: string; to: string; accent?: boolean; image?: string };
  status: "live" | "in-progress";
  url?: string;
  metrics?: ProjectMetric[];
};

export const projects: Project[] = [
  {
    slug: "ek-constructions",
    title: "EK Constructions",
    client: "EK Constructions",
    discipline: "Architecture · Construction",
    year: "2025",
    services: ["Web Design", "Development", "SEO"],
    summary:
      "A commanding digital presence for a premier construction and development firm — built with structural grid layouts, rich portfolio staging, and optimized search performance.",
    cover: { from: "#1b2226", to: "#0a0e10", image: "/images/projects/ek-constructions.png" },
    status: "live",
    url: "https://ekconstructionsau.com/",
    metrics: [
      { value: "+120%", label: "Inquiries" },
      { value: "+85%", label: "Site Engagement" },
      { value: "100%", label: "Mobile Friendly" },
      { value: "<2.1s", label: "Load Time" },
    ],
  },
  // Hidden for now — keep object + /public images in place, just not shown.
  // {
  //   slug: "ali-amir-husseini",
  //   title: "Ali Amir Husseini",
  //   client: "Ali Amir Husseini",
  //   discipline: "Portfolio · CEO",
  //   year: "2025",
  //   services: ["Creative Direction", "Design System", "Development"],
  //   summary:
  //     "The official portfolio of the CEO. A minimalist, typography-driven digital archive highlighting creative leadership, brand transformations, and interactive experiences.",
  //   cover: { from: "#241b2b", to: "#0d0a11", image: "/images/projects/aliamirhusseini.png", accent: true },
  //   status: "live",
  //   url: "https://www.aliamirhusseini.com/",
  //   metrics: [
  //     { value: "+150k", label: "Total Reads" },
  //     { value: "10+", label: "Live Apps" },
  //     { value: "100%", label: "Open Source" },
  //     { value: "<50ms", label: "Latency" },
  //   ],
  // },
  // {
  //   slug: "ali-khafaji",
  //   title: "Ali Khafaji",
  //   client: "Ali Khafaji",
  //   discipline: "Portfolio · Design",
  //   year: "2025",
  //   services: ["Web Design", "Development", "Motion"],
  //   summary:
  //     "A bespoke interactive portfolio showcasing high-end visual design, frontend craftsmanship, and fluid motion systems for next-generation digital interfaces.",
  //   cover: { from: "#1f241e", to: "#0a0d09", image: "/images/projects/alikhafaji.png" },
  //   status: "live",
  //   url: "https://www.alikhafaji.com/",
  //   metrics: [
  //     { value: "30+", label: "Clients" },
  //     { value: "100%", label: "Reliability" },
  //     { value: "99%", label: "Performance" },
  //     { value: "<1.5s", label: "Load Time" },
  //   ],
  // },
];
