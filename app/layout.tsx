import type { Metadata, Viewport } from "next";
import { BRAND } from "./brand";
import { PwaSupport } from "./pwa-support";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  applicationName: "Kingsperl Events",
  title: "Kingsperl Events | St. John's Event Decor",
  description:
    "Cinematic event styling, transparent decor build sheets, and intelligent event design for St. John's and the Avalon Peninsula.",
  alternates: { canonical: "/" },
  category: "Event design and decor",
  keywords: ["St. John's event decor", "Newfoundland wedding decor", "event design", "event rentals", "event styling", "event build sheets"],
  creator: BRAND.name,
  publisher: BRAND.name,
  robots: { index: true, follow: true },
  openGraph: {
    title: "Kingsperl Events",
    description:
      "Where atmosphere takes form. Cinematic event design, exact build sheets and venue-aware planning for St. John's.",
    url: "/",
    siteName: "Kingsperl Events",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/og/kingsperl-events.jpg",
        width: 1200,
        height: 630,
        alt: "Kingsperl Events — Where atmosphere takes form",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kingsperl Events",
    description: "Where atmosphere takes form. Cinematic, venue-aware event design for St. John's.",
    images: ["/og/kingsperl-events.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/brand/kingsperl-mark.svg", color: "#071A1F" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kingsperl Events",
  },
};

export const viewport: Viewport = { themeColor: "#071A1F", colorScheme: "light", width: "device-width", initialScale: 1 };

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Kingsperl Events",
  alternateName: BRAND.name,
  description: "Cinematic, venue-aware event design, styling, rentals and installation for St. John's and the Avalon Peninsula.",
  url: BRAND.siteUrl,
  logo: `${BRAND.siteUrl}/brand/kingsperl-mark.svg`,
  image: `${BRAND.siteUrl}/og/kingsperl-events.jpg`,
  areaServed: ["St. John's", "Mount Pearl", "Paradise", "Conception Bay South", "Avalon Peninsula"],
  slogan: BRAND.tagline,
  serviceType: ["Event design", "Event decor", "Event styling", "Event rentals", "Event installation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <PwaSupport>{children}</PwaSupport>
      </body>
    </html>
  );
}
