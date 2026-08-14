import { hash2 } from "@/lib/particles/ParticleNoise";
import {
  DEFAULT_FORMATION_RADIUS,
  normalizeToRadius,
  sortPointsSpatially,
} from "@/lib/particles/normalizeToRadius";
import type { FormationBuffers } from "@/types/particles";

export const AI_BOT_FORMATION = "ai-bot";

type Pt = { x: number; y: number };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function pushPoint(
  out: number[],
  x: number,
  y: number,
  z: number,
  layer: number,
  size: number,
  opacity: number,
) {
  out.push(x, y, z, layer, size, opacity);
}

function samplePolyline(
  out: number[],
  pts: Pt[],
  count: number,
  closed: boolean,
  layer: number,
  size: number,
  opacity: number,
  seed: number,
) {
  if (pts.length < 2 || count <= 0) return;
  const segs = closed ? pts.length : pts.length - 1;
  const lengths: number[] = [];
  let total = 0;
  for (let i = 0; i < segs; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    lengths.push(len);
    total += len;
  }
  if (total < 1e-8) return;

  for (let i = 0; i < count; i++) {
    const u = (i + hash2(i + seed, 0.17)) / count;
    let d = u * total;
    let si = 0;
    while (si < lengths.length - 1 && d > lengths[si]) {
      d -= lengths[si];
      si++;
    }
    const a = pts[si];
    const b = pts[(si + 1) % pts.length];
    const t = lengths[si] > 1e-8 ? d / lengths[si] : 0;
    const x = lerp(a.x, b.x, t);
    const y = lerp(a.y, b.y, t);
    const z = (hash2(i + seed, 2.3) - 0.5) * 0.12;
    pushPoint(out, x, y, z, layer, size, opacity);
  }
}

function sampleRing(
  out: number[],
  cx: number,
  cy: number,
  r: number,
  count: number,
  layer: number,
  size: number,
  opacity: number,
  seed: number,
) {
  for (let i = 0; i < count; i++) {
    const t = (i + hash2(i + seed, 0.4)) / count;
    const ang = t * Math.PI * 2;
    const rr = r * (0.97 + hash2(i + seed, 1.9) * 0.06);
    const x = cx + Math.cos(ang) * rr;
    const y = cy + Math.sin(ang) * rr;
    const z = (hash2(i + seed, 3.2) - 0.5) * 0.1;
    pushPoint(out, x, y, z, layer, size, opacity);
  }
}

function sampleDisk(
  out: number[],
  cx: number,
  cy: number,
  r: number,
  count: number,
  layer: number,
  size: number,
  opacity: number,
  seed: number,
) {
  for (let i = 0; i < count; i++) {
    const u = hash2(i + seed, 1.1);
    const v = hash2(i + seed, 2.7);
    const ang = u * Math.PI * 2;
    const rad = Math.sqrt(v) * r;
    const x = cx + Math.cos(ang) * rad;
    const y = cy + Math.sin(ang) * rad;
    const z = (hash2(i + seed, 4.1) - 0.5) * 0.1;
    pushPoint(out, x, y, z, layer, size, opacity);
  }
}

/** Rounded-rect outline (axis-aligned), sampled as a closed polyline. */
function roundedRectOutline(
  cx: number,
  cy: number,
  w: number,
  h: number,
  r: number,
  cornerSteps = 5,
): Pt[] {
  const hw = w * 0.5;
  const hh = h * 0.5;
  const rr = Math.min(r, hw, hh);
  const pts: Pt[] = [];
  const corners: Array<[number, number, number, number]> = [
    [cx + hw - rr, cy + hh - rr, 0, Math.PI * 0.5],
    [cx - hw + rr, cy + hh - rr, Math.PI * 0.5, Math.PI],
    [cx - hw + rr, cy - hh + rr, Math.PI, Math.PI * 1.5],
    [cx + hw - rr, cy - hh + rr, Math.PI * 1.5, Math.PI * 2],
  ];
  for (const [ox, oy, a0, a1] of corners) {
    for (let i = 0; i <= cornerSteps; i++) {
      const a = lerp(a0, a1, i / cornerSteps);
      pts.push({ x: ox + Math.cos(a) * rr, y: oy + Math.sin(a) * rr });
    }
  }
  return pts;
}

/**
 * Procedural AI-bot icon for Agents:
 * thick outer ring, rounded head, eyes, antenna, side tabs.
 * Layer 2 = soft fill, 3 = bright outline.
 */
export function generateAiBotTarget(count: number): Float32Array {
  return getAiBotFormationBuffers(count).positions;
}

