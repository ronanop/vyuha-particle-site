import type Lenis from "lenis";
import { getScrollFeel, luxuryEase } from "@/lib/utils/scrollFeel";

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null): void {
  lenisInstance = instance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function scrollToTarget(
  target: string | HTMLElement | number,
  options?: { offset?: number; duration?: number },
): void {
  if (lenisInstance) {
    const feel = getScrollFeel();
    lenisInstance.scrollTo(target, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? feel.anchorDuration,
      easing: luxuryEase,
    });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }

  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (el instanceof HTMLElement) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
