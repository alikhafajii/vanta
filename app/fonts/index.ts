import localFont from "next/font/local";

/**
 * VANTA runs on exactly two typefaces, both self-hosted as woff2 so there are
 * no external font requests and no build-time font fetch.
 *
 * Satoshi (Fontshare)  — display: headings, navigation, buttons, chips, cards.
 * Montserrat (Google)  — text: body, descriptions, labels, forms, footer.
 *
 * No italic faces are loaded anywhere: emphasis is carried by weight, size and
 * spacing instead.
 */

/** Satoshi — geometric grotesque. Primary/display face. */
export const satoshi = localFont({
  variable: "--font-satoshi",
  display: "swap",
  preload: true,
  src: [
    { path: "./satoshi-300.woff2", weight: "300", style: "normal" },
    { path: "./satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "./satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "./satoshi-700.woff2", weight: "700", style: "normal" },
  ],
});

/** Montserrat — humanist geometric sans. Secondary/text face. */
export const montserrat = localFont({
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
  src: [
    { path: "./montserrat-300.woff2", weight: "300", style: "normal" },
    { path: "./montserrat-400.woff2", weight: "400", style: "normal" },
    { path: "./montserrat-500.woff2", weight: "500", style: "normal" },
    { path: "./montserrat-600.woff2", weight: "600", style: "normal" },
  ],
});
