import type { Metadata } from "next";
import { SolutionsOverviewView } from "@/components/marketing/solutions/SolutionsViews";
import { solutionsOverview } from "@/content/solutions/overview";

export const metadata: Metadata = {
  title: "Solutions — Vyuha.ai",
  description: solutionsOverview.body[0],
};

export default function SolutionsPage() {
  return <SolutionsOverviewView content={solutionsOverview} />;
}
