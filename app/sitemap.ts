import type { MetadataRoute } from "next";
import { BRAND } from "./brand";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/events", "/studio", "/install", "/privacy", "/terms"].map((path) => ({
    url: `${BRAND.siteUrl}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
