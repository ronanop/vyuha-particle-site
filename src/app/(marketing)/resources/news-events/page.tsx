import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";

export const metadata: Metadata = { title: "News & Events — Vyuha.ai" };

export default function NewsEventsPage() {
  return (
    <PlaceholderPage title="News & Events" path="/resources/news-events" />
  );
}
