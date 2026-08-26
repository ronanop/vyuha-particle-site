/**
 * Warm heavy hero chunks + tunnel textures before navigation.
 * Safe to call repeatedly (deduped).
 */

export const SOLUTIONS_TUNNEL_IMAGES = [
  "/solutions/tunnel/pexels-rsapmech-13084563.webp",
  "/solutions/tunnel/pexels-cottonbro-6803554.webp",
  "/solutions/tunnel/pexels-thales13-38343508.webp",
  "/solutions/tunnel/pexels-jakubzerdzicki-33000099.webp",
  "/solutions/tunnel/pexels-cookiecutter-17489155.webp",
  "/solutions/tunnel/pexels-divinetechygirl-1181316.webp",
  "/solutions/tunnel/pexels-pavel-danilyuk-8438993.webp",
  "/solutions/tunnel/pexels-yaroslav-shuraev-7688592.webp",
  "/solutions/tunnel/pexels-yankrukov-7693743.webp",
] as const;

export const SOLUTIONS_TUNNEL_POSTER = "/solutions/tunnel/poster.webp";

const warmed = new Set<string>();

function preloadImage(href: string) {
  if (typeof document === "undefined" || warmed.has(href)) return;
  warmed.add(href);
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = href;
  link.type = "image/webp";
  document.head.appendChild(link);

  const img = new Image();
  img.decoding = "async";
  img.src = href;
}

export function prefetchSolutionsHero() {
  if (typeof window === "undefined") return;
  if (!warmed.has("solutions-chunk")) {
    warmed.add("solutions-chunk");
    void import("@/components/marketing/solutions/InfiniteScrollTunnel");
  }
  preloadImage(SOLUTIONS_TUNNEL_POSTER);
  // First three textures are enough for an instant first paint
  for (const url of SOLUTIONS_TUNNEL_IMAGES.slice(0, 3)) {
    preloadImage(url);
  }
}

export function prefetchPlatformHero() {
  if (typeof window === "undefined") return;
  if (!warmed.has("platform-chunk")) {
    warmed.add("platform-chunk");
    void import("@/components/marketing/platform/LightTunnel");
  }
}

export function prefetchMarketingHero(href: string) {
  if (href === "/solutions" || href.startsWith("/solutions?")) {
    prefetchSolutionsHero();
  } else if (href === "/platform" || href.startsWith("/platform?")) {
    prefetchPlatformHero();
  }
}
