import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { resourcesNewsEvents } from "@/content/resources/newsEvents";

export const metadata: Metadata = {
  title: "News & Events — Vyuha.ai",
  description: resourcesNewsEvents.body[0],
};

export default function NewsEventsPage() {
  return <MarketingPageView content={resourcesNewsEvents} />;
}
