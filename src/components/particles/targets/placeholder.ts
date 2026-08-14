import { hash2 } from "@/lib/particles/ParticleNoise";
import { normalizeToRadius } from "@/lib/particles/normalizeToRadius";

/**
 * Temporary stand-in formation so the engine can run before real shapes arrive.
 * Soft ellipsoid cloud centered at origin (slot offset moves the group).
 */
export function generatePlaceholderTarget(count: number): Float32Array {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const u = hash2(i, 1.7);
    const v = hash2(i, 3.1);
    const w = hash2(i, 5.9);

    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = Math.cbrt(w) * 0.85 + 0.15;

    const sinPhi = Math.sin(phi);
    positions[i * 3] = r * sinPhi * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * sinPhi * Math.sin(theta);
  }

  return normalizeToRadius(positions);
}
