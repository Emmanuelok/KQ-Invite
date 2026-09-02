export type GalleryClusterId = "promise" | "radiance" | "celebration";

export type GalleryFrame = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  cluster: GalleryClusterId;
  orientation: "landscape" | "portrait";
  focalPoint: string;
};

export const galleryClusters = [
  {
    id: "promise" as const,
    number: "I",
    title: "The Promise",
    subtitle: "Two lives turning toward one future.",
  },
  {
    id: "radiance" as const,
    number: "II",
    title: "Her Radiance",
    subtitle: "The light, colour and quiet confidence of Perla.",
  },
  {
    id: "celebration" as const,
    number: "III",
    title: "Joy in Motion",
    subtitle: "Laughter, family and the beautiful noise of being loved.",
  },
] as const;

/**
 * The single source of truth for the public gallery. Future photographs only
 * need one entry here; the gallery layouts, filters and lightbox are data-driven.
 */
export const galleryFrames: GalleryFrame[] = [
  {
    id: "the-day-we-said-yes",
    src: "/engagement-laughter.webp",
    alt: "Kingsford and Perla laughing together at their engagement celebration.",
    title: "The day we said yes",
    caption: "The kind of laughter that makes a whole room disappear.",
    cluster: "celebration",
    orientation: "landscape",
    focalPoint: "58% 28%",
  },
  {
    id: "together",
    src: "/engagement-couple.webp",
    alt: "Kingsford and Perla smiling and holding hands in coordinated engagement attire.",
    title: "Together",
    caption: "Hand in hand, already looking like home.",
    cluster: "promise",
    orientation: "portrait",
    focalPoint: "50% 30%",
  },
  {
    id: "one-promise",
    src: "/engagement-together.webp",
    alt: "Kingsford and Perla standing together at their engagement celebration.",
    title: "One promise",
    caption: "A portrait of the chapter we chose together.",
    cluster: "promise",
    orientation: "landscape",
    focalPoint: "50% 30%",
  },
  {
    id: "radiance",
    src: "/engagement-perla.webp",
    alt: "Perla posing in her orange and brown engagement dress.",
    title: "Radiance",
    caption: "Bold colour, gentle grace, unmistakably Perla.",
    cluster: "radiance",
    orientation: "portrait",
    focalPoint: "55% 34%",
  },
  {
    id: "quiet-moment",
    src: "/engagement-quiet-moment.webp",
    alt: "Kingsford facing Perla during a quiet moment at their engagement celebration.",
    title: "A quiet moment",
    caption: "The stillness between every cheer and every promise.",
    cluster: "promise",
    orientation: "portrait",
    focalPoint: "64% 45%",
  },
  {
    id: "pure-joy",
    src: "/engagement-joy.webp",
    alt: "Perla smiling and clapping during the engagement celebration.",
    title: "Pure joy",
    caption: "A feeling too bright to keep still.",
    cluster: "celebration",
    orientation: "portrait",
    focalPoint: "49% 39%",
  },
  {
    id: "love-in-motion",
    src: "/engagement-celebration.webp",
    alt: "Kingsford and Perla sharing a playful moment at their engagement celebration.",
    title: "Love in motion",
    caption: "The room moved with us—and love kept the rhythm.",
    cluster: "celebration",
    orientation: "landscape",
    focalPoint: "54% 36%",
  },
  {
    id: "her-joy",
    src: "/engagement-radiance.webp",
    alt: "Perla laughing in her engagement dress.",
    title: "Her joy",
    caption: "Warmth, laughter and a room full of love.",
    cluster: "radiance",
    orientation: "portrait",
    focalPoint: "42% 27%",
  },
  {
    id: "among-our-people",
    src: "/engagement-candid.webp",
    alt: "Perla smiling among guests at the engagement celebration.",
    title: "Among our people",
    caption: "Held by the family and friends who brought us here.",
    cluster: "radiance",
    orientation: "portrait",
    focalPoint: "56% 42%",
  },
];

export function getGalleryFrame(id: string) {
  return galleryFrames.find((frame) => frame.id === id);
}
