import type { QualityProfile, QualityRange, QualityTier } from "@/types/particles";

/** Stable marketing-site budgets — logo silhouette needs denser fill. */
export const QUALITY_COUNTS: Record<QualityTier, QualityRange> = {
  HIGH: { min: 9000, max: 14000, target: 12000 },
  MEDIUM: { min: 6500, max: 9000, target: 8000 },
  LOW: { min: 4000, max: 6500, target: 5500 },
  MINIMAL: { min: 2200, max: 3600, target: 2800 },
};

const TIER_FPS_FLOOR: Record<QualityTier, number> = {
  HIGH: 48,
  MEDIUM: 42,
  LOW: 36,
  MINIMAL: 0,
};

const TIER_RANK: Record<QualityTier, number> = {
  MINIMAL: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

const TIER_STORAGE_KEY = "vyuha:particle-tier";
/** Persisted downgrades expire so a hardware/browser change can re-detect. */
const TIER_STORAGE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type GpuClass = "software" | "weak" | "ok";

interface WebGLProbe {
  available: boolean;
  renderer: string;
}

let webglProbe: WebGLProbe | null = null;

/*
 * Media queries are cached — getQualityProfile runs inside the frame loop and
 * window.matchMedia per call is measurable on low-end devices.
 */
let touchCache: boolean | null = null;
let reducedMotionCache: boolean | null = null;
const profileCache = new Map<QualityTier, QualityProfile>();
let detectedTierCache: QualityTier | null = null;

export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  if (touchCache === null) {
    const mq = window.matchMedia("(pointer: coarse)");
    touchCache = mq.matches || navigator.maxTouchPoints > 0;
    try {
      mq.addEventListener("change", () => {
        touchCache = mq.matches || navigator.maxTouchPoints > 0;
        profileCache.clear();
      });
    } catch {
      /* older engines without MediaQueryList events */
    }
  }
  return touchCache;
}

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

function probeWebGL(): WebGLProbe {
  if (webglProbe) return webglProbe;
  if (typeof document === "undefined") {
    webglProbe = { available: false, renderer: "" };
    return webglProbe;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { alpha: true, antialias: false }) ||
      canvas.getContext("webgl", { alpha: true, antialias: false }) ||
      canvas.getContext("experimental-webgl", {
        alpha: true,
        antialias: false,
      });

    if (!gl || typeof (gl as WebGLRenderingContext).getParameter !== "function") {
      webglProbe = { available: false, renderer: "" };
      return webglProbe;
    }

    const ctx = gl as WebGLRenderingContext;
    let renderer = "";
    const info = ctx.getExtension("WEBGL_debug_renderer_info");
    if (info) {
      renderer = String(ctx.getParameter(info.UNMASKED_RENDERER_WEBGL) || "");
    }
    ctx.getExtension("WEBGL_lose_context")?.loseContext();
    webglProbe = { available: true, renderer };
    return webglProbe;
  } catch {
    webglProbe = { available: false, renderer: "" };
    return webglProbe;
  }
}

export function isWebGLAvailable(): boolean {
  return probeWebGL().available;
}

function classifyGpu(renderer: string): GpuClass {
  const r = renderer.toLowerCase();
  if (!r) return "ok";
  if (
    /swiftshader|llvmpipe|softpipe|microsoft basic render|software rasterizer/.test(
      r,
    )
  ) {
    return "software";
  }
  if (
    /mali-4|mali-t6|mali-t7|mali-t8|mali-g[2-5][0-9]|mali-g71|mali-g72/.test(r) ||
    /adreno \(tm\) [1-5]|adreno [1-5]\d{2}/.test(r) ||
    /powervr/.test(r)
  ) {
    return "weak";
  }
  // Intel iGPU: HD / UHD 6xx struggle; Iris, Arc, and UHD 7xx+ are fine
  if (/intel/.test(r)) {
    if (/iris|arc|uhd graphics 7|uhd graphics [8-9]/.test(r)) return "ok";
    if (/\b(hd|uhd)\b/.test(r)) return "weak";
  }
  return "ok";
}

function prefersSaveData(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean };
    }
  ).connection;
  return conn?.saveData === true;
}

function isQualityTier(value: string | null): value is QualityTier {
  return value === "HIGH" || value === "MEDIUM" || value === "LOW" || value === "MINIMAL";
}

/** Dev/QA override: `?tier=low` forces a tier without touching detection. */
function readTierOverride(): QualityTier | null {
  if (process.env.NODE_ENV === "production") return null;
  if (typeof window === "undefined") return null;
  try {
    const raw = new URLSearchParams(window.location.search).get("tier");
    const upper = raw ? raw.toUpperCase() : null;
    return isQualityTier(upper) ? upper : null;
  } catch {
    return null;
  }
}

/** Last tier the FPS monitor settled on — repeat visits skip the jank ladder. */
function readPersistedTier(): QualityTier | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TIER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { tier?: string; at?: number };
    if (!isQualityTier(parsed.tier ?? null)) return null;
    if (typeof parsed.at !== "number" || Date.now() - parsed.at > TIER_STORAGE_TTL_MS) {
      window.localStorage.removeItem(TIER_STORAGE_KEY);
      return null;
    }
    return parsed.tier as QualityTier;
  } catch {
    return null;
  }
}

export function persistQualityTier(tier: QualityTier): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      TIER_STORAGE_KEY,
      JSON.stringify({ tier, at: Date.now() }),
    );
  } catch {
    /* storage may be unavailable (private mode) */
  }
}

