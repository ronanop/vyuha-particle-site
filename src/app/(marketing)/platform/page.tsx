import type { Metadata } from "next";
import { PlatformOverviewView } from "@/components/marketing/platform/PlatformViews";
import { platformOverview } from "@/content/platform/overview";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Platform",
  description: platformOverview.subtitle || platformOverview.body[0],
  path: "/platform",
  keywords: [
    "enterprise agentic platform",
    "Vyuha.ONE",
    "Vyuha In a BOX",
    "enterprise integrations",
  ],
});

export default function PlatformPage() {
  return <PlatformOverviewView content={platformOverview} />;
}
