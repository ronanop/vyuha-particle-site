import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { securityCompliance } from "@/content/solutions/securityCompliance";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Security & Compliance",
  description: securityCompliance.headline || securityCompliance.body[0],
  path: "/solutions/security-compliance",
  keywords: [
    "AI SOC",
    "DPDP Act compliance",
    "identity governance",
    "sovereign cybersecurity",
  ],
});

export default function SecurityCompliancePage() {
  return <MarketingPageView content={securityCompliance} />;
}
