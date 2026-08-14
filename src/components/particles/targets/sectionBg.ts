import { hash2 } from "@/lib/particles/ParticleNoise";
import type { FormationBuffers } from "@/types/particles";

export const SECTION_BG_FORMATION = "section-bg";

/**
 * Soft full-bleed particle field for the Command section background.
 * Dense enough to read behind centered copy without overpowering it.
 */
export function generateSectionBgTarget(count: number): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const u = hash2(i, 3.7);
    const v = hash2(i, 9.1);
    const w = hash2(i, 14.3);
    const band = hash2(i, 21.9);

    // Cover the full hero/command frame; keep a soft vignette toward edges
    let x = (u - 0.5) * 22;
    let y = (v - 0.5) * 13;
    if (band > 0.7) {
      const side = hash2(i, 33.1);
      if (side < 0.25) x = -10 - u * 2.5;
      else if (side < 0.5) x = 10 + u * 2.5;
      else if (side < 0.75) y = -6.5 - v * 2;
      else y = 6.5 + v * 2;
    }

    const z = (w - 0.5) * 4.5;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
}

export function getSectionBgFormationBuffers(count: number): FormationBuffers {
  const positions = generateSectionBgTarget(count);
  const sizes = new Float32Array(count);
  const opacities = new Float32Array(count);
  const layers = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Brighter / larger than before so the field actually reads on black
    sizes[i] = 0.75 + hash2(i, 41.2) * 0.85;
    opacities[i] = 0.55 + hash2(i, 52.8) * 0.4;
    // Layer 1+ stays visible under earth-mode coloring (layer 0 = alphaScale 0.1 → flash-out)
    layers[i] = hash2(i, 63.4) > 0.72 ? 2 : 1;
  }

  return { positions, sizes, opacities, layers };
}
