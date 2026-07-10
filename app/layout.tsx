import type { Metadata, Viewport } from "next";
import { switzer, instrument, mono } from "./fonts";
import { Providers } from "./providers";
import { Grain } from "@/components/ui/Grain";
import { site } from "@/lib/data/site";
import "./globals.css";

const title = "VANTA — Creative Digital Studio";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: "%s — VANTA",
  },
  description: site.description,
  keywords: [
    "creative studio",
    "web design",
    "web development",
    "branding",
    "UI/UX design",
    "motion design",
    "Next.js",
  ],
  authors: [{ name: "VANTA" }],
  creator: "VANTA",
  openGraph: {
    title,
    description: site.description,
    url: site.url,
    siteName: "VANTA",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#090909",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${switzer.variable} ${instrument.variable} ${mono.variable}`}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />
      </head>
      <body className="bg-void text-text antialiased">
        <Grain />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
