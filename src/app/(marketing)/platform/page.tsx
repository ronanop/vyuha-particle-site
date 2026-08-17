import type { Metadata } from "next";
import { PlatformOverviewView } from "@/components/marketing/platform/PlatformViews";
import { platformOverview } from "@/content/platform/overview";

export const metadata: Metadata = {
  title: "Platform — Vyuha.ai",
  description: platformOverview.subtitle,
};

export default function PlatformPage() {
  return <PlatformOverviewView content={platformOverview} />;
}
