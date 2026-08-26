import type { Metadata } from "next";
import { PartnersOverview } from "@/components/marketing/partners/PartnersOverview";
import { partnersPage } from "@/content/partners";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Partners",
  description: partnersPage.body[0],
  path: "/partners",
  keywords: ["AI partners", "Dell", "Airrived", "technology partners"],
});

export default function PartnersPage() {
  return <PartnersOverview content={partnersPage} />;
}
