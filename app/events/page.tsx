import type { Metadata } from "next";
import { BRAND } from "../brand";
import { events } from "./event-catalog";
import EventWorld from "./event-world";

export const metadata: Metadata = {
  title: `The Event World | ${BRAND.name} Events`,
  description:
    `Explore ${events.length} décor-relevant occasions, six curated visual collections and 42 non-repeating décor photographs with St. John's event intelligence.`,
  alternates: { canonical: "/events" },
  openGraph: {
    title: `The Event World | ${BRAND.name}`,
    description: `${events.length} décor-relevant occasions, six visual collections and 42 non-repeating photographs.`,
    url: "/events",
  },
};

export default function EventsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `The ${BRAND.name} Event World`,
    description: `A searchable ${events.length}-occasion index connected to six curated collections and 42 original, non-repeating décor scenes.`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: events.length,
      itemListElement: events.map((event, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: event.title,
      })),
    },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <EventWorld />
  </>;
}
