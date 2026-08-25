import type { Metadata } from "next";
import { PlatformProductView } from "@/components/marketing/platform/PlatformViews";
import { platformCommand } from "@/content/platform/command";

export const metadata: Metadata = {
  title: "Vyuha.ONE — Vyuha.ai",
  description: platformCommand.headline,
};

export default function CommandPage() {
  return <PlatformProductView content={platformCommand} />;
}
