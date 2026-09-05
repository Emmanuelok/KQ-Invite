import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./kp6.css";
import "./kp8.css";
import "./kp9.css";
import "./gallery.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kingsperl.com"),
  title: "Kingsford & Perla — Our Wedding",
  description:
    "Kingsford and Perla invite you to their wedding ceremony at 10:00 AM on Saturday, 19 September 2026 at Ramada Hotel in St. John’s—with gallery, guest guide, gifts and an optional attendance notice.",
  applicationName: "Kingsford & Perla — Our Wedding",
  category: "wedding",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "/",
    siteName: "Kingsford & Perla — Our Wedding",
    title: "Kingsford & Perla — Our Wedding",
    description:
      "Join Kingsford and Perla for their wedding ceremony on Saturday, 19 September 2026 in St. John’s, Newfoundland.",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "Kingsford and Perla smiling together in coordinated traditional attire.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kingsford & Perla — Our Wedding",
    description:
      "Join Kingsford and Perla for their wedding ceremony on Saturday, 19 September 2026 in St. John’s, Newfoundland.",
    images: ["/og-image"],
  },
  other: {
    "codex-preview": "development",
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#120907",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
