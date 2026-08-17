import type { Metadata } from "next";
import { SolutionsFunctionView } from "@/components/marketing/solutions/SolutionsViews";
import { securityCompliance } from "@/content/solutions/securityCompliance";

export const metadata: Metadata = {
  title: "Security & Compliance — Vyuha.ai",
  description: securityCompliance.headline,
};

export default function SecurityCompliancePage() {
  return <SolutionsFunctionView content={securityCompliance} />;
}
