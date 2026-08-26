import type { Metadata } from "next";
import { PlatformProductView } from "@/components/marketing/platform/PlatformViews";
import { platformIntegrations } from "@/content/platform/integrations";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Integrations",
  description: platformIntegrations.headline,
  path: "/platform/integrations",
  keywords: [
    "enterprise integrations",
    "SIEM",
    "IAM",
    "ServiceNow",
    "200+ connectors",
  ],
});

export default function IntegrationsPage() {
  return <PlatformProductView content={platformIntegrations} />;
}
