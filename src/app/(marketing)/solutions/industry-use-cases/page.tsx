import type { Metadata } from "next";
import { SolutionsIndustryView } from "@/components/marketing/solutions/SolutionsViews";
import { industryUseCases } from "@/content/solutions/industryUseCases";

export const metadata: Metadata = {
  title: "Industry-Wise Use Cases — Vyuha.ai",
  description: industryUseCases.headline,
};

export default function IndustryUseCasesPage() {
  return <SolutionsIndustryView content={industryUseCases} />;
}
