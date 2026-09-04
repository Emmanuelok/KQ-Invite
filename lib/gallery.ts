export type GalleryClusterId =
  | "studio"
  | "heritage"
  | "coast"
  | "promise"
  | "radiance"
  | "celebration";

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
    id: "studio" as const,
    number: "I",
    title: "Warm Light",
    subtitle: "Portraits shaped by colour, closeness and quiet confidence.",
  },
  {
    id: "heritage" as const,
    number: "II",
    title: "Heritage in the Mist",
    subtitle: "Tradition, tenderness and two paths becoming one.",
  },
  {
    id: "coast" as const,
    number: "III",
    title: "Along the Coast",
    subtitle: "Wind, laughter and love against a Newfoundland horizon.",
  },
  {
    id: "promise" as const,
    number: "IV",
    title: "The Promise",
    subtitle: "Two lives turning toward one future.",
  },
  {
    id: "radiance" as const,
    number: "V",
    title: "Her Radiance",
    subtitle: "The light, colour and quiet confidence of Perla.",
  },
  {
    id: "celebration" as const,
    number: "VI",
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
    id: "studio-intimate",
    src: "/kp-studio-intimate.webp",
    alt: "Kingsford and Perla sharing a warm studio portrait in coordinated traditional attire.",
    title: "Close to home",
    caption: "A quiet closeness, wrapped in the colours of home.",
    cluster: "studio",
    orientation: "portrait",
    focalPoint: "50% 28%",
  },
  {
    id: "studio-classic",
    src: "/kp-studio-classic.webp",
    alt: "Kingsford and Perla smiling together in a classic studio portrait.",
    title: "Side by side",
    caption: "The easiest smiles are the ones we share.",
    cluster: "studio",
    orientation: "portrait",
    focalPoint: "50% 30%",
  },
  {
    id: "studio-full-length",
    src: "/kp-studio-full-length.webp",
    alt: "Kingsford and Perla standing together in a full-length studio portrait wearing coordinated traditional attire.",
    title: "Dressed in joy",
    caption: "Tradition in every detail, joy in every glance.",
    cluster: "studio",
    orientation: "portrait",
    focalPoint: "50% 38%",
  },
  {
    id: "mist-walk",
    src: "/kp-traditional-mist-walk.webp",
    alt: "Kingsford and Perla walking together through a misty green landscape in traditional attire.",
    title: "Into the mist",
    caption: "Forward together, even when the horizon is still unfolding.",
    cluster: "heritage",
    orientation: "portrait",
    focalPoint: "50% 39%",
  },
  {
    id: "mist-close",
    src: "/kp-traditional-mist-close.webp",
    alt: "Kingsford and Perla standing close together in a mist-covered landscape.",
    title: "Held close",
    caption: "A gentle pause in the hush of the hills.",
    cluster: "heritage",
    orientation: "portrait",
    focalPoint: "50% 29%",
  },
  {
    id: "mist-holding-hands",
    src: "/kp-traditional-holding-hands.webp",
    alt: "Kingsford and Perla facing each other and holding hands in a misty field.",
    title: "The way forward",
    caption: "Two hands, one direction, and a future chosen together.",
    cluster: "heritage",
    orientation: "landscape",
    focalPoint: "53% 43%",
  },
  {
    id: "mist-side-portrait",
    src: "/kp-traditional-side-portrait.webp",
    alt: "Kingsford standing beside Perla in a close traditional portrait in the mist.",
    title: "Quiet assurance",
    caption: "Love feels steady here.",
    cluster: "heritage",
    orientation: "portrait",
    focalPoint: "50% 31%",
  },
  {
    id: "coastal-walk",
    src: "/kp-coastal-walk.webp",
    alt: "Kingsford and Perla walking hand in hand along a foggy coastal path.",
    title: "Coastal steps",
    caption: "A soft horizon and nowhere else we need to be.",
    cluster: "coast",
    orientation: "landscape",
    focalPoint: "58% 46%",
  },
  {
    id: "coastal-stairs",
    src: "/kp-coastal-stairs.webp",
    alt: "Kingsford and Perla standing together on coastal stairs above a misty landscape.",
    title: "Where land meets sky",
    caption: "Newfoundland mist, open air and a love that feels at home.",
    cluster: "coast",
    orientation: "landscape",
    focalPoint: "54% 45%",
  },
  {
    id: "coastal-joy",
    src: "/kp-coastal-joy.webp",
    alt: "Kingsford and Perla laughing together beside a coastal lookout.",
    title: "Joy by the sea",
    caption: "The wind arrived first; the laughter followed.",
    cluster: "coast",
    orientation: "landscape",
    focalPoint: "58% 41%",
  },
  {
    id: "coastal-hand-in-hand",
    src: "/kp-coastal-hand-in-hand.webp",
    alt: "Kingsford and Perla smiling and holding hands at a misty coastal lookout.",
    title: "Hand in hand",
    caption: "A beautiful view, made brighter together.",
    cluster: "coast",
    orientation: "landscape",
    focalPoint: "55% 40%",
  },
  {
    id: "coastal-layered",
    src: "/kp-coastal-layered.webp",
    alt: "Kingsford and Perla posing together above a winding coastal path.",
    title: "Above the shoreline",
    caption: "Standing together where the path and the ocean meet.",
    cluster: "coast",
    orientation: "landscape",
    focalPoint: "58% 43%",
  },
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
