/**
 * Canonical Vyuha.ai site map. Routes and titles only — copy comes later.
 */

export type SiteNode = {
  path: string;
  title: string;
  children?: SiteNode[];
  /** Omit from nav, footer, public sitemap page, and SEO sitemap. */
  hidden?: boolean;
  /** Keep in SEO + HTML sitemap, but omit from primary nav / footer. */
  navHidden?: boolean;
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
    // No published content yet — keep routes in the map for later, hide everywhere public.
    hidden: true,
    children: [
      { path: "/resources/news-events", title: "News & Events", hidden: true },
      { path: "/resources/blog", title: "Blog / Insights", hidden: true },
    ],
  },
  {
    path: "/contact",
    title: "Contact",
  },
  {
    path: "/sitemap",
    title: "Sitemap",
    navHidden: true,
  },
];

/** Public top-level hubs for the sitemap page (excludes hidden sections). */
export const PUBLIC_SITE_MAP = SITE_MAP.filter((n) => !n.hidden);

/** Top-level items for the primary nav (excludes Home, hidden, and navHidden). */
export const PRIMARY_NAV = PUBLIC_SITE_MAP.filter(
  (n) => n.path !== "/" && !n.navHidden,
);

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

/** Depth-first list of public routes in SITE_MAP (parents before children). */
export function flattenSiteMap(nodes: SiteNode[] = SITE_MAP): SiteNode[] {
  const out: SiteNode[] = [];
  const walk = (list: SiteNode[]) => {
    for (const node of list) {
      if (node.hidden) continue;
      out.push({ path: node.path, title: node.title });
      if (node.children) walk(node.children);
    }
  };
  walk(nodes);
  return out;
}
