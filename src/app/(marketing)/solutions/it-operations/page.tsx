import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { itOperations } from "@/content/solutions/itOperations";

export const metadata: Metadata = {
  title: "IT Operations — Vyuha.ai",
  description: itOperations.body[0],
};

export default function ItOperationsPage() {
  return <MarketingPageView content={itOperations} />;
}
