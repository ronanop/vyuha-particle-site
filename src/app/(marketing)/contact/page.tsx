import type { Metadata } from "next";
import { ContactOverviewView } from "@/components/marketing/contact/ContactOverview";
import { contactPage } from "@/content/contact";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Vyuha.ai by email, phone, or the form on this page to discuss enterprise AI architecture, agentic workflows, and deployment.",
  path: "/contact",
  keywords: ["contact Vyuha", "book demo", "enterprise AI demo"],
});

export default function ContactPage() {
  return <ContactOverviewView content={contactPage} />;
}
