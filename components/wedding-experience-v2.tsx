"use client";

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
  CalendarDays,
  Church,
  Heart,
  MapPin,
  Plane,
  Sparkles,
} from "lucide-react";

import { RsvpDialog } from "@/components/wedding-experience";
import { weddingContent } from "@/lib/wedding-content";

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const navItems = [
  { label: "The promise", href: "#promise" },
  { label: "The covenant", href: "#covenant" },
  { label: "The celebration", href: "#celebration" },
  { label: "Guest notes", href: "#guest-notes" },
] as const;

const guestNotes = [
  {
    icon: CalendarDays,
    index: "01",
    label: "The date",
    title: "Held close, for now.",
    body: "The wedding date will be revealed here first, once every detail is ready to receive you.",
  },
  {
    icon: MapPin,
    index: "02",
    label: "The place",
    title: "A setting with meaning.",
    body: "Confirmed guests will find the venue, maps, transport and arrival notes in this private home.",
  },
  {
    icon: BedDouble,
    index: "03",
    label: "Your stay",
    title: "Travel, made gentle.",
    body: "Hotel guidance and local recommendations will arrive alongside the formal invitation details.",
  },
  {
    icon: Plane,
    index: "04",
    label: "The journey",
    title: "From near and far.",
    body: "Airport or station guidance will be gathered here for everyone travelling to celebrate with us.",
  },
] as const;

