import type { Metadata } from "next";
import { PlatformProductView } from "@/components/marketing/platform/PlatformViews";
import { platformIntegrations } from "@/content/platform/integrations";

export const metadata: Metadata = {
  title: "Integrations — Vyuha.ai",
  description: platformIntegrations.headline,
};

export default function IntegrationsPage() {
  return <PlatformProductView content={platformIntegrations} />;
}
