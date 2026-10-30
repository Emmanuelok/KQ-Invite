import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Kingsperl Events",
    short_name: "Kingsperl",
    description: "Where atmosphere takes form. Explore, specify and plan cinematic event environments for St. John's and the Avalon Peninsula.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F3EEE5",
    theme_color: "#071A1F",
    orientation: "portrait-primary",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    categories: ["lifestyle", "business"],
    lang: "en-CA",
    shortcuts: [
      { name: "Explore events", short_name: "Inspiration", url: "/events", icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }] },
      { name: "Open Design Studio", short_name: "Studio", url: "/studio", icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }] },
    ],
  };
}
