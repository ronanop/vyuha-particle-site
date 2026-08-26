import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { securityCompliance } from "@/content/solutions/securityCompliance";

export const metadata: Metadata = {
  title: "Security & Compliance — Vyuha.ai",
  description: securityCompliance.body[0],
};

export default function SecurityCompliancePage() {
  return <MarketingPageView content={securityCompliance} />;
}