/** Reflect the active tier on <html> so CSS can gate expensive effects. */
export function markDocumentTier(tier: QualityTier): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.particleTier = tier;
}

/**
 * Pick a conservative boot tier. Runtime FPS monitor may still drop further;
 * it never upgrades (avoids a geometry remount hitch).
 */
export function detectQualityTier(): QualityTier {
  if (typeof window === "undefined") return "MEDIUM";
  if (detectedTierCache) return detectedTierCache;

  const override = readTierOverride();
  if (override) {
    detectedTierCache = override;
    return override;
  }

  const detected = detectQualityTierUncached();
  const persisted = readPersistedTier();
  const tier =
    persisted && TIER_RANK[persisted] < TIER_RANK[detected] ? persisted : detected;
  detectedTierCache = tier;
  return tier;
}

function detectQualityTierUncached(): QualityTier {
  const probe = probeWebGL();
  if (!probe.available) return "MINIMAL";

  const gpu = classifyGpu(probe.renderer);
  if (gpu === "software" || prefersSaveData()) return "MINIMAL";

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cssPixels = window.innerWidth * window.innerHeight;

  if (prefersReducedMotion()) {
    return gpu === "weak" || (memory !== undefined && memory <= 4)
      ? "MINIMAL"
      : "LOW";
  }

  if (isTouchDevice()) {
    if (gpu === "weak" || cores <= 4 || (memory !== undefined && memory <= 3)) {
      return "MINIMAL";
    }
    return "LOW";
  }

  if (gpu === "weak" || cores <= 4 || (memory !== undefined && memory <= 4)) {
    return "LOW";
  }

  // 1440p/4K fill-rate: don't start at HIGH even on a decent CPU
  if (cssPixels > 1920 * 1200 || dpr > 2.25 || cores < 8 || (memory !== undefined && memory < 8)) {
    return "MEDIUM";
  }

  return "HIGH";
}

export function getQualityProfile(tier?: QualityTier): QualityProfile {
  const resolved = tier ?? detectQualityTier();
  const cached = profileCache.get(resolved);
  if (cached) return cached;

  const touch = isTouchDevice();
  const noiseEnabled = resolved === "HIGH" || resolved === "MEDIUM";
  const mouseEnabled = !touch && (resolved === "HIGH" || resolved === "MEDIUM");

  const lod: QualityProfile["shaderLod"] =
    resolved === "HIGH" ? 3 : resolved === "MEDIUM" ? 2 : resolved === "LOW" ? 1 : 0;

  const profile: QualityProfile = {
    tier: resolved,
    count: QUALITY_COUNTS[resolved].target,
    dprCap:
      resolved === "HIGH" ? 2 : resolved === "MEDIUM" ? 1.5 : 1,
    mouseEnabled,
    noiseEnabled,
    shaderLod: lod,
    slotMs: resolved === "HIGH" ? 16 : resolved === "MEDIUM" ? 24 : resolved === "LOW" ? 48 : 80,
    sizeBoost: resolved === "MINIMAL" ? 1.42 : resolved === "LOW" ? 1.18 : 1,
  };
  profileCache.set(resolved, profile);
  return profile;
}

export function downgradeTier(tier: QualityTier): QualityTier {
  if (tier === "HIGH") return "MEDIUM";
  if (tier === "MEDIUM") return "LOW";
  if (tier === "LOW") return "MINIMAL";
  return "MINIMAL";
}

export function fpsFloorForTier(tier: QualityTier): number {
  return TIER_FPS_FLOOR[tier];
}

/**
 * Native scroll on the cheap tiers — Lenis animates scrollTop from the same
 * rAF as the particles, so when the canvas drops frames the entire page
 * scroll stutters with it. LOW/MINIMAL keep native scroll instead.
 */
export function shouldUseSmoothScroll(): boolean {
  if (typeof window === "undefined") return true;
  if (prefersReducedMotion()) return false;
  const tier = detectQualityTier();
  return tier === "HIGH" || tier === "MEDIUM";
}

/** True when a tier is too weak for Lenis smooth scroll. */
export function tierWantsNativeScroll(tier: QualityTier): boolean {
  return tier === "LOW" || tier === "MINIMAL";
}

/** Rolling FPS window used to auto-downgrade particle count / lod. */
export class FpsMonitor {
  private readonly samples: Float32Array;
  private readonly windowSize: number;
  private readonly warmupFrames: number;
  private index = 0;
  private filled = 0;
  private warmup = 0;

  constructor(windowSize = 45, warmupFrames = 18) {
    this.windowSize = windowSize;
    this.warmupFrames = warmupFrames;
    this.samples = new Float32Array(windowSize);
  }

  push(dtSeconds: number): void {
    if (dtSeconds <= 0 || dtSeconds > 0.1) return;
    this.warmup += 1;
    if (this.warmup < this.warmupFrames) return;
    this.samples[this.index] = 1 / dtSeconds;
    this.index = (this.index + 1) % this.windowSize;
    if (this.filled < this.windowSize) this.filled += 1;
  }

  average(): number {
    if (this.filled === 0) return 60;
    let sum = 0;
    for (let i = 0; i < this.filled; i++) sum += this.samples[i];
    return sum / this.filled;
  }

  shouldDowngrade(threshold = 42): boolean {
    if (threshold <= 0) return false;
    return this.filled >= this.windowSize && this.average() < threshold;
  }

  reset(): void {
    this.index = 0;
    this.filled = 0;
    this.warmup = 0;
  }
}
