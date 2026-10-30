"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import HomeOpening from "./home-opening";
import { BRAND, BrandLockup } from "./brand";
import {
  events as eventWorldEvents,
  inspirationDirections as eventWorldDirections,
  type EventCategory as WorldEventCategory,
} from "./events/event-catalog";
import { referenceSchedule } from "./events/event-world";

type DecorProject = {
  id: string;
  title: string;
  event: string;
  category: "Weddings" | "Celebrations" | "Corporate" | "Community";
  paletteName: string;
  palette: string[];
  startingAt: number;
  guests: number;
  venue: string;
  mood: string;
  image: string;
  footprint: string;
  install: string;
};

type InventoryItem = {
  zone: string;
  item: string;
  quantity: number;
  measurement: string;
  note: string;
};

type PlannerState = {
  event: string;
  date: string;
  guests: number;
  budget: number;
  palette: string;
  venue: string;
  dimensions: string;
  ceiling: string;
  access: string;
  description: string;
  mustHaves: string[];
};

const projects: DecorProject[] = [
  {
    id: "pearl-sage",
    title: "Saltair in Pearl & Sage",
    event: "Wedding reception",
    category: "Weddings",
    paletteName: "Pearl · Sage · Oyster",
    palette: ["#f4f0e6", "#9aa58f", "#d8d3c6", "#6d7568"],
    startingAt: 6800,
    guests: 120,
    venue: "Coastal glasshouse",
    mood: "Airy, sculptural, Atlantic",
    image: "/decor-v2/01-pearl-sage-v2.webp",
    footprint: "72 × 48 ft / 21.9 × 14.6 m",
    install: "8–10 hours",
  },
  {
    id: "nocturne",
    title: "Nocturne Ballroom",
    event: "Black-tie wedding",
    category: "Weddings",
    paletteName: "Obsidian · Champagne",
    palette: ["#11100f", "#c6aa6a", "#ece0c9", "#674f35"],
    startingAt: 8900,
    guests: 160,
    venue: "Hotel ballroom",
    mood: "Candlelit, dramatic, tailored",
    image: "/decor-v2/02-nocturne-v2.webp",
    footprint: "84 × 56 ft / 25.6 × 17.1 m",
    install: "10–12 hours",
  },
  {
    id: "clay-rose",
    title: "Clay Rose Ceremony",
    event: "Micro wedding",
    category: "Weddings",
    paletteName: "Terracotta · Blush · Sand",
    palette: ["#b76545", "#dfb6a8", "#d6c2a5", "#6f4b3e"],
    startingAt: 2850,
    guests: 42,
    venue: "Intimate ceremony room",
    mood: "Warm, organic, editorial",
    image: "/decor-v2/03-clay-rose-v2.webp",
    footprint: "34 × 28 ft / 10.4 × 8.5 m",
    install: "4–5 hours",
  },
  {
    id: "winter-chrome",
    title: "Winter in Chrome",
    event: "Winter wedding",
    category: "Weddings",
    paletteName: "Snow · Chrome · Ice",
    palette: ["#f4f5f3", "#bfc6c8", "#d9e3e7", "#7f8a90"],
    startingAt: 7400,
    guests: 110,
    venue: "Modern gallery hall",
    mood: "Luminous, clean, architectural",
    image: "/decor-v2/04-winter-chrome-v2.webp",
    footprint: "68 × 44 ft / 20.7 × 13.4 m",
    install: "8–10 hours",
  },
  {
    id: "heritage-gold",
    title: "Accra Atlantic",
    event: "Ghanaian or West African diaspora celebration",
    category: "Community",
    paletteName: "Indigo · Brass · Terracotta",
    palette: ["#172b54", "#bc833b", "#365341", "#a54d32"],
    startingAt: 8200,
    guests: 180,
    venue: "Modern diaspora celebration hall",
    mood: "Contemporary, rooted, host-led",
    image: "/event-world/25-indigo-diaspora.webp",
    footprint: "92 × 58 ft / 28 × 17.7 m",
    install: "10–12 hours",
  },
  {
    id: "afterglow",
    title: "Afterglow for Two",
    event: "Sweetheart dinner",
    category: "Weddings",
    paletteName: "Wine · Rose · Candlewax",
    palette: ["#651f2b", "#c87879", "#f1e5d5", "#8b5e3c"],
    startingAt: 1650,
    guests: 12,
    venue: "Private dining room",
    mood: "Intimate, cinematic, floral",
    image: "/decor-v2/06-afterglow-v2.webp",
    footprint: "20 × 18 ft / 6.1 × 5.5 m",
    install: "3–4 hours",
  },
  {
    id: "blue-hour",
    title: "Blue Hour Fifty",
    event: "Milestone birthday",
    category: "Celebrations",
    paletteName: "Cobalt · Citrus · Ink",
    palette: ["#1839a6", "#f2a93b", "#10182d", "#f5ede0"],
    startingAt: 4200,
    guests: 72,
    venue: "Downtown loft",
    mood: "Electric, polished, expressive",
    image: "/decor-v2/07-blue-hour-v2.webp",
    footprint: "48 × 36 ft / 14.6 × 11 m",
    install: "6–7 hours",
  },
  {
    id: "cloud-nine",
    title: "Cloud Nine",
    event: "Baby shower",
    category: "Celebrations",
    paletteName: "Powder · Peach · Cream",
    palette: ["#cbdce9", "#edc2ad", "#f6f0e4", "#aaa5bf"],
    startingAt: 2350,
    guests: 46,
    venue: "Bright social room",
    mood: "Soft, sculptural, serene",
    image: "/decor-v2/08-cloud-nine-v2.webp",
    footprint: "32 × 26 ft / 9.8 × 7.9 m",
    install: "4–5 hours",
  },
  {
    id: "lavender-tea",
    title: "Lavender Tea Garden",
    event: "Bridal shower",
    category: "Celebrations",
    paletteName: "Lavender · Butter · Leaf",
    palette: ["#a991bd", "#f1d985", "#667a58", "#f7efe5"],
    startingAt: 2700,
    guests: 38,
    venue: "Garden conservatory",
    mood: "Botanical, gracious, sunlit",
    image: "/decor-v2/09-lavender-tea-v2.webp",
    footprint: "36 × 24 ft / 11 × 7.3 m",
    install: "4–5 hours",
  },
  {
    id: "emerald-fifty",
    title: "Emerald After Dark",
    event: "50th birthday",
    category: "Celebrations",
    paletteName: "Emerald · Brass · Black",
    palette: ["#12483b", "#b89454", "#141414", "#e8dac0"],
    startingAt: 5100,
    guests: 90,
    venue: "Cocktail lounge",
    mood: "Glamorous, saturated, grown-up",
    image: "/decor-v2/10-emerald-after-dark-v2.webp",
    footprint: "54 × 38 ft / 16.5 × 11.6 m",
    install: "7–8 hours",
  },
  {
    id: "little-atlantis",
    title: "Little Atlantis",
    event: "Children’s birthday",
    category: "Celebrations",
    paletteName: "Aqua · Coral · Foam",
    palette: ["#37a7ad", "#ef7763", "#e9f4ee", "#285c75"],
    startingAt: 1950,
    guests: 28,
    venue: "Family event room",
    mood: "Playful, immersive, polished",
    image: "/decor-v2/11-little-atlantis-v2.webp",
    footprint: "30 × 24 ft / 9.1 × 7.3 m",
    install: "4–5 hours",
  },
  {
    id: "edge-of-ocean",
    title: "Edge of the Ocean",
    event: "Engagement proposal",
    category: "Celebrations",
    paletteName: "Atlantic · Rose · Amber",
    palette: ["#365660", "#bc6d6d", "#d7a250", "#f0e8db"],
    startingAt: 1850,
    guests: 8,
    venue: "Coastal private dining",
    mood: "Elemental, private, unforgettable",
    image: "/decor-v2/12-edge-of-ocean-v2.webp",
    footprint: "18 × 16 ft / 5.5 × 4.9 m",
    install: "3–4 hours",
  },
  {
    id: "north-star-gala",
    title: "North Star Gala",
    event: "Awards gala",
    category: "Corporate",
    paletteName: "Midnight · Amber · Ivory",
    palette: ["#10243e", "#d89a47", "#f0e8d9", "#596a7f"],
    startingAt: 9800,
    guests: 240,
    venue: "Convention ballroom",
    mood: "Cinematic, prestigious, composed",
    image: "/decor-v2/13-north-star-gala-v2.webp",
    footprint: "108 × 72 ft / 32.9 × 21.9 m",
    install: "12–14 hours",
  },
  {
    id: "coral-launch",
    title: "Coral Launch Lab",
    event: "Product launch",
    category: "Corporate",
    paletteName: "Coral · Acrylic · White",
    palette: ["#ee6d5f", "#f3efea", "#b8d4d3", "#323a3d"],
    startingAt: 6200,
    guests: 100,
    venue: "Contemporary studio",
    mood: "Fresh, precise, camera-ready",
    image: "/decor-v2/14-coral-launch-v2.webp",
    footprint: "58 × 40 ft / 17.7 × 12.2 m",
    install: "7–9 hours",
  },
  {
    id: "harbour-blue",
    title: "Harbour Blue Benefit",
    event: "Fundraising dinner",
    category: "Community",
    paletteName: "Harbour · Fog · Copper",
    palette: ["#174d65", "#becbd0", "#b36c42", "#f0e8db"],
    startingAt: 7100,
    guests: 150,
    venue: "Waterfront event hall",
    mood: "Local, generous, contemporary",
    image: "/decor-v2/15-harbour-blue-v2.webp",
    footprint: "78 × 52 ft / 23.8 × 15.8 m",
    install: "9–10 hours",
  },
  {
    id: "convocation",
    title: "Convocation House",
    event: "Graduation celebration",
    category: "Community",
    paletteName: "Burgundy · Parchment",
    palette: ["#762a3a", "#eee1c6", "#ae8d55", "#333235"],
    startingAt: 3600,
    guests: 64,
    venue: "University reception room",
    mood: "Proud, tailored, celebratory",
    image: "/decor-v2/16-convocation-v2.webp",
    footprint: "42 × 32 ft / 12.8 × 9.8 m",
    install: "5–6 hours",
  },
  {
    id: "still-garden",
    title: "The Still Garden",
    event: "Celebration of life",
    category: "Community",
    paletteName: "Botanical · White · Stone",
    palette: ["#526857", "#f4f0e7", "#a6a49a", "#d8c9ad"],
    startingAt: 2100,
    guests: 70,
    venue: "Quiet reception hall",
    mood: "Gentle, natural, dignified",
    image: "/decor-v2/17-still-garden-v2.webp",
    footprint: "40 × 30 ft / 12.2 × 9.1 m",
    install: "4–5 hours",
  },
  {
    id: "winter-social",
    title: "Winter Social Club",
    event: "Holiday party",
    category: "Corporate",
    paletteName: "Pine · Oxblood · Brass",
    palette: ["#26483a", "#762d35", "#bd9554", "#efe4cf"],
    startingAt: 5800,
    guests: 115,
    venue: "Heritage hall",
    mood: "Festive, warm, deeply textured",
    image: "/decor-v2/18-winter-social-v2.webp",
    footprint: "62 × 42 ft / 18.9 × 12.8 m",
    install: "7–8 hours",
  },
];

