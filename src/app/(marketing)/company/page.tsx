import type { Metadata } from "next";
import { CompanyOverviewView } from "@/components/marketing/company/CompanyViews";
import { companyAbout } from "@/content/company/about";

export const metadata: Metadata = {
  title: "Company | Vyuha.ai",
  description: companyAbout.body[0],
};

export default function CompanyPage() {
  return <CompanyOverviewView content={companyAbout} />;
}
