let reducedMotionCache: boolean | null = null;
let mobileViewportCache: boolean | null = null;

const MOBILE_MQ = "(max-width: 767px)";

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

/** Cached Tailwind `md` breakpoint (below 768px). */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  if (mobileViewportCache === null) {
    const mq = window.matchMedia(MOBILE_MQ);
    mobileViewportCache = mq.matches;
    try {
      mq.addEventListener("change", () => {
        mobileViewportCache = mq.matches;
      });
    } catch {
      /* older engines without MediaQueryList events */
    }
  }
  return mobileViewportCache;
}

/**
 * Skip heavy scroll / scramble / WebGL FX on phones and when the user
 * prefers reduced motion — keeps final content visible without jank.
 */
export function shouldSkipMotionEffects(): boolean {
  return prefersReducedMotion() || isMobileViewport();
}
