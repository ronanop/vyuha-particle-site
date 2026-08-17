import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";

export const metadata: Metadata = { title: "Blog / Insights — Vyuha.ai" };

export default function BlogPage() {
  return <PlaceholderPage title="Blog / Insights" path="/resources/blog" />;
}
