import type { QualityTier } from "@/types/particles";
import { detectQualityTier } from "@/lib/particles/ParticlePerformance";

/**
 * Layered scroll lag:
 * 1. Lenis `lerp` — the page trails the wheel (do not also set `duration`)
 * 2. ScrollTrigger `scrub` — leftover progress lag
 * 3. Particle stage/morph damp — the cloud trails the copy
 */
export interface ScrollFeel {
  lerp: number;
  wheelMultiplier: number;
  touchMultiplier: number;
  scrub: number;
  stageLambdaFwd: number;
  stageLambdaRev: number;
  morphLambda: number;
  slotFollow: number;
  anchorDuration: number;
}

const FEEL: Record<QualityTier, ScrollFeel> = {
  HIGH: {
    lerp: 0.048,
    wheelMultiplier: 0.62,
    touchMultiplier: 1.05,
    scrub: 1.9,
    stageLambdaFwd: 1.85,
    stageLambdaRev: 1.55,
    morphLambda: 2.05,
    slotFollow: 1.15,
    anchorDuration: 2.05,
  },
  MEDIUM: {
    lerp: 0.062,
    wheelMultiplier: 0.72,
    touchMultiplier: 1.12,
    scrub: 1.65,
    stageLambdaFwd: 2.2,
    stageLambdaRev: 1.85,
    morphLambda: 2.45,
    slotFollow: 1.35,
    anchorDuration: 1.75,
  },
  // LOW is native scroll (no Lenis) — damp values do all the smoothing
  LOW: {
    lerp: 1,
    wheelMultiplier: 1,
    touchMultiplier: 1,
    scrub: 1.2,
    stageLambdaFwd: 3.4,
    stageLambdaRev: 3.0,
    morphLambda: 3.6,
    slotFollow: 2.2,
    anchorDuration: 1.1,
  },
  MINIMAL: {
    lerp: 1,
    wheelMultiplier: 1,
    touchMultiplier: 1,
    scrub: 0,
    stageLambdaFwd: 8,
    stageLambdaRev: 8,
    morphLambda: 8,
    slotFollow: 6,
    anchorDuration: 0.6,
  },
};

export function luxuryEase(t: number): number {
  return 1 - (1 - t) ** 4;
}

export function getScrollFeel(tier?: QualityTier): ScrollFeel {
  return FEEL[tier ?? detectQualityTier()];
}
