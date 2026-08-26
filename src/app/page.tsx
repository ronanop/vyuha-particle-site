import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";
import { PageTransition } from "@/components/ui/PageTransition";
import { createPageMetadata } from "@/lib/seo";
import { homeContent } from "@/content/home";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Sovereign Agentic AI for the Enterprise",
    description: homeContent.lead,
    path: "/",
    keywords: [
      "enterprise agentic platform",
      "sovereign AI India",
      "private perimeter AI",
    ],
  }),
  title: {
    absolute: "Vyuha.ai | Sovereign Agentic AI for the Enterprise",
  },
};

export default function Home() {
  return (
    <PageTransition>
      <PageContent />
    </PageTransition>
  );
}
