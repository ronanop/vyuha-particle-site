import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";
import { findSiteNode } from "@/lib/sitemap";

const node = findSiteNode("/company")!;

export const metadata: Metadata = { title: `${node.title} — Vyuha.ai` };

export default function CompanyPage() {
  return (
    <PlaceholderPage
      title={node.title}
      path={node.path}
      childrenNodes={node.children}
    />
  );
}
