import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { NotFoundView } from "@/components/NotFoundView";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist. Return to the Vyuha.ai homepage.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <MarketingShell>
      <NotFoundView />
    </MarketingShell>
  );
}
