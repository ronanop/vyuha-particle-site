import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { businessOperations } from "@/content/solutions/businessOperations";

export const metadata: Metadata = {
  title: "Business Operations & FinOps — Vyuha.ai",
  description: businessOperations.body[0],
};

export default function BusinessOperationsPage() {
  return <MarketingPageView content={businessOperations} />;
}
