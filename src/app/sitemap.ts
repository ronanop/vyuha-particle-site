import type { MetadataRoute } from "next";
import { flattenSiteMap } from "@/lib/sitemap";

function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit).origin;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  return flattenSiteMap().map((node) => ({
    url: new URL(node.path, origin).toString(),
    changeFrequency: node.path === "/" ? "weekly" : "monthly",
    priority: node.path === "/" ? 1 : node.path.split("/").length <= 2 ? 0.8 : 0.6,
  }));
}
