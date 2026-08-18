import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { companyTeam } from "@/content/company/team";

export const metadata: Metadata = {
  title: "Team — Vyuha.ai",
  description: companyTeam.body[0],
};

export default function TeamPage() {
  return <MarketingPageView content={companyTeam} />;
}
