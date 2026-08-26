import type { Metadata } from "next";
import { PlatformProductView } from "@/components/marketing/platform/PlatformViews";
import { platformInABox } from "@/content/platform/inABox";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Vyuha In a BOX",
  description: platformInABox.headline,
  path: "/platform/in-a-box",
  keywords: [
    "on-premise AI",
    "air-gapped AI",
    "Vyuha In a BOX",
    "data localization",
  ],
});

export default function InABoxPage() {
  return <PlatformProductView content={platformInABox} />;
}
