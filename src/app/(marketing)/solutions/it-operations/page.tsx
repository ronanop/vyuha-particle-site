import type { Metadata } from "next";
import { SolutionsFunctionView } from "@/components/marketing/solutions/SolutionsViews";
import { itOperations } from "@/content/solutions/itOperations";

export const metadata: Metadata = {
  title: "IT Operations — Vyuha.ai",
  description: itOperations.headline,
};

export default function ItOperationsPage() {
  return <SolutionsFunctionView content={itOperations} />;
}
