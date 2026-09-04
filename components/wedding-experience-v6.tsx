"use client";

import NextImage, { type ImageProps } from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Accessibility,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BedDouble,
  BellRing,
  CalendarHeart,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CirclePause,
  CirclePlay,
  Compass,
  Copy,
  Gift,
  Heart,
  Images,
  MapPin,
  Menu,
  MessageCircleQuestion,
  Plane,
  Search,
  ShieldCheck,
  Shirt,
  Sparkles,
  X,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RsvpDialog } from "@/components/wedding-experience";
import { weddingContent } from "@/lib/wedding-content";

const heroFrames = [
  {
    src: "/engagement-laughter.webp",
    alt: "Kingsford and Perla laughing together at their engagement celebration.",
    label: "The day we said yes",
    note: "Joy in every frame",
    orientation: "wide",
    desktopPosition: "58% 28%",
    mobilePosition: "58% 32%",
  },
  {
    src: "/engagement-couple.webp",
    alt: "Kingsford and Perla smiling and holding hands in coordinated engagement attire.",
    label: "Together",
    note: "Our next chapter",
    orientation: "portrait",
    desktopPosition: "50% 30%",
    mobilePosition: "50% 32%",
  },
  {
    src: "/engagement-together.webp",
    alt: "Kingsford and Perla standing together at their engagement celebration.",
    label: "One promise",
    note: "Kingsford & Perla",
    orientation: "wide",
    desktopPosition: "50% 30%",
    mobilePosition: "50% 32%",
  },
  {
    src: "/engagement-perla.webp",
    alt: "Perla posing in her orange and brown engagement dress.",
    label: "Radiance",
    note: "A beautiful beginning",
    orientation: "portrait",
    desktopPosition: "55% 34%",
    mobilePosition: "55% 34%",
  },
  {
    src: "/engagement-quiet-moment.webp",
    alt: "Kingsford facing Perla during a quiet moment at their engagement celebration.",
    label: "A quiet moment",
    note: "Between all the joy",
    orientation: "portrait",
    desktopPosition: "64% 45%",
    mobilePosition: "64% 45%",
  },
  {
    src: "/engagement-joy.webp",
    alt: "Perla smiling and clapping during the engagement celebration.",
    label: "Pure joy",
    note: "29 August 2026",
    orientation: "portrait",
    desktopPosition: "49% 39%",
    mobilePosition: "50% 39%",
  },
  {
    src: "/engagement-celebration.webp",
    alt: "Kingsford and Perla sharing a playful moment at their engagement celebration.",
    label: "Love in motion",
    note: "Unmistakably us",
    orientation: "wide",
    desktopPosition: "54% 36%",
    mobilePosition: "54% 36%",
  },
  {
    src: "/engagement-radiance.webp",
    alt: "Perla laughing in her engagement dress.",
    label: "Her joy",
    note: "A room full of love",
    orientation: "portrait",
    desktopPosition: "42% 27%",
    mobilePosition: "42% 28%",
  },
  {
    src: "/engagement-candid.webp",
    alt: "Perla smiling among guests at the engagement celebration.",
    label: "Among our people",
    note: "Held by family",
    orientation: "portrait",
    desktopPosition: "56% 42%",
    mobilePosition: "56% 42%",
  },
] as const;

const navItems = [
  { label: "Our story", href: "#story" },
  { label: "Gallery", href: "#gallery" },
  { label: "Guest guide", href: "#guest-guide" },
  { label: "RSVP", href: "#rsvp" },
] as const;

const essentialCards = [
  {
    icon: CalendarHeart,
    label: "Wedding date & place",
    title: "Being finalised",
    copy: "The verified date, venue, arrival time and directions will appear here first.",
    status: "Update pending",
    tone: "pending",
  },
  {
    icon: Heart,
    label: "Household RSVP",
    title: "Open now",
    copy: "Respond once for your household, include your needs and return later to update it.",
    status: "Ready to use",
    tone: "live",
  },
  {
    icon: ShieldCheck,
    label: "Private confirmation",
    title: "Protected",
    copy: "Every response receives a private reference for secure lookup and changes.",
    status: "Live now",
    tone: "live",
  },
  {
    icon: BellRing,
    label: "Guest updates",
    title: "One source",
    copy: "Schedule, travel, attire, accommodation and registry updates stay in this wedding home.",
    status: "Always current",
    tone: "ready",
  },
] as const;

const travelCards = [
  {
    icon: MapPin,
    title: "Venue & directions",
    copy: "The confirmed address, map, parking and arrival guidance will publish together.",
  },
  {
    icon: BedDouble,
    title: "Accommodation",
    copy: "Hotel suggestions and any room-block information will follow the confirmed location.",
  },
  {
    icon: Plane,
    title: "Getting here",
    copy: "Airport, station and local transport notes will be shaped around the wedding city.",
  },
] as const;

