import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";
import { insights } from "@/data/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/insights`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...insights.map((i) => ({
      url: `${siteConfig.url}/insights/${i.slug}`,
      lastModified: new Date(i.updated ?? i.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
