"use client";

/* eslint-disable @next/next/no-html-link-for-pages */

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { BRAND, BrandLockup } from "../brand";
import {
  categories,
  collectionForEvent,
  currency,
  directionsForCollection,
  eventCollections,
  events,
  eventsForCollection,
  inspirationDirections,
  type EventCategory,
  type EventCollection,
  type EventCollectionId,
  type EventScale,
  type EventSeason,
  type EventSetting,
  type EventType,
  type InspirationDirection,
} from "./event-catalog";

const BOARD_KEY = "kingsperl-event-world-board-v1";
const LEGACY_BOARD_KEY = "morrow-event-world-board-v1";

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4.2 4.2" /></svg>
);

const scaleFromGuests = (guests: number): EventScale => guests <= 40 ? "Intimate" : guests <= 180 ? "Mid-size" : "Large-scale";

const scopeFromBudget = (budget: number) => {
  if (budget < 3500) return "One unforgettable focal moment";
  if (budget < 8000) return "Layered room transformation";
  if (budget < 15000) return "Full-room signature environment";
  return "Immersive production with custom fabrication";
};

const idealBudgetByScale: Record<EventScale, number> = {
  Intimate: 3000,
  "Mid-size": 7000,
  "Large-scale": 16000,
  Flexible: 5500,
};

const sampleKey = (event: EventType, direction: InspirationDirection) => `${event.id}::${direction.id}`;

export type ReferenceBuildItem = {
  zone: string;
  item: string;
  quantity: number;
  measurement: string;
  note: string;
};

