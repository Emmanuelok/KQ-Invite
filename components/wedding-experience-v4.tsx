"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowDown,
  ArrowRight,
  BedDouble,
  CalendarHeart,
  Check,
  CirclePause,
  CirclePlay,
  Copy,
  Gift,
  Heart,
  MapPin,
  Menu,
  Plane,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RsvpDialog } from "@/components/wedding-experience";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { weddingContent } from "@/lib/wedding-content";

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const navItems = [
  { label: "Our beginning", href: "#beginning" },
  { label: "Engagement", href: "#engagement" },
  { label: "Guest guide", href: "#guest-guide" },
  { label: "RSVP", href: "#rsvp" },
] as const;

const statusCards = [
  {
    icon: CalendarHeart,
    eyebrow: "Date & place",
    title: "In planning",
    copy: "The wedding date, venue and arrival time publish here only when confirmed.",
    status: "Pending final plans",
  },
  {
    icon: Heart,
    eyebrow: "Household RSVP",
    title: "Ready",
    copy: "Guests can respond together, share meal needs and leave a note in one visit.",
    status: "Live now",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Private reference",
    title: "Protected",
    copy: "Every reply receives a private code so the household can return and update it.",
    status: "Live now",
  },
  {
    icon: Sparkles,
    eyebrow: "Guest essentials",
    title: "One home",
    copy: "Schedule, travel, accommodation, registry and FAQs stay together—never scattered.",
    status: "Prepared",
  },
] as const;

const travelCards = [
  {
    icon: MapPin,
    title: "Arrive with confidence",
    copy: "Verified venue address, maps, parking and arrival notes will publish together.",
  },
  {
    icon: BedDouble,
    title: "Stay close",
    copy: "Hotel guidance and any room-block information will appear after the venue is set.",
  },
  {
    icon: Plane,
    title: "Plan the journey",
    copy: "Airport, station and local transport options will be shaped around the confirmed city.",
  },
] as const;

const engagementPhotos = [
  {
    src: "/engagement-together.webp",
    alt: "Kingsford and Perla standing together in coordinated engagement attire",
  },
  {
    src: "/engagement-joy.webp",
    alt: "Perla clapping and smiling during the celebration",
  },
  {
    src: "/engagement-radiance.webp",
    alt: "Perla laughing during the engagement celebration",
  },
  {
    src: "/engagement-candid.webp",
    alt: "Perla smiling among guests during the engagement celebration",
  },
  {
    src: "/engagement-celebration.webp",
    alt: "Kingsford and Perla sharing a playful moment",
  },
] as const;

