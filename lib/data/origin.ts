export type OriginMarkStep = {
  image: string;
  label: string;
};

export type OriginFounder = {
  name: string;
  role: string;
  url: string;
  /** Monogram shown in the founder card's visual anchor. */
  initials: string;
};

export const origin = {
  sectionIndex: "(04)",
  sectionLabel: "Origin",

  name: {
    headline: "Born from a material that swallows light.",
    /** Word within `headline` rendered in serif italic. */
    emphasis: "swallows",
    body: "Vanta Black absorbs 99.965% of visible light — nothing escapes, nothing reflects. We took the name because it is the philosophy: strip away every distraction until only the work remains. Black isn't empty. It's everything else, removed.",
  },

  mark: {
    number: "01",
    eyebrow: "The mark",
    caption: "A razorbill's silhouette. A black hole's corona. One mark.",
    steps: [
      { image: "/images/origin/razorbill.jpg", label: "Inspiration" },
      { image: "/images/origin/razorbill-poster.jpg", label: "Abstraction" },
      { image: "/images/origin/logo-glow.jpg", label: "The mark" },
    ] satisfies OriginMarkStep[],
  },

  founders: {
    number: "02",
    eyebrow: "Founders",
    headline: "Two friends who decided to build what they couldn't find.",
    /** Phrase within `headline` rendered in serif italic. */
    emphasis: "couldn't find",
    linkLabel: "View portfolio",
    members: [
      {
        name: "Ali Amir Husseini",
        role: "Co-founder & Developer",
        url: "https://www.aliamirhusseini.com",
        initials: "AH",
      },
      {
        name: "Ali Khafaji",
        role: "Co-founder & Developer",
        url: "https://www.alikhafaji.com",
        initials: "AK",
      },
    ] satisfies OriginFounder[],
    body: "We started VANTA because the studios we admired built work we couldn't afford, and the ones we could afford built work we couldn't admire. So we made our own — small on purpose, obsessive by default.",
  },

  vision:
    "We're not building an agency. We're building a reputation — one project at a time, until the work speaks and we don't have to.",

  /** Atmospheric backdrop behind the closing vision block (very low opacity). */
  atmosphere: "/images/origin/logo-cosmic.jpg",
} as const;
