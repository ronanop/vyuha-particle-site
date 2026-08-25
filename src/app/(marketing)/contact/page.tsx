import type { Metadata } from "next";
import { ContactOverviewView } from "@/components/marketing/contact/ContactOverview";
import { contactPage } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact — Vyuha.ai",
  description: "Contact Vyuha.ai by email, phone, or the form on this page.",
};

export default function ContactPage() {
  return <ContactOverviewView content={contactPage} />;
}
