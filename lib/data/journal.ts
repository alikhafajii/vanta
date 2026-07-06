export type Article = {
  slug: string;
  title: string;
  category: "Design" | "Development" | "Branding" | "Case Study";
  excerpt: string;
  /** ISO date — formatted for display at render time. */
  date: string;
  readingTime: string;
};

export const articles: Article[] = [
  {
    slug: "design-that-disappears",
    title: "Design That Disappears",
    category: "Design",
    excerpt:
      "Why the most premium interfaces are the ones you never notice — and how restraint became our loudest tool.",
    date: "2026-05-18",
    readingTime: "6 min",
  },
  {
    slug: "the-cost-of-a-millisecond",
    title: "The Cost of a Millisecond",
    category: "Development",
    excerpt:
      "Performance is a design decision. How we keep VANTA builds in the high nineties without sacrificing an ounce of craft.",
    date: "2026-04-02",
    readingTime: "8 min",
  },
  {
    slug: "the-weight-of-type",
    title: "The Weight of Type",
    category: "Branding",
    excerpt:
      "Typography carries more of a brand than a logo ever will. Notes on building identities that read as pure confidence.",
    date: "2026-02-27",
    readingTime: "5 min",
  },
  {
    slug: "shipping-sarah-boutique",
    title: "Shipping Sarah Boutique",
    category: "Case Study",
    excerpt:
      "How we rebuilt a fashion storefront around stillness, editorial staging, and a checkout that gets out of the way.",
    date: "2026-01-15",
    readingTime: "7 min",
  },
];