export const referenceSchedule = (event: EventType, direction: InspirationDirection, guestCount: number): ReferenceBuildItem[] => {
  const guests = Math.min(800, Math.max(10, Math.round(guestCount)));
  const diningTables = Math.max(1, Math.ceil(guests / 10));
  const loungeSets = Math.max(1, Math.ceil(guests / 60));
  const floralPieces = Math.max(3, Math.ceil(diningTables * 0.7));
  const lightPieces = Math.max(18, diningTables * 5);
  const outdoor = event.setting !== "Indoor";
  const title = event.title.toLowerCase();
  const isPerformance = event.category === "Arts & entertainment" || /concert|music festival|theatre|opera|dance recital|comedy|screening|fashion show|talent show/.test(title);
  const isExpo = /conference|convention|trade show|expo|symposium|seminar|workshop|open house|science fair|orientation/.test(title);
  const isSport = event.category === "Sport & wellness" && !/awards banquet|retreat/.test(title);
  const isPublicFestival = event.category === "Community & civic" && /street|festival|market|fair|block party|picnic/.test(title);
  const isCeremony = /ceremony|elopement|proposal|christening|baptism|communion|confirmation|memorial|wake|worship|bar or bat mitzvah/.test(title);

  const arrival: ReferenceBuildItem[] = [
    { zone: "Arrival", item: `${direction.title} welcome portal`, quantity: 1, measurement: "10 ft W × 9 ft H / 3.05 × 2.74 m", note: "Freestanding modular frame; blank artwork panel included" },
    { zone: "Feature", item: "Scenic backdrop modules", quantity: guests > 220 ? 5 : 3, measurement: "4 ft W × 10 ft H each / 1.22 × 3.05 m", note: `Finished to the ${direction.title} material and palette direction` },
  ];

  const banquet: ReferenceBuildItem[] = [
    { zone: "Feature", item: "Grounded floral / botanical compositions", quantity: floralPieces, measurement: "24–48 in W × 20–42 in H / 61–122 × 51–107 cm", note: "Recipe and substitutions follow season, culture and venue rules" },
    { zone: "Dining", item: "72-inch round guest tables", quantity: diningTables, measurement: "72 in Ø × 30 in H / 1.83 × 0.76 m", note: "Reference seating at 10 guests per table" },
    { zone: "Dining", item: "Guest chairs", quantity: guests, measurement: "18 in W × 36 in H / 46 × 91 cm", note: "Final chair family follows venue inventory and access" },
    { zone: "Dining", item: "Floor-length table linen", quantity: diningTables, measurement: "132 in round / 3.35 m round", note: "Pressed on site; palette-matched textile" },
    { zone: "Tabletop", item: "Complete styled place setting", quantity: guests + Math.ceil(guests * 0.05), measurement: "5-piece setting with 20 in / 51 cm napkin", note: "Includes a 5% service reserve" },
    { zone: "Lounge", item: "Soft-seating conversation vignette", quantity: loungeSets, measurement: "10 × 8 ft each / 3.05 × 2.44 m", note: "Sofa, two chairs, rug and cocktail tables" },
  ];

  const ceremony: ReferenceBuildItem[] = [
    { zone: "Ceremony", item: "Guest ceremony chairs", quantity: guests, measurement: "18 in W × 36 in H / 46 × 91 cm", note: "Set in accessible blocks with a minimum 44 in / 1.12 m primary aisle" },
    { zone: "Ceremony", item: `${direction.title} focal structure`, quantity: 1, measurement: "12 ft W × 10 ft H / 3.66 × 3.05 m", note: "Freestanding, venue-safe and rebuilt around cultural or faith protocol" },
    { zone: "Aisle", item: "Grounded aisle compositions", quantity: Math.max(6, Math.ceil(guests / 24)), measurement: "18–30 in W × 16–28 in H / 46–76 × 41–71 cm", note: "Kept clear of accessible travel and egress" },
    { zone: "Hospitality", item: "Welcome / remembrance lounge vignette", quantity: loungeSets, measurement: "10 × 8 ft each / 3.05 × 2.44 m", note: "Seating, side tables, textile and restrained botanical layer" },
  ];

  const performance: ReferenceBuildItem[] = [
    { zone: "Stage", item: "Modular performance deck", quantity: 1, measurement: guests > 350 ? "32 × 20 ft × 32 in H / 9.75 × 6.10 × 0.81 m" : "24 × 16 ft × 24 in H / 7.32 × 4.88 × 0.61 m", note: "Guarding, steps and accessible route follow final venue plan" },
    { zone: "Production", item: "Ground-supported lighting / scenic truss bays", quantity: guests > 350 ? 4 : 2, measurement: "10 ft W × 14 ft H / 3.05 × 4.27 m each", note: "Engineer-reviewed ballast and venue-approved power distribution" },
    { zone: "Audience", item: "Audience chairs", quantity: Math.ceil(guests * 0.9), measurement: "20 in W × 34 in H / 51 × 86 cm", note: "Remaining capacity reserved for accessible, standing and technical zones" },
    { zone: "Backstage", item: "Draped artist / speaker support bay", quantity: Math.max(1, Math.ceil(guests / 400)), measurement: "12 × 10 ft / 3.66 × 3.05 m", note: "Opaque flame-rated drape, mirror, table and garment rail" },
    { zone: "Front of house", item: "Technical control position", quantity: 1, measurement: "12 × 8 ft / 3.66 × 2.44 m", note: "Protected sightline for audio, lighting and show control" },
  ];

  const expo: ReferenceBuildItem[] = [
    { zone: "Registration", item: "Accessible welcome / check-in counters", quantity: Math.max(2, Math.ceil(guests / 250)), measurement: "6 ft W × 30–42 in H / 1.83 × 0.76–1.07 m", note: "Includes one lowered accessible position per bank" },
    { zone: "Exhibition", item: "Modular exhibitor / content bays", quantity: Math.max(6, Math.ceil(guests / 35)), measurement: "10 × 10 ft / 3.05 × 3.05 m", note: "Blank brand-ready panels, task light and concealed cable path" },
    { zone: "Program", item: "Talk / demonstration platform", quantity: 1, measurement: "20 × 12 ft × 16 in H / 6.10 × 3.66 × 0.41 m", note: "Accessible approach and clear screen sightlines" },
    { zone: "Networking", item: "Standing conversation clusters", quantity: Math.max(4, Math.ceil(guests / 45)), measurement: "8 × 8 ft each / 2.44 × 2.44 m", note: "Cocktail tables, two stools and a rest perch per cluster" },
    { zone: "Power", item: "Managed floor-power / cable-ramp runs", quantity: Math.max(4, Math.ceil(guests / 80)), measurement: "25 ft / 7.62 m run", note: "Final circuits and loads by venue electrician" },
  ];

  const sport: ReferenceBuildItem[] = [
    { zone: "Recognition", item: "Awards / photo platform", quantity: 1, measurement: "20 × 12 ft × 16 in H / 6.10 × 3.66 × 0.41 m", note: "Blank scenic face, accessible approach and weather-rated finish" },
    { zone: "Hospitality", item: "Covered team / guest lounge bay", quantity: Math.max(2, Math.ceil(guests / 160)), measurement: "20 × 20 ft / 6.10 × 6.10 m", note: "Open-sided weather canopy with engineered ballast" },
    { zone: "Route", item: "Weighted route barrier sections", quantity: Math.max(12, Math.ceil(guests / 20)), measurement: "8 ft L × 42 in H / 2.44 × 1.07 m", note: "Continuous accessible gates and emergency breaks shown on plan" },
    { zone: "Recovery", item: "Hydration / rest stations", quantity: Math.max(2, Math.ceil(guests / 180)), measurement: "12 × 10 ft / 3.66 × 3.05 m", note: "Shaded counter, waste sorting and accessible rest seating" },
    { zone: "Spectator", item: "Loose hospitality chairs", quantity: Math.max(30, Math.ceil(guests * 0.28)), measurement: "20 in W × 34 in H / 51 × 86 cm", note: "Concentrated at recognition and recovery zones, not the course" },
  ];

  const publicFestival: ReferenceBuildItem[] = [
    { zone: "Program", item: "Covered community program platform", quantity: 1, measurement: "24 × 16 ft × 24 in H / 7.32 × 4.88 × 0.61 m", note: "Weather roof, accessible approach and blank scenic backdrop" },
    { zone: "Public realm", item: "Weighted vendor / activity bays", quantity: Math.max(6, Math.ceil(guests / 75)), measurement: "10 × 10 ft / 3.05 × 3.05 m", note: "Wind-rated canopy, ballast and a minimum 12 ft / 3.66 m public aisle" },
    { zone: "Rest", item: "Accessible seating and shade clusters", quantity: Math.max(3, Math.ceil(guests / 160)), measurement: "14 × 12 ft / 4.27 × 3.66 m", note: "Mixed-height seating with wheelchair companion spaces" },
    { zone: "Route", item: "Pedestrian-control barrier sections", quantity: Math.max(12, Math.ceil(guests / 28)), measurement: "8 ft L × 42 in H / 2.44 × 1.07 m", note: "Emergency breaks and crossings remain visible" },
    { zone: "Waste", item: "Styled waste-sorting stations", quantity: Math.max(3, Math.ceil(guests / 180)), measurement: "6 × 3 ft / 1.83 × 0.91 m", note: "Waste, recycling and organics with blank changeable headers" },
  ];

  const formatItems = isPerformance
    ? performance
    : isExpo
      ? expo
      : isSport
        ? sport
        : isPublicFestival
          ? publicFestival
          : isCeremony
            ? ceremony
            : banquet;

  return [
    ...arrival,
    ...formatItems,
    { zone: "Lighting", item: "Venue-compliant programmable LED lights", quantity: lightPieces, measurement: "6–18 in H / 15–46 cm", note: `Warm-to-neutral output and colour accents calibrated to ${direction.title}` },
    { zone: "Wayfinding", item: "Blank modular information / photo panel", quantity: Math.max(2, Math.ceil(guests / 180)), measurement: "36 × 72 in / 91 × 183 cm", note: "Accessible viewing height; final artwork quoted separately" },
    ...(outdoor ? [{ zone: "Weather", item: "Wind-rated ballast and weather protection", quantity: Math.max(6, Math.ceil(guests / 35)), measurement: "250–500 lb / 113–227 kg rated points", note: "Final engineering follows site exposure and tent/scenic loads" }] : []),
    { zone: "Logistics", item: "Installation and strike crew", quantity: Math.max(3, Math.ceil(guests / 65)), measurement: guests > 250 ? "10–14 hour install" : "6–10 hour install", note: "Final labour follows venue access, loading and curfew" },
  ];
};

