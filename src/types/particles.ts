/**
 * Particle engine shared types.
 * Formation names stay open — register generators in ParticleTarget, then add morph segments.
 */

export type QualityTier = "HIGH" | "MEDIUM" | "LOW";

export interface QualityRange {
  min: number;
  max: number;
  target: number;
}

export interface QualityProfile {
  tier: QualityTier;
  count: number;
  dprCap: number;
  mouseEnabled: boolean;
}

/**
 * Formation id — register generators via `registerTarget()`.
 * `"placeholder"` ships with the engine; add real shapes in the next phase.
 */
export type ParticleFormation = string;

export const PLACEHOLDER_FORMATION = "placeholder" as const;

export interface MorphSegment {
  start: number;
  end: number;
  from: ParticleFormation;
  to: ParticleFormation;
}

export interface ResolvedMorph {
  from: ParticleFormation;
  to: ParticleFormation;
  localProgress: number;
  segmentIndex: number;
}

export interface ParticleVisualConfig {
  particleColor: string;
  particleOpacity: number;
  particleSize: number;
  particleIntensity: number;
  noiseStrength: number;
  noiseSpeed: number;
  mouseInfluence: number;
}

export const DEFAULT_VISUAL_CONFIG: ParticleVisualConfig = {
  particleColor: "#22d3ee",
  particleOpacity: 0.85,
  particleSize: 1.5,
  particleIntensity: 1.15,
  noiseStrength: 0.18,
  noiseSpeed: 0.12,
  mouseInfluence: 0.55,
};

/** Target generator: fill a Float32Array of length count*3 with xyz world positions. */
export type TargetGenerator = (count: number) => Float32Array;

/** Optional per-particle visual attrs (e.g. earth layers). */
export interface FormationBuffers {
  positions: Float32Array;
  sizes?: Float32Array;
  opacities?: Float32Array;
  /** 0=shell, 1=world, 2=sriLanka, 3=india for earth-india */
  layers?: Float32Array;
}

export interface SlotRect {
  left: number;
  top: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}
