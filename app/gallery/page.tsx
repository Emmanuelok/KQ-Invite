import type { Metadata } from "next";

import { GalleryExperience } from "@/components/gallery-experience";

export const metadata: Metadata = {
  title: "Our Story in Photographs — Kingsford & Perla",
  description: "Twenty-one portraits of Kingsford and Perla presented as an immersive six-chapter gallery, from studio warmth and heritage to coastal joy.",
  robots: { index: false, follow: false },
};

export default function GalleryPage() {
  return <GalleryExperience />;
}
