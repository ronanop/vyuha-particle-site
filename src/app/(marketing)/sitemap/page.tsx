import type { Metadata } from "next";
import { SitemapView } from "@/components/marketing/SitemapView";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sitemap",
  description: "Index of every public page on Vyuha.ai.",
  path: "/sitemap",
});

export default function SitemapPage() {
  return <SitemapView />;
}