export function WeddingExperienceV4() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [heroProgress, setHeroProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [filmPlaying, setFilmPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion) {
      video.pause();
    }
  }, [reducedMotion, videoReady]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = heroRef.current;
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
      setHeroProgress(clamp(-bounds.top / travel));
    };
    const queue = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-kp4-reveal]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("kp4-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const toggleFilm = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
      setFilmPlaying(true);
    } else {
      video.pause();
      setFilmPlaying(false);
    }
  };

  const copyPrivateLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 2200);
  };

  const firstBeatOpacity = clamp(1 - heroProgress * 2.05);
  const secondBeatOpacity = clamp((heroProgress - 0.42) * 2.15);
  const couplePhotoOpacity = clamp((heroProgress - 0.31) * 2.55);
  const heroStyle = {
    "--kp4-progress": heroProgress,
  } as CSSProperties;

  return (
    <main className="kp4-site">
      <a className="kp4-skip" href="#beginning">
        Skip the opening film
      </a>

      <header
        className={`kp4-header ${heroProgress > 0.08 ? "kp4-header-solid" : ""}`}
        aria-label="Wedding navigation"
      >
        <a className="kp4-brand" href="#top" aria-label="Kingsford and Perla, home">
          <span className="kp4-brand-mark" aria-hidden="true">K</span>
          <span>
            Kingsford <i>&amp;</i> Perla
            <small>Engaged · 29 · 08 · 26</small>
          </span>
        </a>

        <nav className="kp4-desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <button
          className="kp4-nav-rsvp"
          type="button"
          onClick={() => setRsvpOpen(true)}
        >
          Guest RSVP <ArrowRight aria-hidden="true" />
        </button>

        <button
          className="kp4-menu-button"
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        {mobileOpen && (
          <div className="kp4-mobile-menu" role="dialog" aria-label="Wedding menu">
            <div className="kp4-mobile-menu-inner">
              <p>Our private wedding home</p>
              <nav aria-label="Mobile navigation">
                {navItems.map((item, index) => (
                  <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                    <small>0{index + 1}</small>
                    <span>{item.label}</span>
                    <ArrowRight aria-hidden="true" />
                  </a>
                ))}
              </nav>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setRsvpOpen(true);
                }}
              >
                Open guest RSVP <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </header>

      <section
        ref={heroRef}
        id="top"
        className="kp4-hero"
        style={heroStyle}
        aria-labelledby="kp4-hero-title"
      >
        <div className="kp4-hero-sticky">
          <div className="kp4-hero-media" aria-hidden="true">
            <div className="kp4-hero-poster" />
            <video
              ref={videoRef}
              className={videoReady ? "kp4-video-ready" : ""}
              autoPlay={!reducedMotion}
              muted
              loop
              playsInline
              preload="metadata"
              poster="/wedding-editorial-poster.jpg"
              onCanPlay={() => setVideoReady(true)}
              onPlay={() => setFilmPlaying(true)}
              onPause={() => setFilmPlaying(false)}
            >
              <source src="/wedding-editorial.mp4" type="video/mp4" />
            </video>
            <div
              className="kp4-hero-photo"
              style={{ opacity: couplePhotoOpacity }}
            />
            <div
              className="kp4-hero-grade"
              style={{ opacity: clamp(1 - couplePhotoOpacity * 0.62) }}
            />
            <div
              className="kp4-hero-photo-grade"
              style={{ opacity: couplePhotoOpacity }}
            />
            <div className="kp4-grain" />
          </div>

          <div
            className="kp4-hero-first"
            style={{
              opacity: firstBeatOpacity,
              transform: `translate3d(0, ${heroProgress * -42}px, 0)`,
              pointerEvents: firstBeatOpacity < 0.12 ? "none" : "auto",
            }}
            aria-hidden={firstBeatOpacity < 0.08}
          >
            <div className="kp4-hero-crest" aria-hidden="true">
              <Image src="/kp-crest-mark.webp" alt="" width={720} height={556} priority />
            </div>
            <p className="kp4-eyebrow kp4-eyebrow-light">
              Engaged · {weddingContent.engagement.dateDisplay}
            </p>
            <h1 id="kp4-hero-title">
              <span>Kingsford</span>
              <em>&amp;</em>
              <span>Perla</span>
            </h1>
            <p className="kp4-hero-deck">
              The celebration is taking shape. This private home will hold every
              beautiful detail.
            </p>
            <div className="kp4-hero-actions">
              <a href="#guest-guide" tabIndex={firstBeatOpacity < 0.12 ? -1 : undefined}>
                Enter the guest guide <ArrowDown aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => setRsvpOpen(true)}
                tabIndex={firstBeatOpacity < 0.12 ? -1 : undefined}
              >
                Guest RSVP
              </button>
            </div>
          </div>

          <div
            className="kp4-hero-second"
            style={{
              opacity: secondBeatOpacity,
              transform: `translate3d(0, ${(1 - heroProgress) * 44}px, 0)`,
              pointerEvents: secondBeatOpacity < 0.12 ? "none" : "auto",
            }}
            aria-hidden={secondBeatOpacity < 0.08}
          >
            <p className="kp4-eyebrow kp4-eyebrow-light">29 August 2026</p>
            <h2>This is us.</h2>
            <p>
              The day we said yes—full of joy, colour and the promise of everything
              still to come.
            </p>
            <a href="#beginning" tabIndex={secondBeatOpacity < 0.12 ? -1 : undefined}>
              Continue the story <ArrowDown aria-hidden="true" />
            </a>
          </div>

          <div className="kp4-hero-rail" aria-hidden="true">
            <span style={{ transform: `scaleX(${heroProgress})` }} />
          </div>

          <button
            className="kp4-film-control"
            type="button"
            onClick={toggleFilm}
            style={{
              opacity: clamp(1 - couplePhotoOpacity * 1.35),
              pointerEvents: couplePhotoOpacity > 0.72 ? "none" : "auto",
            }}
            tabIndex={couplePhotoOpacity > 0.72 ? -1 : 0}
            aria-label={filmPlaying ? "Pause background film" : "Play background film"}
          >
            {filmPlaying ? <CirclePause aria-hidden="true" /> : <CirclePlay aria-hidden="true" />}
            <span>{filmPlaying ? "Pause film" : "Play film"}</span>
          </button>
        </div>
      </section>

      <section id="beginning" className="kp4-beginning">
        <div className="kp4-beginning-copy" data-kp4-reveal>
          <p className="kp4-eyebrow">Our beginning</p>
          <h2>The first date in our forever.</h2>
          <p className="kp4-lede">
            On 29 August 2026, we chose the next chapter. Now we are creating a
            celebration rooted in faith, full of warmth, and surrounded by the
            people who have carried us here.
          </p>
          <p>
            Wedding plans are being finalised. When the date, place and invitation
            details are confirmed, this is where they will live—beautifully,
            privately and in one place.
          </p>
          <div className="kp4-beginning-signoff">
            <span>Faith</span><i />
            <span>Family</span><i />
            <span>Forever</span>
          </div>
        </div>

        <div className="kp4-art-stack" data-kp4-reveal aria-label="Kingsford and Perla wedding identity">
          <div className="kp4-art-ring">
            <Image
              src="/engagement-perla.webp"
              alt="Perla smiling during the engagement celebration"
              fill
              sizes="(max-width: 760px) 82vw, 34vw"
            />
          </div>
          <div className="kp4-art-card">
            <Image
              src="/engagement-quiet-moment.webp"
              alt="Kingsford and Perla sharing a quiet moment"
              fill
              sizes="(max-width: 760px) 48vw, 20vw"
            />
          </div>
          <div className="kp4-art-pearl" aria-hidden="true">
            <Image src="/kp-pearl-monogram.webp" alt="" fill sizes="220px" />
          </div>
          <span className="kp4-hand-note">A new chapter, beautifully ours.</span>
        </div>
      </section>

      <section id="engagement" className="kp4-memories" aria-labelledby="kp4-memories-title">
        <div className="kp4-memories-heading" data-kp4-reveal>
          <div>
            <p className="kp4-eyebrow kp4-eyebrow-light">Our engagement · 29 August 2026</p>
            <h2 id="kp4-memories-title">The day we said yes.</h2>
          </div>
          <p>
            Joy, colour and the quiet moments between them—held here as the opening
            scene of everything ahead.
          </p>
        </div>

        <div className="kp4-memory-grid" data-kp4-reveal>
          {engagementPhotos.map((photo, index) => (
            <figure
              key={photo.src}
              className={`kp4-memory kp4-memory-${index + 1}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={
                  index === 0 || index === 4
                    ? "(max-width: 820px) calc(100vw - 44px), 62vw"
                    : "(max-width: 820px) calc(50vw - 27px), 28vw"
                }
              />
              <figcaption aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>K + P · 29.08.26</small>
              </figcaption>
            </figure>
          ))}
          <div className="kp4-memory-note" aria-hidden="true">
            <span>Our</span>
            <strong>Beginning</strong>
            <small>29 · 08 · 26</small>
          </div>
        </div>

        <div className="kp4-memory-signoff" data-kp4-reveal>
          <span>One promise</span>
          <i aria-hidden="true" />
          <strong>Our forever, in motion.</strong>
        </div>
      </section>

      <section id="guest-guide" className="kp4-guide">
        <div className="kp4-guide-heading" data-kp4-reveal>
          <div>
            <p className="kp4-eyebrow">The guest guide</p>
            <h2>One invitation.<br />Every answer.</h2>
          </div>
          <p>
            No scattered messages or mystery links. Guests will come here for the
            verified schedule, travel, registry and response.
          </p>
        </div>

        <Tabs defaultValue="overview" className="kp4-guide-tabs" data-kp4-reveal>
          <TabsList aria-label="Wedding guest guide">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="weekend">Weekend</TabsTrigger>
            <TabsTrigger value="travel">Travel &amp; stay</TabsTrigger>
            <TabsTrigger value="registry">Registry</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="kp4-tab-panel">
            <div className="kp4-status-grid">
              {statusCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.eyebrow}>
                    <div className="kp4-status-icon"><Icon aria-hidden="true" /></div>
                    <p>{card.eyebrow}</p>
                    <h3>{card.title}</h3>
                    <span>{card.copy}</span>
                    <small><i />{card.status}</small>
                  </article>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="weekend" className="kp4-tab-panel">
            <div className="kp4-weekend-intro">
              <p className="kp4-eyebrow">A considered celebration</p>
              <h3>The moments that will shape our wedding.</h3>
              <p>
                The formal invitation will unlock each confirmed time, place and
                arrival note. Private events will only be shown to the guests invited.
              </p>
            </div>
            <div className="kp4-weekend-list">
              {weddingContent.schedule.map((item) => (
                <article key={item.sequence}>
                  <small>{item.sequence}</small>
                  <div>
                    <p>{item.label}</p>
                    <h4>{item.detail}</h4>
                  </div>
                  <span>{item.note}</span>
                </article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="travel" className="kp4-tab-panel">
            <div className="kp4-travel-grid">
              {travelCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.title}>
                    <Icon aria-hidden="true" />
                    <h3>{card.title}</h3>
                    <p>{card.copy}</p>
                    <span>Publishes with the confirmed location</span>
                  </article>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="registry" className="kp4-tab-panel">
            <div className="kp4-registry-panel">
              <div className="kp4-registry-icon"><Gift aria-hidden="true" /></div>
              <p className="kp4-eyebrow">With grateful hearts</p>
              <h3>Your presence comes first.</h3>
              <p>
                Celebrating with you is the gift. If we create a registry, the verified
                link will appear in this private guest home—never in an unfamiliar
                forwarded request.
              </p>
              <span>Registry details have not been published.</span>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="kp4-tab-panel">
            <Accordion type="single" collapsible className="kp4-faq-list">
              {weddingContent.faqs.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`}>
                  <AccordionTrigger>
                    <small>0{index + 1}</small>
                    <span>{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </section>

      <section id="rsvp" className="kp4-rsvp-stage">
        <div className="kp4-rsvp-media" aria-hidden="true">
          <Image
            src="/engagement-candid.webp"
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 52vw"
          />
          <div />
        </div>
        <div className="kp4-rsvp-copy" data-kp4-reveal>
          <p className="kp4-eyebrow kp4-eyebrow-light">Guest RSVP</p>
          <h2>A beautiful yes deserves an easy reply.</h2>
          <p>
            Respond once for your household, tell us what will make the day welcoming,
            and return later with your private confirmation code if plans change.
          </p>
          <ul>
            <li><Check aria-hidden="true" />One household response</li>
            <li><Check aria-hidden="true" />Private accessibility notes</li>
            <li><Check aria-hidden="true" />Private update reference</li>
          </ul>
          <button type="button" onClick={() => setRsvpOpen(true)}>
            Open guest RSVP <ArrowRight aria-hidden="true" />
          </button>
          <small>
            The response portal is operational while this private site is being prepared.
          </small>
        </div>
      </section>

      <section className="kp4-link-home" data-kp4-reveal>
        <div className="kp4-link-seal" aria-hidden="true">
          <Image src="/kp-crest-mark.webp" alt="" width={720} height={556} />
        </div>
        <p className="kp4-eyebrow">Keep the right place</p>
        <h2>This is the one link to save.</h2>
        <p>
          Every confirmed detail will appear here first. Keep it close and return as
          the celebration unfolds.
        </p>
        <button type="button" onClick={copyPrivateLink}>
          {linkCopied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {linkCopied ? "Private link copied" : "Copy private link"}
        </button>
      </section>

      <footer className="kp4-footer">
        <a href="#top" className="kp4-footer-brand">
          <span>K</span>
          <div>
            <strong>Kingsford &amp; Perla</strong>
            <small>Engaged · 29 August 2026</small>
          </div>
        </a>
        <p>Made with faith, joy and room for everyone we love.</p>
        <a href="/manage">Organiser access</a>
      </footer>

      <button
        className="kp4-mobile-rsvp"
        type="button"
        onClick={() => setRsvpOpen(true)}
      >
        Guest RSVP <ArrowRight aria-hidden="true" />
      </button>

      <RsvpDialog open={rsvpOpen} onOpenChange={setRsvpOpen} />
    </main>
  );
}
