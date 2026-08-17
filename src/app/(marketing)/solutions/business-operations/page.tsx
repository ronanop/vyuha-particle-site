import type { Metadata } from "next";
import { SolutionsFunctionView } from "@/components/marketing/solutions/SolutionsViews";
import { businessOperations } from "@/content/solutions/businessOperations";

export const metadata: Metadata = {
  title: "Business Operations & FinOps — Vyuha.ai",
  description: businessOperations.headline,
};

export default function BusinessOperationsPage() {
  return <SolutionsFunctionView content={businessOperations} />;
}
