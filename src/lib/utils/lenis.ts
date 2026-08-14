import type Lenis from "lenis";

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
    lenisInstance.scrollTo(target, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.25,
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
