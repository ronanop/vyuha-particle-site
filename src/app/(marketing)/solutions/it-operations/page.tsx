import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { itOperations } from "@/content/solutions/itOperations";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "IT Operations",
  description: itOperations.body[0],
  path: "/solutions/it-operations",
  keywords: [
    "autonomous IT operations",
    "AIOps",
    "incident resolution",
    "CMDB automation",
  ],
});

export default function ItOperationsPage() {
  return <MarketingPageView content={itOperations} />;
}
