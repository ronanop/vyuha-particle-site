import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { resourcesBlog } from "@/content/resources/blog";

export const metadata: Metadata = {
  title: "Blog / Insights — Vyuha.ai",
  description: resourcesBlog.body[0],
};

export default function BlogPage() {
  return <MarketingPageView content={resourcesBlog} />;
}
