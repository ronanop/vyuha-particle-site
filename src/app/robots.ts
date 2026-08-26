import type { MetadataRoute } from "next";
import { AI_CRAWLER_USER_AGENTS } from "@/lib/ai-discovery";
import { getSiteOrigin } from "@/lib/seo";

const PRIVATE_PATHS = ["/resources", "/resources/"];

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // Explicit allow for major AI search + answer + training crawlers
      ...AI_CRAWLER_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/" as const,
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
