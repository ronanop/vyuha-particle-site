import { hash2 } from "@/lib/particles/ParticleNoise";
import {
  DEFAULT_FORMATION_RADIUS,
  normalizeToRadius,
  sortPointsSpatially,
} from "@/lib/particles/normalizeToRadius";
import type { FormationBuffers } from "@/types/particles";

export const AI_GEAR_FORMATION = "ai-gear";

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

function sampleCapsule(
  out: number[],
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  count: number,
  layer: number,
  size: number,
  opacity: number,
  seed: number,
) {
  samplePolyline(
    out,
    [
      { x: x0, y: y0 },
      { x: x1, y: y1 },
    ],
    count,
    false,
    layer,
    size,
    opacity,
    seed,
  );
}

/** 10-tooth square gear outline (outer silhouette). */
function gearOutline(teeth = 10, rInner = 0.72, rOuter = 1.0, toothW = 0.38): Pt[] {
  const pts: Pt[] = [];
  const step = (Math.PI * 2) / teeth;
  const halfTooth = (toothW * step) * 0.5;

  for (let i = 0; i < teeth; i++) {
    const a0 = i * step - Math.PI * 0.5;
    const aMid = a0 + step * 0.5;
    const a1 = a0 + step;

    // Valley on inner radius between teeth
    pts.push({
      x: Math.cos(a0 + halfTooth) * rInner,
      y: Math.sin(a0 + halfTooth) * rInner,
    });
    // Rise to tooth
    pts.push({
      x: Math.cos(aMid - halfTooth) * rOuter,
      y: Math.sin(aMid - halfTooth) * rOuter,
    });
    pts.push({
      x: Math.cos(aMid + halfTooth) * rOuter,
      y: Math.sin(aMid + halfTooth) * rOuter,
    });
    pts.push({
      x: Math.cos(a1 - halfTooth) * rInner,
      y: Math.sin(a1 - halfTooth) * rInner,
    });
  }
  return pts;
}

/**
 * Procedural gear + "AI" icon for AI Tools:
 * 10 square teeth, inner ring, chevron A + pill I.
 * Layer 2 = soft fill, 3 = bright outline.
 */
export function generateAiGearTarget(count: number): Float32Array {
  return getAiGearFormationBuffers(count).positions;
}

export function getAiGearFormationBuffers(count: number): FormationBuffers {
  const packed: number[] = [];

  const outlineN = Math.round(count * 0.7);
  const fillN = count - outlineN;

  const gearN = Math.round(outlineN * 0.55);
  const ringN = Math.round(outlineN * 0.18);
  const letterN = outlineN - gearN - ringN;
  const aN = Math.round(letterN * 0.62);
  const iN = letterN - aN;

  // Outer gear silhouette
  const gear = gearOutline(10, 0.7, 1.02, 0.42);
  samplePolyline(packed, gear, gearN, true, 3, 1.2, 1, 11);

  // Inner ring (reads the hollow center)
  sampleRing(packed, 0, 0, 0.58, ringN, 3, 1.05, 1, 19);

  // Letter A — inverted V / chevron (no crossbar), slightly left
  const aLeft = [
    { x: -0.38, y: -0.28 },
    { x: -0.18, y: 0.32 },
  ];
  const aRight = [
    { x: -0.18, y: 0.32 },
    { x: 0.02, y: -0.28 },
  ];
  const aHalf = Math.floor(aN / 2);
  samplePolyline(packed, aLeft, aHalf, false, 3, 1.25, 1, 29);
  samplePolyline(packed, aRight, aN - aHalf, false, 3, 1.25, 1, 31);

  // Letter I — vertical capsule on the right
  sampleCapsule(packed, 0.28, -0.28, 0.28, 0.32, iN, 3, 1.25, 1, 37);

  // Soft fills along strokes / gear band
  const gearFill = Math.round(fillN * 0.45);
  for (let i = 0; i < gearFill; i++) {
    const t = hash2(i, 2.1);
    const ang = t * Math.PI * 2;
    const rr = 0.74 + hash2(i, 3.4) * 0.22;
    // Prefer tooth regions slightly
    const toothPhase = ((ang + Math.PI * 0.5) % ((Math.PI * 2) / 10)) / ((Math.PI * 2) / 10);
    const onTooth = toothPhase > 0.28 && toothPhase < 0.72;
    const r = onTooth ? Math.max(rr, 0.86) : Math.min(rr, 0.82);
    const x = Math.cos(ang) * r;
    const y = Math.sin(ang) * r;
    const z = (hash2(i, 4.5) - 0.5) * 0.1;
    pushPoint(packed, x, y, z, 2, 0.7, 0.5);
  }

  const letterFill = fillN - gearFill;
  for (let i = 0; i < letterFill; i++) {
    const u = hash2(i, 6.2);
    const v = hash2(i, 7.3);
    if (u < 0.62) {
      // Along A strokes
      const side = hash2(i, 8.1) < 0.5;
      const t = v;
      const x = side ? lerp(-0.38, -0.18, t) : lerp(-0.18, 0.02, t);
      const y = side ? lerp(-0.28, 0.32, t) : lerp(0.32, -0.28, t);
      const n = (hash2(i, 9.2) - 0.5) * 0.06;
      pushPoint(packed, x + n, y, (hash2(i, 10.1) - 0.5) * 0.08, 2, 0.85, 0.75);
    } else {
      const t = v;
      const x = 0.28 + (hash2(i, 11.2) - 0.5) * 0.05;
      const y = lerp(-0.28, 0.32, t);
      pushPoint(packed, x, y, (hash2(i, 12.3) - 0.5) * 0.08, 2, 0.85, 0.75);
    }
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
