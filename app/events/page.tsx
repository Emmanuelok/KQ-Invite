import type { Metadata } from "next";
import { BRAND } from "../brand";
import { events, eventCollections, inspirationDirections } from "./event-catalog";
import EventWorld from "./event-world";

export const metadata: Metadata = {
  title: `The Event World | ${BRAND.name} Events`,
  description:
    `Explore ${events.length} décor-relevant occasions, ${eventCollections.length} curated collections and ${inspirationDirections.length} distinct design concepts with St. John's event intelligence.`,
  alternates: { canonical: "/events" },
  openGraph: {
    title: `The Event World | ${BRAND.name}`,
    description: `${events.length} décor-relevant occasions, ${eventCollections.length} visual collections and ${inspirationDirections.length} distinct design concepts.`,
    url: "/events",
  },
};

export default function EventsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `The ${BRAND.name} Event World`,
    description: `A searchable ${events.length}-occasion index connected to ${eventCollections.length} curated collections and ${inspirationDirections.length} original décor concepts with adjustable build sheets.`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: inspirationDirections.length,
      itemListElement: inspirationDirections.map((direction, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: direction.title,
        url: `${BRAND.siteUrl}/events/designs/${direction.id}`,
      })),
    },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <EventWorld />
  </>;
}
