import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, BrandLockup } from "../brand";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Planning Terms | Kingsperl Events",
  description: "Planning, estimate, image and feasibility terms for the Kingsperl Events platform.",
};

export default function TermsPage() {
  return <main className={styles.page}>
    <header className={styles.header}><Link className="brand" href="/" aria-label="Kingsperl Events home"><BrandLockup /></Link><div><Link href="/studio">Design Studio</Link><Link href="/privacy">Privacy</Link></div></header>
    <article className={styles.main}>
      <div className={styles.hero}><p>Planning framework · updated August 14, 2026</p><h1>Planning terms</h1><span>What a concept, build sheet, proposal estimate and direction acknowledgement do—and do not—mean.</span></div>
      <section className={styles.section}><span>01 · Concept status</span><h2>Inspiration is not a claim of completed client work.</h2><p>Gallery imagery and Design Studio photographs are inspirational concept renders. They communicate atmosphere and possible design language; they do not promise an identical result, a specific venue, a past Kingsperl Events installation or exact seasonal floral availability.</p></section>
      <section className={styles.section}><span>02 · Estimates and inventory</span><h2>A planning estimate is not a reservation.</h2><p>Quantities and prices are recalculated from the selected scope, guest count and venue inputs. They remain estimates until Kingsperl Events verifies measurements, access, labour, logistics, supplier pricing, taxes, production timing and date-window inventory availability.</p><p>No item, crew member, vehicle, supplier or event date is reserved until an authorized hold or agreement confirms it.</p></section>
      <section className={styles.section}><span>03 · Approval and changes</span><h2>Direction acknowledgement begins feasibility review.</h2><p>Approving a design direction asks Kingsperl Events to verify and formalize that direction. It is not an electronic service contract, does not collect payment and does not override the final agreement.</p><p>Only a documented, approved change order changes contracted scope, price, tax, schedule or inventory. Messages and informal conversations do not change the agreement.</p></section>
      <section className={styles.section}><span>04 · Venue, safety and authorities</span><h2>Buildability controls the final design.</h2><p>Venue approval, capacity, egress, accessibility, weather, structural engineering, temporary power, fire restrictions, insurance, permits, traffic, food service, noise and restoration requirements can alter or prevent a concept. The relevant venue, authority and qualified professional decisions control.</p></section>
      <section className={styles.section}><span>05 · Cultural context and client materials</span><h2>Context is host-led, never inferred.</h2><p>Clients are responsible for describing cultural, regional, faith, family and ceremonial requirements they want considered and for identifying protected or prohibited elements. Kingsperl Events may require a qualified advisor or decline cues that cannot be responsibly verified.</p><p>Only provide photographs, plans, logos or other material you are authorized to share for project planning.</p></section>
      <section className={styles.section}><span>06 · Contract and payment</span><h2>The signed agreement is the commercial authority.</h2><p>Final services, cancellation terms, payment milestones, damage responsibility, substitutions, force majeure, intellectual-property use and liability are set in the project-specific agreement. The platform’s sample operations and finance views are demonstrations, not client obligations.</p></section>
      <div className={styles.note}>These planning terms are a transparent product handoff, not finalized legal terms of service. Canadian and Newfoundland & Labrador counsel should review the public contract, privacy notice and payment flow before broad commercial launch.</div>
    </article>
    <footer className={styles.footer}><span>© 2026 {BRAND.name} Events</span><div><Link href="/">Home</Link><Link href="/privacy">Privacy</Link></div></footer>
  </main>;
}
