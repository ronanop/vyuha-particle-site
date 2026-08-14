/**
 * Particle engine shared types.
 * Formation names stay open — register generators in ParticleTarget, then add morph segments.
 */

export type QualityTier = "HIGH" | "MEDIUM" | "LOW" | "MINIMAL";

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
  /** Curl-noise / mid-flight flow. Off on LOW+MINIMAL. */
  noiseEnabled: boolean;
  /** 3=full, 2=cheap noise, 1=no noise/mouse, 0=simplest morph. */
  shaderLod: 0 | 1 | 2 | 3;
  /** Slot projection interval (ms). Formation stage still updates every frame. */
  slotMs: number;
  /** Multiply point size so sparser clouds still read as a silhouette. */
  sizeBoost: number;
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
