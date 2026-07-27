import type { Metadata, Viewport } from "next";
import { satoshi, montserrat } from "./fonts";
import { Providers } from "./providers";
import { site, socials } from "@/lib/data/site";
import { services } from "@/lib/data/services";
import "./globals.css";

const title = "VΛNTΛ";

/** Absolute URL for the social-share card. */
const ogImage = {
  url: "/og/og-image.jpg",
  width: 1600,
  height: 900,
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
    template: `%s — ${title}`,
  },
  description: site.description,
  alternates: { canonical: site.url },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
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
      className={`${satoshi.variable} ${montserrat.variable}`}
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
