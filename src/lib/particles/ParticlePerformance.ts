import type { QualityProfile, QualityRange, QualityTier } from "@/types/particles";

/** Stable marketing-site budgets — logo silhouette needs denser fill. */
export const QUALITY_COUNTS: Record<QualityTier, QualityRange> = {
  HIGH: { min: 9000, max: 14000, target: 12000 },
  MEDIUM: { min: 6500, max: 9000, target: 8000 },
  LOW: { min: 4500, max: 6500, target: 5500 },
};

export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isWebGLAvailable(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function detectQualityTier(): QualityTier {
  if (typeof window === "undefined") return "MEDIUM";

  if (isTouchDevice() || prefersReducedMotion()) return "LOW";

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);

  if (cores <= 4 || memory <= 4) return "LOW";
  if (cores >= 8 && memory >= 8 && dpr <= 2) return "HIGH";
  return "MEDIUM";
}

export function getQualityProfile(tier?: QualityTier): QualityProfile {
  const resolved = tier ?? detectQualityTier();
  const touch = isTouchDevice();
  return {
    tier: resolved,
    count: QUALITY_COUNTS[resolved].target,
    dprCap: resolved === "LOW" ? 1.5 : 2,
    mouseEnabled: !touch && resolved !== "LOW",
  };
}

export function downgradeTier(tier: QualityTier): QualityTier {
  if (tier === "HIGH") return "MEDIUM";
  if (tier === "MEDIUM") return "LOW";
  return "LOW";
}

/** Rolling FPS window used to auto-downgrade particle count. */
export class FpsMonitor {
  private samples: number[] = [];
  private readonly windowSize: number;

  constructor(windowSize = 60) {
    this.windowSize = windowSize;
  }

  push(dtSeconds: number): void {
    if (dtSeconds <= 0) return;
    const fps = 1 / dtSeconds;
    this.samples.push(fps);
    if (this.samples.length > this.windowSize) this.samples.shift();
  }

  average(): number {
    if (this.samples.length === 0) return 60;
    const sum = this.samples.reduce((a, b) => a + b, 0);
    return sum / this.samples.length;
  }

  shouldDowngrade(threshold = 40): boolean {
    return this.samples.length >= this.windowSize && this.average() < threshold;
  }

  reset(): void {
    this.samples.length = 0;
  }
}
