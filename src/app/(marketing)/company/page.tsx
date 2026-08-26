import type { Metadata } from "next";
import { CompanyOverviewView } from "@/components/marketing/company/CompanyViews";
import { companyAbout } from "@/content/company/about";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Company",
  description: companyAbout.body[0],
  path: "/company",
  keywords: ["about Vyuha", "enterprise AI company", "India AI"],
});

export default function CompanyPage() {
  return <CompanyOverviewView content={companyAbout} />;
}
