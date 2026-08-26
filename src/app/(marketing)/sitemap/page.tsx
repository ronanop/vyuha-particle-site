import type { Metadata } from "next";
import { SitemapView } from "@/components/marketing/SitemapView";

export const metadata: Metadata = {
  title: "Sitemap | Vyuha.ai",
  description: "Index of every public page on Vyuha.ai.",
};

export default function SitemapPage() {
  return <SitemapView />;
}