const conciergeItems = [
  {
    icon: CalendarHeart,
    title: "Wedding date and venue",
    summary: "Details are being finalised and will be published in the guest guide.",
    keywords: "date venue place time ceremony location",
    target: "#guest-guide",
  },
  {
    icon: Heart,
    title: "Send or update an RSVP",
    summary: "Respond for your household or find an existing response with your private reference.",
    keywords: "rsvp respond attendance update confirmation household",
    action: "rsvp",
  },
  {
    icon: Plane,
    title: "Travel and accommodation",
    summary: "Airport, transport, parking and stay guidance will publish after the venue is confirmed.",
    keywords: "travel hotel airport flight parking stay accommodation",
    target: "#guest-guide",
  },
  {
    icon: Shirt,
    title: "Dress code",
    summary: "Attire and colour guidance will appear with the formal invitation details.",
    keywords: "dress code attire colour outfit wear",
    target: "#guest-guide",
  },
  {
    icon: Accessibility,
    title: "Dietary or accessibility needs",
    summary: "Add private support requirements directly to your household RSVP.",
    keywords: "diet allergy accessibility disability support food meal",
    action: "rsvp",
  },
  {
    icon: Gift,
    title: "Registry and gifts",
    summary: "Your presence comes first. Any verified registry link will appear only here.",
    keywords: "gift registry present money",
    target: "#guest-guide",
  },
  {
    icon: Images,
    title: "Engagement photographs",
    summary: "Open all nine engagement photographs in the immersive gallery.",
    keywords: "photos pictures engagement gallery images",
    target: "#gallery",
  },
] as const;

const checklistItems = [
  { id: "save", label: "Save this private wedding link" },
  { id: "rsvp", label: "Send or update our household RSVP" },
  { id: "needs", label: "Add dietary and accessibility needs" },
  { id: "return", label: "Return for confirmed date and venue details" },
] as const;

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

function StaticImage(props: ImageProps) {
  return <NextImage {...props} unoptimized />;
}

