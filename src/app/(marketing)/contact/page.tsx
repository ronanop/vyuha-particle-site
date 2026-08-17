import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";

export const metadata: Metadata = { title: "Contact — Vyuha.ai" };

export default function ContactPage() {
  return <PlaceholderPage title="Contact" path="/contact" />;
}
