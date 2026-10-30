"use client";

import { UIIcon } from "../ui-icon";


/* eslint-disable @next/next/no-html-link-for-pages */

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { designMatchesFilters, profileForDirection } from "./design-profiles";
import { normalizeGuestCount, referenceSchedule, scheduleCsv } from "./reference-schedule";
import SiteHeader from "../site-header";
import MobileActionBar from "../mobile-action-bar";
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

const NEW_DESIGN_IDS = new Set(["apartment-atelier", "quiet-cove", "rain-garden", "open-circle", "makers-workshop", "screen-salon"]);

const sampleKey = (event: EventType, direction: InspirationDirection) => `${event.id}::${direction.id}`;

export default function EventWorld() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | EventCategory>("All");
  const [season, setSeason] = useState<"All" | EventSeason>("All");
  const [setting, setSetting] = useState<"All" | EventSetting>("All");
  const [localOnly, setLocalOnly] = useState(false);
  const [newDesignsOnly, setNewDesignsOnly] = useState(false);
  const [designQuery, setDesignQuery] = useState("");
  const [designSetting, setDesignSetting] = useState<"All" | EventSetting>("All");
  const [designCollection, setDesignCollection] = useState<"All" | EventCollectionId>("All");
  const [designOccasion, setDesignOccasion] = useState("All");
  const [reservePercent, setReservePercent] = useState(10);
  const [scheduleGuestInput, setScheduleGuestInput] = useState("120");
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
          // Keep existing boards valid when the catalogue gains more specific occasion guidance.
          const valid = new Set(events.flatMap((event) => inspirationDirections.map((direction) => sampleKey(event, direction))));
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

  const selectedDesignEvent = events.find((event) => event.id === designOccasion);
  const visibleCollections = useMemo(() => eventCollections
    .filter((collection) => designCollection === "All" || collection.id === designCollection)
    .map((collection) => ({
      collection,
      directions: directionsForCollection(collection).filter((direction) => (!newDesignsOnly || NEW_DESIGN_IDS.has(direction.id)) && designMatchesFilters(direction, {
        query: designQuery,
        setting: designSetting === "All" ? undefined : designSetting,
        occasionId: designOccasion === "All" ? undefined : designOccasion,
      })),
    }))
    .filter(({ directions }) => directions.length > 0),
  [designCollection, designOccasion, designQuery, designSetting, newDesignsOnly]);
  const visibleDesignCount = visibleCollections.reduce((total, { directions }) => total + directions.length, 0);

  const resetDesignFilters = () => {
    setNewDesignsOnly(false);
    setDesignQuery("");
    setDesignSetting("All");
    setDesignCollection("All");
    setDesignOccasion("All");
  };

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
    setNewDesignsOnly(false);
    const collection = collectionForEvent(event);
    setSelectedEventIds((current) => ({ ...current, [collection.id]: event.id }));
    setDesignQuery("");
    setDesignSetting("All");
    setDesignCollection("All");
    setDesignOccasion(event.id);
    const target = document.getElementById("design-filters");
    if (!target) return;
    target.focus({ preventScroll: true });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  };

  const openSchedule = (event: EventType, direction: InspirationDirection) => {
    previousScheduleFocus.current = document.activeElement as HTMLElement;
    setActiveEvent(event);
    setActiveDirection(direction);
    setScheduleGuestInput(String(normalizeGuestCount(direction, matcherGuests)));
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
  const plannerHref = (event: EventType, direction?: InspirationDirection, boardDirections: InspirationDirection[] = [], guestCount = matcherGuests) => {
    const params = new URLSearchParams({ event: event.title });
    if (direction) { params.set("style", direction.title); params.set("design", direction.id); params.set("reserve", String(reservePercent)); }
    boardDirections.slice(0, 12).forEach((savedDirection) => params.append("look", savedDirection.title));
    params.set("guests", String(direction ? normalizeGuestCount(direction, guestCount) : Math.min(800, Math.max(10, Math.round(guestCount)))));
    if (!direction || direction.startingAt !== null) params.set("budget", String(direction?.startingAt ?? matcherBudget));
    params.set("venue", direction?.venue ?? event.venuePattern);
    return `/studio?${params.toString()}`;
  };

  const designHref = (event: EventType, direction: InspirationDirection, guestCount = matcherGuests) => {
    const params = new URLSearchParams({ event: event.id, guests: String(normalizeGuestCount(direction, guestCount)), reserve: String(reservePercent) });
    return `/events/designs/${direction.id}?${params.toString()}`;
  };

  const downloadSchedule = (event: EventType, direction: InspirationDirection, guestCount: number) => {
    const url = URL.createObjectURL(new Blob([scheduleCsv(event, direction, guestCount, reservePercent)], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `kingsperl-${direction.id}-${guestCount}-${profileForDirection(direction).capacityBasis === "concurrent" ? "users" : "guests"}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const activeProfile = activeDirection ? profileForDirection(activeDirection) : null;
  const scheduleGuests = activeDirection ? normalizeGuestCount(activeDirection, Number(scheduleGuestInput)) : matcherGuests;

  return (
    <main className="event-world-page">
      <SiteHeader onBoard={openBoard} boardCount={savedLooks.length} />

      <section className="event-world-hero" id="main-content" tabIndex={-1}>
        <div className="event-world-hero-copy">
          <p className="eyebrow light">THE KINGSPERL COLLECTIONS</p>
          <h1>A world of ideas.<br /><em>Your kind of occasion.</em></h1>
          <p>Explore {events.length} occasions and {eventCollections.length} curated collections. Save what you love, find your direction and begin making it yours. Images are inspirational design concepts.</p>
          <div className="event-world-stats" aria-label="Gallery coverage">
            <div><strong>{events.length}</strong><span>searchable occasions</span></div>
            <div><strong>{eventCollections.length}</strong><span>visual collections</span></div>
            <div><strong>{inspirationDirections.length}</strong><span>distinct concept scenes</span></div>
          </div>
          <a className="solid-button light-button" href="#visual-collections">Enter the collections <Arrow /></a>
        </div>

        <aside className="event-compass" aria-label="Event direction matcher">
          <div className="event-compass-heading"><span>A starting point, just for you</span><strong>Find your fit.</strong></div>
          <label>Guests <b>{matcherGuests}</b><input type="range" min="10" max="800" step="10" value={matcherGuests} onChange={(event) => setMatcherGuests(Number(event.target.value))} /></label>
          <label>Décor investment <b>{currency(matcherBudget)}</b><input type="range" min="1500" max="30000" step="500" value={matcherBudget} onChange={(event) => setMatcherBudget(Number(event.target.value))} /></label>
          <div className="event-compass-selects">
            <label>Season<select value={matcherSeason} onChange={(event) => setMatcherSeason(event.target.value as EventSeason)}>{["Year-round", "Spring", "Summer", "Autumn", "Winter"].map((value) => <option key={value}>{value}</option>)}</select></label>
            <label>Setting<select value={matcherSetting} onChange={(event) => setMatcherSetting(event.target.value as EventSetting)}>{["Indoor", "Outdoor", "Hybrid"].map((value) => <option key={value}>{value}</option>)}</select></label>
          </div>
          <div className="event-compass-scope"><span>Recommended scope</span><strong>{scopeFromBudget(matcherBudget)}</strong></div>
          <div className="event-compass-results">
            {matcherResults.map(({ event }, index) => <button key={event.id} onClick={() => focusCollectionForEvent(event)}><b>0{index + 1}</b><span><strong>{event.title}</strong><small>{collectionForEvent(event).title} · {event.setting}</small></span><i><UIIcon name="arrow-right" /></i></button>)}
          </div>
        </aside>
      </section>

      <section className="local-event-section">
        <div className="event-world-shell local-event-heading">
          <div><p className="eyebrow">What brings you together?</p><h2>Start with your occasion.</h2></div>
          <p>From life’s milestones to gatherings that move a community, find a collection that speaks to your moment.</p>
        </div>
        <div className="local-event-rail">
          {localEvents.map((event, index) => <button key={event.id} onClick={() => focusCollectionForEvent(event)} className="local-event-card">
            <span>Local route {String(index + 1).padStart(2, "0")}</span>
            <div><small>{event.localExample}</small><strong>{event.title}</strong><p>{collectionForEvent(event).title}</p><i>Open its collection <UIIcon name="arrow-right" /></i></div>
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
          <div><p className="eyebrow">{eventCollections.length} COLLECTIONS. ENDLESS PERSONALITY.</p><h2>Find the look that feels like you.</h2></div>
          <p>Explore every design by atmosphere, setting and occasion. Open a concept for its materials, layout and build sheet, then adapt it to your guest count.</p>
        </div>

        <div className="event-world-shell catalogue-new-directions">
          <div><p className="eyebrow">NEW PERSPECTIVES</p><h3>More ways to bring people together.</h3><p>Small home celebrations, quieter spaces, level-access ceremonies, indoor rain alternatives, hands-on workshops and connected meetings.</p></div>
          <button aria-pressed={newDesignsOnly} onClick={() => { resetDesignFilters(); setNewDesignsOnly(!newDesignsOnly); }}>{newDesignsOnly ? "Show every design" : "Explore 6 new concepts"} <Arrow /></button>
        </div>

        <div className="event-world-shell design-filter-panel" id="design-filters" tabIndex={-1}>
          <div className="design-filter-grid" role="search" aria-label="Find a design concept">
            <label className="design-filter-search"><span>Search designs</span><input type="search" value={designQuery} onChange={(event) => setDesignQuery(event.target.value)} placeholder="Try sage, home, quiet or lantern…" /></label>
            <label><span>Design setting</span><select value={designSetting} onChange={(event) => setDesignSetting(event.target.value as "All" | EventSetting)}>
              <option value="All">Every setting</option><option>Indoor</option><option>Outdoor</option><option value="Hybrid">Indoor + outdoor</option>
            </select></label>
            <label><span>Collection</span><select value={designCollection} onChange={(event) => setDesignCollection(event.target.value as "All" | EventCollectionId)}>
              <option value="All">Every collection</option>{eventCollections.map((collection) => <option value={collection.id} key={collection.id}>{collection.title}</option>)}
            </select></label>
            <label><span>Occasion</span><select value={designOccasion} onChange={(event) => setDesignOccasion(event.target.value)}>
              <option value="All">Every occasion</option>{events.map((event) => <option value={event.id} key={event.id}>{event.title}</option>)}
            </select></label>
          </div>
          <div className="design-filter-summary"><p role="status" aria-live="polite"><strong>{visibleDesignCount}</strong> of {inspirationDirections.length} design concepts{selectedDesignEvent ? ` for ${selectedDesignEvent.title.toLowerCase()}` : ""}</p><button type="button" onClick={resetDesignFilters}>Clear design filters</button></div>
          <p className="design-filter-note">Settings describe the concept shown. Indoor + outdoor means a combined venue plan; remote participation is identified in the design details.</p>
        </div>

        {visibleDesignCount === 0 && <div className="event-world-shell design-empty-results"><h3>No designs match these filters.</h3><p>Try another setting or clear the filters to explore every concept.</p><button className="solid-button" onClick={resetDesignFilters}>Show all designs <Arrow /></button></div>}
        <div className="event-collections-list">
          {visibleCollections.map(({ collection, directions }) => {
            const collectionEvents = eventsForCollection(collection);
            const selectedEvent = selectedDesignEvent ?? selectedEventForCollection(collection);
            if (!selectedEvent) return null;
            return <article className="event-collection" id={`collection-${collection.id}`} key={collection.id} tabIndex={-1}>
              <div className="event-world-shell event-collection-head">
                <div><span>{collection.kicker} · {directions.length} {directions.length === 1 ? "design" : "designs"}</span><h2>{collection.title}</h2><p>{collection.description}</p></div>
                <label className="event-collection-select">Plan these scenes for
                  <select value={selectedEvent.id} onChange={(event) => {
                    setDesignOccasion(event.target.value);
                    setDesignCollection(collection.id);
                    setSelectedEventIds((current) => ({ ...current, [collection.id]: event.target.value }));
                  }}>
                    {selectedDesignEvent && !collectionEvents.some((event) => event.id === selectedDesignEvent.id) && <option value={selectedDesignEvent.id}>{selectedDesignEvent.title}</option>}
                    {collectionEvents.map((event) => <option value={event.id} key={event.id}>{event.title}</option>)}
                  </select>
                  <small>{selectedEvent.season} · {selectedEvent.setting} · {selectedEvent.guestRange}</small>
                </label>
              </div>
              <div className="event-world-shell event-collection-note"><strong>Planning lens</strong><p>{collection.planningNote}</p></div>
              <div className="event-world-shell event-collection-grid">
                {directions.map((direction) => {
                  const profile = profileForDirection(direction);
                  const contextEvent = designMatchesFilters(direction, { occasionId: selectedEvent.id })
                    ? selectedEvent : events.find((event) => profile.occasionIds.includes(event.id)) ?? selectedEvent;
                  const saved = savedLooks.includes(sampleKey(contextEvent, direction));
                  return <article className="event-collection-card" key={direction.id}>
                    <button className="event-collection-image" onClick={() => openSchedule(contextEvent, direction)} aria-label={`Open item schedule for ${direction.title}, adapted to ${contextEvent.title}`}>
                      <Image unoptimized src={direction.image} alt={`${direction.title} event décor concept`} width={1536} height={1024} loading="lazy" decoding="async" sizes="(max-width: 840px) calc(100vw - 38px), (max-width: 1180px) 50vw, 33vw" />
                      <span className="design-concept-badge">Concept render</span><b>See quantities + measurements <UIIcon name="arrow-right" /></b>
                    </button>
                    <div className="event-collection-copy"><p>{direction.venue}</p><h3>{direction.title}</h3><span>{direction.mood}</span><div className="design-card-meta"><span>{profile.setting === "Hybrid" ? "Indoor + outdoor" : profile.setting}</span><span>{profile.settingLabel}</span></div><div className="event-direction-palette" aria-label={`${direction.title} palette`}>{direction.palette.map((color) => <i key={color} style={{ background: color }} />)}</div><small>{direction.startingAt !== null ? `Reference investment from ${currency(direction.startingAt)}` : "Quote after venue review"}</small><Link className="design-detail-link" href={designHref(contextEvent, direction)}>Explore design + build sheet <UIIcon name="arrow-right" /></Link></div>
                    <button className={saved ? "saved" : ""} onClick={() => toggleLook(contextEvent, direction)} aria-pressed={saved}>{saved ? "Saved to board ✓" : `+ Save for ${contextEvent.title}`}</button>
                  </article>;
                })}
              </div>
            </article>;
          })}
        </div>
      </section>

      <section className="event-catalog-section" id="event-catalog">
        <div className="event-world-shell event-catalog-heading">
          <div><p className="eyebrow">EVERY REASON TO CELEBRATE</p><h2>Find any reason to gather.</h2></div>
          <p>Explore all {events.length} occasions. Choose one to see the matching visual designs, with your exact occasion carried into each build sheet.</p>
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
              <i>Find designs <UIIcon name="arrow-right" /></i>
            </button>)}
          </div>
        ) : (
          <div className="event-world-shell event-empty"><span>0</span><h3>No exact match yet.</h3><p>Clear a filter or search a broader occasion. The design studio can still compose a custom event format from scratch.</p><button className="solid-button" onClick={() => { setQuery(""); setCategory("All"); setSeason("All"); setSetting("All"); setLocalOnly(false); }}>Show every event</button></div>
        )}
      </section>

      <section className="event-intelligence-section">
        <div className="event-world-shell event-intelligence-heading"><p className="eyebrow light">FROM INSPIRATION TO SOMETHING REAL</p><h2>Beautiful ideas. Practical plans.</h2></div>
        <div className="event-world-shell event-intelligence-grid">
          <article><span>01</span><h3>Room to imagine</h3><p>Explore {inspirationDirections.length} distinctive concept scenes across {eventCollections.length} collections, each with its own atmosphere and details.</p></article>
          <article><span>02</span><h3>Made for your venue</h3><p>Weather, wind, access, venue class, guest flow and seasonal substitution logic travel with the visual direction.</p></article>
          <article><span>03</span><h3>Keep what you love</h3><p>Save a look once, attach it to the correct occasion and carry every selected signal into the design studio.</p></article>
          <article><span>04</span><h3>A clear next step</h3><p>Move from an event and direction into the design studio, then calculate inventory, quantities, measurements and scope.</p></article>
        </div>
      </section>

      <section className="event-world-cta">
        <div className="event-world-cta-orbit" aria-hidden="true"><span /><span /><span /></div>
        <div><p className="eyebrow light">YOUR IDEAS ARE ONLY THE BEGINNING</p><h2>Now make it unmistakably yours.</h2><p>Bring a favourite look or a board full of possibilities. We’ll help turn your inspiration into a plan for your people and your place.</p><a className="solid-button light-button" href="/studio">Open the design studio <Arrow /></a></div>
      </section>

      <footer className="event-world-footer">
        <a className="brand footer-brand" href="/" aria-label={`${BRAND.name} home`}><BrandLockup /></a>
        <p>Cinematic event design for St. John&apos;s and the Avalon Peninsula.</p>
        <div><a href="/">Home</a><a href="/#inspiration">Signature looks</a><a href="/studio">Design studio</a><a href="/privacy">Privacy</a><a href="/install">Get the app</a><button onClick={openBoard}>Planning board ({savedLooks.length})</button></div>
      </footer>

      <MobileActionBar label="Mobile collection navigation" actions={[
        { label: "Home", icon: "home", href: "/" },
        { label: "Ideas", icon: "grid", href: "#visual-collections", current: true },
        { label: "Saved", icon: "bookmark", count: savedLooks.length, onClick: openBoard },
        { label: "Design", icon: "design", href: "/studio", primary: true },
      ]} />

      {boardOpen && (
        <div className="event-world-overlay" role="dialog" aria-modal="true" aria-labelledby="board-title">
          <button className="event-world-backdrop" tabIndex={-1} onClick={closeOverlay} aria-label="Close planning board" />
          <aside className="event-board" ref={dialogRef} tabIndex={-1}>
            <div className="event-board-head"><div><span>Your cross-event visual signal</span><h2 id="board-title">Planning board</h2></div><button onClick={closeOverlay} aria-label="Close">×</button></div>
            {boardItems.length ? <>
              <div className="event-board-summary"><strong>{boardItems.length}</strong><p>saved {boardItems.length === 1 ? "direction" : "directions"} across <b>{new Set(boardItems.map((item) => item.event.id)).size}</b> occasions.</p></div>
              <div className="event-board-items">{boardItems.map(({ key, event, direction }) => <article key={key}><div className="event-board-swatch" aria-hidden="true" style={{ background: `linear-gradient(135deg, ${direction.palette[0]} 0 38%, ${direction.palette[1]} 38% 70%, ${direction.palette[2]} 70%)` }} /><div><small>{event.title}</small><strong>{direction.title}</strong><span>{direction.mood}</span></div><button onClick={() => setSavedLooks((current) => current.filter((value) => value !== key))} aria-label={`Remove ${direction.title} for ${event.title}`}>×</button></article>)}</div>
              <div className="event-board-footer"><p>Palette temperature, venue geometry, light and density can now seed your exact design brief with the occasion preserved.</p>{primaryBoardEvent && <a className="solid-button" href={plannerHref(primaryBoardEvent, boardItems[0].direction, boardItems.map((item) => item.direction))}>Build from this board <Arrow /></a>}<button onClick={() => setSavedLooks([])}>Clear board</button></div>
            </> : <div className="event-board-empty"><span>♡</span><h3>No directions saved yet.</h3><p>Save the concepts that catch your eye. Each selection keeps its exact occasion context.</p><button className="solid-button" onClick={closeOverlay}>Explore collections</button></div>}
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
              <div><span>{activeProfile?.capacityBasis === "concurrent" ? "Concurrent users" : "Reference guests"}</span><strong>{scheduleGuests}</strong></div>
              <div><span>Reference investment</span><strong>{activeDirection.startingAt !== null ? currency(activeDirection.startingAt) : "Quote after venue review"}</strong></div>
              <div><span>Venue signal</span><strong>{activeDirection.venue}</strong></div>
            </div>
            <div className="event-schedule-heading"><div><span>Quantity + measurement schedule</span><h3>What it takes to build this direction.</h3></div><p>Adjust the guests and spare allowance below. Quantities are planning references; final stock and specialist installations are confirmed after venue review.</p></div>
            <div className="design-schedule-controls">
              <label>{activeProfile?.capacityBasis === "concurrent" ? "Concurrent users" : "Reference guests"}<input type="number" min={activeProfile?.minGuests ?? 10} max={activeProfile?.maxGuests ?? 800} step="1" value={scheduleGuestInput} onChange={(event) => setScheduleGuestInput(event.target.value)} onBlur={() => setScheduleGuestInput(String(scheduleGuests))} /></label>
              <label>Spare allowance<select value={reservePercent} onChange={(event) => setReservePercent(Number(event.target.value))}>{[0, 5, 10, 15].map((value) => <option key={value} value={value}>{value}%</option>)}</select></label>
              <button className="outline-button" onClick={() => downloadSchedule(activeEvent, activeDirection, scheduleGuests)}>Download CSV</button>
              <Link className="outline-button" href={`${designHref(activeEvent, activeDirection, scheduleGuests)}#build-sheet`}>Open printable build sheet <Arrow /></Link>
            </div>
            <p className="design-capacity-note">{activeProfile?.capacityNote}</p>
            <div className="event-schedule-table-wrap">
              <table className="event-schedule-table">
                <thead><tr><th>Zone / item</th><th>Base</th><th>Spare</th><th>Total</th><th>Reference measurement</th><th>Production note</th></tr></thead>
                <tbody>{referenceSchedule(activeEvent, activeDirection, scheduleGuests, reservePercent).map((item) => <tr key={`${item.zone}-${item.item}`}><td data-label="Zone / item"><small>{item.zone}</small><strong>{item.item}</strong></td><td data-label="Base quantity">{item.quantity}</td><td data-label="Spare quantity">{item.spare}</td><td data-label="Total quantity"><strong>{item.totalQuantity}</strong></td><td data-label="Reference measurement">{item.measurement}</td><td data-label="Production note">{item.note}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="event-schedule-note"><strong>Planning note</strong><p>This is a transparent reference schedule, not a final quote or engineering document. {BRAND.name} confirms real stock, fabrication, rigging, fire-rating, weather and labour after venue review.</p></div>
            <div className="event-schedule-actions"><a className="solid-button" href={plannerHref(activeEvent, activeDirection, [], scheduleGuests)}>Adapt this direction in the studio <Arrow /></a><button className="outline-button" onClick={() => toggleLook(activeEvent, activeDirection)} aria-pressed={savedLooks.includes(sampleKey(activeEvent, activeDirection))}>{savedLooks.includes(sampleKey(activeEvent, activeDirection)) ? "Saved to board ✓" : "+ Save to planning board"}</button></div>
          </aside>
        </div>
      )}
    </main>
  );
}
