"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePause,
  CirclePlay,
  Copy,
  Grid2X2,
  Heart,
  Rows3,
  Sparkles,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  galleryClusters,
  galleryFrames,
  getGalleryFrame,
  type GalleryClusterId,
  type GalleryFrame,
} from "@/lib/gallery";

type ViewMode = "chapters" | "mosaic" | "film";
type Filter = "all" | GalleryClusterId;

const galleryHeroFrames = [
  "coastal-layered",
  "mist-holding-hands",
  "coastal-joy",
  "coastal-hand-in-hand",
  "coastal-walk",
  "coastal-stairs",
  "the-day-we-said-yes",
  "one-promise",
  "love-in-motion",
]
  .map(getGalleryFrame)
  .filter((frame): frame is GalleryFrame => Boolean(frame));

function GalleryLogo() {
  return (
    <span className="kp-mark" aria-hidden="true">
      <span className="kp-mark-pearl" />
      <span className="kp-mark-letters"><i>K</i><b>&amp;</b><i>P</i></span>
    </span>
  );
}

export function GalleryExperience() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [view, setView] = useState<ViewMode>("chapters");
  const [filter, setFilter] = useState<Filter>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const touchStart = useRef<number | null>(null);

  const visibleFrames = useMemo(
    () => filter === "all" ? galleryFrames : galleryFrames.filter((frame) => frame.cluster === filter),
    [filter],
  );

  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("photo");
    if (!query) return;
    const index = galleryFrames.findIndex((frame) => frame.id === query);
    if (index < 0) return;
    const frame = window.requestAnimationFrame(() => setLightboxIndex(index));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!playing || reduced) return;
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % galleryHeroFrames.length);
    }, 5400);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-gallery-reveal]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [view, filter]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const frame = galleryFrames[lightboxIndex];
    const url = new URL(window.location.href);
    url.searchParams.set("photo", frame.id);
    window.history.replaceState({}, "", url);
    for (const offset of [-1, 1]) {
      const adjacent = galleryFrames[(lightboxIndex + offset + galleryFrames.length) % galleryFrames.length];
      const preloader = new window.Image();
      preloader.src = adjacent.src;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setLightboxIndex((lightboxIndex + 1) % galleryFrames.length);
      if (event.key === "ArrowLeft") setLightboxIndex((lightboxIndex - 1 + galleryFrames.length) % galleryFrames.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("photo");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  const openFrame = (frameId: string) => {
    const index = galleryFrames.findIndex((frame) => frame.id === frameId);
    if (index >= 0) setLightboxIndex(index);
  };

  const copyFrameLink = async () => {
    if (lightboxIndex === null) return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("photo", galleryFrames[lightboxIndex].id);
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const finishSwipe = (event: ReactPointerEvent) => {
    if (touchStart.current === null || lightboxIndex === null) return;
    const distance = event.clientX - touchStart.current;
    if (Math.abs(distance) > 55) {
      setLightboxIndex(
        distance < 0
          ? (lightboxIndex + 1) % galleryFrames.length
          : (lightboxIndex - 1 + galleryFrames.length) % galleryFrames.length,
      );
    }
    touchStart.current = null;
  };

  return (
    <main className="kp-gallery-site">
      <a className="kp-gallery-skip" href="#gallery-collection">Skip to the photographs</a>
      <header className="kp-gallery-header">
        <Link href="/" className="kp-gallery-brand" aria-label="Kingsford and Perla wedding home">
          <GalleryLogo />
          <span><strong>Kingsford &amp; Perla</strong><small>Our story in photographs</small></span>
        </Link>
        <nav aria-label="Gallery navigation">
          <a href="#gallery-collection">The collection</a>
          <a href="#gallery-chapters">Chapters</a>
          <Link href="/#guest-guide">Wedding details</Link>
        </nav>
        <Link href="/#attendance" className="kp-gallery-rsvp">Planning to attend? <ArrowRight aria-hidden="true" /></Link>
      </header>

      <section className="kp-gallery-hero" aria-labelledby="gallery-title">
        <div className="kp-gallery-hero-media">
          {galleryHeroFrames.map((frame, index) => (
            <div key={frame.id} className={`kp-gallery-hero-frame ${index === heroIndex ? "is-active" : ""}`} aria-hidden={index !== heroIndex}>
              <Image
                src={frame.src}
                alt={index === heroIndex ? frame.alt : ""}
                fill
                unoptimized
                priority={index === 0}
                sizes="100vw"
                style={{ objectPosition: frame.focalPoint }}
              />
            </div>
          ))}
          <div className="kp-gallery-hero-grade" />
          <div className="kp-gallery-grain" />
        </div>

        <div className="kp-gallery-hero-copy">
          <p>Portraits · Promises · 2026</p>
          <h1 id="gallery-title"><span>Our story</span><em>in frames.</em></h1>
          <div>
            <span>{String(galleryFrames.length).padStart(2, "0")} photographs</span>
            <i />
            <span>{galleryClusters.length} chapters</span>
          </div>
        </div>

        <div className="kp-gallery-hero-control">
          <button type="button" onClick={() => setPlaying((current) => !current)} aria-label={playing ? "Pause gallery introduction" : "Play gallery introduction"}>
            {playing ? <CirclePause aria-hidden="true" /> : <CirclePlay aria-hidden="true" />}
          </button>
          <span>{String(heroIndex + 1).padStart(2, "0")} / {String(galleryHeroFrames.length).padStart(2, "0")}</span>
          <div aria-hidden="true"><i style={{ transform: `scaleX(${(heroIndex + 1) / galleryHeroFrames.length})` }} /></div>
        </div>

        <div className="kp-gallery-orbit" aria-hidden="true">
          {galleryFrames.slice(0, 5).map((frame, index) => (
            <span key={frame.id} className={`kp-gallery-orbit-${index + 1}`}>
              <Image src={frame.src} alt="" fill unoptimized sizes="10vw" style={{ objectPosition: frame.focalPoint }} />
            </span>
          ))}
        </div>
      </section>

      <section className="kp-gallery-prologue" data-gallery-reveal>
        <p>Not simply photographs.</p>
        <h2>Twenty-one pieces of a feeling<br /><em>we never want to forget.</em></h2>
        <span>From studio warmth and heritage in the mist to the Newfoundland coast and our engagement celebration, every frame holds a piece of us.</span>
      </section>

      <section id="gallery-collection" className="kp-gallery-collection" aria-labelledby="collection-title">
        <div className="kp-gallery-toolbar" data-gallery-reveal>
          <div>
            <p>The complete collection</p>
            <h2 id="collection-title">Choose how the story moves.</h2>
          </div>
          <div className="kp-gallery-view-switch" aria-label="Gallery display style">
            <button className={view === "chapters" ? "is-active" : ""} type="button" onClick={() => setView("chapters")}><Sparkles aria-hidden="true" /> Chapters</button>
            <button className={view === "mosaic" ? "is-active" : ""} type="button" onClick={() => setView("mosaic")}><Grid2X2 aria-hidden="true" /> Mosaic</button>
            <button className={view === "film" ? "is-active" : ""} type="button" onClick={() => setView("film")}><Rows3 aria-hidden="true" /> Film strip</button>
          </div>
        </div>

        <div className="kp-gallery-filter" data-gallery-reveal aria-label="Filter photographs by chapter">
          <button type="button" className={filter === "all" ? "is-active" : ""} onClick={() => setFilter("all")}>All frames <span>{galleryFrames.length}</span></button>
          {galleryClusters.map((cluster) => (
            <button key={cluster.id} type="button" className={filter === cluster.id ? "is-active" : ""} onClick={() => setFilter(cluster.id)}>
              {cluster.title} <span>{galleryFrames.filter((frame) => frame.cluster === cluster.id).length}</span>
            </button>
          ))}
        </div>

        {view === "chapters" && (
          <div id="gallery-chapters" className="kp-gallery-chapters">
            {galleryClusters.filter((cluster) => filter === "all" || filter === cluster.id).map((cluster) => {
              const frames = galleryFrames.filter((frame) => frame.cluster === cluster.id);
              return (
                <section key={cluster.id} className={`kp-gallery-chapter kp-gallery-chapter-${cluster.id}`} aria-labelledby={`chapter-${cluster.id}`}>
                  <div className="kp-gallery-chapter-copy" data-gallery-reveal>
                    <span>{cluster.number}</span>
                    <p>Chapter {cluster.number}</p>
                    <h3 id={`chapter-${cluster.id}`}>{cluster.title}</h3>
                    <em>{cluster.subtitle}</em>
                  </div>
                  <div className="kp-gallery-chapter-grid">
                    {frames.map((frame, index) => (
                      <button
                        key={frame.id}
                        type="button"
                        className={`kp-gallery-card kp-gallery-card-${frame.orientation}`}
                        onClick={() => openFrame(frame.id)}
                        data-gallery-reveal
                        aria-label={`Open ${frame.title}`}
                      >
                        <span className="kp-gallery-card-image">
                          <Image src={frame.src} alt={frame.alt} fill unoptimized sizes="(max-width: 700px) 100vw, 50vw" style={{ objectPosition: frame.focalPoint }} />
                        </span>
                        <span className="kp-gallery-card-caption"><small>{String(index + 1).padStart(2, "0")}</small><strong>{frame.title}</strong><ArrowRight aria-hidden="true" /></span>
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {view === "mosaic" && (
          <div className="kp-gallery-mosaic">
            {visibleFrames.map((frame, index) => (
              <button key={frame.id} type="button" className={`kp-gallery-mosaic-card is-${frame.orientation}`} onClick={() => openFrame(frame.id)} data-gallery-reveal>
                <Image src={frame.src} alt={frame.alt} fill unoptimized sizes="(max-width: 700px) 100vw, 34vw" style={{ objectPosition: frame.focalPoint }} />
                <span><small>{String(index + 1).padStart(2, "0")}</small><strong>{frame.title}</strong></span>
              </button>
            ))}
          </div>
        )}

        {view === "film" && (
          <div className="kp-gallery-film-strip" aria-label="Scrollable photograph film strip">
            {visibleFrames.map((frame, index) => (
              <button key={frame.id} type="button" onClick={() => openFrame(frame.id)} data-gallery-reveal>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><Image src={frame.src} alt={frame.alt} fill unoptimized sizes="(max-width: 700px) 82vw, 42vw" style={{ objectPosition: frame.focalPoint }} /></div>
                <strong>{frame.title}</strong>
                <small>{frame.caption}</small>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="kp-gallery-finale" data-gallery-reveal>
        <GalleryLogo />
        <p>From one beautiful yes to another.</p>
        <h2>The next chapter<br /><em>begins 19 September.</em></h2>
        <div>
          <Link href="/"><ArrowLeft aria-hidden="true" /> Wedding details</Link>
          <Link href="/#attendance">Let us know you’re coming <Heart aria-hidden="true" /></Link>
        </div>
      </section>

      <footer className="kp-gallery-footer">
        <span>Kingsford &amp; Perla · Portrait &amp; engagement gallery</span>
        <span>29 · 08 · 26 → 19 · 09 · 26</span>
      </footer>

      <Dialog open={lightboxIndex !== null} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent className="kp-gallery-lightbox" showCloseButton={false}>
          {lightboxIndex !== null && (
            <div className="kp-gallery-lightbox-inner" onPointerDown={(event) => { touchStart.current = event.clientX; }} onPointerUp={finishSwipe}>
              <DialogTitle className="sr-only">{galleryFrames[lightboxIndex].title}</DialogTitle>
              <DialogDescription className="sr-only">{galleryFrames[lightboxIndex].alt}</DialogDescription>
              <div className="kp-gallery-lightbox-image">
                <Image
                  key={galleryFrames[lightboxIndex].id}
                  src={galleryFrames[lightboxIndex].src}
                  alt={galleryFrames[lightboxIndex].alt}
                  fill
                  unoptimized
                  priority
                  sizes="100vw"
                  style={{ objectPosition: galleryFrames[lightboxIndex].focalPoint }}
                />
              </div>
              <div className="kp-gallery-lightbox-top">
                <span>{String(lightboxIndex + 1).padStart(2, "0")} / {String(galleryFrames.length).padStart(2, "0")}</span>
                <div>
                  <button type="button" onClick={copyFrameLink}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}<span>{copied ? "Copied" : "Copy frame link"}</span></button>
                  <button type="button" onClick={closeLightbox} aria-label="Close photograph"><X aria-hidden="true" /></button>
                </div>
              </div>
              <div className="kp-gallery-lightbox-caption">
                <small>{galleryClusters.find((cluster) => cluster.id === galleryFrames[lightboxIndex].cluster)?.title}</small>
                <strong>{galleryFrames[lightboxIndex].title}</strong>
                <p>{galleryFrames[lightboxIndex].caption}</p>
              </div>
              <div className="kp-gallery-lightbox-controls">
                <button type="button" aria-label="Previous photograph" onClick={() => setLightboxIndex((lightboxIndex - 1 + galleryFrames.length) % galleryFrames.length)}><ChevronLeft aria-hidden="true" /></button>
                <button type="button" aria-label="Next photograph" onClick={() => setLightboxIndex((lightboxIndex + 1) % galleryFrames.length)}><ChevronRight aria-hidden="true" /></button>
              </div>
              <div className="kp-gallery-lightbox-rail" aria-label="Choose a photograph">
                {galleryFrames.map((frame, index) => (
                  <button key={frame.id} type="button" className={index === lightboxIndex ? "is-active" : ""} onClick={() => setLightboxIndex(index)} aria-label={`View ${frame.title}`}>
                    <Image src={frame.src} alt="" fill unoptimized sizes="80px" style={{ objectPosition: frame.focalPoint }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
