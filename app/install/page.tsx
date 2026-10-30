import { UIIcon } from "../ui-icon";
import type { Metadata } from "next";
import Link from "next/link";
import { BrandLockup } from "../brand";
import { InstallPanel } from "../pwa-support";

export const metadata: Metadata = {
  title: "Get the app | Kingsperl Events",
  description: "Install Kingsperl Events for quick access to event inspiration and your Design Studio.",
  alternates: { canonical: "/install" },
};

export default function InstallPage() {
  return <main className="app-page">
    <header className="app-page-header"><Link href="/" className="brand" aria-label="Kingsperl Events home"><BrandLockup /></Link><Link href="/events">Explore event ideas <UIIcon name="arrow-right" /></Link></header>
    <InstallPanel />
    <section className="app-benefits"><article><span>01</span><h2>Find your atmosphere.</h2><p>Explore the Event World and keep your favourite visual directions close.</p></article><article><span>02</span><h2>Build your brief.</h2><p>Move from inspiration to venue planning, quantities and an initial estimate.</p></article><article><span>03</span><h2>Return with ease.</h2><p>Use your private project link to securely resume your saved plan online.</p></article></section>
    <footer className="app-page-footer"><span>© 2026 Kingsperl Events</span><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></footer>
  </main>;
}
