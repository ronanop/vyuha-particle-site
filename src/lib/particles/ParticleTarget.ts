import type {
  FormationBuffers,
  ParticleFormation,
  TargetGenerator,
} from "@/types/particles";
import { PLACEHOLDER_FORMATION } from "@/types/particles";
import { generatePlaceholderTarget } from "@/components/particles/targets/placeholder";
import {
  EARTH_FORMATION,
  generateEarthTarget,
  getEarthFormationBuffers,
} from "@/components/particles/targets/earth";
import {
  SCATTERED_BG_FORMATION,
  generateScatteredBgTarget,
} from "@/components/particles/targets/scatteredBg";
import {
  SECTION_BG_FORMATION,
  generateSectionBgTarget,
  getSectionBgFormationBuffers,
} from "@/components/particles/targets/sectionBg";
import {
  SHOPPING_CART_FORMATION,
  generateShoppingCartTarget,
  getShoppingCartFormationBuffers,
} from "@/components/particles/targets/shoppingCart";
import {
  AI_BOT_FORMATION,
  generateAiBotTarget,
  getAiBotFormationBuffers,
} from "@/components/particles/targets/aiBot";
import {
  AI_GEAR_FORMATION,
  generateAiGearTarget,
  getAiGearFormationBuffers,
} from "@/components/particles/targets/aiGear";
import {
  SHIELD_LOCK_FORMATION,
  generateShieldLockTarget,
  getShieldLockFormationBuffers,
} from "@/components/particles/targets/shieldLock";
import {
  VYUHA_LOGO_FORMATION,
  generateVyuhaLogoTarget,
  getVyuhaLogoFormationBuffers,
} from "@/components/particles/targets/vyuhaLogo";

const generators = new Map<ParticleFormation, TargetGenerator>();

/** Register or replace a formation sampler. */
export function registerTarget(
  formation: ParticleFormation,
  generator: TargetGenerator,
): void {
  generators.set(formation, generator);
}

export function getRegisteredFormations(): ParticleFormation[] {
  return [...generators.keys()];
}

function ensureDefaults(): void {
  if (!generators.has(PLACEHOLDER_FORMATION)) {
    generators.set(PLACEHOLDER_FORMATION, generatePlaceholderTarget);
  }
  if (!generators.has(EARTH_FORMATION)) {
    generators.set(EARTH_FORMATION, generateEarthTarget);
  }
  if (!generators.has(SCATTERED_BG_FORMATION)) {
    generators.set(SCATTERED_BG_FORMATION, generateScatteredBgTarget);
  }
  if (!generators.has(SECTION_BG_FORMATION)) {
    generators.set(SECTION_BG_FORMATION, generateSectionBgTarget);
  }
  if (!generators.has(SHOPPING_CART_FORMATION)) {
    generators.set(SHOPPING_CART_FORMATION, generateShoppingCartTarget);
  }
  if (!generators.has(AI_BOT_FORMATION)) {
    generators.set(AI_BOT_FORMATION, generateAiBotTarget);
  }
  if (!generators.has(AI_GEAR_FORMATION)) {
    generators.set(AI_GEAR_FORMATION, generateAiGearTarget);
  }
  if (!generators.has(SHIELD_LOCK_FORMATION)) {
    generators.set(SHIELD_LOCK_FORMATION, generateShieldLockTarget);
  }
  if (!generators.has(VYUHA_LOGO_FORMATION)) {
    generators.set(VYUHA_LOGO_FORMATION, generateVyuhaLogoTarget);
  }
}

/**
 * Precompute every registered formation at `count` particles.
 * All shapes must share the same count for index-matched morphing.
 */
export function buildTargetCache(
  count: number,
): Record<string, FormationBuffers> {
  ensureDefaults();
  const cache: Record<string, FormationBuffers> = {};
  for (const [name, generate] of generators) {
    if (name === EARTH_FORMATION) {
      cache[name] = getEarthFormationBuffers(count);
    } else if (name === SECTION_BG_FORMATION) {
      cache[name] = getSectionBgFormationBuffers(count);
    } else if (name === SHOPPING_CART_FORMATION) {
      cache[name] = getShoppingCartFormationBuffers(count);
    } else if (name === AI_BOT_FORMATION) {
      cache[name] = getAiBotFormationBuffers(count);
    } else if (name === AI_GEAR_FORMATION) {
      cache[name] = getAiGearFormationBuffers(count);
    } else if (name === SHIELD_LOCK_FORMATION) {
      cache[name] = getShieldLockFormationBuffers(count);
    } else if (name === VYUHA_LOGO_FORMATION) {
      cache[name] = getVyuhaLogoFormationBuffers(count);
    } else {
      cache[name] = { positions: generate(count) };
    }
  }
  return cache;
}

export function getTargetPositions(
  cache: Record<string, FormationBuffers>,
  formation: ParticleFormation,
): Float32Array {
  ensureDefaults();
  if (!cache[formation]) {
    const count =
      (cache[EARTH_FORMATION]?.positions.length ??
        cache[PLACEHOLDER_FORMATION]?.positions.length ??
        0) / 3 || 4800;
    if (formation === EARTH_FORMATION) {
      cache[formation] = getEarthFormationBuffers(count);
    } else if (formation === SECTION_BG_FORMATION) {
      cache[formation] = getSectionBgFormationBuffers(count);
    } else if (formation === SHOPPING_CART_FORMATION) {
      cache[formation] = getShoppingCartFormationBuffers(count);
    } else if (formation === AI_BOT_FORMATION) {
      cache[formation] = getAiBotFormationBuffers(count);
    } else if (formation === AI_GEAR_FORMATION) {
      cache[formation] = getAiGearFormationBuffers(count);
    } else if (formation === SHIELD_LOCK_FORMATION) {
      cache[formation] = getShieldLockFormationBuffers(count);
    } else if (formation === VYUHA_LOGO_FORMATION) {
      cache[formation] = getVyuhaLogoFormationBuffers(count);
    } else if (formation === SCATTERED_BG_FORMATION) {
      cache[formation] = { positions: generateScatteredBgTarget(count) };
    }
  }
  return (
    cache[formation]?.positions ??
    cache[PLACEHOLDER_FORMATION]?.positions
  );
}

export function getFormationBuffers(
  cache: Record<string, FormationBuffers>,
  formation: ParticleFormation,
): FormationBuffers {
  ensureDefaults();
  return cache[formation] ?? cache[PLACEHOLDER_FORMATION];
}
