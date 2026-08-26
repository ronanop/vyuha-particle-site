import type { Metadata } from "next";
import { PlatformProductView } from "@/components/marketing/platform/PlatformViews";
import { platformInABox } from "@/content/platform/inABox";

export const metadata: Metadata = {
  title: "Vyuha In a BOX | Vyuha.ai",
  description: platformInABox.headline,
};

export default function InABoxPage() {
  return <PlatformProductView content={platformInABox} />;
}
