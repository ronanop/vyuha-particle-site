import type {
  ParticleFormation,
  ParticleVisualConfig,
  QualityTier,
} from "@/types/particles";
import { DEFAULT_VISUAL_CONFIG } from "@/types/particles";
import { detectQualityTier, getQualityProfile } from "@/lib/particles/ParticlePerformance";
import { FORMATION_STAGE_MAX } from "@/lib/particles/formationChain";

export interface ParticleDebugState {
  enabled: boolean;
  forceProgress: number | null;
  forceFormation: ParticleFormation | null;
  visual: ParticleVisualConfig;
}

export interface ParticleEngineState {
  scrollProgress: number;
  mouseX: number;
  mouseY: number;
  mouseActive: boolean;
  reducedMotion: boolean;
  webglAvailable: boolean;
  qualityTier: QualityTier;
  particleCount: number;
  /** Active section slot id (data-particle-slot), or null. */
  activeSlotId: string | null;
  /** World-space offset applied to the particle group for the active slot. */
  slotOffsetX: number;
  slotOffsetY: number;
  slotOffsetZ: number;
  /**
   * 0–1 travel morph amount when the anchored slot/position changes.
   * Driven by the controller; consumed/decayed by ParticleSystem.
   */
  slotTravel: number;
  /**
   * Continuous morph stage along FORMATION_CHAIN
   * (0 = earth … 6 = delivery field … 7 = Vyuha logo).
   * Same particle group morphs between adjacent formations.
   */
  formationStage: number;
  /** @deprecated Derived from formationStage — kept for any legacy reads. */
  breakProgress: number;
  /** 0 = scattered intro, 1 = earth formed. */
  introProgress: number;
  introComplete: boolean;
  debug: ParticleDebugState;
}

const initialProfile = getQualityProfile("MEDIUM");

export const particleState: ParticleEngineState = {
  scrollProgress: 0,
  mouseX: 0,
  mouseY: 0,
  mouseActive: false,
  reducedMotion: false,
  webglAvailable: true,
  qualityTier: initialProfile.tier,
  particleCount: initialProfile.count,
  activeSlotId: null,
  slotOffsetX: 0,
  slotOffsetY: 0,
  slotOffsetZ: 0,
  slotTravel: 0,
  formationStage: 0,
  breakProgress: 0,
  introProgress: 0,
  introComplete: false,
  debug: {
    enabled: false,
    forceProgress: null,
    forceFormation: null,
    visual: { ...DEFAULT_VISUAL_CONFIG },
  },
};

export function setScrollProgress(value: number): void {
  particleState.scrollProgress = Math.min(1, Math.max(0, value));
}

export function setMouse(x: number, y: number, active: boolean): void {
  particleState.mouseX = x;
  particleState.mouseY = y;
  particleState.mouseActive = active;
}

export function setActiveSlot(
  id: string | null,
  offset: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
  travel = 0,
): void {
  particleState.activeSlotId = id;
  particleState.slotOffsetX = offset.x;
  particleState.slotOffsetY = offset.y;
  particleState.slotOffsetZ = offset.z;
  if (travel > particleState.slotTravel) {
    particleState.slotTravel = Math.min(1, travel);
  }
}

/** Decay slot-travel morph (called each frame from ParticleSystem). */
export function decaySlotTravel(amount: number): void {
  particleState.slotTravel = Math.max(0, particleState.slotTravel - amount);
}

export function setFormationStage(value: number): void {
  const stage = Math.min(FORMATION_STAGE_MAX, Math.max(0, value));
  particleState.formationStage = stage;
  particleState.breakProgress = Math.min(1, stage);
}

export function setBreakProgress(value: number): void {
  // Legacy: treat as stage floor when only break is known
  particleState.breakProgress = Math.min(1, Math.max(0, value));
  if (particleState.formationStage < particleState.breakProgress) {
    particleState.formationStage = particleState.breakProgress;
  }
}

export function setIntroProgress(value: number): void {
  particleState.introProgress = Math.min(1, Math.max(0, value));
  if (particleState.introProgress >= 1) {
    particleState.introComplete = true;
  }
}

export function completeIntroImmediately(): void {
  particleState.introProgress = 1;
  particleState.introComplete = true;
}

export function getEffectiveProgress(): number {
  const { debug, scrollProgress } = particleState;
  if (debug.enabled && debug.forceProgress != null) {
    return Math.min(1, Math.max(0, debug.forceProgress));
  }
  return scrollProgress;
}

export function bootParticleState(options: {
  webglAvailable: boolean;
  reducedMotion: boolean;
  qualityTier?: QualityTier;
}): void {
  const tier = options.qualityTier ?? detectQualityTier();
  const profile = getQualityProfile(tier);
  particleState.webglAvailable = options.webglAvailable;
  particleState.reducedMotion = options.reducedMotion;
  particleState.qualityTier = profile.tier;
  particleState.particleCount = profile.count;
  particleState.introProgress = 0;
  particleState.introComplete = false;
  particleState.formationStage = 0;
  particleState.breakProgress = 0;
}

/** Soft reset used when remounting the canvas without a full reload. */
export function resetIntro(): void {
  particleState.introProgress = 0;
  particleState.introComplete = false;
  particleState.formationStage = 0;
  particleState.breakProgress = 0;
}
