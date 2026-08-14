/**
 * Shared formation helpers: normalize bounds + spatial index sort for morph correspondence.
 */

const TARGET_RADIUS_MIN = 2.2;
const TARGET_RADIUS_MAX = 2.6;
export const DEFAULT_FORMATION_RADIUS = 2.4;

/** Scale xyz so max distance from origin lands in [2.2, 2.6] (default 2.4). */
export function normalizeToRadius(
  positions: Float32Array,
  targetRadius: number = DEFAULT_FORMATION_RADIUS,
): Float32Array {
  const r = Math.min(
    TARGET_RADIUS_MAX,
    Math.max(TARGET_RADIUS_MIN, targetRadius),
  );
  let maxLen = 0;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    const len = Math.hypot(x, y, z);
    if (len > maxLen) maxLen = len;
  }
  if (maxLen < 1e-8) return positions;
  const scale = r / maxLen;
  for (let i = 0; i < positions.length; i++) {
    positions[i] *= scale;
  }
  return positions;
}

/** Spherical key for stable index correspondence across formations. */
export function spatialSortKey(x: number, y: number, z: number): number {
  const len = Math.hypot(x, y, z) || 1;
  const nx = x / len;
  const ny = y / len;
  const nz = z / len;
  const theta = Math.atan2(nz, nx); // -PI..PI
  const phi = Math.acos(Math.min(1, Math.max(-1, ny))); // 0..PI
  // Interleave into a sortable scalar (phi primary bands, then theta)
  return phi * 1000 + (theta + Math.PI);
}

/**
 * Reorder interleaved xyz (and optional parallel float attrs) by spatial key
 * so morphs between shapes keep local coherence.
 * Keys are precomputed once (decorate–sort–undecorate) — computing them in the
 * sort comparator costs O(n log n) transcendental evals and stalls low-end
 * CPUs during target-cache builds.
 */
export function sortPointsSpatially(
  positions: Float32Array,
  attrs: Float32Array[] = [],
): void {
  const count = positions.length / 3;
  const keys = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    keys[i] = spatialSortKey(
      positions[i * 3],
      positions[i * 3 + 1],
      positions[i * 3 + 2],
    );
  }
  const order = new Uint32Array(count);
  for (let i = 0; i < count; i++) order[i] = i;
  order.sort((a, b) => keys[a] - keys[b]);

  const posOut = new Float32Array(positions.length);
  const attrOuts = attrs.map((a) => new Float32Array(a.length));
  for (let i = 0; i < count; i++) {
    const src = order[i];
    posOut[i * 3] = positions[src * 3];
    posOut[i * 3 + 1] = positions[src * 3 + 1];
    posOut[i * 3 + 2] = positions[src * 3 + 2];
    for (let a = 0; a < attrs.length; a++) {
      attrOuts[a][i] = attrs[a][src];
    }
  }
  positions.set(posOut);
  for (let a = 0; a < attrs.length; a++) {
    attrs[a].set(attrOuts[a]);
  }
}
