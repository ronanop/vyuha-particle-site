import bake from "./earthBake.json";

export const EARTH_LAYER = {
  SHELL: 0,
  WORLD: 1,
  SRI_LANKA: 2,
  INDIA: 3,
} as const;

/** Bake radius is ~2.4; sized to sit in the right half of the hero, not fill the viewport. */
export const EARTH_SCALE = 6;

type EarthBakeFile = {
  count: number;
  radius: number;
  lonOffsetDeg: number;
  positions: string;
  layers: string;
  sizes: string;
  opacities: string;
};

export type EarthPointLayer = {
  positions: Float32Array;
  color: string;
  size: number;
  opacity: number;
};

export type EarthLineLayer = {
  positions: Float32Array;
  color: string;
  opacity: number;
};

function base64ToFloat32(b64: string): Float32Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Float32Array(bytes.buffer);
}

function collectLayer(
  positions: Float32Array,
  layers: Float32Array,
  match: number | number[],
  scale: number,
): Float32Array {
  const wanted = new Set(Array.isArray(match) ? match : [match]);
  const out: number[] = [];
  const n = layers.length;
  for (let i = 0; i < n; i++) {
    if (!wanted.has(layers[i])) continue;
    out.push(
      positions[i * 3] * scale,
      positions[i * 3 + 1] * scale,
      positions[i * 3 + 2] * scale,
    );
  }
  return new Float32Array(out);
}

/** Deterministic stride subsample — keeps roughly `keep` fraction of points. */
function subsample(positions: Float32Array, keep: number): Float32Array {
  if (keep >= 1) return positions;
  const n = positions.length / 3;
  const step = 1 / keep;
  const out: number[] = [];
  for (let f = 0; f < n; f += step) {
    const i = Math.floor(f) * 3;
    out.push(positions[i], positions[i + 1], positions[i + 2]);
  }
  return new Float32Array(out);
}

/**
 * Connect each point to its nearest neighbors under a distance cap.
 * Uses a spatial hash grid so cost is ~O(n) instead of O(n^2) — this is what
 * keeps the one-time build from freezing low-end devices on load.
 */
function neighborEdges(
  positions: Float32Array,
  maxDist: number,
  maxNeighbors = 2,
): Float32Array {
  const n = positions.length / 3;
  if (n < 2) return new Float32Array(0);
  const maxDistSq = maxDist * maxDist;
  const cell = maxDist;
  const grid = new Map<string, number[]>();
  const cellKey = (x: number, y: number, z: number) =>
    `${Math.floor(x / cell)}|${Math.floor(y / cell)}|${Math.floor(z / cell)}`;

  for (let i = 0; i < n; i++) {
    const key = cellKey(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
    const bucket = grid.get(key);
    if (bucket) bucket.push(i);
    else grid.set(key, [i]);
  }

  const seen = new Set<string>();
  const edges: number[] = [];
  const near: Array<{ j: number; d: number }> = [];

  for (let i = 0; i < n; i++) {
    const ix = positions[i * 3];
    const iy = positions[i * 3 + 1];
    const iz = positions[i * 3 + 2];
    const gx = Math.floor(ix / cell);
    const gy = Math.floor(iy / cell);
    const gz = Math.floor(iz / cell);
    near.length = 0;

    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        for (let oz = -1; oz <= 1; oz++) {
          const bucket = grid.get(`${gx + ox}|${gy + oy}|${gz + oz}`);
          if (!bucket) continue;
          for (const j of bucket) {
            if (i === j) continue;
            const dx = ix - positions[j * 3];
            const dy = iy - positions[j * 3 + 1];
            const dz = iz - positions[j * 3 + 2];
            const d = dx * dx + dy * dy + dz * dz;
            if (d <= maxDistSq) near.push({ j, d });
          }
        }
      }
    }

    near.sort((a, b) => a.d - b.d);
    const take = Math.min(maxNeighbors, near.length);
    for (let k = 0; k < take; k++) {
      const hit = near[k];
      const a = i < hit.j ? i : hit.j;
      const b = i < hit.j ? hit.j : i;
      const key = `${a}:${b}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push(
        positions[a * 3],
        positions[a * 3 + 1],
        positions[a * 3 + 2],
        positions[b * 3],
        positions[b * 3 + 1],
        positions[b * 3 + 2],
      );
    }
  }

  return new Float32Array(edges);
}

export function createEarthCloud(options: {
  particleColor: string;
  particleSize: number;
  lineColor: string;
  lineOpacity: number;
  /** "low" thins the point cloud and drops the heaviest line layer for mobile/low-end. */
  tier?: "high" | "low";
}): { points: EarthPointLayer[]; lines: EarthLineLayer[] } {
  const data = bake as EarthBakeFile;
  const positions = base64ToFloat32(data.positions);
  const layers = base64ToFloat32(data.layers);
  const scale = EARTH_SCALE;
  const low = options.tier === "low";

  const shell = subsample(
    collectLayer(positions, layers, EARTH_LAYER.SHELL, scale),
    low ? 0.3 : 0.9,
  );
  const world = subsample(
    collectLayer(positions, layers, EARTH_LAYER.WORLD, scale),
    low ? 0.5 : 1,
  );
  const sriLanka = collectLayer(
    positions,
    layers,
    EARTH_LAYER.SRI_LANKA,
    scale,
  );
  const india = collectLayer(positions, layers, EARTH_LAYER.INDIA, scale);

  const indiaSize = options.particleSize * 1.45;
  const worldSize = options.particleSize * 0.9;
  const shellSize = options.particleSize * 0.62;

  const lines: EarthLineLayer[] = [];
  // World lines are the densest layer — skip them on low tier to save build
  // time and per-frame vertex count.
  if (!low) {
    lines.push({
      positions: neighborEdges(world, EARTH_SCALE * 0.076, 2),
      color: "#67e8f9",
      opacity: Math.min(0.32, options.lineOpacity + 0.14),
    });
  }
  lines.push({
    positions: neighborEdges(india, EARTH_SCALE * 0.097, low ? 2 : 3),
    color: options.lineColor,
    opacity: Math.min(0.42, options.lineOpacity + 0.2),
  });

  return {
    points: [
      {
        positions: shell,
        color: "#2dd4e8",
        size: shellSize,
        opacity: 0.5,
      },
      {
        positions: world,
        color: "#67e8f9",
        size: worldSize,
        opacity: 0.78,
      },
      {
        positions: sriLanka,
        color: options.lineColor,
        size: indiaSize * 0.85,
        opacity: 0.72,
      },
      {
        positions: india,
        color: options.particleColor,
        size: indiaSize,
        opacity: 0.92,
      },
    ],
    lines,
  };
}
