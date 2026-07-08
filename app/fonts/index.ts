import localFont from "next/font/local";

/** Switzer — neutral Swiss grotesque. Structure, headlines, body, UI. */
export const switzer = localFont({
  variable: "--font-switzer",
  display: "swap",
  preload: true,
  src: [
    { path: "./switzer-300.woff2", weight: "300", style: "normal" },
    { path: "./switzer-400.woff2", weight: "400", style: "normal" },
    { path: "./switzer-500.woff2", weight: "500", style: "normal" },
    { path: "./switzer-600.woff2", weight: "600", style: "normal" },
    { path: "./switzer-700.woff2", weight: "700", style: "normal" },
  ],
});

/** Instrument Serif — high-contrast editorial accent (emphasis words, quotes). */
export const instrument = localFont({
  variable: "--font-instrument",
  display: "swap",
  preload: true,
  src: [
    { path: "./instrument-normal.woff2", weight: "400", style: "normal" },
    { path: "./instrument-italic.woff2", weight: "400", style: "italic" },
  ],
});

/** JetBrains Mono — technical register: indices, labels, captions, meta. */
export const mono = localFont({
  variable: "--font-jbmono",
  display: "swap",
  preload: false,
  src: [{ path: "./jbmono-400.woff2", weight: "400", style: "normal" }],
});