const projectCategoryFromWorld = (category: WorldEventCategory, title = ""): DecorProject["category"] => {
  if (/wedding|elopement|vow/i.test(title)) return "Weddings";
  if (category === "Corporate") return "Corporate";
  if (["Community & civic", "Culture & faith", "Education & youth", "Sport & wellness"].includes(category)) return "Community";
  return "Celebrations";
};

const directionProjects: DecorProject[] = eventWorldDirections
  .filter((direction) => !projects.some((project) => project.id === direction.id))
  .map((direction) => ({
    id: direction.id,
    title: `${direction.title} · custom route`,
    event: "Custom event direction",
    category: projectCategoryFromWorld(direction.bestFor[0]),
    paletteName: direction.title,
    palette: direction.palette,
    startingAt: direction.startingAt,
    guests: 120,
    venue: direction.venue,
    mood: direction.mood.replaceAll(" · ", ", "),
    image: direction.image,
    footprint: "Venue-scaled after measured floor plan",
    install: direction.startingAt >= 10000 ? "10–14 hours" : "6–10 hours",
  }));

const generatorProjects = [...projects, ...directionProjects];

const paletteOptions = [
  { name: "Pearl & Sage", colors: ["#f2eee3", "#8c9b83", "#d7cbb8"] },
  { name: "Obsidian & Gold", colors: ["#141414", "#b69455", "#efe3ca"] },
  { name: "Terracotta Garden", colors: ["#b66445", "#e3b8a5", "#667855"] },
  { name: "Atlantic Blue", colors: ["#194c65", "#9db7be", "#e9e1d3"] },
  { name: "Plum & Rose", colors: ["#5f2b4b", "#c77782", "#efd8d0"] },
  { name: "Surprise me", colors: ["#e0664f", "#223949", "#e7c277"] },
];

const plannerDefaults: PlannerState = {
  event: "Wedding reception",
  date: "",
  guests: 100,
  budget: 6500,
  palette: "Pearl & Sage",
  venue: "Hotel ballroom",
  dimensions: "60 ft × 40 ft",
  ceiling: "12 ft",
  access: "Ground-level loading access",
  description:
    "A bright rectangular room with a stage on one end, neutral walls, two entrances and a dance floor in the centre.",
  mustHaves: ["Statement backdrop", "Guest-table styling"],
};

const scrollToSection = (selector: string) => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelector(selector)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
};

const venueOptionFromSignal = (signal: string) => {
  if (/outdoor|lake|waterfront|garden|coast|shore|street|lane|courtyard|terrace|park|lawn|tent/i.test(signal)) return "Outdoor / tented";
  if (/church|worship|ceremony/i.test(signal)) return "Church / ceremony venue";
  if (/restaurant|dining|lounge|bar/i.test(signal)) return "Restaurant / private dining";
  if (/home|backyard|residence/i.test(signal)) return "Home / backyard";
  if (/gallery|studio|loft|warehouse|atrium|public space/i.test(signal)) return "Gallery / studio";
  if (/community|heritage|timber|gathering hall/i.test(signal)) return "Community hall";
  if (/ballroom|hotel|convention|event hall/i.test(signal)) return "Hotel ballroom";
  return "Venue not selected yet";
};

const venuePhrase = (venue: string) => {
  if (venue === "Outdoor / tented") return "an outdoor or tented setting";
  if (venue === "Restaurant / private dining") return "a restaurant or private dining room";
  if (venue === "Home / backyard") return "a home or backyard setting";
  if (venue === "Gallery / studio") return "a gallery or studio";
  if (venue === "Church / ceremony venue") return "a church or ceremony venue";
  if (venue === "Venue not selected yet") return "a venue still to be confirmed";
  return `a ${venue.toLowerCase()}`;
};

const mustHaveOptions = [
  "Statement backdrop",
  "Guest-table styling",
  "Ceiling treatment",
  "Photo moment",
  "Styled entrance",
  "Lounge area",
];

const legacyPlannerEventOptions = [
  "Wedding reception",
  "Wedding ceremony",
  "Engagement",
  "Birthday",
  "Baby shower",
  "Bridal shower",
  "Corporate gala",
  "Product launch",
  "Fundraiser",
  "Graduation",
  "Cultural celebration",
  "Celebration of life",
];

const plannerEventOptions = Array.from(new Set([
  ...legacyPlannerEventOptions,
  ...projects.map((project) => project.event),
  ...eventWorldEvents.map((event) => event.title),
  "Other event",
]));

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);

const budgetBandFor = (budget: number) =>
  budget < 3000 ? "$750–$3,000" : budget < 6000 ? "$3,000–$6,000" : budget <= 10000 ? "$6,000–$10,000" : "$10,000+";

