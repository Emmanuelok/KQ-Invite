import type { Metadata } from "next";

import { GalleryExperience } from "@/components/gallery-experience";

export const metadata: Metadata = {
  title: "The Engagement Gallery — Kingsford & Perla",
  description: "Nine moments from the day Kingsford and Perla said yes, presented as an immersive three-chapter engagement archive.",
  robots: { index: false, follow: false },
};

export default function GalleryPage() {
  return <GalleryExperience />;
}
