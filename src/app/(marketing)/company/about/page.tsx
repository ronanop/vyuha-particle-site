import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";

export const metadata: Metadata = { title: "About Us — Vyuha.ai" };

export default function AboutPage() {
  return <PlaceholderPage title="About Us" path="/company/about" />;
}
