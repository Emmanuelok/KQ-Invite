import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRAND } from "../../../brand";
import { eventCollections, events, inspirationDirections } from "../../event-catalog";
import { profileForDirection } from "../../design-profiles";
import DesignDetail from "../design-detail";
import { normalizeGuestCount } from "../../reference-schedule";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return inspirationDirections.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const direction = inspirationDirections.find((item) => item.id === id);
  if (!direction) return { title: "Design not found | Kingsperl Events" };
  const profile = profileForDirection(direction);
  const description = `${profile.description} Explore the concept, materials and adjustable planning build sheet.`;
  return {
    title: `${direction.title} — Event Design Concept | ${BRAND.fullName}`,
    description,
    alternates: { canonical: `/events/designs/${direction.id}` },
    openGraph: {
      title: `${direction.title} | ${BRAND.fullName}`,
      description,
      url: `/events/designs/${direction.id}`,
      images: [{ url: direction.image, width: 1536, height: 1024, alt: `${direction.title} — inspirational concept render` }],
    },
    twitter: { card: "summary_large_image", title: `${direction.title} | ${BRAND.fullName}`, description, images: [direction.image] },
  };
}

export default async function DesignPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const direction = inspirationDirections.find((item) => item.id === id);
  if (!direction) notFound();
  const profile = profileForDirection(direction);
  const collection = eventCollections.find((item) => item.directionIds.includes(id))!;
  const query = await searchParams;
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const candidates = events.filter((event) => profile.occasionIds.includes(event.id));
  const compatibleEvents = candidates.length ? candidates : events;
  const initialEvent = compatibleEvents.find((event) => event.id === first(query.event))
    ?? compatibleEvents.find((event) => event.title === collection.defaultEventTitle)
    ?? compatibleEvents[0];
  const guestValue = Number(first(query.guests));
  const initialGuests = first(query.guests) !== undefined && Number.isFinite(guestValue) ? normalizeGuestCount(direction, guestValue) : profile.referenceGuests;
  const reserveValue = Number(first(query.reserve));
  const initialReserve = first(query.reserve) !== undefined && [0, 5, 10, 15].includes(reserveValue) ? reserveValue : 10;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${BRAND.siteUrl}/events/designs/${id}`,
    name: `${direction.title} — design concept`,
    description: profile.description,
    creator: { "@type": "Organization", name: BRAND.fullName, url: BRAND.siteUrl },
    image: {
      "@type": "ImageObject",
      contentUrl: `${BRAND.siteUrl}${direction.image}`,
      caption: `${direction.title}: inspirational concept render, not a completed client event`,
    },
    isPartOf: { "@type": "CollectionPage", name: collection.title, url: `${BRAND.siteUrl}/events#collection-${collection.id}` },
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <DesignDetail direction={direction} profile={profile} collection={collection} compatibleEvents={compatibleEvents} initialEventId={initialEvent.id} initialGuests={initialGuests} initialReserve={initialReserve} />
  </>;
}
