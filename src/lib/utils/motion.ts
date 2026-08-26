let reducedMotionCache: boolean | null = null;

/** Cached `prefers-reduced-motion` — safe to call from effects and frame loops. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  if (reducedMotionCache === null) {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionCache = mq.matches;
    try {
      mq.addEventListener("change", () => {
        reducedMotionCache = mq.matches;
      });
    } catch {
      /* older engines without MediaQueryList events */
    }
  }
  return reducedMotionCache;
}
