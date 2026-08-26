import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { industryUseCases } from "@/content/solutions/industryUseCases";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Industry-Wise Use Cases",
  description: industryUseCases.body[0],
  path: "/solutions/industry-use-cases",
  keywords: [
    "banking AI India",
    "telecom AI",
    "retail fraud AI",
    "insurance AI",
  ],
});

export default function IndustryUseCasesPage() {
  return <MarketingPageView content={industryUseCases} />;
}
