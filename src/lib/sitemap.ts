/**
 * Canonical Vyuha.ai site map. Routes and titles only — copy comes later.
 */

export type SiteNode = {
  path: string;
  title: string;
  children?: SiteNode[];
};

export const SITE_MAP: SiteNode[] = [
  {
    path: "/",
    title: "Home",
  },
  {
    path: "/platform",
    title: "Platform",
    children: [
      { path: "/platform/command", title: "Vyuha.ONE" },
      { path: "/platform/in-a-box", title: "Vyuha In a BOX" },
      { path: "/platform/integrations", title: "Integrations" },
    ],
  },
  {
    path: "/solutions",
    title: "Solutions",
    children: [
      { path: "/solutions/security-compliance", title: "Security & Compliance" },
      { path: "/solutions/it-operations", title: "IT Operations" },
      {
        path: "/solutions/business-operations",
        title: "Business Operations & FinOps",
      },
      {
        path: "/solutions/industry-use-cases",
        title: "Industry-Wise Use Cases",
      },
    ],
  },
  {
    path: "/company",
    title: "Company",
  },
  {
    path: "/partners",
    title: "Partners",
  },
  {
    path: "/resources",
    title: "Resources",
    children: [
      { path: "/resources/news-events", title: "News & Events" },
      { path: "/resources/blog", title: "Blog / Insights" },
    ],
  },
  {
    path: "/contact",
    title: "Contact",
  },
  {
    path: "/book-a-demo",
    title: "Book a Demo",
  },
];

/** Top-level items for the primary nav (excludes Home). */
export const PRIMARY_NAV = SITE_MAP.filter((n) => n.path !== "/");

export function findSiteNode(path: string): SiteNode | null {
  const walk = (nodes: SiteNode[]): SiteNode | null => {
    for (const node of nodes) {
      if (node.path === path) return node;
      if (node.children) {
        const hit = walk(node.children);
        if (hit) return hit;
      }
    }
    return null;
  };
  return walk(SITE_MAP);
}

/** Depth-first list of every route in SITE_MAP (parents before children). */
export function flattenSiteMap(nodes: SiteNode[] = SITE_MAP): SiteNode[] {
  const out: SiteNode[] = [];
  const walk = (list: SiteNode[]) => {
    for (const node of list) {
      out.push({ path: node.path, title: node.title });
      if (node.children) walk(node.children);
    }
  };
  walk(nodes);
  return out;
}
