import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, BrandLockup } from "../brand";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Privacy | Kingsperl Events",
  description: "How Kingsperl Events handles consultation and Design Studio information.",
};

export default function PrivacyPage() {
  return <main className={styles.page}>
    <header className={styles.header}><Link className="brand" href="/" aria-label="Kingsperl Events home"><BrandLockup /></Link><div><Link href="/studio">Design Studio</Link><Link href="/terms">Terms</Link></div></header>
    <article className={styles.main}>
      <div className={styles.hero}><p>Trust centre · updated October 30, 2026</p><h1>Privacy</h1><span>A plain-language account of the information this platform currently collects, why it is used, and where its limits are.</span></div>
      <section className={styles.section}><span>01 · Information you provide</span><h2>Event details, not hidden profiling.</h2><p>Consultation and Design Studio submissions can include your name, email, phone, event date, occasion, guest count, budget, venue inputs, palette, accessibility priorities, cultural context and your written description.</p><p>When you choose venue photographs or a floor-plan file, the current Studio records only the filenames in the working project snapshot. It does not represent those files as uploaded because secure object storage is not yet connected.</p></section>
      <section className={styles.section}><span>02 · How it is used</span><h2>To plan, price and deliver the event you asked about.</h2><ul><li>Respond to an enquiry and preserve the brief you intentionally submitted.</li><li>Recompute a catalogue-based planning estimate and photo-specific build sheet.</li><li>Screen venue, inventory, accessibility, weather and compliance assumptions.</li><li>Record a design-direction acknowledgement and requested changes.</li><li>Protect the service from abuse, diagnose failures and maintain an audit trail.</li></ul></section>
      <section className={styles.section}><span>03 · Storage and access</span><h2>Operational records are separated from the public experience.</h2><p>This public website securely sends project submissions to Kingsperl Events’s existing Cloudflare D1 database. The separate operations workspace requires ChatGPT sign-in plus an active Kingsperl Events staff allowlist. We do not sell project information.</p><p>A saved project can create a private resume link. Its edit token remains in the URL fragment rather than the server request URL, but anyone who receives the full link can view that customer-safe project snapshot and submit change requests. Store it privately and do not post it publicly.</p><p>Third-party municipal and provincial guidance links open external websites governed by their own privacy practices.</p></section>
      <section className={styles.section}><span>04 · Payments and generated media</span><h2>No payment details are collected by this build.</h2><p>Planning proposals show an estimated deposit schedule, but a verified contract and secure payment provider must be activated before payment. The platform does not currently collect card or banking data.</p><p>Inspirational photographs are labelled as concept renders and are not used to infer a visitor’s identity, ethnicity, faith or protected characteristics.</p></section>
      <section className={styles.section}><span>05 · Choices and correction</span><h2>You can ask for a copy, correction or deletion.</h2><p>Use the consultation form and include “Privacy request” plus your project reference. Kingsperl Events will verify the requester before disclosing, changing or removing a record. Some records may need to be retained where required for contracts, accounting, safety or dispute handling.</p></section>
      <div className={styles.note}>This page describes the current platform implementation. It is not a substitute for professional privacy or legal advice, and it should be reviewed before public launch in any additional jurisdiction.</div>
    </article>
    <footer className={styles.footer}><span>© 2026 {BRAND.name} Events</span><div><Link href="/">Home</Link><Link href="/terms">Terms</Link></div></footer>
  </main>;
}
