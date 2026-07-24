export const site = {
  name: "VANTA",
  /** The wordmark, rendered letter-by-letter — the "A" is the signature apex (Λ). */
  wordmark: ["V", "Λ", "N", "T", "Λ"] as const,
  domain: "www.vantadevs.com",
  url: "https://www.vantadevs.com",
  email: "vantadevss@gmail.com",
  tagline: "A creative digital studio.",
  description:
    "We build in the dark. Digital experiences crafted to make brands impossible to ignore.",
} as const;

export const whatsapp = {
  number: "+961 81 049 409",
  href: "https://wa.me/96181049409",
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
  { label: "WhatsApp", handle: "Chat", href: whatsapp.href },
];
