import type { MetadataRoute } from "next";
import { BRAND } from "./brand";
import { inspirationDirections } from "./events/event-catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/events", "/studio", "/install", "/privacy", "/terms", ...inspirationDirections.map(({ id }) => `/events/designs/${id}`)].map((path) => ({
    url: `${BRAND.siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
