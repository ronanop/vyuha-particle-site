import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { businessOperations } from "@/content/solutions/businessOperations";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Business Operations & FinOps",
  description: businessOperations.body[0],
  path: "/solutions/business-operations",
  keywords: [
    "FinOps AI",
    "business operations automation",
    "governed approvals",
    "operational reconciliation",
  ],
});

export default function BusinessOperationsPage() {
  return <MarketingPageView content={businessOperations} />;
}