export default function EventWorld() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | EventCategory>("All");
  const [season, setSeason] = useState<"All" | EventSeason>("All");
  const [setting, setSetting] = useState<"All" | EventSetting>("All");
  const [localOnly, setLocalOnly] = useState(false);
  const [selectedEventIds, setSelectedEventIds] = useState<Record<EventCollectionId, string>>(() => Object.fromEntries(
    eventCollections.map((collection) => [collection.id, events.find((event) => event.title === collection.defaultEventTitle)?.id ?? eventsForCollection(collection)[0]?.id ?? ""]),
  ) as Record<EventCollectionId, string>);
  const [activeEvent, setActiveEvent] = useState<EventType | null>(null);
  const [activeDirection, setActiveDirection] = useState<InspirationDirection | null>(null);
  const [boardOpen, setBoardOpen] = useState(false);
  const [savedLooks, setSavedLooks] = useState<string[]>([]);
  const [boardHydrated, setBoardHydrated] = useState(false);
  const [matcherGuests, setMatcherGuests] = useState(120);
  const [matcherBudget, setMatcherBudget] = useState(6500);
  const [matcherSeason, setMatcherSeason] = useState<EventSeason>("Year-round");
  const [matcherSetting, setMatcherSetting] = useState<EventSetting>("Indoor");
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const scheduleRef = useRef<HTMLElement | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const previousScheduleFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const restored = JSON.parse(localStorage.getItem(BOARD_KEY) ?? localStorage.getItem(LEGACY_BOARD_KEY) ?? "[]") as unknown;
        if (Array.isArray(restored)) {
          const valid = new Set(events.flatMap((event) => directionsForCollection(collectionForEvent(event)).map((direction) => sampleKey(event, direction))));
          const seenDirections = new Set<string>();
          setSavedLooks(restored.filter((value): value is string => {
            if (typeof value !== "string" || !valid.has(value)) return false;
            const directionId = value.split("::")[1];
            if (!directionId || seenDirections.has(directionId)) return false;
            seenDirections.add(directionId);
            return true;
          }));
        }
      } catch {
        setSavedLooks([]);
      } finally {
        setBoardHydrated(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!boardHydrated) return;
    try {
      localStorage.setItem(BOARD_KEY, JSON.stringify(savedLooks));
    } catch {
      // The board remains usable for the current session when storage is unavailable.
    }
  }, [boardHydrated, savedLooks]);

  const overlayOpen = Boolean((activeEvent && activeDirection) || boardOpen);

  useEffect(() => {
    if (!overlayOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => (activeDirection ? scheduleRef.current : dialogRef.current)?.focus(), 10);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activeDirection) {
          setActiveDirection(null);
          setActiveEvent(null);
          window.setTimeout(() => previousScheduleFocus.current?.focus(), 30);
          return;
        }
        setActiveEvent(null);
        setBoardOpen(false);
        window.setTimeout(() => previousFocus.current?.focus(), 10);
      }
      const focusRoot = activeDirection ? scheduleRef.current : dialogRef.current;
      if (event.key === "Tab" && focusRoot) {
        const focusable = [...focusRoot.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, select")];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!focusRoot.contains(document.activeElement) || document.activeElement === focusRoot) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeDirection, activeEvent, boardOpen, overlayOpen]);

  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return events.filter((event) => {
      const searchable = [event.title, event.category, event.localExample, ...event.aliases].filter(Boolean).join(" ").toLowerCase();
      return (!normalized || searchable.includes(normalized))
        && (category === "All" || event.category === category)
        && (season === "All" || event.season === season || event.season === "Year-round")
        && (setting === "All" || event.setting === setting || event.setting === "Hybrid")
        && (!localOnly || event.localPriority);
    });
  }, [category, localOnly, query, season, setting]);

  const matcherResults = useMemo(() => {
    const wantedScale = scaleFromGuests(matcherGuests);
    return [...events]
      .map((event) => {
        const budgetDistance = Math.abs(matcherBudget - idealBudgetByScale[event.scale]);
        const budgetFit = Math.max(-5, 5 - Math.ceil(budgetDistance / 3000));
        return {
          event,
          score: (event.localPriority ? 3 : 0)
          + (event.scale === wantedScale || event.scale === "Flexible" ? 5 : 0)
          + (event.setting === matcherSetting || event.setting === "Hybrid" ? 3 : 0)
          + (event.season === matcherSeason || event.season === "Year-round" || matcherSeason === "Year-round" ? 2 : 0)
          + budgetFit,
        };
      })
      .sort((a, b) => b.score - a.score || a.event.index - b.event.index)
      .slice(0, 3);
  }, [matcherBudget, matcherGuests, matcherSeason, matcherSetting]);

  const localFeatureTitles = [
    "Rowing regatta",
    "Newfoundland folk festival or kitchen party",
    "Street festival",
    "Conference or convention",
    "Winter festival",
    "Newcomer welcome fair or settlement expo",
    "Wedding ceremony & reception",
  ];
  const localEvents = localFeatureTitles.flatMap((title) => {
    const match = events.find((event) => event.title === title && event.localPriority);
    return match ? [match] : [];
  });

  const focusCollectionForEvent = (event: EventType) => {
    const collection = collectionForEvent(event);
    setSelectedEventIds((current) => ({ ...current, [collection.id]: event.id }));
    const target = document.getElementById(`collection-${collection.id}`);
    if (!target) return;
    target.focus({ preventScroll: true });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  const openSchedule = (event: EventType, direction: InspirationDirection) => {
    previousScheduleFocus.current = document.activeElement as HTMLElement;
    setActiveEvent(event);
    setActiveDirection(direction);
  };

  const closeSchedule = () => {
    setActiveDirection(null);
    setActiveEvent(null);
    window.setTimeout(() => previousScheduleFocus.current?.focus(), 30);
  };

  const openBoard = () => {
    previousFocus.current = document.activeElement as HTMLElement;
    setActiveEvent(null);
    setActiveDirection(null);
    setBoardOpen(true);
  };

  const closeOverlay = () => {
    setActiveEvent(null);
    setActiveDirection(null);
    setBoardOpen(false);
    window.setTimeout(() => previousFocus.current?.focus(), 10);
  };

  const toggleLook = (event: EventType, direction: InspirationDirection) => {
    const key = sampleKey(event, direction);
    setSavedLooks((current) => current.includes(key)
      ? current.filter((value) => value !== key)
      : [...current.filter((value) => value.split("::")[1] !== direction.id), key]);
  };

  const selectedEventForCollection = (collection: EventCollection) => {
    const candidates = eventsForCollection(collection);
    return candidates.find((event) => event.id === selectedEventIds[collection.id]) ?? candidates[0];
  };

  const boardItems = savedLooks.flatMap((key) => {
    const [eventId, directionId] = key.split("::");
    const event = events.find((candidate) => candidate.id === eventId);
    const direction = inspirationDirections.find((candidate) => candidate.id === directionId);
    return event && direction ? [{ key, event, direction }] : [];
  });

  const primaryBoardEvent = boardItems[0]?.event;
  const plannerHref = (event: EventType, direction?: InspirationDirection, boardDirections: InspirationDirection[] = []) => {
    const params = new URLSearchParams({ event: event.title });
    if (direction) params.set("style", direction.title);
    boardDirections.slice(0, 12).forEach((savedDirection) => params.append("look", savedDirection.title));
    params.set("guests", String(Math.min(800, Math.max(10, Math.round(matcherGuests)))));
    params.set("budget", String(direction?.startingAt ?? matcherBudget));
    params.set("venue", direction?.venue ?? event.venuePattern);
    return `/studio?${params.toString()}`;
  };

  return (
    <main className="event-world-page">
      <div className="top-ribbon event-world-ribbon">
        <span>St. John&apos;s first · globally inspired</span>
        <span className="top-ribbon-secondary">42 concept scenes · each shown once</span>
      </div>

      <header className="site-header event-world-header">
        <a className="brand" href="/" aria-label={`${BRAND.name} home`}><BrandLockup /></a>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>
          <a className="active" href="/events" aria-current="page">Event world</a>
          <a href="/#inspiration">Signature looks</a>
          <a href="/studio">Design studio</a><a href="/my-event">My event</a>
        </nav>
        <div className="header-actions">
          <button className="text-button" onClick={openBoard}>Planning board <span>{savedLooks.length}</span></button>
          <a className="solid-button compact" href="/studio">Start a brief</a>
        </div>
      </header>

      <section className="event-world-hero" id="main-content" tabIndex={-1}>
        <div className="event-world-hero-media" aria-hidden="true">
          <Image unoptimized priority src="/decor-v2/hero-glasshouse-v2-hd.webp" alt="" width={3070} height={2048} fetchPriority="high" sizes="100vw" />
        </div>
        <div className="event-world-hero-copy">
          <p className="eyebrow light">The {BRAND.name} Event World</p>
          <h1>There is a room for <em>every reason</em> people gather.</h1>
          <p>Search {events.length} real occasions, then enter one of six disciplined visual worlds. The 42 generated concept scenes are never recycled between themes: one scene, one placement, one clear reason to exist. These are design concepts, not photographs of completed client events.</p>
          <div className="event-world-stats" aria-label="Gallery coverage">
            <div><strong>{events.length}</strong><span>searchable occasions</span></div>
            <div><strong>{eventCollections.length}</strong><span>visual collections</span></div>
            <div><strong>{inspirationDirections.length}</strong><span>distinct concept scenes</span></div>
          </div>
          <a className="solid-button light-button" href="#visual-collections">Enter the collections <Arrow /></a>
        </div>

        <aside className="event-compass" aria-label="Event direction matcher">
          <div className="event-compass-heading"><span>Live event compass</span><strong>Find the strongest starting points.</strong></div>
          <label>Guests <b>{matcherGuests}</b><input type="range" min="10" max="800" step="10" value={matcherGuests} onChange={(event) => setMatcherGuests(Number(event.target.value))} /></label>
          <label>Décor investment <b>{currency(matcherBudget)}</b><input type="range" min="1500" max="30000" step="500" value={matcherBudget} onChange={(event) => setMatcherBudget(Number(event.target.value))} /></label>
          <div className="event-compass-selects">
            <label>Season<select value={matcherSeason} onChange={(event) => setMatcherSeason(event.target.value as EventSeason)}>{["Year-round", "Spring", "Summer", "Autumn", "Winter"].map((value) => <option key={value}>{value}</option>)}</select></label>
            <label>Setting<select value={matcherSetting} onChange={(event) => setMatcherSetting(event.target.value as EventSetting)}>{["Indoor", "Outdoor", "Hybrid"].map((value) => <option key={value}>{value}</option>)}</select></label>
          </div>
          <div className="event-compass-scope"><span>Recommended scope</span><strong>{scopeFromBudget(matcherBudget)}</strong></div>
          <div className="event-compass-results">
            {matcherResults.map(({ event }, index) => <button key={event.id} onClick={() => focusCollectionForEvent(event)}><b>0{index + 1}</b><span><strong>{event.title}</strong><small>{collectionForEvent(event).title} · {event.setting}</small></span><i>↘</i></button>)}
          </div>
        </aside>
      </section>

      <section className="local-event-section">
        <div className="event-world-shell local-event-heading">
          <div><p className="eyebrow">Popular and practical in St. John&apos;s</p><h2>Designed for the events this city actually hosts.</h2></div>
          <p>These are direct routes into the right collection—not duplicate cover photos. Local priorities reflect recurring programming, major venue formats and established traditions, not paid placement.</p>
        </div>
        <div className="local-event-rail">
          {localEvents.map((event, index) => <button key={event.id} onClick={() => focusCollectionForEvent(event)} className="local-event-card">
            <span>Local route {String(index + 1).padStart(2, "0")}</span>
            <div><small>{event.localExample}</small><strong>{event.title}</strong><p>{collectionForEvent(event).title}</p><i>Open its collection ↘</i></div>
          </button>)}
        </div>
        <div className="event-world-shell local-signal-grid">
          <a href="https://stjohnsregatta.ca/" target="_blank" rel="noreferrer"><span>Local signal 01</span><strong>Regatta-scale lakeside hospitality</strong><p>The annual Royal Regatta combines rowing, public festivities and weather-dependent operations at Quidi Vidi Lake.</p></a>
          <a href="https://sjcc.ca/plan/spaces/" target="_blank" rel="noreferrer"><span>Local signal 02</span><strong>Large professional-event capacity</strong><p>The Convention Centre supports conferences, galas, exhibitions and high-capacity receptions.</p></a>
          <a href="https://www.stjohns.ca/recreation-culture/events/city-hosted-events/" target="_blank" rel="noreferrer"><span>Local signal 03</span><strong>Four-season civic programming</strong><p>Winter festivals, markets, concerts, holiday events and newcomer programs create year-round formats.</p></a>
        </div>
      </section>

      <section className="event-collections-section" id="visual-collections">
        <div className="event-world-shell event-collections-heading">
          <div><p className="eyebrow">Six visual worlds · zero recycled scenes</p><h2>Every scene earns one place.</h2></div>
          <p>The catalogue has been tightened into six stronger collections. Choose the exact occasion inside a collection; quantities, measurements and the studio handoff remain specific to that selection.</p>
        </div>

        <div className="event-collections-list">
          {eventCollections.map((collection) => {
            const collectionEvents = eventsForCollection(collection);
            const selectedEvent = selectedEventForCollection(collection);
            const directions = directionsForCollection(collection);
            if (!selectedEvent) return null;
            return <article className="event-collection" id={`collection-${collection.id}`} key={collection.id} tabIndex={-1}>
              <div className="event-world-shell event-collection-head">
                <div><span>{collection.kicker}</span><h2>{collection.title}</h2><p>{collection.description}</p></div>
                <label className="event-collection-select">Plan these scenes for
                  <select value={selectedEvent.id} onChange={(event) => setSelectedEventIds((current) => ({ ...current, [collection.id]: event.target.value }))}>
                    {collectionEvents.map((event) => <option value={event.id} key={event.id}>{event.title}</option>)}
                  </select>
                  <small>{selectedEvent.season} · {selectedEvent.setting} · {selectedEvent.guestRange}</small>
                </label>
              </div>
              <div className="event-world-shell event-collection-note"><strong>Planning lens</strong><p>{collection.planningNote}</p></div>
              <div className="event-world-shell event-collection-grid">
                {directions.map((direction, index) => {
                  const saved = savedLooks.includes(sampleKey(selectedEvent, direction));
                  return <article className="event-collection-card" key={direction.id}>
                    <button className="event-collection-image" onClick={() => openSchedule(selectedEvent, direction)} aria-label={`Open item schedule for ${direction.title}, adapted to ${selectedEvent.title}`}>
                      <Image unoptimized src={direction.image} alt={`${direction.title} event décor concept`} width={1536} height={1024} loading="lazy" decoding="async" sizes="(max-width: 840px) calc(100vw - 38px), (max-width: 1180px) 50vw, 33vw" />
                      <span>{String(index + 1).padStart(2, "0")} / 07</span><b>See quantities + measurements ↗</b>
                    </button>
                    <div className="event-collection-copy"><p>{direction.venue}</p><h3>{direction.title}</h3><span>{direction.mood}</span><div className="event-direction-palette" aria-label={`${direction.title} palette`}>{direction.palette.map((color) => <i key={color} style={{ background: color }} />)}</div><small>Reference investment from {currency(direction.startingAt)}</small></div>
                    <button className={saved ? "saved" : ""} onClick={() => toggleLook(selectedEvent, direction)} aria-pressed={saved}>{saved ? "Saved to board ✓" : `+ Save for ${selectedEvent.title}`}</button>
                  </article>;
                })}
              </div>
            </article>;
          })}
        </div>
      </section>

      <section className="event-catalog-section" id="event-catalog">
        <div className="event-world-shell event-catalog-heading">
          <div><p className="eyebrow">The complete text-only occasion index</p><h2>Find any reason to gather.</h2></div>
          <p>All {events.length} décor-relevant occasions remain searchable without duplicating photography. Choose one and we will take you to its strongest visual collection with the exact occasion already selected.</p>
        </div>

        <div className="event-world-shell event-filters">
          <label className="event-search"><SearchIcon /><span className="sr-only">Search events</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search wedding, regatta, Eid, conference…" /></label>
          <label><span>Season</span><select value={season} onChange={(event) => setSeason(event.target.value as "All" | EventSeason)}>{["All", "Spring", "Summer", "Autumn", "Winter", "Year-round"].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label><span>Setting</span><select value={setting} onChange={(event) => setSetting(event.target.value as "All" | EventSetting)}>{["All", "Indoor", "Outdoor", "Hybrid"].map((value) => <option key={value}>{value}</option>)}</select></label>
          <button className={localOnly ? "active" : ""} onClick={() => setLocalOnly((value) => !value)} aria-pressed={localOnly}>St. John&apos;s priorities</button>
        </div>

        <div className="event-world-shell event-category-row" role="group" aria-label="Filter by event family">
          <button className={category === "All" ? "active" : ""} onClick={() => setCategory("All")} aria-pressed={category === "All"}>All <span>{events.length}</span></button>
          {categories.map((item) => <button key={item.id} className={category === item.id ? "active" : ""} onClick={() => setCategory(item.id)} aria-pressed={category === item.id}>{item.label} <span>{item.count}</span></button>)}
        </div>

        <div className="event-world-shell event-result-bar"><p role="status" aria-live="polite"><strong>{filteredEvents.length}</strong> {filteredEvents.length === 1 ? "occasion" : "occasions"}</p><button onClick={() => { setQuery(""); setCategory("All"); setSeason("All"); setSetting("All"); setLocalOnly(false); }}>Reset filters</button></div>

        {filteredEvents.length ? (
          <div className="event-world-shell event-occasion-grid">
            {filteredEvents.map((event) => <button className="event-occasion-card" key={event.id} onClick={() => focusCollectionForEvent(event)}>
              <span>{event.localPriority ? "St. John's priority" : event.category}</span>
              <small>{event.season} · {event.setting} · {event.scale}</small>
              <strong>{event.title}</strong>
              <p>{collectionForEvent(event).title}</p>
              <i>Open collection ↘</i>
            </button>)}
          </div>
        ) : (
          <div className="event-world-shell event-empty"><span>0</span><h3>No exact match yet.</h3><p>Clear a filter or search a broader occasion. The design studio can still compose a custom event format from scratch.</p><button className="solid-button" onClick={() => { setQuery(""); setCategory("All"); setSeason("All"); setSetting("All"); setLocalOnly(false); }}>Show every event</button></div>
        )}
      </section>

      <section className="event-intelligence-section">
        <div className="event-world-shell event-intelligence-heading"><p className="eyebrow light">Beyond the image grid</p><h2>Every inspiration can become an executable event brief.</h2></div>
        <div className="event-world-shell event-intelligence-grid">
          <article><span>01</span><h3>Zero-repeat visual system</h3><p>Forty-two original scenes are divided once across six visual collections. No card is disguised as a different theme.</p></article>
          <article><span>02</span><h3>Local operating intelligence</h3><p>Weather, wind, access, venue class, guest flow and seasonal substitution logic travel with the visual direction.</p></article>
          <article><span>03</span><h3>Persistent planning board</h3><p>Save a look once, attach it to the correct occasion and carry every selected signal into the design studio.</p></article>
          <article><span>04</span><h3>Specification-ready handoff</h3><p>Move from an event and direction into the design studio, then calculate inventory, quantities, measurements and scope.</p></article>
        </div>
      </section>

      <section className="event-world-cta">
        <div className="event-world-cta-orbit" aria-hidden="true"><span /><span /><span /></div>
        <div><p className="eyebrow light">Found the signal?</p><h2>Now make it unmistakably yours.</h2><p>Bring one precise direction or a board of contrasting ideas. The studio translates the signal into a venue-aware, quantity-ready plan.</p><a className="solid-button light-button" href="/studio">Open the design studio <Arrow /></a></div>
      </section>

      <footer className="event-world-footer">
        <a className="brand footer-brand" href="/" aria-label={`${BRAND.name} home`}><BrandLockup /></a>
        <p>Cinematic event design for St. John&apos;s and the Avalon Peninsula.</p>
        <div><a href="/">Home</a><a href="/#inspiration">Signature looks</a><a href="/studio">Design studio</a><a href="/privacy">Privacy</a><a href="/install">Get the app</a><button onClick={openBoard}>Planning board ({savedLooks.length})</button></div>
      </footer>

      <div className="event-world-mobile-nav"><a href="/">Home</a><a href="#visual-collections">Collections</a><button onClick={openBoard}>Board {savedLooks.length}</button><a href="/studio">Design</a></div>

      {boardOpen && (
        <div className="event-world-overlay" role="dialog" aria-modal="true" aria-labelledby="board-title">
          <button className="event-world-backdrop" tabIndex={-1} onClick={closeOverlay} aria-label="Close planning board" />
          <aside className="event-board" ref={dialogRef} tabIndex={-1}>
            <div className="event-board-head"><div><span>Your cross-event visual signal</span><h2 id="board-title">Planning board</h2></div><button onClick={closeOverlay} aria-label="Close">×</button></div>
            {boardItems.length ? <>
              <div className="event-board-summary"><strong>{boardItems.length}</strong><p>saved {boardItems.length === 1 ? "direction" : "directions"} across <b>{new Set(boardItems.map((item) => item.event.id)).size}</b> occasions.</p></div>
              <div className="event-board-items">{boardItems.map(({ key, event, direction }) => <article key={key}><div className="event-board-swatch" aria-hidden="true" style={{ background: `linear-gradient(135deg, ${direction.palette[0]} 0 38%, ${direction.palette[1]} 38% 70%, ${direction.palette[2]} 70%)` }} /><div><small>{event.title}</small><strong>{direction.title}</strong><span>{direction.mood}</span></div><button onClick={() => setSavedLooks((current) => current.filter((value) => value !== key))} aria-label={`Remove ${direction.title} for ${event.title}`}>×</button></article>)}</div>
              <div className="event-board-footer"><p>Palette temperature, venue geometry, light and density can now seed your exact design brief without duplicating gallery photography.</p>{primaryBoardEvent && <a className="solid-button" href={plannerHref(primaryBoardEvent, boardItems[0].direction, boardItems.map((item) => item.direction))}>Build from this board <Arrow /></a>}<button onClick={() => setSavedLooks([])}>Clear board</button></div>
            </> : <div className="event-board-empty"><span>♡</span><h3>No directions saved yet.</h3><p>Save the one-use scenes that catch your eye. Each selection keeps its exact occasion context.</p><button className="solid-button" onClick={closeOverlay}>Explore collections</button></div>}
          </aside>
        </div>
      )}

      {activeEvent && activeDirection && (
        <div className="event-schedule-overlay" role="dialog" aria-modal="true" aria-labelledby="event-schedule-title">
          <button className="event-schedule-backdrop" tabIndex={-1} onClick={closeSchedule} aria-label="Close item schedule" />
          <aside className="event-schedule-sheet" ref={scheduleRef} tabIndex={-1}>
            <button className="event-schedule-close" onClick={closeSchedule} aria-label="Close">×</button>
            <div className="event-schedule-visual event-schedule-material" style={{ background: `linear-gradient(120deg, ${activeDirection.palette[0]} 0 36%, ${activeDirection.palette[1]} 36% 68%, ${activeDirection.palette[2]} 68%)` }}><span>Reference build sheet · {activeDirection.title}</span></div>
            <div className="event-schedule-title"><p>{activeEvent.title}</p><h2 id="event-schedule-title">{activeDirection.title}</h2><span>{activeDirection.mood}</span></div>
            <div className="event-schedule-summary">
              <div><span>Reference guests</span><strong>{Math.min(800, Math.max(10, Math.round(matcherGuests)))}</strong></div>
              <div><span>Starting investment</span><strong>{currency(activeDirection.startingAt)}</strong></div>
              <div><span>Venue signal</span><strong>{activeDirection.venue}</strong></div>
            </div>
            <div className="event-schedule-heading"><div><span>Quantity + measurement schedule</span><h3>What it takes to build this direction.</h3></div><p>Reference quantities update from the guest count in your Event Compass. Final inventory follows a measured floor plan, venue rules and an approved production design.</p></div>
            <div className="event-schedule-table-wrap">
              <table className="event-schedule-table">
                <thead><tr><th>Zone / item</th><th>Qty</th><th>Reference measurement</th><th>Production note</th></tr></thead>
                <tbody>{referenceSchedule(activeEvent, activeDirection, matcherGuests).map((item) => <tr key={`${item.zone}-${item.item}`}><td data-label="Zone / item"><small>{item.zone}</small><strong>{item.item}</strong></td><td data-label="Quantity">{item.quantity}</td><td data-label="Reference measurement">{item.measurement}</td><td data-label="Production note">{item.note}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="event-schedule-note"><strong>Planning note</strong><p>This is a transparent reference schedule, not a final quote or engineering document. {BRAND.name} confirms real stock, fabrication, rigging, fire-rating, weather and labour after venue review.</p></div>
            <div className="event-schedule-actions"><a className="solid-button" href={plannerHref(activeEvent, activeDirection)}>Adapt this direction in the studio <Arrow /></a><button className="outline-button" onClick={() => toggleLook(activeEvent, activeDirection)} aria-pressed={savedLooks.includes(sampleKey(activeEvent, activeDirection))}>{savedLooks.includes(sampleKey(activeEvent, activeDirection)) ? "Saved to board ✓" : "+ Save to planning board"}</button></div>
          </aside>
        </div>
      )}
    </main>
  );
}
