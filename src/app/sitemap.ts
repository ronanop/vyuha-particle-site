import type { MetadataRoute } from "next";
import { flattenSiteMap } from "@/lib/sitemap";
import { getSiteOrigin } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  const now = new Date();

  const pageEntries = flattenSiteMap().map((node) => {
    const depth =
      node.path === "/" ? 1 : node.path.split("/").filter(Boolean).length;
    return {
      url: new URL(node.path, origin).toString(),
      lastModified: now,
      changeFrequency:
        node.path === "/" || depth === 1 ? ("weekly" as const) : ("monthly" as const),
      priority:
        node.path === "/"
          ? 1
          : depth === 1
            ? 0.9
            : depth === 2
              ? 0.8
              : 0.6,
    };
  });

  const aiDiscovery = [
    {
      url: new URL("/llms.txt", origin).toString(),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: new URL("/llms-full.txt", origin).toString(),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
  ];

  return [...pageEntries, ...aiDiscovery];
}
