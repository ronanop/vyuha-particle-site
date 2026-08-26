import type { Metadata } from "next";
import { PlatformOverviewView } from "@/components/marketing/platform/PlatformViews";
import { platformOverview } from "@/content/platform/overview";

export const metadata: Metadata = {
  title: "Platform | Vyuha.ai",
  description:
    "Vyuha is the enterprise agentic platform: one command plane for Cybersecurity, IT, FinOps, and Business Operations leaders to orchestrate multi-agent workflows with total perimeter control.",
};

export default function PlatformPage() {
  return <PlatformOverviewView content={platformOverview} />;
}
