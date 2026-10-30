import type { Metadata } from "next";
import StudioExperience, { type StudioPrefill } from "./studio-experience";

export const metadata: Metadata = {
  title: "Design Studio | Kingsperl Events",
  description: "Build a venue-aware Kingsperl Events event concept, compare scopes, inspect exact inventory, price the proposal and complete the St. John’s readiness review.",
  alternates: { canonical: "/studio" },
  openGraph: {
    title: "Kingsperl Events Design Studio",
    description: "From atmosphere to executable event plan—venue, inventory, quote and readiness in one workspace.",
    url: "/studio",
    images: [{ url: "/og/kingsperl-events.jpg", width: 1200, height: 630, alt: "Kingsperl Events" }],
  },
};

type StudioSearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function StudioPage({ searchParams }: { searchParams: Promise<StudioSearchParams> }) {
  const params = await searchParams;
  const lookValue = params.look;
  const prefill: StudioPrefill = {
    event: first(params.event)?.slice(0, 160),
    style: first(params.style)?.slice(0, 160),
    looks: (Array.isArray(lookValue) ? lookValue : lookValue ? [lookValue] : []).slice(0, 12).map((value) => value.slice(0, 160)),
    venue: first(params.venue)?.slice(0, 240),
    guests: Number(first(params.guests)),
    budget: Number(first(params.budget)),
  };
  return <StudioExperience prefill={prefill} />;
}
