"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import SiteHeader from "../../site-header";
import { BRAND, BrandLockup } from "../../brand";
import { currency, inspirationDirections, type EventCollection, type EventType, type InspirationDirection } from "../event-catalog";
import type { DesignProfile } from "../design-profiles";
import { referenceSchedule, scheduleCsv, normalizeGuestCount } from "../reference-schedule";
import styles from "./design-detail.module.css";

type Props = {
  direction: InspirationDirection;
  profile: DesignProfile;
  collection: EventCollection;
  compatibleEvents: EventType[];
  initialEventId: string;
  initialGuests: number;
  initialReserve: number;
};

export default function DesignDetail({ direction, profile, collection, compatibleEvents, initialEventId, initialGuests, initialReserve }: Props) {
  const [eventId, setEventId] = useState(initialEventId);
  const [guests, setGuests] = useState(initialGuests);
  const [guestInput, setGuestInput] = useState(String(initialGuests));
  const [reserve, setReserve] = useState(initialReserve);
  const [copyMessage, setCopyMessage] = useState("");
  const event = compatibleEvents.find((item) => item.id === eventId) ?? compatibleEvents[0];
  const schedule = useMemo(() => referenceSchedule(event, direction, guests, reserve), [event, direction, guests, reserve]);
  const related = inspirationDirections.filter((item) => item.id !== direction.id && collection.directionIds.includes(item.id)).slice(0, 3);
  const params = new URLSearchParams({ event: event.title, style: direction.title, guests: String(guests), venue: direction.venue, design: direction.id, reserve: String(reserve) });
  if (direction.startingAt !== null) params.set("budget", String(direction.startingAt));
  const studioHref = `/studio?${params.toString()}`;

  const updateAddress = (nextEvent: string, nextGuests: number, nextReserve: number) => {
    const query = new URLSearchParams({ event: nextEvent, guests: String(nextGuests), reserve: String(nextReserve) });
    window.history.replaceState(null, "", `${window.location.pathname}?${query}`);
    setCopyMessage("");
  };
  const commitGuests = () => {
    const value = Number(guestInput);
    const safe = Number.isFinite(value) && guestInput.trim() ? normalizeGuestCount(direction, value) : guests;
    setGuests(safe);
    setGuestInput(String(safe));
    updateAddress(eventId, safe, reserve);
  };
  const download = () => {
    const blob = new Blob([scheduleCsv(event, direction, guests, reserve)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `kingsperl-${direction.id}-${guests}-${profile.capacityBasis === "concurrent" ? "users" : "guests"}.csv`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const copyLink = async () => {
    updateAddress(eventId, guests, reserve);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyMessage("Design link copied.");
    } catch {
      setCopyMessage("Your browser could not copy the link. Copy this page’s address to share this plan.");
    }
  };

  return <main className={styles.page}>
    <div className={styles.noPrint}><SiteHeader /></div>
    <div className={styles.shell}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><a href="/events">Design catalogue</a><span aria-hidden="true">/</span><a href={`/events#collection-${collection.id}`}>{collection.title}</a><span aria-hidden="true">/</span><span aria-current="page">{direction.title}</span></nav>
      <section className={styles.hero} id="main-content" tabIndex={-1}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{collection.title}</p>
          <h1>{direction.title}</h1>
          <p className={styles.description}>{profile.description}</p>
          <div className={styles.tags}><span>{profile.setting}</span><span>{profile.settingLabel}</span></div>
          <div className={styles.palette} aria-label="Concept palette">{direction.palette.map((color) => <span key={color} style={{ backgroundColor: color }} title={color} />)}<p>{direction.mood}</p></div>
          <div className={styles.investment}><span>{direction.startingAt === null ? "Your venue, your scope" : "Indicative décor investment"}</span><strong>{direction.startingAt === null ? "Quoted after venue review" : `From ${currency(direction.startingAt)}`}</strong><p>{direction.startingAt === null ? "We’ll shape the design around the space, guest needs and the pieces you choose." : "Existing catalogue guide in CAD. A confirmed proposal follows venue review; this is not an inventory purchase price."}</p></div>
          <div className={styles.actions}><a className={styles.primary} href="#build-sheet">Explore the build sheet <span aria-hidden="true">↗</span></a><button className={styles.secondary} onClick={copyLink}>Copy design link</button></div>
          <p className={styles.copyStatus} role="status">{copyMessage}</p>
        </div>
        <figure className={styles.heroImage}><Image unoptimized src={direction.image} alt={`${direction.title} — inspirational event design concept`} width={1536} height={1024} priority sizes="(max-width: 900px) 100vw, 60vw" /><figcaption>Concept render · inspiration for your event</figcaption></figure>
      </section>

      <section className={styles.designStory} aria-labelledby="design-story">
        <div><p className={styles.eyebrow}>The details that make it</p><h2 id="design-story">A considered atmosphere.</h2><ul className={styles.featureList}>{profile.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
        <div className={styles.materialCard}><span className={styles.eyebrow}>Material direction</span><div className={styles.materials}>{profile.materials.map((material) => <span key={material}>{material}</span>)}</div><p>{profile.planningFocus}</p></div>
      </section>

      <section className={styles.planGrid} aria-label="Venue and guest planning">
        <article><span>01 / Space</span><h3>Room to gather</h3><p>{profile.layoutNote}</p>{profile.capacityNote && <p className={styles.capacity}>{profile.capacityNote}</p>}</article>
        <article><span>02 / Conditions</span><h3>Plan for the day</h3><p>{profile.weatherPlan}</p>{direction.id === "rain-garden" && <a href="/events/designs/orchard-vow">Explore the garden counterpart ↗</a>}{direction.id === "orchard-vow" && <a href="/events/designs/rain-garden">See the indoor Rain Garden alternative ↗</a>}</article>
      </section>

      <section className={styles.buildSection} id="build-sheet" aria-labelledby="build-title">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>From concept to a working list</p><h2 id="build-title">Your planning build sheet.</h2></div><p>Adjust the occasion, attendance and spare stock allowance. Quantities describe a planning setup; they do not confirm stock or a booking.</p></div>
        <div className={styles.controls}>
          <label>Occasion<select value={eventId} onChange={(e) => { setEventId(e.target.value); updateAddress(e.target.value, guests, reserve); }}>{compatibleEvents.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
          <label>{profile.capacityBasis === "concurrent" ? "Concurrent lounge users" : "Reference guests"}<input type="number" min={profile.minGuests} max={profile.maxGuests} step="1" inputMode="numeric" value={guestInput} onChange={(e) => { setGuestInput(e.target.value); const value = Number(e.target.value); if (e.target.value && Number.isFinite(value) && value >= profile.minGuests && value <= profile.maxGuests) { const next = Math.round(value); setGuests(next); updateAddress(eventId, next, reserve); } }} onBlur={commitGuests} onKeyDown={(e) => { if (e.key === "Enter") commitGuests(); }} /></label>
          <label>Spare allowance<select value={reserve} onChange={(e) => { const value = Number(e.target.value); setReserve(value); updateAddress(eventId, guests, value); }}>{[0, 5, 10, 15].map((value) => <option value={value} key={value}>{value}% reserve</option>)}</select></label>
        </div>
        <p className={styles.scheduleStatus} role="status">{event.title} · {guests} {profile.capacityBasis === "concurrent" ? "concurrent lounge users" : "reference guests"} · {reserve}% allowance on eligible items. Specialist structures and labour are scoped separately. {profile.capacityNote}</p>
        <div className={styles.exportActions}><button onClick={download}>Download build sheet (CSV) <span aria-hidden="true">↓</span></button><button onClick={() => window.print()}>Print / save as PDF <span aria-hidden="true">↗</span></button></div>
        <div className={styles.tableWrap}><table><caption className="sr-only">{direction.title} planning items for {event.title}, {guests} {profile.capacityBasis === "concurrent" ? "concurrent lounge users" : "reference guests"}</caption><thead><tr><th scope="col">Zone / item</th><th scope="col">Base</th><th scope="col">Spare</th><th scope="col">Total</th><th scope="col">Measurement &amp; planning note</th></tr></thead><tbody>{schedule.map((item, index) => <tr key={`${item.zone}-${item.item}-${index}`}><th scope="row"><small>{item.zone}</small><strong>{item.item}</strong></th><td data-label="Base">{item.quantity}</td><td data-label="Spare">{item.spare}</td><td data-label="Total" className={styles.total}>{item.totalQuantity}</td><td className={styles.specification}><span>{item.measurement}</span><p>{item.note}</p></td></tr>)}</tbody></table></div>
        <aside className={styles.planningNote}><strong>A practical starting point</strong><p>Confirm measurements, access and final quantities against your venue plan. Large tents, glass shelters, rigging and ceiling installations need qualified review and installation. Materials may be rented, sourced or fabricated; pictured items are not a promise of owned stock.</p></aside>
        <div className={styles.nextStep}><div><p className={styles.eyebrow}>Make room for your own ideas</p><h3>Make this direction yours.</h3><p>Take this occasion, design and guest count into your event brief.</p></div><a className={styles.primary} href={studioHref}>Adapt in the design studio <span aria-hidden="true">↗</span></a></div>
      </section>

      <section className={`${styles.related} ${styles.noPrint}`} aria-labelledby="related-title"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Keep exploring</p><h2 id="related-title">A different kind of beautiful.</h2></div><a href={`/events#collection-${collection.id}`}>View the collection ↗</a></div><div className={styles.relatedGrid}>{related.map((item) => <a href={`/events/designs/${item.id}`} key={item.id}><Image unoptimized src={item.image} alt={`${item.title} concept render`} width={768} height={512} loading="lazy" /><div><small>Concept render</small><h3>{item.title}</h3><p>{item.venue}</p></div></a>)}</div></section>
      <footer className={styles.footer}><a className="brand" href="/"><BrandLockup /></a><p>{BRAND.fullName} · Design concepts, shaped around your occasion.</p><a className={styles.noPrint} href="/events">Back to all designs ↗</a></footer>
    </div>
  </main>;
}
