import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { solutionsOverview } from "@/content/solutions/overview";

export const metadata: Metadata = {
  title: "Solutions Overview — Vyuha.ai",
  description: solutionsOverview.body[0],
};

export default function SolutionsPage() {
  return <MarketingPageView content={solutionsOverview} />;
}
