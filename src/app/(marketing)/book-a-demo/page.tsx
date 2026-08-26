import type { Metadata } from "next";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { bookADemo } from "@/content/bookADemo";

export const metadata: Metadata = {
  title: "Book a Demo | Vyuha.ai",
  description: bookADemo.body[0],
};

export default function BookADemoPage() {
  return <MarketingPageView content={bookADemo} />;
}
