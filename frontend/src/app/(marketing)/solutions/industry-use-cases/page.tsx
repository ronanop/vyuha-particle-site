import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { industryUseCases } from "@/content/solutions/industryUseCases";

export const metadata: Metadata = {
  title: "Industry-Wise Use Cases — Vyuha.ai",
  description: industryUseCases.body[0],
};

export default function IndustryUseCasesPage() {
  return <MarketingPageView content={industryUseCases} />;
}
