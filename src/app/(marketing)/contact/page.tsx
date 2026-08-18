import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { contactPage } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact — Vyuha.ai",
  description: contactPage.body[0],
};

export default function ContactPage() {
  return <MarketingPageView content={contactPage} />;
}
