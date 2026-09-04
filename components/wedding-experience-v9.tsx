"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Accessibility,
  ArrowDown,
  ArrowRight,
  BedDouble,
  CalendarHeart,
  CarFront,
  Check,
  ChevronRight,
  CirclePause,
  CirclePlay,
  Copy,
  ExternalLink,
  Heart,
  Images,
  MapPin,
  Menu,
  Phone,
  Plane,
  Route,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GiftCenter } from "@/components/gift-center";
import { RsvpDialog } from "@/components/wedding-experience";
import { galleryFrames } from "@/lib/gallery";
import { weddingContent } from "@/lib/wedding-content";

const WEDDING_MOMENT = new Date("2026-09-19T12:00:00-02:30").getTime();

function WeddingMark() {
  return (
    <span className="kp-mark" aria-hidden="true">
      <span className="kp-mark-pearl" />
      <span className="kp-mark-letters"><i>K</i><b>&amp;</b><i>P</i></span>
    </span>
  );
}

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  const difference = Math.max(0, WEDDING_MOMENT - now);
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference % 86_400_000) / 3_600_000),
    minutes: Math.floor((difference % 3_600_000) / 60_000),
  };
}

const navigation = [
  { label: "Our invitation", href: "#invitation" },
  { label: "Gallery", href: "/gallery" },
  { label: "The day", href: "#the-day" },
  { label: "Travel", href: "#guest-guide" },
  { label: "Gifts", href: "#gifts" },
] as const;