export function getAiBotFormationBuffers(count: number): FormationBuffers {
  const packed: number[] = [];

  const outlineN = Math.round(count * 0.62);
  const fillN = count - outlineN;

  const ringN = Math.round(outlineN * 0.42);
  const headN = Math.round(outlineN * 0.28);
  const earN = Math.round(outlineN * 0.12);
  const antennaN = Math.round(outlineN * 0.08);
  const eyeOutlineN = outlineN - ringN - headN - earN - antennaN;
  const eyeOutlineEach = Math.floor(eyeOutlineN / 2);

  // Outer ring (thick → double stroke)
  sampleRing(packed, 0, 0.02, 1.02, Math.floor(ringN * 0.55), 3, 1.2, 1, 11);
  sampleRing(packed, 0, 0.02, 0.92, ringN - Math.floor(ringN * 0.55), 3, 1.05, 1, 17);

  // Head capsule / rounded rect
  const head = roundedRectOutline(0, 0.02, 1.05, 0.72, 0.28, 6);
  samplePolyline(packed, head, headN, true, 3, 1.15, 1, 23);

  // Side tabs (ears)
  const earL = roundedRectOutline(-0.68, 0.02, 0.22, 0.28, 0.08, 4);
  const earR = roundedRectOutline(0.68, 0.02, 0.22, 0.28, 0.08, 4);
  const earEach = Math.floor(earN / 2);
  samplePolyline(packed, earL, earEach, true, 3, 1.05, 1, 31);
  samplePolyline(packed, earR, earN - earEach, true, 3, 1.05, 1, 37);

  // Antenna stem + tip outline
  samplePolyline(
    packed,
    [
      { x: 0, y: 0.38 },
      { x: 0, y: 0.68 },
    ],
    Math.max(4, antennaN - Math.floor(antennaN * 0.45)),
    false,
    3,
    1.1,
    1,
    41,
  );
  sampleRing(
    packed,
    0,
    0.78,
    0.09,
    Math.floor(antennaN * 0.45),
    3,
    1.15,
    1,
    47,
  );

  // Eye rings
  sampleRing(packed, -0.22, 0.06, 0.1, eyeOutlineEach, 3, 1.05, 1, 53);
  sampleRing(
    packed,
    0.22,
    0.06,
    0.1,
    eyeOutlineN - eyeOutlineEach,
    3,
    1.05,
    1,
    59,
  );

  // Fills — eyes, antenna tip, soft head interior, ring soft band
  const eyeFill = Math.round(fillN * 0.28);
  const eyeEach = Math.floor(eyeFill / 2);
  sampleDisk(packed, -0.22, 0.06, 0.085, eyeEach, 2, 0.95, 0.9, 67);
  sampleDisk(
    packed,
    0.22,
    0.06,
    0.085,
    eyeFill - eyeEach,
    2,
    0.95,
    0.9,
    71,
  );

  const tipFill = Math.round(fillN * 0.08);
  sampleDisk(packed, 0, 0.78, 0.075, tipFill, 2, 0.95, 0.9, 79);

  const headFill = Math.round(fillN * 0.4);
  for (let i = 0; i < headFill; i++) {
    const u = hash2(i, 8.1);
    const v = hash2(i, 9.4);
    // Approximate capsule interior
    const x = lerp(-0.42, 0.42, u);
    const y = lerp(-0.22, 0.28, v);
    const edgeX = Math.abs(x) / 0.42;
    const edgeY = Math.abs(y - 0.03) / 0.25;
    if (edgeX * edgeX + edgeY * edgeY > 1.05 && hash2(i, 3.3) > 0.35) {
      // soft reject near corners → denser core
      continue;
    }
    const z = (hash2(i, 12.2) - 0.5) * 0.12;
    pushPoint(packed, x, y, z, 2, 0.7, 0.55);
  }

  const ringFill = fillN - eyeFill - tipFill - headFill;
  for (let i = 0; i < Math.max(0, ringFill); i++) {
    const t = hash2(i, 1.7);
    const ang = t * Math.PI * 2;
    const rr = 0.94 + hash2(i, 2.8) * 0.1;
    const x = Math.cos(ang) * rr;
    const y = 0.02 + Math.sin(ang) * rr;
    const z = (hash2(i, 4.4) - 0.5) * 0.1;
    pushPoint(packed, x, y, z, 2, 0.65, 0.45);
  }

  // Top up if soft-rejects under-filled head
  while (Math.floor(packed.length / 6) < count) {
    const i = Math.floor(packed.length / 6);
    const u = hash2(i, 14.1);
    const v = hash2(i, 15.2);
    pushPoint(
      packed,
      lerp(-0.35, 0.35, u),
      lerp(-0.15, 0.22, v),
      (hash2(i, 16.3) - 0.5) * 0.1,
      2,
      0.68,
      0.5,
    );
  }

  const n = Math.floor(packed.length / 6);
  const positions = new Float32Array(count * 3);
  const layers = new Float32Array(count);
  const sizes = new Float32Array(count);
  const opacities = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const src = i < n ? i : i % Math.max(1, n);
    positions[i * 3] = packed[src * 6];
    positions[i * 3 + 1] = packed[src * 6 + 1];
    positions[i * 3 + 2] = packed[src * 6 + 2];
    layers[i] = packed[src * 6 + 3];
    sizes[i] = packed[src * 6 + 4];
    opacities[i] = packed[src * 6 + 5];
  }

  normalizeToRadius(positions, DEFAULT_FORMATION_RADIUS * 1.05);
  sortPointsSpatially(positions, [layers, sizes, opacities]);

  return { positions, layers, sizes, opacities };
}
