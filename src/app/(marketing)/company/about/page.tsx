import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { companyAbout } from "@/content/company/about";

export const metadata: Metadata = {
  title: "About Us — Vyuha.ai",
  description: companyAbout.body[0],
};

export default function AboutPage() {
  return <MarketingPageView content={companyAbout} />;
}