export function WeddingExperienceV9() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const countdown = useCountdown();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      videoRef.current?.pause();
    }
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-kp9-reveal]"));
    if (reduced.matches) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: .09, rootMargin: "0px 0px -7%" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const calendarHref = useMemo(() => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Kingsford and Perla//Wedding//EN",
      "BEGIN:VEVENT",
      "UID:kingsford-perla-20260919@wedding",
      "DTSTAMP:20260831T000000Z",
      "DTSTART;VALUE=DATE:20260919",
      "DTEND;VALUE=DATE:20260920",
      "SUMMARY:Kingsford & Perla — Wedding Ceremony",
      "LOCATION:Ramada by Wyndham St. John's\\, 102 Kenmount Road\\, St. John's\\, NL A1B 3R2",
      "DESCRIPTION:Wedding ceremony at Ramada by Wyndham St. John's. Confirmed arrival time will appear on your invitation.",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
  }, []);

  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
      setVideoPlaying(true);
    } else {
      video.pause();
      setVideoPlaying(false);
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(weddingContent.event.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const openRsvp = () => {
    setMenuOpen(false);
    setRsvpOpen(true);
  };

  return (
    <main className="kp9-site">
      <a className="kp9-skip" href="#invitation">Skip to the invitation</a>

      <header className="kp9-header">
        <a href="#top" className="kp9-brand" aria-label="Kingsford and Perla wedding home">
          <WeddingMark />
          <span><strong>Kingsford &amp; Perla</strong><small>19 · 09 · 26</small></span>
        </a>
        <nav className="kp9-nav" aria-label="Wedding navigation">
          {navigation.map((item) => item.href.startsWith("/") ? (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ) : (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <div className="kp9-header-actions">
          <button type="button" onClick={openRsvp}>RSVP <ArrowRight aria-hidden="true" /></button>
          <button className="kp9-menu" type="button" onClick={() => setMenuOpen(true)} aria-label="Open wedding menu"><Menu aria-hidden="true" /></button>
        </div>
      </header>

      {menuOpen && (
        <div className="kp9-mobile-nav" role="dialog" aria-modal="true" aria-label="Wedding menu">
          <div className="kp9-mobile-nav-top"><WeddingMark /><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close wedding menu"><X aria-hidden="true" /></button></div>
          <nav>
            {navigation.map((item, index) => item.href.startsWith("/") ? (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><small>0{index + 1}</small><span>{item.label}</span><ArrowRight aria-hidden="true" /></Link>
            ) : (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><small>0{index + 1}</small><span>{item.label}</span><ArrowRight aria-hidden="true" /></a>
            ))}
          </nav>
          <button type="button" onClick={openRsvp}>Respond to our invitation <Heart aria-hidden="true" /></button>
        </div>
      )}

      <section id="top" className="kp9-hero" aria-labelledby="kp9-hero-title">
        <div className="kp9-hero-photo">
          <picture className="kp9-hero-picture">
            <source media="(max-width: 780px)" srcSet="/engagement-couple.webp" />
            <Image
              src="/engagement-laughter.webp"
              alt="Kingsford and Perla laughing together at their engagement celebration."
              fill
              priority
              unoptimized
              sizes="100vw"
            />
          </picture>
          <div className="kp9-hero-split" aria-hidden="true">
            <Image src="/engagement-laughter.webp" alt="" fill priority unoptimized sizes="100vw" />
          </div>
          <div className="kp9-hero-grade" />
          <div className="kp9-grain" />
        </div>
        <div className="kp9-hero-copy">
          <p>With joy, we invite you to witness</p>
          <h1 id="kp9-hero-title"><span>Kingsford</span><i>&amp;</i><span>Perla</span></h1>
          <div className="kp9-hero-date"><strong>19</strong><span><small>September</small><b>2026</b></span></div>
          <p className="kp9-hero-place"><MapPin aria-hidden="true" /> Ramada by Wyndham St. John’s · Newfoundland</p>
          <div className="kp9-hero-buttons">
            <button type="button" onClick={openRsvp}>Respond to our invitation <ArrowRight aria-hidden="true" /></button>
            <Link href="/gallery"><Images aria-hidden="true" /> Enter the gallery</Link>
          </div>
        </div>
        <div className="kp9-hero-countdown" aria-label={`${countdown.days} days, ${countdown.hours} hours and ${countdown.minutes} minutes until the wedding`}>
          <span><strong>{String(countdown.days).padStart(2, "0")}</strong><small>Days</small></span>
          <i>:</i>
          <span><strong>{String(countdown.hours).padStart(2, "0")}</strong><small>Hours</small></span>
          <i>:</i>
          <span><strong>{String(countdown.minutes).padStart(2, "0")}</strong><small>Minutes</small></span>
        </div>
        <a className="kp9-scroll" href="#invitation"><span>Unfold the invitation</span><ArrowDown aria-hidden="true" /></a>
      </section>

      <section className="kp9-confirmed" aria-label="Confirmed wedding details">
        <article><CalendarHeart aria-hidden="true" /><span><small>Wedding day</small><strong>Saturday, 19 September 2026</strong></span></article>
        <article><MapPin aria-hidden="true" /><span><small>Ceremony venue</small><strong>Ramada by Wyndham St. John’s</strong></span></article>
        <a href={weddingContent.event.mapUrl} target="_blank" rel="noreferrer">Open directions <ArrowRight aria-hidden="true" /></a>
      </section>

      <section id="invitation" className="kp9-invitation">
        <div className="kp9-invitation-copy" data-kp9-reveal>
          <p className="kp9-kicker">A covenant · A celebration · A new beginning</p>
          <h2>One beautiful day.<br /><em>One forever after.</em></h2>
          <p>
            By God’s grace, our story has led us here. We would be honoured to have
            the people who have prayed, laughed, guided and grown with us gather around
            the promise we are about to make.
          </p>
          <blockquote>“Two are better than one, because they have a good return for their labour.”<cite>Ecclesiastes 4:9</cite></blockquote>
        </div>
        <figure className="kp9-invitation-portrait" data-kp9-reveal>
          <Image src="/engagement-couple.webp" alt="Kingsford and Perla holding hands and smiling together." fill unoptimized sizes="(max-width: 780px) 100vw, 44vw" style={{ objectPosition: "50% 30%" }} />
          <figcaption><span>K + P</span><small>From yes to always</small></figcaption>
        </figure>
        <div className="kp9-invitation-seal" aria-hidden="true"><WeddingMark /><span>By grace · For life</span></div>
      </section>

      <section className="kp9-gallery-doorway" aria-labelledby="kp9-gallery-title">
        <div className="kp9-gallery-doorway-copy" data-kp9-reveal>
          <p className="kp9-kicker kp9-kicker-light">The engagement archive</p>
          <h2 id="kp9-gallery-title">Every feeling<br /><em>has a frame.</em></h2>
          <p>
            We moved the complete collection into its own cinematic memory room—three
            chapters, nine real moments, and several ways to experience the story.
          </p>
          <Link href="/gallery">Enter the full gallery <ArrowRight aria-hidden="true" /></Link>
          <span><Images aria-hidden="true" /> Story · Mosaic · Film strip · Fullscreen cinema</span>
        </div>
        <div className="kp9-gallery-stack" data-kp9-reveal aria-hidden="true">
          {[galleryFrames[3], galleryFrames[2], galleryFrames[0]].map((frame, index) => (
            <figure key={frame.id} className={`kp9-gallery-stack-${index + 1}`}>
              <Image src={frame.src} alt="" fill unoptimized sizes="(max-width: 780px) 70vw, 30vw" style={{ objectPosition: frame.focalPoint }} />
              <span>{frame.title}</span>
            </figure>
          ))}
        </div>
      </section>

      <section id="the-day" className="kp9-day" aria-labelledby="kp9-day-title">
        <div className="kp9-day-heading" data-kp9-reveal>
          <p className="kp9-kicker">The wedding day</p>
          <h2 id="kp9-day-title">One sacred gathering.<br /><em>One lasting promise.</em></h2>
          <p>Your invitation carries the confirmed arrival time and wedding-day details.</p>
        </div>
        <div className="kp9-day-date" aria-hidden="true"><span>19</span><i>09</i><strong>26</strong></div>
        <div className="kp9-day-timeline" data-kp9-reveal>
          {weddingContent.schedule.map((item) => (
            <article key={item.sequence}>
              <span>{item.sequence}</span>
              <div><small>The promise</small><h3>{item.label}</h3><p>{item.detail}</p></div>
              <em>{item.note}</em>
            </article>
          ))}
        </div>
      </section>

      <section className="kp9-film" aria-labelledby="kp9-film-title">
        <div className="kp9-film-media" data-kp9-reveal>
          <video ref={videoRef} autoPlay muted loop playsInline preload="metadata" poster="/wedding-editorial-poster.jpg" onPlay={() => setVideoPlaying(true)} onPause={() => setVideoPlaying(false)}>
            <source src="/wedding-editorial.mp4" type="video/mp4" />
          </video>
          <div />
          <button type="button" onClick={toggleVideo}>{videoPlaying ? <CirclePause aria-hidden="true" /> : <CirclePlay aria-hidden="true" />} {videoPlaying ? "Pause film" : "Play film"}</button>
        </div>
        <div className="kp9-film-copy" data-kp9-reveal>
          <p className="kp9-kicker">The living invitation</p>
          <h2 id="kp9-film-title">A little cinema.<br /><em>A lot of us.</em></h2>
          <p>Motion, light and the warmth of Newfoundland frame a wedding home that feels alive before the day even begins.</p>
          <ul><li><Check aria-hidden="true" /> Pause control</li><li><Check aria-hidden="true" /> Reduced-motion alternative</li><li><Check aria-hidden="true" /> Mobile-ready film</li></ul>
        </div>
      </section>

      <section id="guest-guide" className="kp9-guide" aria-labelledby="kp9-guide-title">
        <div className="kp9-guide-heading" data-kp9-reveal>
          <div><p className="kp9-kicker">Your complete guest guide</p><h2 id="kp9-guide-title">Arrive with ease.<br /><em>Celebrate fully.</em></h2></div>
          <p>Everything currently confirmed for Ramada by Wyndham St. John’s, gathered in one place. Use the live links before travelling because transport schedules can change.</p>
        </div>

        <div className="kp9-venue-card" data-kp9-reveal>
          <a
            className="kp9-venue-photo"
            href={weddingContent.event.venueUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="View the official Ramada by Wyndham St. John’s hotel page"
          >
            <Image
              src={weddingContent.event.venueImageUrl}
              alt="Exterior entrance of Ramada by Wyndham St. John’s at 102 Kenmount Road."
              fill
              unoptimized
              sizes="(max-width: 850px) 100vw, 56vw"
            />
            <span className="kp9-venue-photo-credit">
              <small>Confirmed ceremony venue</small>
              Official exterior · Photo: {weddingContent.event.venueImageCredit}
              <ExternalLink aria-hidden="true" />
            </span>
          </a>
          <div className="kp9-venue-copy">
            <p>Our ceremony venue</p>
            <h3>Ramada by Wyndham<br />St. John’s</h3>
            <address>{weddingContent.event.address}</address>
            <div>
              <a href={weddingContent.event.mapUrl} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" /> Open in Google Maps</a>
              <button type="button" onClick={copyAddress}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />} {copied ? "Address copied" : "Copy address"}</button>
            </div>
            <span><Phone aria-hidden="true" /><a href="tel:+17097229330">+1 709 722 9330</a></span>
          </div>
        </div>

        <div className="kp9-travel-grid">
          <article data-kp9-reveal>
            <span>01</span><CarFront aria-hidden="true" /><h3>Driving &amp; parking</h3>
            <p>The hotel currently lists free on-site parking. Open the verified map for turn-by-turn directions to 102 Kenmount Road.</p>
            <a href={weddingContent.event.mapUrl} target="_blank" rel="noreferrer">Start route <ExternalLink aria-hidden="true" /></a>
          </article>
          <article data-kp9-reveal>
            <span>02</span><Plane aria-hidden="true" /><h3>From YYT airport</h3>
            <p>St. John’s International Airport currently publishes a C$42 fixed taxi fare to the Ramada. Confirm the current fare before departure.</p>
            <a href="https://stjohnsairport.com/to-from-airport/ground-transportation/taxis/" target="_blank" rel="noreferrer">Airport taxi guide <ExternalLink aria-hidden="true" /></a>
          </article>
          <article data-kp9-reveal>
            <span>03</span><Route aria-hidden="true" /><h3>Metrobus route</h3>
            <p>Use Route 14 from the airport area to MUN Centre, then transfer to Route 16 toward Kenmount Road. Check the live planner for service changes.</p>
            <a href="https://www.metrobus.com/plantrip.asp" target="_blank" rel="noreferrer">Plan a live trip <ExternalLink aria-hidden="true" /></a>
          </article>
          <article data-kp9-reveal>
            <span>04</span><BedDouble aria-hidden="true" /><h3>Staying at the venue</h3>
            <p>Published hotel times are 3:00 PM check-in and 11:00 AM check-out. No wedding room block is announced yet; verify rates directly.</p>
            <a href={weddingContent.event.venueUrl} target="_blank" rel="noreferrer">Official hotel page <ExternalLink aria-hidden="true" /></a>
          </article>
          <article data-kp9-reveal>
            <span>05</span><Accessibility aria-hidden="true" /><h3>Accessible arrival</h3>
            <p>The property lists wheelchair-accessible elevators and accessible facilities. Add specific needs privately to your RSVP so we can coordinate with the venue.</p>
            <button type="button" onClick={openRsvp}>Add access needs <ChevronRight aria-hidden="true" /></button>
          </article>
          <article data-kp9-reveal>
            <span>06</span><CalendarHeart aria-hidden="true" /><h3>Keep the day close</h3>
            <p>Save the wedding date now. Your invitation and this private website remain the source for confirmed timing.</p>
            <a href={calendarHref} download="kingsford-perla-wedding.ics">Add to calendar <ExternalLink aria-hidden="true" /></a>
          </article>
        </div>

        <div className="kp9-guide-notice" data-kp9-reveal><ShieldCheck aria-hidden="true" /><p><strong>Verified information only.</strong> We do not currently advertise a shuttle or room block. If one is confirmed, it will appear here first.</p></div>
      </section>

      <GiftCenter />

      <section className="kp9-faq" aria-labelledby="kp9-faq-title">
        <div className="kp9-faq-heading" data-kp9-reveal><p className="kp9-kicker">Good to know</p><h2 id="kp9-faq-title">Before you ask<br /><em>the group chat.</em></h2><p>Clear answers for the details guests ask most.</p></div>
        <Accordion type="single" collapsible className="kp9-faq-list" data-kp9-reveal>
          {weddingContent.faqs.map((item, index) => (
            <AccordionItem key={item.question} value={`question-${index}`}>
              <AccordionTrigger><small>{String(index + 1).padStart(2, "0")}</small><span>{item.question}</span></AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section id="rsvp" className="kp9-rsvp" aria-labelledby="kp9-rsvp-title">
        <div className="kp9-rsvp-image"><Image src="/engagement-together.webp" alt="Kingsford and Perla standing together at their engagement celebration." fill unoptimized sizes="100vw" style={{ objectPosition: "50% 30%" }} /><div /></div>
        <div className="kp9-rsvp-copy" data-kp9-reveal>
          <p className="kp9-kicker kp9-kicker-light">Your place in our story</p>
          <h2 id="kp9-rsvp-title">Will you celebrate<br /><em>with us?</em></h2>
          <p>Respond once for your household. Add accessibility needs privately, then use your confirmation reference if plans change.</p>
          <button type="button" onClick={openRsvp}>Open guest RSVP <ArrowRight aria-hidden="true" /></button>
          <span><ShieldCheck aria-hidden="true" /> Private household response · Secure update reference</span>
        </div>
      </section>

      <footer className="kp9-footer">
        <div><WeddingMark /><span><strong>Kingsford &amp; Perla</strong><small>Saturday, 19 September 2026</small></span></div>
        <p>Made with faith, joy and room for everyone we love.</p>
        <nav><Link href="/gallery">Gallery</Link><a href={weddingContent.event.mapUrl} target="_blank" rel="noreferrer">Directions</a><a href="/manage">Organiser access</a></nav>
      </footer>

      <button className="kp9-floating-rsvp" type="button" onClick={openRsvp}><Heart aria-hidden="true" /><span>RSVP</span></button>
      <RsvpDialog open={rsvpOpen} onOpenChange={setRsvpOpen} />
    </main>
  );
}
