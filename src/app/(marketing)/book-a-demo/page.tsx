import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";

export const metadata: Metadata = { title: "Book a Demo — Vyuha.ai" };

export default function BookADemoPage() {
  return <PlaceholderPage title="Book a Demo" path="/book-a-demo" />;
}
