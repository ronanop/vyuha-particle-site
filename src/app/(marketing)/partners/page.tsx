import type { Metadata } from "next";
import { PartnersOverview } from "@/components/marketing/partners/PartnersOverview";
import { partnersPage } from "@/content/partners";

export const metadata: Metadata = {
  title: "Partners — Vyuha.ai",
  description: partnersPage.body[0],
};

export default function PartnersPage() {
  return <PartnersOverview content={partnersPage} />;
}