export function WeddingExperienceV6() {
  const heroRef = useRef<HTMLElement>(null);
  const filmRef = useRef<HTMLVideoElement>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPlaying, setHeroPlaying] = useState(true);
  const [filmPlaying, setFilmPlaying] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [checklist, setChecklist] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const activeFrame = heroFrames[heroIndex];

  useEffect(() => {
    const queryList = window.matchMedia("(prefers-reduced-motion: reduce)");
    const portraitHero = window.matchMedia(
      "(max-width: 820px), (orientation: portrait)",
    );
    const portraitFrame = window.requestAnimationFrame(() => {
      if (portraitHero.matches) setHeroIndex(1);
    });
    const sync = () => {
      setReducedMotion(queryList.matches);
      if (queryList.matches) setHeroPlaying(false);
    };
    sync();
    queryList.addEventListener("change", sync);
    return () => {
      window.cancelAnimationFrame(portraitFrame);
      queryList.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!heroPlaying || reducedMotion) return;
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroFrames.length);
    }, 6800);
    return () => window.clearInterval(timer);
  }, [heroPlaying, reducedMotion]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("kp-guest-checklist");
    if (stored) {
      try {
        const savedChecklist = JSON.parse(stored) as string[];
        const frame = window.requestAnimationFrame(() => {
          setChecklist(savedChecklist);
        });
        return () => window.cancelAnimationFrame(frame);
      } catch {
        window.localStorage.removeItem("kp-guest-checklist");
      }
    }
  }, []);

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-kp6-reveal]"),
    );
    if (reducedMotion) {
      elements.forEach((element) => element.classList.add("kp6-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("kp6-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -7%" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) =>
          current === null ? 0 : (current + 1) % heroFrames.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null
            ? 0
            : (current - 1 + heroFrames.length) % heroFrames.length,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex]);

  useEffect(() => {
    if (!reducedMotion) return;
    filmRef.current?.pause();
  }, [reducedMotion]);

  const nextHero = useCallback(() => {
    setHeroIndex((current) => (current + 1) % heroFrames.length);
  }, []);

  const previousHero = useCallback(() => {
    setHeroIndex(
      (current) => (current - 1 + heroFrames.length) % heroFrames.length,
    );
  }, []);

  const goToSection = useCallback((href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
    setConciergeOpen(false);
  }, []);

  const openRsvp = useCallback(() => {
    setMobileOpen(false);
    setConciergeOpen(false);
    window.setTimeout(() => setRsvpOpen(true), 120);
  }, []);

  const copyPrivateLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
      setChecklist((current) => {
        const next = [...new Set([...current, "save"])];
        window.localStorage.setItem("kp-guest-checklist", JSON.stringify(next));
        return next;
      });
    } catch {
      setCopied(false);
    }
  }, []);

  const toggleChecklist = useCallback((id: string) => {
    setChecklist((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      window.localStorage.setItem("kp-guest-checklist", JSON.stringify(next));
      return next;
    });
  }, []);

  const filteredConciergeItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return conciergeItems;
    return conciergeItems.filter((item) =>
      `${item.title} ${item.summary} ${item.keywords}`.toLowerCase().includes(term),
    );
  }, [query]);

  const handleHeroPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;
    const x = (relativeX - 0.5) * 8;
    const y = (relativeY - 0.5) * 6;
    heroRef.current?.style.setProperty("--kp6-shift-x", `${x}px`);
    heroRef.current?.style.setProperty("--kp6-shift-y", `${y}px`);
    heroRef.current?.style.setProperty("--kp6-pointer-x", `${relativeX * 100}%`);
    heroRef.current?.style.setProperty("--kp6-pointer-y", `${relativeY * 100}%`);
  };

  const resetHeroPointer = () => {
    heroRef.current?.style.setProperty("--kp6-shift-x", "0px");
    heroRef.current?.style.setProperty("--kp6-shift-y", "0px");
    heroRef.current?.style.setProperty("--kp6-pointer-x", "68%");
    heroRef.current?.style.setProperty("--kp6-pointer-y", "34%");
  };

  const toggleFilm = async () => {
    const film = filmRef.current;
    if (!film) return;
    if (film.paused) {
      await film.play();
      setFilmPlaying(true);
    } else {
      film.pause();
      setFilmPlaying(false);
    }
  };

  const checklistProgress = clamp(checklist.length / checklistItems.length);

  return (
    <main className="kp6-site">
      <a className="kp6-skip" href="#story">
        Skip to our story
      </a>

      <header className={`kp6-header ${scrolled ? "kp6-header-scrolled" : ""}`}>
        <a className="kp6-brand" href="#top" aria-label="Kingsford and Perla, home">
          <span aria-hidden="true">K<span>&amp;</span>P</span>
          <strong>
            Kingsford &amp; Perla
            <small>Engaged · 29 August 2026</small>
          </strong>
        </a>

        <nav className="kp6-desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="kp6-header-actions">
          <button
            className="kp6-concierge-trigger"
            type="button"
            onClick={() => setConciergeOpen(true)}
          >
            <Compass aria-hidden="true" />
            <span>Guest concierge</span>
          </button>
          <button className="kp6-header-rsvp" type="button" onClick={openRsvp}>
            RSVP <ArrowRight aria-hidden="true" />
          </button>
          <button
            className="kp6-menu-trigger"
            type="button"
            aria-label="Open wedding menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu aria-hidden="true" />
          </button>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent className="kp6-nav-sheet" showCloseButton={false} side="right">
          <SheetHeader className="kp6-nav-sheet-header">
            <SheetTitle>Kingsford &amp; Perla</SheetTitle>
            <SheetDescription>Our private wedding home</SheetDescription>
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X aria-hidden="true" />
            </button>
          </SheetHeader>
          <nav aria-label="Mobile navigation">
            {navItems.map((item, index) => (
              <button key={item.href} type="button" onClick={() => goToSection(item.href)}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <span>{item.label}</span>
                <ArrowRight aria-hidden="true" />
              </button>
            ))}
          </nav>
          <div className="kp6-nav-sheet-actions">
            <button type="button" onClick={() => {
              setMobileOpen(false);
              window.setTimeout(() => setConciergeOpen(true), 120);
            }}>
              <Compass aria-hidden="true" /> Open guest concierge
            </button>
            <button type="button" onClick={openRsvp}>
              Guest RSVP <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <section
        ref={heroRef}
        id="top"
        className="kp6-hero"
        aria-labelledby="kp6-hero-title"
        onPointerMove={handleHeroPointer}
        onPointerLeave={resetHeroPointer}
      >
        <div className="kp6-hero-media" aria-live="off">
          {heroFrames.map((frame, index) => {
            const isActive = index === heroIndex;
            const positionStyle = {
              "--kp6-desktop-position": frame.desktopPosition,
              "--kp6-mobile-position": frame.mobilePosition,
            } as CSSProperties;
            return (
              <div
                key={frame.src}
                className={`kp6-hero-frame kp6-${frame.orientation} ${isActive ? "kp6-active" : ""}`}
                style={positionStyle}
                aria-hidden={!isActive}
              >
                {frame.orientation === "portrait" ? (
                  <>
                    <StaticImage
                      className="kp6-hero-backdrop"
                      src={frame.src}
                      alt=""
                      fill
                      sizes="100vw"
                    />
                    <div className="kp6-hero-portrait">
                      <StaticImage
                        src={frame.src}
                        alt={isActive ? frame.alt : ""}
                        fill
                        priority={index === 1}
                        sizes="(max-width: 820px) 100vw, 48vw"
                      />
                      {isActive && (
                        <div className="kp6-union-cut kp6-union-cut-portrait" aria-hidden="true">
                          <StaticImage className="kp6-union-left" src={frame.src} alt="" fill sizes="(max-width: 820px) 100vw, 48vw" />
                          <StaticImage className="kp6-union-right" src={frame.src} alt="" fill sizes="(max-width: 820px) 100vw, 48vw" />
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="kp6-hero-wide-wrap">
                    <StaticImage
                      className="kp6-hero-wide-backdrop"
                      src={frame.src}
                      alt=""
                      fill
                      priority={index === 0}
                      sizes="100vw"
                    />
                    <StaticImage
                      className={`kp6-hero-wide kp6-hero-wide-desktop ${index === 0 ? "kp6-first-hero" : ""}`}
                      src={frame.src}
                      alt={isActive ? frame.alt : ""}
                      fill
                      priority={index === 0}
                      sizes="100vw"
                    />
                    {index === 0 && (
                      <StaticImage
                        className="kp6-hero-wide kp6-hero-wide-mobile"
                        src={heroFrames[1].src}
                        alt={isActive ? heroFrames[1].alt : ""}
                        fill
                        priority
                        sizes="100vw"
                      />
                    )}
                    {isActive && (
                      <div className={`kp6-union-cut ${index === 0 ? "kp6-union-cut-initial" : ""}`} aria-hidden="true">
                        <StaticImage className="kp6-union-left" src={frame.src} alt="" fill priority={index === 0} sizes="100vw" />
                        <StaticImage className="kp6-union-right" src={frame.src} alt="" fill priority={index === 0} sizes="100vw" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div className="kp6-hero-grade" />
          <div className="kp6-hero-spotlight" />
          <div className="kp6-grain" />
        </div>

        <div className="kp6-hero-film-edge kp6-hero-film-edge-left" aria-hidden="true" />
        <div className="kp6-hero-film-edge kp6-hero-film-edge-right" aria-hidden="true" />
        <div className="kp6-union-seam" aria-hidden="true"><span /></div>

        <div className="kp6-hero-volume" aria-hidden="true">
          <span>Volume I</span>
          <strong>The engagement</strong>
        </div>

        <div className="kp6-hero-frame-id" aria-hidden="true">
          <span>Frame</span>
          <strong>{String(heroIndex + 1).padStart(2, "0")}</strong>
        </div>

        <div className="kp6-hero-copy">
          <div className="kp6-hero-kicker">
            <span>A story in motion</span>
            <i aria-hidden="true" />
            <span>Engaged · 29 August 2026</span>
          </div>
          <h1 id="kp6-hero-title">
            <span className="kp6-name-first">Kingsford</span>
            <em className="kp6-union-mark"><b>&amp;</b><i aria-hidden="true" /></em>
            <span className="kp6-name-second">Perla</span>
          </h1>
          <p>A love worth remembering in every frame.</p>
          <div className="kp6-hero-announcement">
            <span aria-hidden="true" />
            <strong>Wedding details will be revealed here soon.</strong>
          </div>
          <div className="kp6-hero-cta">
            <a href="#story">
              Enter our story <ArrowDown aria-hidden="true" />
            </a>
            <button type="button" onClick={openRsvp}>
              Guest RSVP <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="kp6-hero-caption">
          <span>{String(heroIndex + 1).padStart(2, "0")} / {String(heroFrames.length).padStart(2, "0")}</span>
          <div aria-live="polite">
            <strong>{activeFrame.label}</strong>
            <small>{activeFrame.note}</small>
          </div>
        </div>

        <div className="kp6-hero-controls">
          <button type="button" onClick={previousHero} aria-label="Previous photograph">
            <ArrowLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setHeroPlaying((playing) => !playing)}
            aria-label={heroPlaying ? "Pause photograph reel" : "Play photograph reel"}
          >
            {heroPlaying ? <CirclePause aria-hidden="true" /> : <CirclePlay aria-hidden="true" />}
          </button>
          <button type="button" onClick={nextHero} aria-label="Next photograph">
            <ArrowRight aria-hidden="true" />
          </button>
        </div>

        <div className="kp6-hero-thumbnails" aria-label="Engagement photograph reel">
          {heroFrames.map((frame, index) => (
            <button
              key={frame.src}
              type="button"
              className={index === heroIndex ? "kp6-selected" : ""}
              onClick={() => setHeroIndex(index)}
              aria-label={`Show photograph ${index + 1}: ${frame.label}`}
              aria-current={index === heroIndex ? "true" : undefined}
            >
              <StaticImage src={frame.src} alt="" fill sizes="72px" />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>

        <div className="kp6-hero-progress" aria-hidden="true">
          <span style={{ width: `${((heroIndex + 1) / heroFrames.length) * 100}%` }} />
        </div>

        <a className="kp6-scroll-cue" href="#contact-sheet">
          <span>Scroll to develop</span>
          <i aria-hidden="true"><ArrowDown /></i>
        </a>
      </section>

      <section id="contact-sheet" className="kp6-contact-sheet" aria-labelledby="kp6-contact-title">
        <div className="kp6-contact-heading" data-kp6-reveal>
          <p className="kp6-eyebrow">The first chapter</p>
          <h2 id="kp6-contact-title">One yes.<br /><em>Every feeling.</em></h2>
          <p>
            A glimpse of the colour, laughter and quiet promises that opened our
            next chapter together.
          </p>
          <a href="#gallery">See all nine photographs <ArrowRight aria-hidden="true" /></a>
        </div>
        <div className="kp6-contact-reel" aria-label="Featured engagement photographs">
          {[2, 6, 4].map((index, reelIndex) => {
            const frame = heroFrames[index];
            return (
              <button
                key={frame.src}
                type="button"
                className={`kp6-contact-frame kp6-contact-frame-${reelIndex + 1}`}
                onClick={() => setLightboxIndex(index)}
                aria-label={`Open featured photograph: ${frame.alt}`}
              >
                <StaticImage src={frame.src} alt={frame.alt} fill sizes="(max-width: 820px) 78vw, 28vw" />
                <span><small>0{reelIndex + 1}</small><strong>{frame.label}</strong></span>
              </button>
            );
          })}
          <div className="kp6-contact-monogram" aria-hidden="true">
            <span>K</span><i>&amp;</i><span>P</span>
            <small>29 · 08 · 26</small>
          </div>
        </div>
      </section>

      <section id="story" className="kp6-story">
        <div className="kp6-section-index" aria-hidden="true">01</div>
        <div className="kp6-story-copy" data-kp6-reveal>
          <p className="kp6-eyebrow">Before the wedding</p>
          <h2>There was<br />this <em>yes.</em></h2>
          <p className="kp6-lede">
            On 29 August 2026, we chose the next chapter. The room was bright with
            colour, laughter and the people who have carried us with love and prayer.
          </p>
          <p>
            Now we are creating a wedding celebration rooted in faith and full of
            warmth. Every confirmed detail will live here—clearly, privately and
            beautifully.
          </p>
          <blockquote>
            “Two are better than one; because they have a good reward for their labour.”
            <cite>Ecclesiastes 4:9</cite>
          </blockquote>
        </div>

        <div className="kp6-story-collage">
          <figure className="kp6-story-main">
            <StaticImage
              src="/engagement-perla.webp"
              alt="Perla smiling during the engagement celebration"
              fill
              sizes="(max-width: 820px) 78vw, 38vw"
            />
            <figcaption>Perla · 29.08.26</figcaption>
          </figure>
          <figure className="kp6-story-secondary">
            <StaticImage
              src="/engagement-quiet-moment.webp"
              alt="Kingsford and Perla sharing a quiet moment"
              fill
              sizes="(max-width: 820px) 52vw, 22vw"
            />
            <figcaption>A quiet moment</figcaption>
          </figure>
          <div className="kp6-story-seal" aria-label="Kingsford and Perla engagement monogram">
            <span>K</span><i>&amp;</i><span>P</span>
            <small>29 · 08 · 26</small>
          </div>
        </div>

        <div className="kp6-story-now" data-kp6-reveal>
          <p className="kp6-eyebrow">Now &amp; next</p>
          <ol>
            <li>
              <span>01</span>
              <div><strong>Engaged</strong><small>29 August 2026</small></div>
              <CheckCircle2 aria-hidden="true" />
            </li>
            <li>
              <span>02</span>
              <div><strong>Planning the celebration</strong><small>Date and venue being finalised</small></div>
              <Sparkles aria-hidden="true" />
            </li>
            <li>
              <span>03</span>
              <div><strong>The wedding</strong><small>Formal invitation details to follow</small></div>
              <Heart aria-hidden="true" />
            </li>
          </ol>
        </div>
      </section>

      <div className="kp6-marquee" aria-hidden="true">
        <div>
          <span>Faith</span><i>✦</i><span>Family</span><i>✦</i><span>Forever</span><i>✦</i>
          <span>Faith</span><i>✦</i><span>Family</span><i>✦</i><span>Forever</span><i>✦</i>
        </div>
      </div>

      <section id="gallery" className="kp6-gallery" aria-labelledby="kp6-gallery-title">
        <div className="kp6-gallery-heading" data-kp6-reveal>
          <div>
            <p className="kp6-eyebrow kp6-eyebrow-light">The engagement gallery</p>
            <h2 id="kp6-gallery-title">Every frame,<br /><em>unmistakably us.</em></h2>
          </div>
          <div>
            <p>
              Nine photographs from the day our next chapter began. Open any frame
              for the full-screen story.
            </p>
            <span><Images aria-hidden="true" /> Select a photograph</span>
          </div>
        </div>

        <div className="kp6-gallery-grid">
          {heroFrames.map((frame, index) => (
            <button
              key={frame.src}
              type="button"
              className={`kp6-gallery-frame kp6-gallery-${index + 1}`}
              onClick={() => setLightboxIndex(index)}
              aria-label={`Open photograph ${index + 1}: ${frame.alt}`}
            >
              <StaticImage
                src={frame.src}
                alt={frame.alt}
                fill
                sizes={
                  frame.orientation === "wide"
                    ? "(max-width: 820px) 100vw, 58vw"
                    : "(max-width: 820px) 50vw, 35vw"
                }
              />
              <span className="kp6-gallery-frame-caption">
                <small>{String(index + 1).padStart(2, "0")}</small>
                <strong>{frame.label}</strong>
                <ArrowRight aria-hidden="true" />
              </span>
            </button>
          ))}
          <div className="kp6-gallery-type-card" aria-hidden="true">
            <small>K + P</small>
            <strong>The beginning<br />of forever.</strong>
            <span>29 · 08 · 26</span>
          </div>
          <div className="kp6-gallery-date-card" aria-hidden="true">
            <span>29</span><i>/</i><span>08</span><i>/</i><span>26</span>
          </div>
        </div>
      </section>

      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => {
          if (!open) setLightboxIndex(null);
        }}
      >
        <DialogContent className="kp6-lightbox" showCloseButton={false}>
          {lightboxIndex !== null && (
            <>
              <DialogTitle className="sr-only">
                Engagement photograph {lightboxIndex + 1}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {heroFrames[lightboxIndex].alt}
              </DialogDescription>
              <div className="kp6-lightbox-image">
                <StaticImage
                  src={heroFrames[lightboxIndex].src}
                  alt={heroFrames[lightboxIndex].alt}
                  fill
                  priority
                  sizes="100vw"
                />
              </div>
              <div className="kp6-lightbox-topbar">
                <span>{String(lightboxIndex + 1).padStart(2, "0")} / {String(heroFrames.length).padStart(2, "0")}</span>
                <DialogClose asChild>
                  <button type="button" aria-label="Close photograph">
                    <X aria-hidden="true" />
                  </button>
                </DialogClose>
              </div>
              <div className="kp6-lightbox-caption">
                <small>Engagement · 29 August 2026</small>
                <strong>{heroFrames[lightboxIndex].label}</strong>
              </div>
              <div className="kp6-lightbox-controls">
                <button
                  type="button"
                  aria-label="Previous photograph"
                  onClick={() => setLightboxIndex(
                    (lightboxIndex - 1 + heroFrames.length) % heroFrames.length,
                  )}
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next photograph"
                  onClick={() => setLightboxIndex((lightboxIndex + 1) % heroFrames.length)}
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <section className="kp6-film-section">
        <div className="kp6-film-copy" data-kp6-reveal>
          <p className="kp6-eyebrow">The living invitation</p>
          <h2>A little cinema.<br /><em>A lot of us.</em></h2>
          <p>
            The film holds the atmosphere. Our photographs hold the story. Together,
            they create a wedding home that can keep unfolding as the celebration takes shape.
          </p>
          <div className="kp6-film-facts">
            <span><Check aria-hidden="true" /> Real engagement photography</span>
            <span><Check aria-hidden="true" /> Motion with pause controls</span>
            <span><Check aria-hidden="true" /> Reduced-motion alternative</span>
          </div>
        </div>
        <div className="kp6-film-frame" data-kp6-reveal>
          <video
            ref={filmRef}
            autoPlay={!reducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            poster="/wedding-editorial-poster.jpg"
            onPlay={() => setFilmPlaying(true)}
            onPause={() => setFilmPlaying(false)}
          >
            <source src="/wedding-editorial.mp4" type="video/mp4" />
          </video>
          <div className="kp6-film-grade" />
          <span className="kp6-film-label">K + P · Invitation film</span>
          <button
            type="button"
            onClick={toggleFilm}
            aria-label={filmPlaying ? "Pause invitation film" : "Play invitation film"}
          >
            {filmPlaying ? <CirclePause aria-hidden="true" /> : <CirclePlay aria-hidden="true" />}
            <span>{filmPlaying ? "Pause film" : "Play film"}</span>
          </button>
        </div>
      </section>

      <section id="guest-guide" className="kp6-guide" aria-labelledby="kp6-guide-title">
        <div className="kp6-section-index kp6-section-index-dark" aria-hidden="true">02</div>
        <div className="kp6-guide-heading" data-kp6-reveal>
          <div>
            <p className="kp6-eyebrow">Your guest guide</p>
            <h2 id="kp6-guide-title">Everything you need.<br /><em>Nothing scattered.</em></h2>
          </div>
          <p>
            This is the verified home for the invitation, itinerary, travel,
            accommodation, registry, questions and household response.
          </p>
        </div>

        <Tabs defaultValue="essentials" className="kp6-guide-tabs" data-kp6-reveal>
          <TabsList aria-label="Wedding guest information">
            <TabsTrigger value="essentials">Essentials</TabsTrigger>
            <TabsTrigger value="weekend">Weekend</TabsTrigger>
            <TabsTrigger value="travel">Travel &amp; stay</TabsTrigger>
            <TabsTrigger value="registry">Registry</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="essentials" className="kp6-guide-panel">
            <div className="kp6-essential-grid">
              {essentialCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.label} className={`kp6-essential-${card.tone}`}>
                    <div><Icon aria-hidden="true" /><span>{card.label}</span></div>
                    <h3>{card.title}</h3>
                    <p>{card.copy}</p>
                    <small><i aria-hidden="true" />{card.status}</small>
                  </article>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="weekend" className="kp6-guide-panel">
            <div className="kp6-weekend-intro">
              <p className="kp6-eyebrow">A considered celebration</p>
              <h3>The moments that will shape the wedding.</h3>
              <p>
                Confirmed guests will see the exact time, place and arrival guidance
                for every event included in their invitation.
              </p>
            </div>
            <div className="kp6-weekend-list">
              {weddingContent.schedule.map((item) => (
                <article key={item.sequence}>
                  <span>{item.sequence}</span>
                  <div><small>{item.label}</small><strong>{item.detail}</strong></div>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="travel" className="kp6-guide-panel">
            <div className="kp6-travel-grid">
              {travelCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <article key={card.title}>
                    <span>0{index + 1}</span>
                    <Icon aria-hidden="true" />
                    <h3>{card.title}</h3>
                    <p>{card.copy}</p>
                    <small>Publishes with the confirmed venue</small>
                  </article>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="registry" className="kp6-guide-panel">
            <div className="kp6-registry-panel">
              <div className="kp6-registry-mark"><Gift aria-hidden="true" /></div>
              <div>
                <p className="kp6-eyebrow">With grateful hearts</p>
                <h3>Your presence comes first.</h3>
                <p>
                  Celebrating with you is the gift. If we create a registry, the
                  verified link will appear here—never through an unfamiliar request.
                </p>
                <span>Registry details have not been published.</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="kp6-guide-panel">
            <div className="kp6-faq-heading">
              <p className="kp6-eyebrow">Good questions, clear answers</p>
              <h3>Before you ask the group chat.</h3>
            </div>
            <Accordion type="single" collapsible className="kp6-faq-list">
              {weddingContent.faqs.map((item, index) => (
                <AccordionItem key={item.question} value={`question-${index}`}>
                  <AccordionTrigger>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <span>{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>

        <div className="kp6-guide-actions" data-kp6-reveal>
          <div>
            <MessageCircleQuestion aria-hidden="true" />
            <span><strong>Still looking?</strong> Search the guest concierge.</span>
          </div>
          <button type="button" onClick={() => setConciergeOpen(true)}>
            Open concierge <ArrowRight aria-hidden="true" />
          </button>
          <button type="button" onClick={openRsvp}>
            Guest RSVP <Heart aria-hidden="true" />
          </button>
        </div>
      </section>

      <section id="rsvp" className="kp6-rsvp-stage">
        <div className="kp6-rsvp-photo" aria-hidden="true">
          <StaticImage
            src="/engagement-celebration.webp"
            alt=""
            fill
            sizes="100vw"
          />
          <div />
        </div>
        <div className="kp6-rsvp-copy" data-kp6-reveal>
          <p className="kp6-eyebrow kp6-eyebrow-light">Guest RSVP</p>
          <h2>Your yes belongs<br />in the story.</h2>
          <p>
            Respond once for your household for the wedding ceremony, share any
            accessibility needs and return later if plans change.
          </p>
          <ul>
            <li><Check aria-hidden="true" /><span><strong>One household response</strong>Names and attendance together</span></li>
            <li><Accessibility aria-hidden="true" /><span><strong>Welcoming by design</strong>Private accessibility notes</span></li>
            <li><ShieldCheck aria-hidden="true" /><span><strong>Private update code</strong>Return and change your answer</span></li>
          </ul>
          <button type="button" onClick={openRsvp}>
            Open guest RSVP <ArrowRight aria-hidden="true" />
          </button>
        </div>
        <div className="kp6-rsvp-monogram" aria-hidden="true">K<span>&amp;</span>P</div>
      </section>

      <section className="kp6-save-home" data-kp6-reveal>
        <div>
          <p className="kp6-eyebrow">Keep the right place</p>
          <h2>One private link.<br />Every confirmed detail.</h2>
        </div>
        <p>
          Save this wedding home and return as the celebration unfolds. Verified
          information will always appear here first.
        </p>
        <button type="button" onClick={copyPrivateLink}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? "Private link copied" : "Copy private link"}
        </button>
      </section>

      <footer className="kp6-footer">
        <div className="kp6-footer-title" aria-hidden="true">
          <span>Kingsford</span><i>&amp;</i><span>Perla</span>
        </div>
        <div className="kp6-footer-bottom">
          <p>Engaged · 29 August 2026</p>
          <p>Made with faith, joy and room for everyone we love.</p>
          <a href="/manage">Organiser access</a>
        </div>
      </footer>

      <button
        className="kp6-floating-concierge"
        type="button"
        onClick={() => setConciergeOpen(true)}
      >
        <Compass aria-hidden="true" />
        <span>Guest help</span>
      </button>

      <Sheet open={conciergeOpen} onOpenChange={setConciergeOpen}>
        <SheetContent className="kp6-concierge" side="right" showCloseButton={false}>
          <SheetHeader className="kp6-concierge-header">
            <div className="kp6-concierge-icon"><Compass aria-hidden="true" /></div>
            <div>
              <p>Private wedding home</p>
              <SheetTitle>Guest concierge</SheetTitle>
              <SheetDescription>
                Find an answer, open your RSVP or keep track of what matters.
              </SheetDescription>
            </div>
            <button type="button" onClick={() => setConciergeOpen(false)} aria-label="Close guest concierge">
              <X aria-hidden="true" />
            </button>
          </SheetHeader>

          <div className="kp6-concierge-scroll">
            <label className="kp6-concierge-search">
              <Search aria-hidden="true" />
              <span className="sr-only">Search guest information</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search RSVP, travel, dress code…"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                  <X aria-hidden="true" />
                </button>
              )}
            </label>

            <div className="kp6-concierge-results" aria-live="polite">
              {filteredConciergeItems.length ? (
                filteredConciergeItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => {
                        if ("action" in item && item.action === "rsvp") {
                          openRsvp();
                        } else if ("target" in item && item.target) {
                          goToSection(item.target);
                        }
                      }}
                    >
                      <span><Icon aria-hidden="true" /></span>
                      <div><strong>{item.title}</strong><small>{item.summary}</small></div>
                      <ArrowRight aria-hidden="true" />
                    </button>
                  );
                })
              ) : (
                <div className="kp6-concierge-empty">
                  <Search aria-hidden="true" />
                  <strong>No exact match yet.</strong>
                  <span>Try RSVP, travel, venue, registry or dress code.</span>
                </div>
              )}
            </div>

            <section className="kp6-checklist" aria-labelledby="kp6-checklist-title">
              <div className="kp6-checklist-heading">
                <div>
                  <p>Your visit</p>
                  <h3 id="kp6-checklist-title">Guest checklist</h3>
                </div>
                <strong>{checklist.length} / {checklistItems.length}</strong>
              </div>
              <div className="kp6-checklist-progress" aria-hidden="true">
                <span style={{ transform: `scaleX(${checklistProgress})` }} />
              </div>
              <div className="kp6-checklist-items">
                {checklistItems.map((item) => (
                  <label key={item.id}>
                    <Checkbox
                      checked={checklist.includes(item.id)}
                      onCheckedChange={() => toggleChecklist(item.id)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <div className="kp6-concierge-footer">
            <button type="button" onClick={copyPrivateLink}>
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copied ? "Link copied" : "Copy private link"}
            </button>
            <button type="button" onClick={openRsvp}>
              Guest RSVP <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <RsvpDialog open={rsvpOpen} onOpenChange={setRsvpOpen} />
    </main>
  );
}
