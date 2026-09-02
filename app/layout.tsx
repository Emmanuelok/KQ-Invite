import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./kp6.css";
import "./kp8.css";
import "./kp9.css";
import "./gallery.css";

export const metadata: Metadata = {
  title: "Kingsford & Perla — Our Wedding",
  description:
    "Kingsford and Perla invite you to their wedding ceremony on Saturday, 19 September 2026 at Ramada by Wyndham St. John’s—with gallery, guest guide, gifts and private RSVP.",
  applicationName: "Kingsford & Perla — Our Wedding",
  category: "wedding",
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
