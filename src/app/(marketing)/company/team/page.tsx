import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";

export const metadata: Metadata = { title: "Team — Vyuha.ai" };

export default function TeamPage() {
  return <PlaceholderPage title="Team" path="/company/team" />;
}
