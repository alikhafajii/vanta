export const site = {
  name: "VANTA",
  /** The wordmark, rendered letter-by-letter — the "A" is the signature apex (Λ). */
  wordmark: ["V", "Λ", "N", "T", "Λ"] as const,
  domain: "vantadevs.com",
  url: "https://vantadevs.com",
  email: "hello@vantadevs.com",
  tagline: "A creative digital studio.",
  description:
    "VANTA is a creative digital studio crafting premium websites, web applications, brand systems and motion for companies that refuse to look ordinary.",
} as const;

export type NavItem = { label: string; href: string; index: string };

export const nav: NavItem[] = [
  { label: "Work", href: "#work", index: "01" },
  { label: "Services", href: "#services", index: "02" },
  { label: "About", href: "#about", index: "03" },
  { label: "Origin", href: "#origin", index: "04" },
  { label: "Contact", href: "#contact", index: "05" },
];

export type Social = { label: string; handle: string; href: string };

export const socials: Social[] = [
  { label: "Instagram", handle: "@vantadevs", href: "https://instagram.com/vantadevs" },
  { label: "Twitter", handle: "@vantadevs", href: "https://x.com/vantadevs" },
  { label: "LinkedIn", handle: "/vantadevs", href: "https://linkedin.com/company/vantadevs" },
  { label: "Dribbble", handle: "/vantadevs", href: "https://dribbble.com/vantadevs" },
];
