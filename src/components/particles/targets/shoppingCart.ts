import { hash2 } from "@/lib/particles/ParticleNoise";
import {
  DEFAULT_FORMATION_RADIUS,
  normalizeToRadius,
  sortPointsSpatially,
} from "@/lib/particles/normalizeToRadius";
import type { FormationBuffers } from "@/types/particles";

export const SHOPPING_CART_FORMATION = "shopping-cart";

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

/** Sample along a polyline (open or closed). */
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

/** Filled disk (solid wheel). */
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

/** Ring outline. */
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
    const rr = r * (0.96 + hash2(i + seed, 1.9) * 0.08);
    const x = cx + Math.cos(ang) * rr;
    const y = cy + Math.sin(ang) * rr;
    const z = (hash2(i + seed, 3.2) - 0.5) * 0.1;
    pushPoint(out, x, y, z, layer, size, opacity);
  }
}

/**
 * Procedural shopping-cart icon matching the App Store glyph:
 * trapezoid basket, handle+frame stroke, base rail, two wheels.
 * Layer 2 = soft fill, 3 = bright outline (reads with earth-mode coloring).
 */
export function generateShoppingCartTarget(count: number): Float32Array {
  return getShoppingCartFormationBuffers(count).positions;
}

export function getShoppingCartFormationBuffers(count: number): FormationBuffers {
  // Design space roughly [-1.2, 1.2] x [-1.0, 1.1] before normalize
  const basket: Pt[] = [
    { x: -0.55, y: 0.55 },
    { x: 0.85, y: 0.55 },
    { x: 0.62, y: -0.15 },
    { x: -0.28, y: -0.15 },
  ];

  // Handle + angled frame + base rail (continuous stroke)
  const frame: Pt[] = [
    { x: -0.95, y: 0.95 },
    { x: -0.55, y: 0.95 },
    { x: -0.42, y: 0.55 },
    { x: -0.28, y: -0.15 },
    { x: -0.55, y: -0.42 },
    { x: 0.95, y: -0.42 },
  ];

  const wheelR = 0.22;
  const wheelY = -0.72;
  const wheelL = { x: -0.15, y: wheelY };
  const wheelRgt = { x: 0.55, y: wheelY };

  const packed: number[] = [];

  // Budget shares
  const outlineN = Math.round(count * 0.55);
  const fillN = count - outlineN;
  const basketOutline = Math.round(outlineN * 0.38);
  const frameOutline = Math.round(outlineN * 0.34);
  const wheelOutline = Math.round(outlineN * 0.28);
  const wheelOutlineEach = Math.floor(wheelOutline / 2);

  // layer 3 = bright cyan outline (same path as India highlight)
  samplePolyline(
    packed,
    basket,
    basketOutline,
    true,
    3,
    1.15,
    1,
    11,
  );
  samplePolyline(packed, frame, frameOutline, false, 3, 1.2, 1, 29);
  sampleRing(
    packed,
    wheelL.x,
    wheelL.y,
    wheelR,
    wheelOutlineEach,
    3,
    1.1,
    1,
    41,
  );
  sampleRing(
    packed,
    wheelRgt.x,
    wheelRgt.y,
    wheelR,
    wheelOutline - wheelOutlineEach,
    3,
    1.1,
    1,
    53,
  );

  // Basket fill — layer 2 (readable secondary)
  const basketFill = Math.round(fillN * 0.55);
  for (let i = 0; i < basketFill; i++) {
    const u = hash2(i, 7.1);
    const v = hash2(i, 9.3);
    const topY = 0.55;
    const botY = -0.15;
    const y = lerp(botY, topY, v);
    const t = (y - botY) / (topY - botY);
    const left = lerp(-0.28, -0.55, t);
    const right = lerp(0.62, 0.85, t);
    const x = lerp(left, right, u);
    const z = (hash2(i, 12.5) - 0.5) * 0.14;
    pushPoint(packed, x, y, z, 2, 0.75, 0.7);
  }

  const wheelFillEach = Math.floor((fillN - basketFill) / 2);
  sampleDisk(
    packed,
    wheelL.x,
    wheelL.y,
    wheelR * 0.85,
    wheelFillEach,
    2,
    0.9,
    0.85,
    67,
  );
  sampleDisk(
    packed,
    wheelRgt.x,
    wheelRgt.y,
    wheelR * 0.85,
    fillN - basketFill - wheelFillEach,
    2,
    0.9,
    0.85,
    79,
  );

  // Trim / pad to exact count
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
