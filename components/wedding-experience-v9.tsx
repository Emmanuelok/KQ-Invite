import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";

function WeddingMark() {
  return (
    <span className="kp-mark" aria-hidden="true">
      <span className="kp-mark-pearl" />
      <span className="kp-mark-letters"><i>K</i><b>&amp;</b><i>P</i></span>
    </span>
  );
}

export function WeddingExperienceV9() {
  return (
    <main className="kp9-site">
      <a className="kp9-skip" href="#thank-you">Skip to our thank-you message</a>
      <header className="kp9-header kp9-thank-you-header">
        <a href="#top" className="kp9-brand" aria-label="Kingsford and Perla home">
          <WeddingMark />
          <span><strong>Kingsford &amp; Perla</strong></span>
        </a>
      </header>

      <section id="top" className="kp9-hero kp9-thank-you" aria-labelledby="kp9-hero-title">
        <div className="kp9-hero-photo">
          <picture className="kp9-hero-picture">
            <Image
              src="/kp-wedding-garden.jpg"
              alt="Kingsford and Perla on their wedding day, standing together among sunlit greenery."
              fill
              priority
              unoptimized
              sizes="(max-width: 780px) 100vw, 46vw"
            />
          </picture>
        </div>
        <div id="thank-you" className="kp9-hero-copy">
          <p>To our family &amp; friends</p>
          <h1 id="kp9-hero-title"><span>With Grateful</span><em>Hearts.</em></h1>
          <div className="kp9-thank-you-message">
            <p>Thank you for making our wedding so special. Whether you celebrated with us in person or supported us from afar, your presence, prayers, love and kind wishes mean more than words can express.</p>
            <p>As we begin married life, we thank God for each of you and will always cherish the love you have shown us.</p>
          </div>
          <p className="kp9-thank-you-signature"><span>With love and gratitude,</span><strong>Kingsford &amp; Perla</strong></p>
          <div className="kp9-hero-buttons">
            <Link href="/gallery"><Images aria-hidden="true" /> Explore our gallery <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
        <footer className="kp9-thank-you-credit">
          Designed and developed by <a href="https://avaloncreative.group" target="_blank" rel="noopener noreferrer">Avalon Creative Group</a>
        </footer>
      </section>

    </main>
  );
}
