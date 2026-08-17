import type { Metadata } from "next";
import { PlatformOverviewView } from "@/components/marketing/platform/PlatformViews";
import { platformOverview } from "@/content/platform/overview";

export const metadata: Metadata = {
  title: "Platform — Vyuha.ai",
  description:
    "Sovereign agentic platform for Indian enterprise. Orchestrate agents with Vyuha Command, deploy at the edge with In a BOX, and bind the stack you already run — without a byte leaving the perimeter.",
};

export default function PlatformPage() {
  return <PlatformOverviewView content={platformOverview} />;
}
