import type { Metadata } from "next";
import { PlatformProductView } from "@/components/marketing/platform/PlatformViews";
import { platformCommand } from "@/content/platform/command";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Vyuha.ONE",
  description: platformCommand.headline,
  path: "/platform/command",
  keywords: [
    "Vyuha.ONE",
    "agentic OS",
    "private cloud AI",
    "command plane",
  ],
});

export default function CommandPage() {
  return <PlatformProductView content={platformCommand} />;
}
