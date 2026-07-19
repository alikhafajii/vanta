import type { Metadata, Viewport } from "next";
import { switzer, instrument, mono } from "./fonts";
import { Providers } from "./providers";
import { Grain } from "@/components/ui/Grain";
import { site, socials } from "@/lib/data/site";
import { services } from "@/lib/data/services";
import "./globals.css";

const title = "VANTA — Creative Digital Studio";

/** Absolute URL for the social-share card — an existing brand asset, 3:2. */
const ogImage = {
  url: "/images/projects/hero-eclipse.png",
  width: 1536,
  height: 1024,
  alt: `${site.name} — ${site.tagline}`,
};

/**
 * Organization schema for rich results + LLM/GEO grounding. Sourced entirely
 * from lib/data/site.ts + services.ts — no hardcoded copy.
 */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/brand/vanta-wordmark.png`,
  description: site.description,
  email: site.email,
  slogan: site.tagline,
  sameAs: socials.map((social) => social.href),
  knowsAbout: services.map((service) => service.title),
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: "%s — VANTA",
  },
  description: site.description,
  alternates: { canonical: site.url },
  verification: { google: "31nN3PoCaV0Z6pbEZig8b8qXPRwZW1nt69jdkK46t6I" },
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
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: [ogImage.url],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="bg-void text-text antialiased">
        <Grain />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
