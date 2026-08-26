import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/marketing/PlaceholderPage";
import { findSiteNode } from "@/lib/sitemap";

const node = findSiteNode("/resources")!;

export const metadata: Metadata = { title: `${node.title} | Vyuha.ai` };

export default function ResourcesPage() {
  return (
    <PlaceholderPage
      title={node.title}
      path={node.path}
      childrenNodes={node.children}
    />
  );
}