function inventoryFor(project: DecorProject, guestOverride?: number): InventoryItem[] {
  const guests = guestOverride ?? project.guests;
  const tables = Math.max(1, Math.ceil(guests / 10));
  const smallEvent = guests <= 20;
  const loungeSets = Math.max(1, Math.ceil(guests / 60));
  const uplights = Math.max(6, Math.ceil(guests / 8));
  const floralCount = Math.max(2, Math.ceil(tables * 0.65));
  const common: InventoryItem[] = [
    {
      zone: "Feature",
      item: "Modular scenic backdrop panels",
      quantity: smallEvent ? 2 : 3,
      measurement: "8 ft H × 4 ft W each / 2.44 × 1.22 m",
      note: "Weighted bases; venue-safe finish",
    },
    {
      zone: "Feature",
      item: "Asymmetrical floral meadow",
      quantity: smallEvent ? 2 : 4,
      measurement: "48 in W × 28 in H / 1.22 × 0.71 m",
      note: "Mixed fresh and premium faux botanicals",
    },
    {
      zone: "Feature",
      item: "Plinth / pedestal set",
      quantity: 3,
      measurement: "24, 30 & 36 in H / 0.61, 0.76 & 0.91 m",
      note: "Colour-matched architectural finish",
    },
    {
      zone: "Dining",
      item: "72-inch round guest tables",
      quantity: tables,
      measurement: "72 in Ø × 30 in H / 1.83 × 0.76 m",
      note: "Seats 8–10 depending on place setting",
    },
    {
      zone: "Dining",
      item: "Guest chairs",
      quantity: guests,
      measurement: "18 in W × 36 in H / 0.46 × 0.91 m",
      note: "Final style subject to venue inventory",
    },
    {
      zone: "Dining",
      item: "Floor-length table linen",
      quantity: tables,
      measurement: "132 in round / 3.35 m round",
      note: "Pressed and steamed on site",
    },
    {
      zone: "Dining",
      item: "Textile napkins",
      quantity: guests + Math.ceil(guests * 0.05),
      measurement: "20 × 20 in / 51 × 51 cm",
      note: "Includes 5% service reserve",
    },
    {
      zone: "Dining",
      item: "Floral centrepieces",
      quantity: floralCount,
      measurement: "18–24 in W × 14–22 in H / 46–61 × 36–56 cm",
      note: "Alternated with candle compositions",
    },
    {
      zone: "Lighting",
      item: "LED taper and pillar candle set",
      quantity: Math.max(18, tables * 5),
      measurement: "6–12 in H / 15–30 cm",
      note: "Venue-compliant flameless illumination",
    },
    {
      zone: "Lighting",
      item: "Wireless uplights",
      quantity: uplights,
      measurement: "6 × 6 in footprint / 15 × 15 cm",
      note: "Individually colour calibrated",
    },
    {
      zone: "Lounge",
      item: "Soft-seating vignette",
      quantity: loungeSets,
      measurement: "10 × 8 ft each / 3.05 × 2.44 m",
      note: "Sofa, two chairs, rug and cocktail tables",
    },
    {
      zone: "Wayfinding",
      item: "Welcome sign and easel",
      quantity: 1,
      measurement: "24 × 36 in / 61 × 91 cm",
      note: "Personalized artwork allowance included",
    },
    {
      zone: "Wayfinding",
      item: "Table numbers / identifiers",
      quantity: tables,
      measurement: "5 × 7 in / 13 × 18 cm",
      note: "Coordinated with stationery system",
    },
    {
      zone: "Logistics",
      item: "Protected transport cases",
      quantity: Math.max(8, Math.ceil(guests / 12)),
      measurement: "Standard 27-gal / 102-L cases",
      note: "Packed for two-way delivery and strike",
    },
    {
      zone: "Logistics",
      item: "Installation and strike crew",
      quantity: Math.max(2, Math.ceil(guests / 55)),
      measurement: `${project.install} install window`,
      note: "Final labour follows confirmed venue access",
    },
  ];

  const conceptSpecific: Record<string, InventoryItem[]> = {
    "pearl-sage": [
      { zone: "Overhead", item: "Suspended botanical canopy modules", quantity: 5, measurement: "8 ft L × 3 ft W / 2.44 × 0.91 m", note: "Glasshouse-approved suspension points required" },
      { zone: "Dining", item: "Ivory garden chair upgrade", quantity: guests, measurement: "18 in W × 37 in H / 46 × 94 cm", note: "Replaces common chair line" },
    ],
    nocturne: [
      { zone: "Scenic", item: "Obsidian velvet perimeter drape", quantity: 96, measurement: "Linear ft at 14 ft H / 29.3 m at 4.27 m H", note: "IFR-rated with weighted black bases" },
      { zone: "Overhead", item: "Crystal chandelier cluster", quantity: 5, measurement: "30–48 in Ø / 76–122 cm Ø", note: "Rigging and power by venue-approved provider" },
    ],
    "clay-rose": [
      { zone: "Ceremony", item: "Textured clay arch pair", quantity: 2, measurement: "7 ft 6 in H × 3 ft W / 2.29 × 0.91 m", note: "Freestanding asymmetrical placement" },
      { zone: "Aisle", item: "Low terracotta floral clusters", quantity: Math.max(6, Math.ceil(guests / 7)), measurement: "24–34 in W / 61–86 cm", note: "Clear of 44-in accessible aisle" },
    ],
    "winter-chrome": [
      { zone: "Dining", item: "Mirror-and-chrome communal tables", quantity: Math.max(2, Math.ceil(guests / 24)), measurement: "16 ft L × 42 in W / 4.88 × 1.07 m", note: "Modular sections with polished edges" },
      { zone: "Botanical", item: "Frosted branch tree", quantity: 8, measurement: "7–9 ft H / 2.13–2.74 m", note: "Weighted clear acrylic vessels" },
    ],
    "heritage-gold": [
      { zone: "Feature", item: "Contemporary timber-and-textile portal", quantity: 1, measurement: "20 ft W × 11 ft H / 6.10 × 3.35 m", note: "Ground-supported structure; material story reviewed with the host" },
      { zone: "Textile", item: "Host-approved handwoven accent set", quantity: Math.max(6, Math.ceil(guests / 30)), measurement: "18–96 in L / 46–244 cm L", note: "Country, region, maker and permitted use confirmed before production; never treated as a generic African motif" },
    ],
    afterglow: [
      { zone: "Dining", item: "Curved sweetheart table", quantity: 1, measurement: "72 in W × 30 in H / 1.83 × 0.76 m", note: "Wine textile and floral waterfall" },
      { zone: "Lighting", item: "Glass hurricane candle garden", quantity: 36, measurement: "8–24 in H / 20–61 cm", note: "Flameless unless open flame is approved" },
    ],
    "blue-hour": [
      { zone: "Scenic", item: "Cobalt crescent backdrop set", quantity: 3, measurement: "6–9 ft H × 4 ft W / 1.83–2.74 × 1.22 m", note: "Matte cobalt finish with citrus reveal" },
      { zone: "Dining", item: "Citrus botanical runner", quantity: Math.max(1, Math.ceil(guests / 24)), measurement: "12 ft L × 18 in W / 3.66 × 0.46 m", note: "Whole and cut citrus mixed with florals" },
    ],
    "cloud-nine": [
      { zone: "Feature", item: "Sculptural cloud backdrop", quantity: 4, measurement: "4–8 ft W × 2–5 ft H / 1.22–2.44 × 0.61–1.52 m", note: "Lightweight foam; freestanding suspension illusion" },
      { zone: "Dessert", item: "Fluted cake-and-favour plinths", quantity: 7, measurement: "24–42 in H / 61–107 cm", note: "Food-safe top surfaces" },
    ],
    "lavender-tea": [
      { zone: "Shade", item: "Lavender garden parasol", quantity: Math.max(2, Math.ceil(guests / 18)), measurement: "9 ft Ø × 8 ft H / 2.74 m Ø × 2.44 m H", note: "Weighted for outdoor use; wind cutoff applies" },
      { zone: "Dining", item: "Afternoon tea china setting", quantity: guests + 4, measurement: "5-piece place setting", note: "Mix-and-match lavender and ivory china" },
    ],
    "emerald-fifty": [
      { zone: "Lounge", item: "Emerald velvet conversation set", quantity: Math.max(2, Math.ceil(guests / 36)), measurement: "12 × 10 ft zone / 3.66 × 3.05 m", note: "Curved sofa, two chairs and brass tables" },
      { zone: "Scenic", item: "Illuminated gold arch portal", quantity: 3, measurement: "9 ft H × 5 ft W / 2.74 × 1.52 m", note: "Low-voltage warm-white LED" },
    ],
    "little-atlantis": [
      { zone: "Immersive", item: "Dimensional coral reef scenic set", quantity: 5, measurement: "4–7 ft W × 3–6 ft H / 1.22–2.13 × 0.91–1.83 m", note: "Soft-edge, child-safe lightweight forms" },
      { zone: "Dining", item: "Shell-back child chair", quantity: guests, measurement: "13 in seat H / 33 cm seat H", note: "Age-appropriate commercial furniture" },
      { zone: "Overhead", item: "Translucent jellyfish light form", quantity: 8, measurement: "18–28 in Ø / 46–71 cm Ø", note: "Suspended above reach height" },
    ],
    "edge-of-ocean": [
      { zone: "Dining", item: "Proposal dinner table for two", quantity: 1, measurement: "42 in Ø × 30 in H / 1.07 × 0.76 m", note: "Weighted linen, complete place settings" },
      { zone: "Weather", item: "Low-profile lantern path", quantity: 18, measurement: "8–18 in H / 20–46 cm", note: "Battery LED; wind and rain rated" },
    ],
    "north-star-gala": [
      { zone: "Stage", item: "Gold waveform awards backdrop", quantity: 1, measurement: "32 ft W × 14 ft H / 9.75 × 4.27 m", note: "Modular illuminated metal-tube composition" },
      { zone: "Stage", item: "Presenter lectern and awards plinths", quantity: 5, measurement: "42 in lectern; 30–42 in plinths / 107; 76–107 cm", note: "Unbranded; vinyl graphics quoted separately" },
    ],
    "coral-launch": [
      { zone: "Product", item: "Clear acrylic display vitrines", quantity: 8, measurement: "18–36 in W × 36–48 in H / 46–91 × 91–122 cm", note: "Load rating matched to product" },
      { zone: "Scenic", item: "Translucent coral partition system", quantity: 7, measurement: "4 ft W × 8 ft H / 1.22 × 2.44 m", note: "Freestanding, modular sight-line control" },
    ],
    "harbour-blue": [
      { zone: "Scenic", item: "Layered Atlantic wave panels", quantity: 9, measurement: "4 ft W × 10 ft H / 1.22 × 3.05 m", note: "Tonal blue lightweight scenic flats" },
      { zone: "Dining", item: "Coastal stone centrepiece bases", quantity: tables, measurement: "16–22 in W / 41–56 cm", note: "Sealed, table-safe composite forms" },
    ],
    convocation: [
      { zone: "Stage", item: "Burgundy convocation drape arch", quantity: 1, measurement: "20 ft W × 12 ft H / 6.10 × 3.66 m", note: "IFR-rated cream and burgundy textile" },
      { zone: "Photo", item: "Graduate portrait environment", quantity: 1, measurement: "14 × 10 ft / 4.27 × 3.05 m", note: "Queue space and accessible approach included" },
    ],
    "still-garden": [
      { zone: "Remembrance", item: "Linen remembrance table", quantity: 2, measurement: "6 ft L × 30 in H / 1.83 × 0.76 m", note: "Frames and personal items supplied by family" },
      { zone: "Botanical", item: "White-and-green garden urn", quantity: 6, measurement: "30–48 in H / 76–122 cm", note: "Calm, low-fragrance floral recipe available" },
    ],
    "winter-social": [
      { zone: "Feature", item: "Pre-lit naturalistic pine tree", quantity: 5, measurement: "7–12 ft H / 2.13–3.66 m", note: "Warm LED; weighted, fire-compliant bases" },
      { zone: "Lounge", item: "Oxblood velvet club grouping", quantity: Math.max(2, Math.ceil(guests / 45)), measurement: "12 × 10 ft zone / 3.66 × 3.05 m", note: "Sofa, lounge chairs and brass tables" },
    ],
  };
  const exclusions: Record<string, string[]> = {
    "pearl-sage": ["Guest chairs"],
    "winter-chrome": ["72-inch round guest tables", "Floor-length table linen"],
    "little-atlantis": ["72-inch round guest tables", "Guest chairs", "Floor-length table linen", "Textile napkins"],
    "edge-of-ocean": ["72-inch round guest tables", "Guest chairs", "Floor-length table linen", "Textile napkins", "Floral centrepieces", "Soft-seating vignette", "Table numbers / identifiers"],
  };
  const excluded = new Set(exclusions[project.id] ?? []);
  return [...(conceptSpecific[project.id] ?? []), ...common.filter((item) => !excluded.has(item.item))];
}

