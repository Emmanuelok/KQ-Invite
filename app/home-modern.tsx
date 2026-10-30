"use client";

import Image from "next/image";

const collections = [
  { title: "Weddings & romance", text: "For the beginning of your forever.", image: "/event-world/02-orchard-vow-renewal.webp", id: "ceremony-romance", tag: "THE BIG YES", color: "rose" },
  { title: "Life’s lovely milestones", text: "Make a meaningful moment remarkable.", image: "/event-world/06-linen-welcome-day.webp", id: "family-milestones", tag: "YOUR PEOPLE. YOUR MOMENT.", color: "peach" },
  { title: "Business & academia", text: "Gather with purpose. Leave an impression.", image: "/event-world/11-future-forum.webp", id: "business-academia", tag: "BEYOND THE EVERYDAY", color: "blue" },
  { title: "Arts & after dark", text: "Set the scene for something electric.", image: "/event-world/19-brick-lane-music.webp", id: "arts-music-nightlife", tag: "A DIFFERENT KIND OF ENERGY", color: "lilac" },
  { title: "Culture & community", text: "Host-led gatherings, rich with meaning.", image: "/event-world/25-indigo-diaspora.webp", id: "culture-faith-diaspora", tag: "BEAUTIFULLY TOGETHER", color: "amber" },
  { title: "Outdoors & seasonal", text: "A sense of place. A spirit of occasion.", image: "/event-world/17-lakeside-regatta.webp", id: "atlantic-outdoor-seasonal", tag: "OPEN TO POSSIBILITY", color: "mint" },
];

export function ModernHero({ onConsult }: { onConsult: () => void }) {
  return <>
    <section className="modern-hero" id="top">
      <div className="modern-hero-copy">
        <p className="modern-kicker"><span /> EVENT DESIGN, WITH FEELING</p>
        <h1>Your occasion.<br /><em>Our obsession.</em></h1>
        <p className="modern-hero-description">Beautiful spaces. Thoughtful details. A celebration that feels unmistakably yours.</p>
        <p className="modern-hero-location">Event design, décor and production for St. John’s and the Avalon Peninsula.</p>
        <div className="modern-hero-actions"><a className="modern-button" href="/studio">Start planning your event <span aria-hidden="true">↗</span></a><button className="modern-text-link" onClick={onConsult}>Talk to our team <span aria-hidden="true">→</span></button></div>
        <div className="hero-assurance"><span>From first idea</span><i /><span>to the final detail</span></div>
      </div>
      <div className="modern-hero-art">
        <figure className="hero-main-photo"><Image unoptimized priority src="/decor-v2/hero-glasshouse-warm-v2-hd.webp" width={1536} height={1024} alt="Warm glasshouse event concept with floral installations and an elegantly set dining table" /><figcaption>WHERE ATMOSPHERE TAKES FORM.</figcaption></figure>
        <figure className="hero-detail-photo"><Image unoptimized src="/decor-v2/03-clay-rose-v2.webp" width={768} height={512} alt="Sculptural terracotta and blush ceremony design concept" /><figcaption>Considered. Down to the last detail.</figcaption></figure>
        <span className="hero-art-label">A LITTLE<br /><strong>extraordinary.</strong></span>
        <span className="hero-concept-note">Design concept imagery</span>
      </div>
    </section>
    <section className="value-ribbon" aria-label="Our approach"><span>Made around you</span><b aria-hidden="true">✦</b><span>Clear, itemized planning</span><b aria-hidden="true">✦</b><span>One beautifully connected experience</span><b aria-hidden="true">✦</b><span>Rooted in the Avalon</span></section>
    <section className="collection-discovery section-shell" aria-labelledby="collections-title">
      <div className="modern-section-heading"><div><p className="eyebrow">SO MANY REASONS TO GATHER</p><h2 id="collections-title">Find your kind<br /><em>of extraordinary.</em></h2></div><div><p>Intimate or ambitious. Joyful or quietly meaningful. Find a starting point for your occasion.</p><a href="/events" className="modern-text-link">Explore all 83 occasions <span aria-hidden="true">↗</span></a></div></div>
      <div className="collection-discovery-grid">{collections.map((item, index) => <a key={item.id} className={`discovery-card ${item.color}`} href={`/events#collection-${item.id}`}>
        <div className="discovery-image"><Image unoptimized src={item.image} alt={`${item.title} event design concept`} width={720} height={480} loading="lazy" /><span className="discovery-number">0{index + 1}</span><span className="discovery-arrow" aria-hidden="true">↗</span></div>
        <div className="discovery-copy"><span>{item.tag}</span><h3>{item.title}</h3><p>{item.text}</p></div>
      </a>)}</div>
    </section>
  </>;
}

export function PlanningInvitation() {
  return <section className="planning-invitation section-shell">
    <div><p className="eyebrow">LESS GUESSWORK. MORE POSSIBILITY.</p><h2>A beautiful idea.<br /><em>A practical plan.</em></h2><p>Bring your date, guest count and a little inspiration. Build a first brief, compare three décor scopes, and see what goes into your estimate.</p><div className="planning-invitation-actions"><a href="/studio" className="modern-button">Open the design studio <span aria-hidden="true">↗</span></a><a href="/my-event" className="modern-text-link">Return to my event →</a></div></div>
    <div className="planning-preview" aria-label="How your event plan comes together"><div className="planning-preview-top"><span className="preview-dots"><i /><i /><i /></span><span>YOUR EVENT, TAKING SHAPE</span></div><div className="preview-step"><b>01</b><div><strong>Make it personal</strong><p>Your people, priorities and setting.</p></div><span aria-hidden="true">✓</span></div><div className="preview-step"><b>02</b><div><strong>See the possibilities</strong><p>Explore Essential, Signature and Statement.</p></div><span aria-hidden="true">↗</span></div><div className="preview-step"><b>03</b><div><strong>Know the details</strong><p>Clear quantities, scope and planning estimates.</p></div><span aria-hidden="true">↗</span></div><div className="preview-note"><span aria-hidden="true">✦</span> Save your progress. Come back inspired.</div></div>
  </section>;
}
