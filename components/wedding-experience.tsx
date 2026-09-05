"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import {
  ArrowDown,
  ArrowRight,
  BedDouble,
  CalendarDays,
  CarFront,
  Check,
  Church,
  Copy,
  Gift,
  Heart,
  MapPin,
  Plane,
  Quote,
  Sparkles,
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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { weddingContent } from "@/lib/wedding-content";

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

export function WeddingExperience() {
  const introRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener("change", syncMotion);
    return () => motionQuery.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const intro = introRef.current;
      if (!intro) return;
      const bounds = intro.getBoundingClientRect();
      const travel = Math.max(1, intro.offsetHeight - window.innerHeight);
      const nextProgress = clamp(-bounds.top / travel);
      setProgress(nextProgress);

      const video = videoRef.current;
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        const target = nextProgress * Math.max(0.01, video.duration - 0.08);
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
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-revealed");
        });
      },
      { threshold: 0.14 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [reducedMotion]);

  const openingOpacity = clamp(1 - progress * 2.25);
  const promiseOpacity = clamp(1 - Math.abs(progress - 0.64) * 3.15);
  const detailsOpacity = clamp((progress - 0.72) * 4.3);
  const heroStyle = {
    "--story-progress": progress,
  } as CSSProperties;

  return (
    <main className="wedding-site">
      <a className="skip-link" href="#welcome">
        Skip the cinematic introduction
      </a>

      <header className="topbar" aria-label="Wedding navigation">
        <a className="monogram" href="#top" aria-label="Kingsford and Perla, home">
          {weddingContent.couple.monogram}
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {weddingContent.navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <button className="nav-rsvp" type="button" onClick={() => setRsvpOpen(true)}>
          RSVP <ArrowRight aria-hidden="true" />
        </button>
      </header>

      <section
        ref={introRef}
        id="top"
        className="cinematic-intro"
        style={heroStyle}
        aria-labelledby="hero-title"
      >
        <div className="cinematic-sticky">
          <div className="hero-media" aria-hidden="true">
            <div className="hero-fallback" />
            <video
              ref={videoRef}
              className={videoReady ? "is-ready" : ""}
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
            <div className="film-grain" />
            <div className="hero-vignette" />
          </div>

          <div
            className="hero-opening"
            style={{ opacity: openingOpacity, transform: `translateY(${progress * -32}px)` }}
          >
            <p className="eyebrow light">An invitation to witness</p>
            <h1 id="hero-title">
              <span>{weddingContent.couple.first}</span>
              <em>&amp;</em>
              <span>{weddingContent.couple.second}</span>
            </h1>
            <p className="hero-date">{weddingContent.event.dateDisplay}</p>
          </div>

          <div
            className="hero-promise"
            style={{
              opacity: promiseOpacity,
              transform: `translateY(${(0.64 - progress) * 44}px)`,
            }}
            aria-hidden={promiseOpacity < 0.12}
          >
            <p>Two lives.</p>
            <p>One unfolding story.</p>
            <span>By God&apos;s grace, forever begins.</span>
          </div>

          <div
            className="hero-essentials"
            style={{ opacity: detailsOpacity, transform: `translateY(${(1 - progress) * 24}px)` }}
          >
            <div>
              <span>Celebration</span>
              <strong>{weddingContent.event.dateDisplay}</strong>
            </div>
            <div>
              <span>Place</span>
              <strong>{weddingContent.event.locationDisplay}</strong>
            </div>
            <button type="button" onClick={() => setRsvpOpen(true)}>
              Respond to our invitation <ArrowRight aria-hidden="true" />
            </button>
          </div>

          <div className="scroll-cue" aria-hidden="true">
            <span>Scroll to unfold</span>
            <ArrowDown />
          </div>
          <div className="film-progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </div>
        </div>
      </section>

      <section id="welcome" className="welcome-section page-section">
        <div className="section-index">01 / WELCOME</div>
        <div className="welcome-copy" data-reveal>
          <p className="eyebrow">With grateful hearts</p>
          <h2>
            Our favourite people,
            <br /> gathered around one promise.
          </h2>
          <p className="lede">
            We are preparing a celebration shaped by faith, warmth and the people
            who have loved us into this moment. This will be your verified home for
            every detail—and the beginning of a story we cannot wait to share with you.
          </p>
          <button className="text-link" type="button" onClick={() => setRsvpOpen(true)}>
            Let us know you&apos;ll be there <ArrowRight aria-hidden="true" />
          </button>
        </div>
        <blockquote className="scripture-card" data-reveal>
          <Quote aria-hidden="true" />
          <p>“Two are better than one, because they have a good return for their labour.”</p>
          <cite>Ecclesiastes 4:9</cite>
        </blockquote>
      </section>

      <section id="story" className="story-section">
        <div className="story-heading page-section" data-reveal>
          <p className="eyebrow">Our story</p>
          <h2>Not a timeline.<br />A becoming.</h2>
          <p>
            The photographs and personal milestones will be added with the couple&apos;s
            final selections. Until then, these are the values holding the story together.
          </p>
        </div>
        <div className="story-chapters">
          {weddingContent.storyChapters.map((chapter, index) => (
            <article
              className={`story-chapter story-chapter-${index + 1}`}
              key={chapter.title}
              data-reveal
            >
              <span className="chapter-number">{chapter.number}</span>
              <div>
                <p>{chapter.kicker}</p>
                <h3>{chapter.title}</h3>
                <span>{chapter.body}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="celebration" className="celebration-section page-section">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">The celebration</p>
            <h2>A day with rhythm,<br />meaning and joy.</h2>
          </div>
          <p>
            Final timing, venues and invitation-specific events will be published here
            as plans are confirmed. No forwarded detail outranks this page.
          </p>
        </div>

        <div className="schedule-grid">
          {weddingContent.schedule.map((item) => (
            <article key={item.sequence} className="schedule-card" data-reveal>
              <div className="schedule-topline">
                <span>{item.sequence}</span>
                {item.sequence === "01" ? <Church /> : item.sequence === "02" ? <Sparkles /> : <Heart />}
              </div>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
              <small>{item.note}</small>
            </article>
          ))}
        </div>

        <div className="guest-action-band" data-reveal>
          <div>
            <CalendarDays aria-hidden="true" />
            <span>
              <strong>Your personal itinerary</strong>
              Confirmed guests will receive invitation-specific times and locations.
            </span>
          </div>
          <button type="button" onClick={() => setRsvpOpen(true)}>
            Start RSVP <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>

      <section id="travel" className="travel-section">
        <div className="travel-title page-section" data-reveal>
          <p className="eyebrow light">Arrive with ease</p>
          <h2>From wherever<br />you call home.</h2>
          <p>
            Once the venue is confirmed, this guide will become a complete journey:
            arrival, stay, local movement and the celebration itself.
          </p>
        </div>
        <div className="travel-route page-section" aria-label="Planned travel guidance">
          {[
            { icon: Plane, title: "Arrive", text: "Nearest airports and stations" },
            { icon: BedDouble, title: "Stay", text: "Hotels, rates and booking windows" },
            { icon: CarFront, title: "Move", text: "Shuttles, parking and local transport" },
            { icon: MapPin, title: "Celebrate", text: "Verified addresses and map links" },
          ].map(({ icon: Icon, title, text }, index) => (
            <article key={title} data-reveal>
              <span className="route-line">0{index + 1}</span>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="registry-section page-section" id="registry">
        <div className="registry-card" data-reveal>
          <Gift aria-hidden="true" />
          <p className="eyebrow">With love</p>
          <h2>Your presence<br />is the present.</h2>
          <p>
            Your prayers, encouragement and the distance you may travel mean more than
            we can say. If a registry is added, the only trusted link will live here.
          </p>
        </div>
        <div className="registry-note" data-reveal>
          <span>Gift safety</span>
          <p>
            We will never change payment information through a forwarded message. If a
            request looks unfamiliar, please verify it with us directly.
          </p>
        </div>
      </section>

      <section id="questions" className="faq-section page-section">
        <div className="faq-heading" data-reveal>
          <p className="eyebrow">Good to know</p>
          <h2>The questions<br />you may be carrying.</h2>
          <p>We will keep these answers current as the celebration takes shape.</p>
        </div>
        <Accordion className="faq-list" type="single" collapsible data-reveal>
          {weddingContent.faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="finale-section">
        <div className="finale-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="eyebrow light">Save your place in our story</p>
        <h2>
          {weddingContent.couple.first} <em>&amp;</em> {weddingContent.couple.second}
        </h2>
        <p>We cannot wait to celebrate what God has done—and what comes next.</p>
        <button type="button" onClick={() => setRsvpOpen(true)}>
          Respond to our invitation <ArrowRight aria-hidden="true" />
        </button>
      </section>

      <footer className="site-footer">
        <span>{weddingContent.couple.monogram}</span>
        <p>Made with gratitude for the people we love.</p>
        <a href="/manage">Organiser access</a>
      </footer>

      <RsvpDialog open={rsvpOpen} onOpenChange={setRsvpOpen} />
    </main>
  );
}

type RsvpDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type SavedRsvp = {
  referenceCode: string;
  fullName: string;
  email: string;
  householdSize: number;
  accessibilityNeeds: string;
};

export function RsvpDialog({ open, onOpenChange }: RsvpDialogProps) {
  const [activeTab, setActiveTab] = useState("respond");
  const [loadedRsvp, setLoadedRsvp] = useState<SavedRsvp | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());

  const reset = () => {
    setActiveTab("respond");
    setLoadedRsvp(null);
    setPrivacyAccepted(false);
    setError("");
    setReferenceCode("");
    setCopied(false);
    setSubmissionId(crypto.randomUUID());
  };

  const loadExistingRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("lookupEmail") ?? "").trim();
    const reference = String(form.get("lookupReference") ?? "").trim();
    const search = new URLSearchParams({ reference });
    if (email) search.set("email", email);

    try {
      const response = await fetch(`/api/rsvp?${search.toString()}`, {
        cache: "no-store",
      });
      const result = (await response.json()) as { rsvp?: SavedRsvp; error?: string };
      if (!response.ok || !result.rsvp) {
        throw new Error(result.error ?? "We could not find that attendance notice.");
      }
      setLoadedRsvp(result.rsvp);
      setPrivacyAccepted(false);
      setActiveTab("respond");
    } catch (lookupError) {
      setError(
        lookupError instanceof Error
          ? lookupError.message
          : "We could not find that attendance notice.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const submitRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!privacyAccepted) {
      setError("Please confirm that we may use these details to prepare for the ceremony.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const payload = {
      referenceCode: String(form.get("referenceCode") ?? ""),
      submissionId,
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: "",
      attendance: "joyfully-attending",
      householdSize: Number(form.get("householdSize") ?? 1),
      guestNames: "",
      accessibilityNeeds: String(form.get("accessibilityNeeds") ?? ""),
      note: "",
      consentAccepted: privacyAccepted,
    };

    setSubmitting(true);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        referenceCode?: string;
        error?: string;
      };
      if (!response.ok || !result.referenceCode) {
        throw new Error(result.error ?? "We could not save your attendance notice.");
      }
      setReferenceCode(result.referenceCode);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not save your attendance notice. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copyReference = async () => {
    await navigator.clipboard.writeText(referenceCode);
    setCopied(true);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) window.setTimeout(reset, 250);
      }}
    >
      <DialogContent className="rsvp-dialog" showCloseButton>
        {referenceCode ? (
          <div className="rsvp-success" role="status">
            <span className="success-mark"><Check aria-hidden="true" /></span>
            <p className="eyebrow">Your attendance notice is safely with us</p>
            <DialogTitle>We look forward to welcoming you.</DialogTitle>
            <DialogDescription>
              Keep this private update reference. You will need it if your plans
              or household count change.
            </DialogDescription>
            <button className="reference-code" type="button" onClick={copyReference}>
              <span>{referenceCode}</span>
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              <small>{copied ? "Copied" : "Copy reference"}</small>
            </button>
            <button className="primary-button" type="button" onClick={() => onOpenChange(false)}>
              Return to the wedding website
            </button>
          </div>
        ) : (
          <>
            <DialogHeader className="rsvp-header">
              <p className="eyebrow">Optional attendance notice</p>
              <DialogTitle>Planning to join us?</DialogTitle>
              <DialogDescription>
                No formal invitation is required. Letting us know simply helps us prepare
                the space; only your household name and number attending are required.
              </DialogDescription>
            </DialogHeader>
            <Tabs
              className="rsvp-tabs"
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                setError("");
              }}
            >
              <TabsList variant="line" aria-label="Attendance notice options">
                <TabsTrigger value="respond">Let us know</TabsTrigger>
                <TabsTrigger value="find">Update my notice</TabsTrigger>
              </TabsList>
              <TabsContent value="respond">
                {loadedRsvp && (
                  <div className="loaded-rsvp" role="status">
                    <Check aria-hidden="true" />
                    <span>
                      <strong>Your attendance notice is ready to edit.</strong>
                      Review the details, reconfirm privacy consent and save your changes.
                    </span>
                  </div>
                )}
            <form
              key={loadedRsvp?.referenceCode ?? "new-response"}
              className="rsvp-form"
              onSubmit={submitRsvp}
            >
              <input
                name="referenceCode"
                type="hidden"
                value={loadedRsvp?.referenceCode ?? ""}
              />
              <div className="form-grid two-columns">
                <label>
                  <span>Name or household name *</span>
                  <input
                    name="fullName"
                    autoComplete="name"
                    required
                    maxLength={120}
                    defaultValue={loadedRsvp?.fullName}
                  />
                </label>
                <label>
                  <span>Number attending *</span>
                  <input
                    name="householdSize"
                    type="number"
                    min={1}
                    max={8}
                    required
                    defaultValue={loadedRsvp?.householdSize ?? 1}
                  />
                </label>
              </div>

              <label>
                <span>Email for important updates (optional)</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={200}
                  defaultValue={loadedRsvp?.email}
                />
              </label>

              <label>
                <span>Accessibility or support needs (optional)</span>
                <textarea
                  name="accessibilityNeeds"
                  rows={2}
                  maxLength={500}
                  defaultValue={loadedRsvp?.accessibilityNeeds}
                />
              </label>

              <label className="privacy-check">
                <Checkbox checked={privacyAccepted} onCheckedChange={(value) => setPrivacyAccepted(value === true)} />
                <span>
                  I agree that these details may be used privately to prepare the ceremony,
                  share important updates and arrange accessibility support. *
                </span>
              </label>

              {error && <p className="form-error" role="alert">{error}</p>}

              <button className="primary-button" type="submit" disabled={submitting}>
                {submitting
                  ? "Saving your attendance notice…"
                  : loadedRsvp
                    ? "Update attendance notice"
                    : "Send attendance notice"}
                {!submitting && <ArrowRight aria-hidden="true" />}
              </button>
            </form>
              </TabsContent>
              <TabsContent value="find">
                <form className="lookup-form" onSubmit={loadExistingRsvp}>
                  <div className="lookup-intro">
                    <p className="eyebrow">Welcome back</p>
                    <h3>Find your attendance notice.</h3>
                    <p>
                      Enter your private update reference. If your reference has only
                      10 characters, also enter the email used with the original response.
                    </p>
                  </div>
                  <label>
                    <span>Private update reference *</span>
                    <input
                      name="lookupReference"
                      autoCapitalize="characters"
                      autoComplete="off"
                      required
                      maxLength={24}
                    />
                  </label>
                  <label>
                    <span>Email for an older reference (optional)</span>
                    <input name="lookupEmail" type="email" autoComplete="email" />
                  </label>
                  {error && <p className="form-error" role="alert">{error}</p>}
                  <button className="primary-button" type="submit" disabled={submitting}>
                    {submitting ? "Finding your notice…" : "Find my attendance notice"}
                    {!submitting && <ArrowRight aria-hidden="true" />}
                  </button>
                </form>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