export function WeddingExperienceV2() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [heroProgress, setHeroProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = heroRef.current;
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
      const progress = clamp(-bounds.top / travel);
      setHeroProgress(progress);

      const video = videoRef.current;
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        const target = progress * Math.max(0.01, video.duration - 0.08);
        if (Math.abs(video.currentTime - target) > 0.035) {
          video.currentTime = target;
        }
      }
    };
    const queueUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    return () => {
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion, videoReady]);

  useEffect(() => {
    if (reducedMotion) return;
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-kp-reveal]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("kp2-is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -9%", threshold: 0.12 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [reducedMotion]);

  const openingOpacity = clamp(1 - heroProgress * 2.35);
  const promiseOpacity = clamp(1 - Math.abs(heroProgress - 0.5) * 4.2);
  const invitationOpacity = clamp((heroProgress - 0.69) * 3.8);
  const heroStyle = {
    "--kp-progress": heroProgress,
  } as CSSProperties;

  return (
    <main className="kp2-site">
      <a className="kp2-skip" href="#promise">
        Skip the opening film
      </a>

      <header className="kp2-header" aria-label="Wedding navigation">
        <a className="kp2-mark" href="#top" aria-label="Kingsford and Perla, home">
          <span>K</span>
          <i aria-hidden="true" />
          <span>P</span>
        </a>
        <nav className="kp2-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <button className="kp2-header-rsvp" type="button" onClick={() => setRsvpOpen(true)}>
          <span>RSVP</span>
          <ArrowRight aria-hidden="true" />
        </button>
      </header>

      <section
        ref={heroRef}
        id="top"
        className="kp2-hero-scroll"
        style={heroStyle}
        aria-labelledby="kp2-hero-title"
      >
        <div className="kp2-hero-sticky">
          <div className="kp2-hero-media" aria-hidden="true">
            <div className="kp2-hero-poster" />
            <video
              ref={videoRef}
              className={videoReady ? "kp2-video-ready" : ""}
              muted
              playsInline
              preload="auto"
              poster="/wedding-hero-poster.jpg"
              onLoadedMetadata={() => {
                setVideoReady(true);
                if (videoRef.current) videoRef.current.currentTime = 0.01;
              }}
            >
              <source src="/wedding-hero.mp4" type="video/mp4" />
            </video>
            <div className="kp2-hero-wash" />
            <div className="kp2-film-grain" />
          </div>

          <svg
            className="kp2-gold-thread"
            viewBox="0 0 1600 900"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              pathLength="1"
              d="M-70 650 C180 570 210 310 445 365 C690 425 665 725 920 635 C1125 565 1120 270 1370 320 C1480 342 1545 430 1690 350"
            />
          </svg>

          <div
            className="kp2-hero-opening"
            style={{
              opacity: openingOpacity,
              transform: `translate3d(0, ${heroProgress * -32}px, 0)`,
            }}
          >
            <p className="kp2-film-label">A wedding story · Chapter zero</p>
            <h1 id="kp2-hero-title">
              <span>Kingsford</span>
              <em>&amp;</em>
              <span>Perla</span>
            </h1>
            <div className="kp2-hero-deck">
              <span>By God&apos;s grace</span>
              <i aria-hidden="true" />
              <span>A forever begins</span>
            </div>
          </div>

          <div
            className="kp2-hero-promise"
            style={{
              opacity: promiseOpacity,
              transform: `translate3d(0, ${(0.5 - heroProgress) * 62}px, 0)`,
            }}
            aria-hidden={promiseOpacity < 0.08}
          >
            <p className="kp2-film-label">Chapter I · The promise</p>
            <p className="kp2-hero-date">{weddingContent.engagement.dateShort}</p>
            <h2>We said yes<br />to the next chapter.</h2>
          </div>

          <div
            className="kp2-hero-invitation"
            style={{
              opacity: invitationOpacity,
              transform: `translate3d(0, ${(1 - heroProgress) * 52}px, 0)`,
            }}
          >
            <p className="kp2-film-label">The wedding chapter</p>
            <h2>A covenant<br />in the making.</h2>
            <p>The date and place will be revealed here, with care.</p>
            <button type="button" onClick={() => setRsvpOpen(true)}>
              Enter the guest experience <ArrowRight aria-hidden="true" />
            </button>
          </div>

          <div className="kp2-frame-index" aria-hidden="true">
            <span>KP / 01</span>
            <span>Faith · Family · Forever</span>
          </div>
          <div className="kp2-scroll-cue" aria-hidden="true">
            <span>Scroll to unfold</span>
            <ArrowDown />
          </div>
          <div className="kp2-progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${heroProgress})` }} />
          </div>
        </div>
      </section>

      <section id="promise" className="kp2-manifesto kp2-ivory">
        <div className="kp2-continuing-thread" aria-hidden="true"><i /></div>
        <div className="kp2-section-meta" data-kp-reveal>
          <span>01</span>
          <p>The promise</p>
        </div>
        <div className="kp2-manifesto-copy" data-kp-reveal>
          <p className="kp2-kicker">The beginning, witnessed by grace</p>
          <h2>Not simply a day.<br /><em>A covenant.</em></h2>
          <div className="kp2-manifesto-grid">
            <p>
              On {weddingContent.engagement.dateDisplay}, we chose the next
              chapter together. Now we are preparing to welcome the people whose
              love, prayer and counsel have carried us here.
            </p>
            <p>
              This is more than a place for logistics. It is our living invitation—
              one that will grow from promise to celebration as every detail becomes real.
            </p>
          </div>
        </div>
        <div className="kp2-date-monument" aria-label={`Engagement date: ${weddingContent.engagement.dateDisplay}`} data-kp-reveal>
          <span>29</span>
          <i />
          <span>08</span>
          <i />
          <span>26</span>
          <small>The engagement</small>
        </div>
      </section>

      <section id="covenant" className="kp2-worlds">
        <div className="kp2-worlds-image" data-kp-reveal>
          {/* This 96 KB WebP is already sized and encoded for the exact art-directed crop. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/covenant-rings.webp"
            alt="Two gold rings joined by a narrow gold and oxblood woven ribbon on ivory paper and dark stone."
          />
          <p>Two rings · one unbroken line</p>
        </div>
        <div className="kp2-worlds-copy" data-kp-reveal>
          <div className="kp2-section-meta kp2-section-meta-light">
            <span>02</span>
            <p>Two worlds, one home</p>
          </div>
          <p className="kp2-kicker">The thread between us</p>
          <h2>One story can hold<br />more than one horizon.</h2>
          <p className="kp2-worlds-lede">
            Ours is shaped by Ghanaian warmth, Canadian stillness, and the family
            and friends who make every place feel like home.
          </p>
          <div className="kp2-material-notes" aria-label="The wedding atmosphere">
            <span>Golden warmth</span>
            <span>Quiet grandeur</span>
            <span>Faith at the centre</span>
          </div>
        </div>
      </section>

      <section className="kp2-scripture">
        <div className="kp2-scripture-orbit" aria-hidden="true">
          <span>K</span><i /><span>P</span>
        </div>
        <div className="kp2-scripture-copy" data-kp-reveal>
          <Church aria-hidden="true" />
          <blockquote>
            “A cord of three strands<br />is not quickly broken.”
          </blockquote>
          <cite>Ecclesiastes 4:12</cite>
          <p>Faith is not an ornament in this story. It is the centre of it.</p>
        </div>
      </section>

      <section id="celebration" className="kp2-celebration kp2-ivory">
        <div className="kp2-celebration-heading" data-kp-reveal>
          <div className="kp2-section-meta">
            <span>03</span>
            <p>The celebration</p>
          </div>
          <p className="kp2-kicker">The next reveal</p>
          <h2>An invitation<br />still being written.</h2>
          <p>
            We are holding the particulars until they are worthy of the promise.
            When they are ready, this page becomes the single source of truth.
          </p>
        </div>

        <div className="kp2-invitation-object" data-kp-reveal>
          <div className="kp2-invitation-shadow" />
          <div className="kp2-invitation-card">
            <p>By God&apos;s grace</p>
            <div className="kp2-invitation-names">
              <span>Kingsford</span><em>&amp;</em><span>Perla</span>
            </div>
            <div className="kp2-invitation-rule" />
            <strong>The wedding chapter<br />will be revealed here first.</strong>
            <button type="button" onClick={() => setRsvpOpen(true)}>
              <span className="kp2-seal-mark">K <i /> P</span>
              <span>Open RSVP</span>
            </button>
          </div>
          <p className="kp2-object-caption">A private invitation for the people we love</p>
        </div>

        <dl className="kp2-status-ledger" data-kp-reveal>
          <div>
            <dt>Wedding date</dt>
            <dd>To be revealed</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>Shared with confirmed guests</dd>
          </div>
          <div>
            <dt>The spirit</dt>
            <dd>Faith · family · joy</dd>
          </div>
        </dl>
      </section>

      <section className="kp2-weekend">
        <div className="kp2-weekend-media" aria-hidden="true">
          {/* This 84 KB WebP is an intentional full-bleed art-directed background. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/engagement-candid.webp" alt="" />
          <div />
        </div>
        <div className="kp2-weekend-content">
          <div className="kp2-section-meta kp2-section-meta-light" data-kp-reveal>
            <span>04</span>
            <p>The wedding weekend</p>
          </div>
          <div className="kp2-weekend-intro" data-kp-reveal>
            <p className="kp2-kicker">One ceremony, one sacred promise</p>
            <h2>Gather.<br />Witness.<br /><em>Bless.</em></h2>
          </div>
          <ol className="kp2-movements">
            {weddingContent.schedule.map((item, index) => (
              <li key={item.sequence} data-kp-reveal style={{ "--kp-delay": `${index * 90}ms` } as CSSProperties}>
                <span>{item.sequence}</span>
                <div>
                  <p>Movement {index + 1}</p>
                  <h3>{item.label}</h3>
                  <small>{item.note}</small>
                </div>
                <ArrowRight aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="guest-notes" className="kp2-guest-notes kp2-ivory">
        <div className="kp2-guest-heading" data-kp-reveal>
          <div className="kp2-section-meta">
            <span>05</span>
            <p>Your guest edition</p>
          </div>
          <p className="kp2-kicker">Arrive with ease</p>
          <h2>Every practical detail,<br /><em>beautifully considered.</em></h2>
        </div>

        <div className="kp2-guest-ledger">
          {guestNotes.map((item, index) => {
            const Icon = item.icon;
            return (
              <article key={item.index} data-kp-reveal style={{ "--kp-delay": `${index * 75}ms` } as CSSProperties}>
                <span className="kp2-note-index">{item.index}</span>
                <Icon aria-hidden="true" />
                <p>{item.label}</p>
                <h3>{item.title}</h3>
                <div><span>{item.body}</span><i aria-hidden="true" /></div>
              </article>
            );
          })}
        </div>

        <div className="kp2-registry-note" data-kp-reveal>
          <Heart aria-hidden="true" />
          <div>
            <p className="kp2-kicker">A note on gifts</p>
            <h3>Your presence and prayers are already a gift.</h3>
          </div>
          <p>
            If we create a registry, its verified link will live here—never in an
            unfamiliar payment request.
          </p>
        </div>
      </section>

      <section className="kp2-rsvp-callout">
        <div className="kp2-rsvp-thread" aria-hidden="true" />
        <div className="kp2-rsvp-copy" data-kp-reveal>
          <Sparkles aria-hidden="true" />
          <p className="kp2-kicker">Your place in the story</p>
          <h2>Will you<br />celebrate with us?</h2>
          <p>
            Respond for your household, share dietary or accessibility needs,
            and return later with your private reference to make a change.
          </p>
          <button type="button" onClick={() => setRsvpOpen(true)}>
            Respond to our invitation <ArrowRight aria-hidden="true" />
          </button>
        </div>
        <div className="kp2-rsvp-seal" aria-hidden="true">
          <span>K</span><i /><span>P</span>
          <small>By grace · with joy</small>
        </div>
      </section>

      <section className="kp2-faq kp2-ivory">
        <div className="kp2-faq-heading" data-kp-reveal>
          <div className="kp2-section-meta">
            <span>06</span>
            <p>Notes before the day</p>
          </div>
          <h2>Questions,<br /><em>answered with care.</em></h2>
        </div>
        <div className="kp2-faq-list" data-kp-reveal>
          {weddingContent.faqs.map((faq, index) => (
            <details key={faq.question}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{faq.question}</strong>
                <i aria-hidden="true" />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="kp2-finale" aria-labelledby="kp2-finale-title">
        <div className="kp2-finale-media" aria-hidden="true" />
        <div className="kp2-finale-copy" data-kp-reveal>
          <p>The story continues</p>
          <h2 id="kp2-finale-title"><span>Kingsford</span><em>&amp;</em><span>Perla</span></h2>
          <strong>We cannot wait to welcome you into what comes next.</strong>
          <button type="button" onClick={() => setRsvpOpen(true)}>
            RSVP <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>

      <footer className="kp2-footer">
        <p>With love spanning Ghana, Canada &amp; beyond.</p>
        <span>K · P</span>
        <a href="/manage">Organiser access</a>
      </footer>

      <button className="kp2-mobile-rsvp" type="button" onClick={() => setRsvpOpen(true)}>
        RSVP <ArrowRight aria-hidden="true" />
      </button>

      <RsvpDialog open={rsvpOpen} onOpenChange={setRsvpOpen} />
    </main>
  );
}
