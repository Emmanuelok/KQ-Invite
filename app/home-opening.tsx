import Image from "next/image";
import SiteHeader from "./site-header";

type Props = {
  onConsult: () => void;
  onBoard: () => void;
  boardCount: number;
  onCategory: (category: string) => void;
};

export default function HomeOpening({ onConsult, onBoard, boardCount, onCategory }: Props) {
  return <>
    <SiteHeader onConsult={onConsult} onBoard={onBoard} boardCount={boardCount} />
    <section className="new-hero" id="main-content" tabIndex={-1}>
      <div className="new-hero-copy">
        <p className="new-kicker"><span /> Event design with a little more feeling</p>
        <h1>Life’s big<br />moments.<br /><span>Reimagined.</span></h1>
        <p className="new-hero-description">Extraordinary spaces for your kind of celebration. From the first spark to the final detail, we make it beautifully yours.</p>
        <div className="new-hero-actions"><button className="new-button lime" onClick={onConsult}>Let’s make a moment <span aria-hidden="true">↗</span></button><a className="new-hero-link" href="#inspiration">Find your inspiration <span aria-hidden="true">↓</span></a></div>
        <div className="new-hero-location"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg><span>Rooted in St. John’s.<br /><strong>Made for wherever you gather.</strong></span></div>
      </div>
      <div className="new-hero-visual">
        <div className="new-hero-image"><Image src="/editorial/coral-gathering.webp" alt="An imaginative coral and lilac event setting with sculptural flowers and beautifully set tables — design concept" width={1536} height={1024} priority unoptimized sizes="(max-width: 800px) 100vw, 55vw" /><span className="image-disclosure">Design concept</span></div>
        <a className="new-image-caption" href="/events"><span><small>IMAGINE THE POSSIBILITIES</small><strong>Anything but ordinary.</strong></span><i aria-hidden="true">↗</i></a>
        <span className="new-image-index" aria-hidden="true">a new point of view / 01</span>
      </div>
    </section>
    <section className="new-occasions" aria-label="Explore your occasion">
      <p>Whatever brings<br /><strong>you together.</strong></p>
      <button onClick={() => onCategory("Weddings")}><span>01</span> Weddings <i aria-hidden="true">↗</i></button>
      <button onClick={() => onCategory("Celebrations")}><span>02</span> Celebrations <i aria-hidden="true">↗</i></button>
      <button onClick={() => onCategory("Corporate")}><span>03</span> Brand & corporate <i aria-hidden="true">↗</i></button>
      <a href="/events"><span>04</span> Every occasion <i aria-hidden="true">↗</i></a>
    </section>
    <section className="new-introduction section-shell">
      <div><p className="eyebrow">A good gathering changes everything</p><h2>More than a beautiful room.<br /><span>A feeling that stays.</span></h2></div>
      <div><p>We bring imagination, thoughtful details and practical know-how to the same table. Your story shapes the space. We take care of how it all comes together.</p><a className="new-text-link" href="#services">Meet your creative team’s toolkit <span aria-hidden="true">↗</span></a></div>
    </section>
  </>;
}
