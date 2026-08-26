"use client";

import { useEffect } from "react";

function scrollWindowToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function isReloadNavigation() {
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return nav?.type === "reload";
}

/**
 * Reload / hard refresh should always land at the top.
 * Disables the browser's automatic scroll restoration so mid-page
 * positions are not restored after refresh.
 */
export function ScrollResetOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const shouldReset = isReloadNavigation() || !window.location.hash;
    if (!shouldReset) return;

    scrollWindowToTop();
    const raf = requestAnimationFrame(scrollWindowToTop);
    const t0 = window.setTimeout(scrollWindowToTop, 0);
    // Late restore races (Chrome) — one more nudge after paint.
    const t1 = window.setTimeout(scrollWindowToTop, 50);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t0);
      window.clearTimeout(t1);
    };
  }, []);

  return null;
}
