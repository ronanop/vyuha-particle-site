import { flattenSiteMap } from "@/lib/sitemap";

const ROUTE_ORDER = flattenSiteMap().map((n) => n.path);

function routeRank(path: string): number {
  const clean = path.split("?")[0]?.split("#")[0] || "/";
  let best = -1;
  let bestLen = -1;
  for (let i = 0; i < ROUTE_ORDER.length; i++) {
    const route = ROUTE_ORDER[i]!;
    if (clean === route || (route !== "/" && clean.startsWith(`${route}/`))) {
      if (route.length > bestLen) {
        best = i;
        bestLen = route.length;
      }
    }
  }
  return best;
}

/**
 * Pick View Transition types for a navigation between two paths.
 * Deeper / later sitemap entries = forward; earlier = back.
 */
export function getNavTransitionTypes(
  fromPath: string,
  toPath: string,
): string[] {
  const from = routeRank(fromPath);
  const to = routeRank(toPath);
  if (from < 0 || to < 0 || from === to) return ["page-fade"];
  return to > from ? ["nav-forward"] : ["nav-back"];
}
