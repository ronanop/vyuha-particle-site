/**
 * Next-phase entry points for shape work.
 * 1. Create a generator in targets/<name>.ts
 * 2. registerTarget("name", generateNameTarget)
 * 3. setMorphSegments([...]) keyed to scroll progress
 *
 * earth-india is registered by default (baked borders). Morph timeline is NOT
 * switched to it yet — call setMorphSegments when ready to replace placeholder / core-orb.
 */

export { registerTarget, buildTargetCache } from "@/lib/particles/ParticleTarget";
export { setMorphSegments, getMorphSegments, holdFormation } from "@/lib/particles/ParticleMorph";
export { PLACEHOLDER_FORMATION } from "@/types/particles";
export { EARTH_FORMATION } from "@/components/particles/targets/earth";
export { SCATTERED_BG_FORMATION } from "@/components/particles/targets/scatteredBg";
export { SECTION_BG_FORMATION } from "@/components/particles/targets/sectionBg";
export { SHOPPING_CART_FORMATION } from "@/components/particles/targets/shoppingCart";
export { AI_BOT_FORMATION } from "@/components/particles/targets/aiBot";
export { AI_GEAR_FORMATION } from "@/components/particles/targets/aiGear";
export { SHIELD_LOCK_FORMATION } from "@/components/particles/targets/shieldLock";
export { VYUHA_LOGO_FORMATION } from "@/components/particles/targets/vyuhaLogo";
export type {
  MorphSegment,
  ParticleFormation,
  TargetGenerator,
  FormationBuffers,
} from "@/types/particles";
