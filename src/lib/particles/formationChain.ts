import type { ParticleFormation } from "@/types/particles";
import { EARTH_FORMATION } from "@/components/particles/targets/earth";
import { SECTION_BG_FORMATION } from "@/components/particles/targets/sectionBg";
import { SHOPPING_CART_FORMATION } from "@/components/particles/targets/shoppingCart";
import { AI_BOT_FORMATION } from "@/components/particles/targets/aiBot";
import { AI_GEAR_FORMATION } from "@/components/particles/targets/aiGear";
import { SHIELD_LOCK_FORMATION } from "@/components/particles/targets/shieldLock";
import { VYUHA_LOGO_FORMATION } from "@/components/particles/targets/vyuhaLogo";
import { smoothstep } from "@/lib/particles/ParticleMorph";

/**
 * One continuous chain — same particle group morphs along this path.
 * 0 earth → 1 field → icons → 5 shield → 6 delivery field → 7 Vyuha logo.
 */
export const FORMATION_CHAIN: readonly ParticleFormation[] = [
  EARTH_FORMATION,
  SECTION_BG_FORMATION,
  SHOPPING_CART_FORMATION,
  AI_BOT_FORMATION,
  AI_GEAR_FORMATION,
  SHIELD_LOCK_FORMATION,
  SECTION_BG_FORMATION,
  VYUHA_LOGO_FORMATION,
] as const;

export const FORMATION_STAGE_MAX = FORMATION_CHAIN.length - 1;

/*
 * Section tops are cached in document space (measured once per invalidation)
 * so the per-frame stage read never touches layout — 7 getBoundingClientRect
 * calls per frame were measurable on low-end CPUs. Viewport-relative top is
 * derived from the live scroll offset instead.
 */
const sectionTopCache = new Map<string, number>();

function sectionDocTop(sectionId: string): number | null {
  if (typeof document === "undefined") return null;
  const cached = sectionTopCache.get(sectionId);
  if (cached !== undefined) return cached;
  const el = document.getElementById(sectionId);
  if (!el) return null;
  const docTop = el.getBoundingClientRect().top + window.scrollY;
  sectionTopCache.set(sectionId, docTop);
  return docTop;
}

export function invalidateFormationDomCache(): void {
  sectionTopCache.clear();
}

/** How far a section has entered the focus band (0–1). */
function sectionEnter(
  sectionId: string,
  viewportHeight: number,
  scrollY: number,
): number {
  const docTop = sectionDocTop(sectionId);
  if (docTop === null) return 0;
  const top = docTop - scrollY;
  const start = viewportHeight * 0.9;
  const end = viewportHeight * 0.34;
  return Math.min(1, Math.max(0, (start - top) / Math.max(1, start - end)));
}

/**
 * Map #command into view → 0..1 earth-break amount.
 */
export function readCommandBreakProgress(viewportHeight: number): number {
  const docTop = sectionDocTop("command");
  if (docTop === null) return 0;
  const top = docTop - window.scrollY;
  const start = viewportHeight * 1.05;
  const end = viewportHeight * 0.18;
  const t = (start - top) / Math.max(1, start - end);
  return Math.min(1, Math.max(0, t));
}

/**
 * Single scroll-driven stage across the whole morph chain.
 * Monotonic with page order so reverse scroll unwinds cleanly.
 */
export function readFormationStage(viewportHeight: number): number {
  const scrollY = typeof window === "undefined" ? 0 : window.scrollY;
  const breakT = readCommandBreakProgress(viewportHeight);
  const e1 = sectionEnter("command-01", viewportHeight, scrollY);
  const e2 = sectionEnter("command-02", viewportHeight, scrollY);
  const e3 = sectionEnter("command-03", viewportHeight, scrollY);
  const e4 = sectionEnter("box-perimeter", viewportHeight, scrollY);
  const e5 = sectionEnter("box-delivery", viewportHeight, scrollY);
  const e6 = sectionEnter("demo", viewportHeight, scrollY);

  // Icons only add once the earth has mostly broken into the field
  const iconGate = smoothstep(Math.min(1, Math.max(0, (breakT - 0.82) / 0.18)));
  const stage =
    breakT + iconGate * (e1 + e2 + e3 + e4 + e5 + e6);

  return Math.min(FORMATION_STAGE_MAX, Math.max(0, stage));
}

export function resolveFormationSegment(stage: number): {
  fromIndex: number;
  toIndex: number;
  from: ParticleFormation;
  to: ParticleFormation;
  local: number;
  /** True for wide dissolve morphs (earth→field, shield→delivery field). */
  isBreak: boolean;
} {
  const max = FORMATION_STAGE_MAX;
  const s = Math.min(max, Math.max(0, stage));
  const fromIndex = Math.min(max - 1, Math.floor(s));
  const toIndex = Math.min(max, fromIndex + 1);
  const local = s >= max ? 1 : s - fromIndex;
  const isBreak =
    (fromIndex === 0 && toIndex === 1) ||
    (fromIndex === 5 && toIndex === 6);
  return {
    fromIndex,
    toIndex,
    from: FORMATION_CHAIN[fromIndex],
    to: FORMATION_CHAIN[toIndex],
    local,
    isBreak,
  };
}
