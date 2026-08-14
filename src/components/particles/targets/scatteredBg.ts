import { hash2 } from "@/lib/particles/ParticleNoise";

export const SCATTERED_BG_FORMATION = "scattered-bg";

/**
 * Full-background scatter field (wide XY coverage for the hero canvas).
 * Not radius-normalized — particles should feel like they drift in from everywhere.
 */
export function generateScatteredBgTarget(count: number): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const u = hash2(i, 11.3);
    const v = hash2(i, 27.1);
    const w = hash2(i, 43.7);
    const edge = hash2(i, 61.9);

    // Bias some particles toward screen edges so the field feels full-bleed
    let x = (u - 0.5) * 24;
    let y = (v - 0.5) * 15;
    if (edge > 0.72) {
      const side = hash2(i, 77.2);
      if (side < 0.25) x = -11 - u * 4;
      else if (side < 0.5) x = 11 + u * 4;
      else if (side < 0.75) y = -7 - v * 3;
      else y = 7 + v * 3;
    }

    const z = (w - 0.5) * 8;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
}