function categoryForEvent(event: string): DecorProject["category"] {
  if (/wedding/i.test(event)) return "Weddings";
  const catalogEvent = eventWorldEvents.find((candidate) => candidate.title === event);
  if (catalogEvent) return projectCategoryFromWorld(catalogEvent.category, catalogEvent.title);
  if (/ceremony/i.test(event)) return "Weddings";
  if (/corporate|launch|gala|fundraiser/i.test(event)) return "Corporate";
  if (/community|graduation|cultural|life/i.test(event)) return "Community";
  return "Celebrations";
}

function IconArrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function EventDecorExperience() {
  const [filter, setFilter] = useState("All");
  const [showAllLooks, setShowAllLooks] = useState(false);
  const [selectedProject, setSelectedProject] = useState<DecorProject | null>(null);
  const [selectedGuestOverride, setSelectedGuestOverride] = useState<number | null>(null);
  const [selectedEventOverride, setSelectedEventOverride] = useState<string | null>(null);
  const [moodbookOpen, setMoodbookOpen] = useState(false);
  const [moodbook, setMoodbook] = useState<string[]>([]);
  const moodbookReady = useRef(false);
  const [planner, setPlanner] = useState<PlannerState>(plannerDefaults);
  const [designMode, setDesignMode] = useState<"scratch" | "adapt">("scratch");
  const [handoffStyleSignal, setHandoffStyleSignal] = useState<string | null>(null);
  const [resultBrief, setResultBrief] = useState<PlannerState | null>(null);
  const [resultDesignMode, setResultDesignMode] = useState<"scratch" | "adapt">("scratch");
  const [plannerStep, setPlannerStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [resultProjectId, setResultProjectId] = useState<string | null>(null);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [inquiryReference, setInquiryReference] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [venueFileNames, setVenueFileNames] = useState<string[]>([]);
  const dialogCloseRef = useRef<HTMLButtonElement | null>(null);
  const generationToken = useRef(0);

  function closeConsultation() {
    setConsultationOpen(false);
    setSubmitted(false);
    setInquiryReference("");
    setInquiryError("");
    setSubmittingInquiry(false);
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem("event-decor-moodbook");
        const restored = saved ? JSON.parse(saved) : [];
        const validIds = new Set(generatorProjects.map((project) => project.id));
        setMoodbook(Array.isArray(restored) ? restored.filter((id) => typeof id === "string" && validIds.has(id)) : []);
      } catch {
        setMoodbook([]);
      }
      moodbookReady.current = true;
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!moodbookReady.current) return;
    try {
      window.localStorage.setItem("event-decor-moodbook", JSON.stringify(moodbook));
    } catch {
      // Moodbook remains usable in memory when device storage is unavailable.
    }
  }, [moodbook]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("inquiry") === "1") setConsultationOpen(true);
      const requestedEvent = params.get("event")?.trim();
      const requestedStyle = params.get("style")?.trim();
      const requestedVenueSignal = params.get("venue")?.trim();
      const requestedLooks = [...new Set(params.getAll("look").map((look) => look.trim()).filter(Boolean))];
      const budgetParam = params.get("budget");
      const guestsParam = params.get("guests");
      const requestedBudget = budgetParam ? Number(budgetParam) : Number.NaN;
      const requestedGuests = guestsParam ? Number(guestsParam) : Number.NaN;
      if (!requestedEvent && !requestedStyle && !requestedVenueSignal && !requestedLooks.length && !Number.isFinite(requestedBudget) && !Number.isFinite(requestedGuests)) return;

      setPlanner((current) => ({
        ...current,
        event: requestedEvent && plannerEventOptions.includes(requestedEvent) ? requestedEvent : "Other event",
        budget: Number.isFinite(requestedBudget)
          ? Math.min(30000, Math.max(750, Math.round(requestedBudget / 250) * 250))
          : current.budget,
        guests: Number.isFinite(requestedGuests)
          ? Math.min(800, Math.max(2, Math.round(requestedGuests)))
          : current.guests,
        venue: requestedVenueSignal ? venueOptionFromSignal(requestedVenueSignal) : current.venue,
        dimensions: requestedVenueSignal ? "" : current.dimensions,
        ceiling: requestedVenueSignal ? "" : current.ceiling,
        access: requestedVenueSignal && venueOptionFromSignal(requestedVenueSignal) === "Outdoor / tented"
          ? "Outdoor carry-in"
          : current.access,
        description: [
          requestedEvent ? `Create a ${requestedEvent.toLowerCase()} environment.` : "Create a custom event environment.",
          requestedVenueSignal ? `Use ${requestedVenueSignal.toLowerCase()} as the venue starting point; final measurements are still required.` : "",
          requestedLooks.length > 1
            ? `Blend the saved planning-board signals: ${requestedLooks.join(", ")}.`
            : requestedStyle || requestedLooks[0]
              ? `Use the ${requestedStyle ?? requestedLooks[0]} visual direction as a starting signal.`
              : "",
          "Rebuild the concept around my venue, guest flow, access and confirmed budget.",
        ].filter(Boolean).join(" "),
      }));
      setHandoffStyleSignal(requestedStyle ?? requestedLooks[0] ?? null);
      setDesignMode(requestedStyle || requestedLooks.length ? "adapt" : "scratch");
      setPlannerStep(1);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const overlayOpen = Boolean(selectedProject || moodbookOpen || consultationOpen);
    document.body.style.overflow = overlayOpen ? "hidden" : "";
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (overlayOpen) window.setTimeout(() => dialogCloseRef.current?.focus(), 0);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
        setMoodbookOpen(false);
        closeConsultation();
      }
      if (event.key === "Tab" && overlayOpen) {
        const overlay = document.querySelector<HTMLElement>(".overlay");
        const focusable = overlay ? Array.from(overlay.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((element) => element.offsetParent !== null) : [];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      if (overlayOpen) previouslyFocused?.focus();
    };
  }, [selectedProject, moodbookOpen, consultationOpen]);

  const visibleProjects = useMemo(
    () => {
      if (filter !== "All") return projects.filter((project) => project.category === filter);
      const featured = ["pearl-sage", "blue-hour", "clay-rose", "cloud-nine", "heritage-gold", "north-star-gala"];
      return [...projects].sort((a, b) => {
        const first = featured.indexOf(a.id);
        const second = featured.indexOf(b.id);
        return (first < 0 ? 99 : first) - (second < 0 ? 99 : second);
      });
    },
    [filter],
  );

  const resultProject = useMemo(
    () => generatorProjects.find((project) => project.id === resultProjectId) ?? null,
    [resultProjectId],
  );

  const resultInventory = useMemo(
    () => {
      if (!resultProject) return [];
      const brief = resultBrief ?? planner;
      const catalogEvent = eventWorldEvents.find((event) => event.title === brief.event);
      const catalogDirection = eventWorldDirections.find((direction) => direction.id === resultProject.id);
      return catalogEvent && catalogDirection
        ? referenceSchedule(catalogEvent, catalogDirection, brief.guests)
        : inventoryFor(resultProject, brief.guests);
    },
    [resultProject, resultBrief, planner],
  );

  const selectedInventory = useMemo(() => {
    if (!selectedProject) return [];
    const catalogEvent = selectedEventOverride
      ? eventWorldEvents.find((event) => event.title === selectedEventOverride)
      : null;
    const catalogDirection = eventWorldDirections.find((direction) => direction.id === selectedProject.id);
    return catalogEvent && catalogDirection
      ? referenceSchedule(catalogEvent, catalogDirection, selectedGuestOverride ?? selectedProject.guests)
      : inventoryFor(selectedProject, selectedGuestOverride ?? undefined);
  }, [selectedEventOverride, selectedGuestOverride, selectedProject]);

  const moodbookProjects = generatorProjects.filter((project) => moodbook.includes(project.id));

  const updatePlanner = <K extends keyof PlannerState>(key: K, value: PlannerState[K]) => {
    generationToken.current += 1;
    setGenerating(false);
    setPlanner((current) => ({ ...current, [key]: value }));
    setResultProjectId(null);
    setResultBrief(null);
  };

  const toggleMustHave = (item: string) => {
    generationToken.current += 1;
    setGenerating(false);
    setPlanner((current) => ({
      ...current,
      mustHaves: current.mustHaves.includes(item)
        ? current.mustHaves.filter((value) => value !== item)
        : [...current.mustHaves, item],
    }));
    setResultProjectId(null);
    setResultBrief(null);
  };

  const toggleMoodbook = (id: string) => {
    generationToken.current += 1;
    setGenerating(false);
    setResultProjectId(null);
    setResultBrief(null);
    setMoodbook((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  const openProject = (project: DecorProject, guestOverride?: number, eventOverride?: string) => {
    setSelectedProject(project);
    setSelectedGuestOverride(guestOverride ?? null);
    setSelectedEventOverride(eventOverride ?? null);
  };

  const createConcept = () => {
    const brief = { ...planner, mustHaves: [...planner.mustHaves] };
    const mode = designMode;
    const token = ++generationToken.current;
    setGenerating(true);
    setResultProjectId(null);
    window.setTimeout(() => {
      if (generationToken.current !== token) return;
      const category = categoryForEvent(brief.event);
      const requestedDirection = handoffStyleSignal
        ? eventWorldDirections.find((direction) => direction.title.toLowerCase() === handoffStyleSignal.toLowerCase())
        : null;
      const handoffProject = requestedDirection
        ? generatorProjects.find((project) => project.id === requestedDirection.id) ?? null
        : null;
      const savedCandidates = generatorProjects.filter((project) => moodbook.includes(project.id) && project.category === category);
      const candidates = mode === "adapt" && savedCandidates.length
        ? savedCandidates
        : projects.filter((project) => project.category === category);
      const paletteIndex = paletteOptions.findIndex((palette) => palette.name === brief.palette);
      const budgetTarget = [...candidates].sort(
        (a, b) => Math.abs(a.startingAt - brief.budget) - Math.abs(b.startingAt - brief.budget),
      );
      const match = mode === "adapt" && handoffProject
        ? handoffProject
        : budgetTarget[Math.max(0, paletteIndex) % Math.min(3, budgetTarget.length)] ?? projects[0];
      setResultProjectId(match.id);
      setResultBrief(brief);
      setResultDesignMode(mode);
      setGenerating(false);
      window.setTimeout(() => scrollToSection("#concept-result"), 50);
    }, 1450);
  };

  const activeResultBrief = resultBrief ?? planner;
  const fitScore = resultProject
    ? Math.max(62, Math.min(97,
        96
        - Math.abs(resultProject.guests - activeResultBrief.guests) / 12
        - (activeResultBrief.dimensions.trim() ? 0 : 8)
        - (activeResultBrief.ceiling.trim() ? 0 : 6)
        - (activeResultBrief.mustHaves.length ? 0 : 5),
      ))
    : 0;
  const minimumViableInvestment = resultProject
    ? Math.max(950, resultProject.startingAt * Math.max(0.46, activeResultBrief.guests / resultProject.guests) * 0.92)
    : 0;
  const overBudget = Math.max(0, minimumViableInvestment - activeResultBrief.budget);
  const budgetStatus = overBudget > 0
    ? `Needs ${formatCurrency(Math.ceil(overBudget / 50) * 50)} more or a reduced scope`
    : minimumViableInvestment <= activeResultBrief.budget * 0.78 ? "Comfortable with contingency" : "Feasible with a tight contingency";

  const applyProjectToPlanner = (project: DecorProject, eventOverride?: string | null) => {
    setPlanner((current) => ({
      ...current,
      event: eventOverride && plannerEventOptions.includes(eventOverride) ? eventOverride : project.event,
      guests: project.guests,
      budget: Math.max(current.budget, project.startingAt),
      palette: paletteOptions.find((option) => project.paletteName.includes(option.name.split(" ")[0]))?.name ?? "Surprise me",
      venue: /ballroom/i.test(project.venue)
        ? "Hotel ballroom"
        : /hall/i.test(project.venue)
          ? "Community hall"
          : /dining|restaurant|lounge/i.test(project.venue)
            ? "Restaurant / private dining"
            : /coast|garden|outdoor/i.test(project.venue)
              ? "Outdoor / tented"
              : /gallery|studio|glasshouse/i.test(project.venue)
                ? "Gallery / studio"
                : "Venue not selected yet",
      description: `Adapt the ${project.title} direction for my venue. Keep the ${project.mood.toLowerCase()} atmosphere while protecting guest circulation and the main focal view.`,
    }));
    setDesignMode("adapt");
    setSelectedProject(null);
    setPlannerStep(2);
    window.setTimeout(() => scrollToSection("#design-studio"), 50);
  };

  const submitConsultation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittingInquiry(true);
    setInquiryError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          email: form.get("email"),
          phone: form.get("phone"),
          eventDate: form.get("eventDate"),
          eventType: form.get("eventType"),
          budgetBand: form.get("budgetBand"),
          description: form.get("description"),
          brief: { planner, designMode, moodbook, resultProjectId, venueFileNames },
        }),
      });
      const payload = (await response.json()) as { publicId?: string; error?: string };
      if (!response.ok || !payload.publicId) throw new Error(payload.error || "Unable to save inquiry");
      setInquiryReference(payload.publicId);
      setSubmitted(true);
    } catch (error) {
      setInquiryError(error instanceof Error ? error.message : "We could not save the inquiry. Please try again.");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <main id="top" className="new-home">
      <HomeOpening onConsult={() => setConsultationOpen(true)} onBoard={() => setMoodbookOpen(true)} boardCount={moodbook.length} onCategory={(category) => { setFilter(category); setShowAllLooks(false); scrollToSection("#inspiration"); }} />

      <section className="gallery-section" id="inspiration">
        <div className="section-shell gallery-heading">
          <div>
            <p className="eyebrow">Find your kind of extraordinary</p>
            <h2>A world of possibilities.</h2>
          </div>
          <div className="filter-row" role="group" aria-label="Filter inspiration by event type">
            {["All", "Weddings", "Celebrations", "Corporate", "Community"].map((category) => (
              <button
                key={category}
                className={filter === category ? "active" : ""}
                onClick={() => { setFilter(category); setShowAllLooks(false); }}
                aria-pressed={filter === category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="project-grid" id="look-grid">
          {visibleProjects.slice(0, showAllLooks ? visibleProjects.length : 6).map((project, index) => (
            <article
              className={`project-card ${index % 7 === 0 || index % 7 === 3 ? "project-card-wide" : ""}`}
              key={project.id}
            >
              <button className="project-image" onClick={() => openProject(project)} aria-label={`Open the complete build sheet for ${project.title}`}>
                <Image
                  unoptimized
                  src={project.image}
                  alt={`${project.title} ${project.event} décor concept`}
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                />
                <span className="concept-label">Concept render</span>
                <span className="view-spec">View all items <IconArrow /></span>
              </button>
              <div className="project-card-copy">
                <div>
                  <span>{String(index + 1).padStart(2, "0")} · {project.event}</span>
                  <h3>{project.title}</h3>
                  <p>{project.mood}</p>
                </div>
                <div className="card-price">
                  <span>from</span>
                  <strong>{formatCurrency(project.startingAt)}</strong>
                </div>
              </div>
              <div className="palette-line">
                <div className="swatches" aria-label={`${project.paletteName} palette`}>
                  {project.palette.map((color) => <i key={color} style={{ background: color }} />)}
                </div>
                <button
                  className={moodbook.includes(project.id) ? "saved" : ""}
                  onClick={() => toggleMoodbook(project.id)}
                  aria-label={`${moodbook.includes(project.id) ? "Remove" : "Save"} ${project.title} ${moodbook.includes(project.id) ? "from" : "to"} moodbook`}
                >
                  {moodbook.includes(project.id) ? "Saved ✓" : "+ Moodbook"}
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className="gallery-more section-shell"><p>Each image is a design concept. Your final look is created around your venue and priorities.</p>{visibleProjects.length > 6 && <button className="new-button dark" aria-expanded={showAllLooks} aria-controls="look-grid" onClick={() => setShowAllLooks(!showAllLooks)}>{showAllLooks ? "Show fewer looks" : `Explore all ${visibleProjects.length} looks`} <span aria-hidden="true">{showAllLooks ? "−" : "+"}</span></button>}</div>
      </section>

      <section className="planner-section" id="design-studio">
        <div className="section-shell planner-heading">
          <div>
            <p className="eyebrow light">Your ideas, taking shape</p>
            <h2>Big idea?<br />Let’s give it a plan.</h2>
          </div>
          <p>
            A few details are all it takes to begin. Tell us about your occasion, explore a direction and see what your space could become.
          </p>
        </div>

        <div className="planner-shell section-shell">
          <div className="planner-sidebar">
            <div className="planner-status"><span className="pulse-dot" /> Design studio online</div>
            {[
              [1, "The occasion", "Date, guests and investment"],
              [2, "The room", "Venue, footprint and access"],
              [3, "The feeling", "Palette and non-negotiables"],
            ].map(([step, title, description]) => (
              <button
                className={plannerStep === step ? "active" : plannerStep > Number(step) ? "complete" : ""}
                key={String(step)}
                onClick={() => setPlannerStep(Number(step))}
              >
                <b>{Number(step).toString().padStart(2, "0")}</b>
                <span><strong>{title}</strong><small>{description}</small></span>
              </button>
            ))}
            <div className="studio-note">
              <span>Private by design</span>
              <p>Your brief stays on this device in this browser. The full Design Studio can securely submit your project for review. Selected files are not uploaded.</p>
            </div>
          </div>

          <div className="planner-form">
            <div className="step-label">Step {plannerStep} of 3</div>
            {plannerStep === 1 && (
              <div className="form-step">
                <div className="form-title"><h3>What are we celebrating?</h3><p>We use this to select the right spatial and service pattern.</p></div>
                <div className="design-mode" role="group" aria-label="Choose how the concept should begin">
                  <button className={designMode === "scratch" ? "active" : ""} onClick={() => setDesignMode("scratch")} aria-pressed={designMode === "scratch"}>
                    <span>✦</span><div><strong>Design from scratch</strong><small>Compose an original direction from this brief.</small></div>
                  </button>
                  <button className={designMode === "adapt" ? "active" : ""} onClick={() => setDesignMode("adapt")} aria-pressed={designMode === "adapt"}>
                    <span>↗</span><div><strong>Adapt an inspiration</strong><small>{moodbook.length ? `Use ${moodbook.length} saved ${moodbook.length === 1 ? "look" : "looks"} as signals.` : "Use a selected direction as the starting point."}</small></div>
                  </button>
                </div>
                <div className="field-grid two">
                  <label>
                    Event type
                    <select value={planner.event} onChange={(event) => updatePlanner("event", event.target.value)}>
                      {plannerEventOptions.map((event) => <option key={event}>{event}</option>)}
                    </select>
                  </label>
                  <label>
                    Event date
                    <input type="date" value={planner.date} onChange={(event) => updatePlanner("date", event.target.value)} />
                  </label>
                </div>
                <div className="field-grid two">
                  <label>
                    Expected guests
                    <span className="number-input"><input type="number" min="2" max="800" step="1" value={planner.guests} onChange={(event) => updatePlanner("guests", Math.min(800, Math.max(2, Math.round(Number(event.target.value) || 2))))} /><small>people</small></span>
                  </label>
                  <label>
                    Working décor budget
                    <span className="budget-value">{formatCurrency(planner.budget)}</span>
                    <input className="range" type="range" min="750" max="30000" step="250" value={planner.budget} onChange={(event) => updatePlanner("budget", Number(event.target.value))} />
                    <span className="range-labels"><small>$750 focal styling</small><small>$20k immersive</small></span>
                  </label>
                </div>
              </div>
            )}

            {plannerStep === 2 && (
              <div className="form-step">
                <div className="form-title"><h3>Describe the room we need to transform.</h3><p>Access, ceiling height and usable footprint can change the concept more than colour.</p></div>
                <div className="field-grid two">
                  <label>
                    Venue type
                    <select value={planner.venue} onChange={(event) => updatePlanner("venue", event.target.value)}>
                      {["Hotel ballroom", "Community hall", "Restaurant / private dining", "Outdoor / tented", "Home / backyard", "Gallery / studio", "Church / ceremony venue", "Venue not selected yet"].map((venue) => <option key={venue}>{venue}</option>)}
                    </select>
                  </label>
                  <label>Usable room dimensions<input value={planner.dimensions} onChange={(event) => updatePlanner("dimensions", event.target.value)} placeholder="e.g. 60 ft × 40 ft" /></label>
                </div>
                <div className="field-grid two">
                  <label>Ceiling / rigging height<input value={planner.ceiling} onChange={(event) => updatePlanner("ceiling", event.target.value)} placeholder="e.g. 12 ft, no ceiling rigging" /></label>
                  <label>
                    Loading access
                    <select value={planner.access} onChange={(event) => updatePlanner("access", event.target.value)}>
                      {["Ground-level loading access", "Elevator access", "Stairs / restricted doorway", "Outdoor carry-in", "Not sure yet"].map((access) => <option key={access}>{access}</option>)}
                    </select>
                  </label>
                </div>
                <label className="full-field">Room description<textarea rows={4} value={planner.description} onChange={(event) => updatePlanner("description", event.target.value)} /></label>
                <label className="upload-zone" htmlFor="venue-reference-files">
                  <input
                    className="venue-file-input"
                    id="venue-reference-files"
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    multiple
                    onChange={(event) => setVenueFileNames(Array.from(event.target.files ?? []).map((file) => file.name))}
                  />
                  <span>{venueFileNames.length ? "✓" : "＋"}</span>
                  <div>
                    <strong>{venueFileNames.length ? `${venueFileNames.length} venue reference ${venueFileNames.length === 1 ? "file" : "files"} ready` : "Add venue photos or a floor plan"}</strong>
                    <small>{venueFileNames.length ? venueFileNames.join(" · ") : "Optional · JPG, PNG or PDF · kept on this device on this device"}</small>
                  </div>
                </label>
              </div>
            )}

            {plannerStep === 3 && (
              <div className="form-step">
                <div className="form-title"><h3>Choose the emotional temperature.</h3><p>Select a palette, then tell us which moments must feel extraordinary.</p></div>
                <div className="palette-picker">
                  {paletteOptions.map((option) => (
                    <button key={option.name} className={planner.palette === option.name ? "active" : ""} onClick={() => updatePlanner("palette", option.name)} aria-pressed={planner.palette === option.name}>
                      <span>{option.colors.map((color) => <i key={color} style={{ background: color }} />)}</span>
                      <strong>{option.name}</strong>
                    </button>
                  ))}
                </div>
                <div className="must-haves">
                  <span>Must-have moments</span>
                  <div>{mustHaveOptions.map((item) => <button key={item} className={planner.mustHaves.includes(item) ? "active" : ""} onClick={() => toggleMustHave(item)} aria-pressed={planner.mustHaves.includes(item)}>{planner.mustHaves.includes(item) ? "✓" : "+"} {item}</button>)}</div>
                </div>
              </div>
            )}

            <div className="planner-footer">
              <button className="back-button" disabled={plannerStep === 1} onClick={() => setPlannerStep((step) => Math.max(1, step - 1))}>← Back</button>
              {plannerStep < 3 ? (
                <button className="solid-button" onClick={() => setPlannerStep((step) => Math.min(3, step + 1))}>Continue <span>→</span></button>
              ) : (
                <button className="solid-button generate-button" onClick={createConcept} disabled={generating}>
                  {generating ? <><i className="spinner" /> Composing your concept…</> : <>Generate my décor direction <IconArrow /></>}
                </button>
              )}
            </div>
          </div>
        </div>

        {resultProject && (
          <div className="concept-result section-shell" id="concept-result">
            <div className="result-visual">
              <Image unoptimized src={resultProject.image} alt={`${resultProject.title} suggested concept`} width={1536} height={1024} loading="lazy" decoding="async" />
              <span>{resultDesignMode === "scratch" ? "Composed from your brief" : "Adapted from your inspiration"} · concept render</span>
              <div className="result-score"><strong>{Math.round(fitScore)}%</strong><small>brief alignment</small></div>
            </div>
            <div className="result-content">
              <p className="eyebrow">{resultDesignMode === "scratch" ? "Your original design direction" : "Your adapted design direction"}</p>
              <h3>{resultDesignMode === "scratch" && activeResultBrief.palette !== "Surprise me" ? `${activeResultBrief.palette} ${activeResultBrief.event}` : resultProject.title}</h3>
              <p className="result-lede">
                A {resultProject.mood.toLowerCase()} environment for {activeResultBrief.guests} guests, planned around {venuePhrase(activeResultBrief.venue)} and prioritized to protect your {formatCurrency(activeResultBrief.budget)} working budget.
              </p>
              <div className="result-facts">
                <div><span>Budget position</span><strong>{budgetStatus}</strong></div>
                <div><span>Minimum viable scope</span><strong>{formatCurrency(Math.round(minimumViableInvestment / 50) * 50)} + HST</strong></div>
                <div><span>Inventory lines</span><strong>{resultInventory.length} specified</strong></div>
                <div><span>Install crew</span><strong>{Math.max(2, Math.ceil(activeResultBrief.guests / 55))} stylists</strong></div>
              </div>
              <div className="allocation">
                <span>Recommended allocation</span>
                {[
                  ["Focal environments", 34], ["Tablescape & textiles", 28], ["Florals", 21], ["Lighting & logistics", 17],
                ].map(([label, value]) => <div key={String(label)}><small>{label}</small><i><b style={{ width: `${value}%` }} /></i><strong>{value}%</strong></div>)}
              </div>
              <div className={`result-alert ${overBudget > 0 ? "budget-warning" : ""}`}>
                <b>{overBudget > 0 ? "Scope correction required" : "Venue intelligence"}</b>
                <p>{overBudget > 0 ? `The current guest count and must-have list cannot responsibly fit inside ${formatCurrency(activeResultBrief.budget)}. Raise the working budget, remove a major zone, or choose focal styling before requesting a quote. ` : ""}{activeResultBrief.access.includes("Stairs") ? "Restricted access adds handling time; use modular panels under 4 ft wide." : "Access supports full-size modular scenic pieces."} Confirm load-in, elevator dimensions, power and flame-retardancy requirements before contract.</p>
              </div>
              <p className="price-assumption">Planning estimate includes concept development, pictured décor/rentals, standard St. John&apos;s two-way delivery, installation and strike. HST, venue charges, specialized rigging, fresh-floral market changes, travel beyond the metro area and refundable damage/security deposits are excluded until quoted.</p>
              <div className="result-actions">
                <button className="solid-button" onClick={() => setConsultationOpen(true)}>Refine with a designer <IconArrow /></button>
                <button className="outline-button" onClick={() => openProject(resultProject, activeResultBrief.guests, activeResultBrief.event)}>See the exact item schedule</button>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="services-section section-shell" id="services">
        <div className="services-heading">
          <div><p className="eyebrow">The details make the difference</p><h2>Your vision.<br />Our full attention.</h2></div>
          <p>Book a focused installation or place the complete visual environment in our hands.</p>
        </div>
        <div className="new-service-stories">
          {[
            { title: "Design & styling", image: "/decor-v2/09-lavender-tea-v2.webp", number: "01", text: "A considered creative direction, from your colour palette and florals to the way the entire room feels.", tags: "Creative direction · Florals · Tablescapes" },
            { title: "Décor & experiences", image: "/decor-v2/14-coral-launch-v2.webp", number: "02", text: "Distinctive rentals, sculptural backdrops and beautifully personal details that bring your story to life.", tags: "Rentals · Custom pieces · Brand moments" },
            { title: "Production & care", image: "/decor-v2/07-blue-hour-v2.webp", number: "03", text: "The planning, lighting, installation and final checks that let you arrive and enjoy your own occasion.", tags: "Lighting · Logistics · Installation" },
          ].map((service) => <article key={service.number}><div className="new-service-image"><Image unoptimized src={service.image} alt={`${service.title} inspiration — event design concept`} width={1536} height={1024} loading="lazy" /><span>{service.number}</span></div><div className="new-service-copy"><h3>{service.title}</h3><p>{service.text}</p><small>{service.tags}</small><button onClick={() => setConsultationOpen(true)} aria-label={`Discuss ${service.title.toLowerCase()}`}>Let’s talk <span aria-hidden="true">↗</span></button></div></article>)}
        </div>
      </section>

      <section className="approach-section" id="approach">
        <div className="section-shell">
          <div className="approach-title"><p className="eyebrow light">The journey, made simple</p><h2>From a spark<br />to a shared memory.</h2></div>
          <div className="timeline">
            {[
              ["01", "Dream it", "Share your occasion, your people and what you want the day to feel like."],
              ["02", "Shape it", "Explore a visual direction with a clear scope and a thoughtful working budget."],
              ["03", "Make it yours", "Refine the details, confirm your venue and approve the plan and agreement."],
              ["04", "Be in the moment", "We coordinate the installation, styling and finishing touches. You enjoy the gathering."],
            ].map(([number, title, copy]) => <div key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>)}
          </div>
        </div>
      </section>

      <section className="local-section section-shell">
        <div className="local-photo"><Image unoptimized src="/decor-v2/15-harbour-blue-v2.webp" alt="Harbour-inspired fundraising event décor concept" width={1536} height={1024} loading="lazy" decoding="async" /><span>Designed for the realities of the Avalon</span></div>
        <div className="local-copy">
          <p className="eyebrow">Local knowledge is part of the design</p>
          <h2>A local heart.<br />A wider imagination.</h2>
          <p>Newfoundland events demand more than a moodboard. Every proposal can account for weather, delivery windows, narrow heritage access, venue inventory, flame policies and the time it takes to safely strike.</p>
          <ul>
            <li><span>01</span> Indoor backup logic for outdoor ceremonies</li>
            <li><span>02</span> Wind-conscious freestanding installations</li>
            <li><span>03</span> Substitution plans for seasonal florals and freight delays</li>
            <li><span>04</span> Venue-safe surfaces, flame-rated textiles and cable management</li>
          </ul>
        </div>
      </section>

      <section className="proof-section">
        <div className="section-shell">
          <p className="eyebrow">The experience we design for</p>
          <blockquote>Thoughtfully imagined.<br />Beautifully brought together.</blockquote>
          <div className="proof-grid">
            <article><strong>One source of truth</strong><p>Your approved visual, item schedule, venue notes and substitutions stay connected.</p></article>
            <article><strong>Budget transparency</strong><p>Know where the visual impact lives and what can flex before you commit.</p></article>
            <article><strong>Production confidence</strong><p>Quantities, measurements, labour and access are resolved before event day.</p></article>
          </div>
        </div>
      </section>

      <section className="faq-section section-shell">
        <div><p className="eyebrow">Before we begin</p><h2>A few things<br />you might wonder.</h2><button className="outline-button" onClick={() => setConsultationOpen(true)}>Ask about your event</button></div>
        <div className="faq-list">
          {[
            ["How early should I book?", "For full-room weddings and galas, 6–12 months is ideal. Focused installations can sometimes be produced in 4–8 weeks, depending on inventory and fabrication."],
            ["Is the starting price the final quote?", "No. It is a planning anchor based on the pictured scope and reference guest count. The confirmed quote follows venue access, exact quantities, floral mix, logistics, installation window and taxes."],
            ["Can you work with décor I already own?", "Yes. We can design around heirlooms, cultural pieces, venue inventory and client-supplied items once condition, dimensions and delivery responsibility are confirmed."],
            ["Do you serve outside St. John’s?", "Yes. We serve the Northeast Avalon and can quote travel elsewhere in Newfoundland. Ferry, flight, accommodation and freight requirements are scoped separately."],
            ["Are these photographs completed client events?", "The current library is an inspirational concept collection, clearly labelled as concept renders. Each final proposal confirms the design, quantities and availability for your venue."],
          ].map(([question, answer], index) => (
            <article key={question} className={faqOpen === index ? "open" : ""}>
              <button onClick={() => setFaqOpen(faqOpen === index ? null : index)} aria-expanded={faqOpen === index} aria-controls={`faq-answer-${index}`}><span>{question}</span><i>{faqOpen === index ? "−" : "+"}</i></button>
              <div id={`faq-answer-${index}`} aria-hidden={faqOpen !== index}><p>{answer}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-cta">
        <div className="closing-media"><Image unoptimized src="/editorial/coral-gathering.webp" alt="Coral and lilac celebration design concept" width={1536} height={1024} loading="lazy" decoding="async" /></div>
        <div className="closing-content">
          <p className="eyebrow light">Your next great memory starts here</p>
          <h2>Let’s make<br /><em>something special.</em></h2>
          <div><button className="solid-button light-button" onClick={() => setConsultationOpen(true)}>Start a consultation <IconArrow /></button><a href="#design-studio">Or create a first concept yourself</a></div>
        </div>
      </section>

      <footer className="new-footer">
        <div className="footer-top">
          <a className="brand footer-brand" href="#top" aria-label={`${BRAND.name} home`}><BrandLockup /></a>
          <p>Cinematic event design for St. John&apos;s and the Avalon Peninsula.</p>
          <button className="footer-email" onClick={() => setConsultationOpen(true)}>Start a private consultation <IconArrow /></button>
        </div>
        <div className="footer-columns">
          <div><span>Explore</span><a href="/events">Event world · {eventWorldEvents.length} occasions</a><a href="#inspiration">Signature looks</a><a href="/studio">Design studio</a><a href="#services">Services</a><a href="#approach">Process</a></div>
          <div><span>Celebrations</span><a href="#inspiration">Weddings</a><a href="#inspiration">Birthdays & showers</a><a href="#inspiration">Corporate events</a><a href="#inspiration">Cultural events</a></div>
          <div><span>Service area</span><p>St. John&apos;s</p><p>Mount Pearl</p><p>Paradise & CBS</p><p>Northeast Avalon</p></div>
          <div><span>Studio hours</span><p>Consultations by appointment</p><p>Tell us your preferred time.</p><p>We’ll confirm an appointment.</p><button onClick={() => setConsultationOpen(true)}>Request a time →</button></div>
        </div>
        <div className="footer-bottom"><span>© 2026 {BRAND.name} Events</span><span>{BRAND.tagline} · St. John&apos;s, Newfoundland & Labrador</span><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/my-event">My event</a><a href="/install">Get the app ↗</a></div></div>
        <div className="footer-wordmark" aria-hidden="true">kingsperl<span>EVENTS</span></div>
      </footer>

      <div className="mobile-cta"><a href="/events">Events</a><button onClick={() => scrollToSection("#design-studio")}>Design</button><button onClick={() => setMoodbookOpen(true)}>Moodbook {moodbook.length}</button><button onClick={() => setConsultationOpen(true)}>Check date</button></div>

      {selectedProject && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label={`${selectedProject.title} build sheet`}>
          <button className="overlay-backdrop" onClick={() => setSelectedProject(null)} aria-label="Close build sheet" />
          <aside className="project-drawer">
            <div className="drawer-hero">
              <Image unoptimized src={selectedProject.image} alt={`${selectedProject.title} décor concept`} width={1536} height={1024} decoding="async" />
              <span>Concept render · specification preview</span>
              <button ref={dialogCloseRef} onClick={() => setSelectedProject(null)} aria-label="Close">×</button>
            </div>
            <div className="drawer-body">
              <div className="drawer-title"><p>{selectedEventOverride ?? selectedProject.event}</p><h2>{selectedProject.title}</h2><span>{selectedProject.mood}</span></div>
              <div className="drawer-facts">
                <div><span>{selectedGuestOverride ? "Your planned guests" : "Reference guests"}</span><strong>{selectedGuestOverride ?? selectedProject.guests}</strong></div>
                <div><span>Room footprint</span><strong>{selectedProject.footprint}</strong></div>
                <div><span>Install window</span><strong>{selectedProject.install}</strong></div>
                <div><span>Starting investment</span><strong>{formatCurrency(selectedProject.startingAt)} + HST</strong></div>
              </div>
              <div className="drawer-palette"><span>Palette</span><div>{selectedProject.palette.map((color) => <i key={color} style={{ background: color }} />)}<strong>{selectedProject.paletteName}</strong></div></div>
              <div className="inventory-heading"><div><span>Complete décor build sheet</span><h3>{selectedInventory.length} inventory & production lines</h3></div><button onClick={() => window.print()}>Print / save PDF</button></div>
              <div className="inventory-table" role="table" aria-label="Decor inventory with quantities and measurements">
                <div className="inventory-row inventory-header" role="row"><span role="columnheader">Zone / item</span><span role="columnheader">Qty</span><span role="columnheader">Exact reference measurement</span></div>
                {selectedInventory.map((item, index) => (
                  <div className="inventory-row" role="row" key={`${item.item}-${index}`}>
                    <span role="cell"><small>{item.zone}</small><strong>{item.item}</strong><em>{item.note}</em></span>
                    <b role="cell">{item.quantity}</b>
                    <span role="cell">{item.measurement}</span>
                  </div>
                ))}
              </div>
              <div className="spec-note"><strong>Specification note</strong><p>Measurements are planning references for the pictured concept—not a promise of venue fit. Final quantities and dimensions follow a site measure, fire/egress review, approved floor plan and confirmed vendor inventory.</p></div>
              <div className="drawer-actions"><button className="solid-button" onClick={() => applyProjectToPlanner(selectedProject, selectedEventOverride)}>Adapt this look to my event <IconArrow /></button><button className="outline-button" onClick={() => toggleMoodbook(selectedProject.id)}>{moodbook.includes(selectedProject.id) ? "Remove from moodbook" : "Save to moodbook"}</button></div>
            </div>
          </aside>
        </div>
      )}

      {moodbookOpen && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="Your moodbook">
          <button className="overlay-backdrop" onClick={() => setMoodbookOpen(false)} aria-label="Close moodbook" />
          <aside className="moodbook-drawer">
            <div className="moodbook-head"><div><span>Your saved direction</span><h2>Moodbook</h2></div><button ref={dialogCloseRef} onClick={() => setMoodbookOpen(false)} aria-label="Close">×</button></div>
            {moodbookProjects.length ? (
              <><div className="moodbook-items">{moodbookProjects.map((project) => <article key={project.id}><Image unoptimized src={project.image} alt="" width={1536} height={1024} loading="lazy" decoding="async" /><div><span>{project.event}</span><strong>{project.title}</strong><small>{project.paletteName}</small></div><button onClick={() => toggleMoodbook(project.id)} aria-label={`Remove ${project.title}`}>×</button></article>)}</div><div className="moodbook-footer"><p>{moodbookProjects.length} visual {moodbookProjects.length === 1 ? "direction" : "directions"} ready to combine into a brief.</p><button className="solid-button" onClick={() => { setDesignMode("adapt"); setPlannerStep(1); setMoodbookOpen(false); scrollToSection("#design-studio"); }}>Build from my moodbook <IconArrow /></button></div></>
            ) : (
              <div className="empty-moodbook"><span>♡</span><h3>Your moodbook is waiting.</h3><p>Save the looks that catch your eye. We&apos;ll use the pattern—not just one picture—to understand your taste.</p><button className="outline-button" onClick={() => { setMoodbookOpen(false); scrollToSection("#inspiration"); }}>Explore inspiration</button></div>
            )}
          </aside>
        </div>
      )}

      {consultationOpen && (
        <div className="overlay consultation-overlay" role="dialog" aria-modal="true" aria-label="Request a consultation">
          <button className="overlay-backdrop" onClick={closeConsultation} aria-label="Close consultation form" />
          <aside className="consultation-modal">
            <button ref={dialogCloseRef} className="modal-close" onClick={closeConsultation} aria-label="Close">×</button>
            {!submitted ? (
              <><p className="eyebrow">Begin with a real conversation</p><h2>Let’s bring your idea to life.</h2><p className="modal-lede">Tell us what you’re planning. We’ll help you explore availability, possibilities and the right next step.</p>
                <form onSubmit={submitConsultation}>
                  <div className="field-grid two"><label>Full name<input name="fullName" required placeholder="Your name" /></label><label>Email<input name="email" required type="email" placeholder="you@example.com" /></label></div>
                  <div className="field-grid two"><label>Phone<input name="phone" type="tel" placeholder="(709) 555-0123" /></label><label>Event date<input name="eventDate" type="date" defaultValue={planner.date} /></label></div>
                  <div className="field-grid two"><label>Event<select name="eventType" defaultValue={planner.event}><option>{planner.event}</option><option>Wedding</option><option>Celebration</option><option>Corporate / community</option></select></label><label>Working budget<select name="budgetBand" defaultValue={budgetBandFor(planner.budget)}><option>$750–$3,000</option><option>$3,000–$6,000</option><option>$6,000–$10,000</option><option>$10,000+</option></select></label></div>
                  <label className="full-field">What should the room feel like?<textarea name="description" rows={4} defaultValue={planner.description} /></label>
                  <label className="consent"><input type="checkbox" required /><span>I agree to be contacted about this event inquiry. This request does not reserve a date.</span></label>
                  {inquiryError && <p className="form-error" role="alert">{inquiryError}</p>}
                  <button className="solid-button full-button" type="submit" disabled={submittingInquiry}>{submittingInquiry ? <><i className="spinner" /> Saving your inquiry…</> : <>Request my consultation <IconArrow /></>}</button>
                </form>
              </>
            ) : (
              <div className="success-state"><span>✓</span><p className="eyebrow">Inquiry received · {inquiryReference}</p><h2>Your event has a starting point.</h2><p>Your contact details and complete design brief have been securely saved for review. This request starts the availability check but does not reserve the date or create a payment obligation.</p><button className="solid-button" onClick={closeConsultation}>Return to the studio</button></div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
