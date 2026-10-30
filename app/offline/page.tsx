import { UIIcon } from "../ui-icon";
import Link from "next/link";
import { BrandLockup } from "../brand";

export const metadata = { title: "Offline | Kingsperl Events", robots: { index: false, follow: false } };

export default function OfflinePage() {
  return <main className="offline-page"><Link className="brand" href="/" aria-label="Kingsperl Events home"><BrandLockup /></Link><p className="eyebrow">A MOMENT BETWEEN CONNECTIONS</p><h1>Your next event<br />can wait a moment.</h1><p>You’re offline. Reconnect to open your saved project, send an enquiry, or explore more inspiration.</p><a className="solid-button" href="/">Try again <span aria-hidden="true"><UIIcon name="arrow-right" /></span></a><small>Private projects and form submissions are never stored in the offline cache.</small></main>;
}
