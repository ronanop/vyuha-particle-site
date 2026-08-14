import { hash2 } from "@/lib/particles/ParticleNoise";
import {
  DEFAULT_FORMATION_RADIUS,
  normalizeToRadius,
  sortPointsSpatially,
} from "@/lib/particles/normalizeToRadius";
import type { FormationBuffers } from "@/types/particles";

export const SHIELD_LOCK_FORMATION = "shield-lock";

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
    pushPoint(
      out,
      cx + Math.cos(ang) * rr,
      cy + Math.sin(ang) * rr,
      (hash2(i + seed, 3.2) - 0.5) * 0.1,
      layer,
      size,
      opacity,
    );
  }
}

/** Classic heater shield outline (point down, slight top notch). */
function shieldOutline(scale = 1): Pt[] {
  const s = scale;
  return [
    { x: -0.72 * s, y: 0.72 * s },
    { x: -0.28 * s, y: 0.78 * s },
    { x: 0, y: 0.68 * s },
    { x: 0.28 * s, y: 0.78 * s },
    { x: 0.72 * s, y: 0.72 * s },
    { x: 0.78 * s, y: 0.2 * s },
    { x: 0.55 * s, y: -0.35 * s },
    { x: 0.22 * s, y: -0.72 * s },
    { x: 0, y: -0.95 * s },
    { x: -0.22 * s, y: -0.72 * s },
    { x: -0.55 * s, y: -0.35 * s },
    { x: -0.78 * s, y: 0.2 * s },
  ];
}

/** Point-in-shield test via ray cast on polygon. */
function insideShield(x: number, y: number, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const hit =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-9) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}

function inLockBody(x: number, y: number): boolean {
  // Rounded rect body
  const cx = 0;
  const cy = -0.02;
  const hw = 0.28;
  const hh = 0.2;
  const r = 0.08;
  const dx = Math.abs(x - cx) - (hw - r);
  const dy = Math.abs(y - cy) - (hh - r);
  const ox = Math.max(dx, 0);
  const oy = Math.max(dy, 0);
  return Math.hypot(ox, oy) + Math.min(Math.max(dx, dy), 0) <= r;
}

function inShackle(x: number, y: number): boolean {
  // U-shaped arc above lock body
  const cx = 0;
  const cy = 0.22;
  const rOuter = 0.22;
  const rInner = 0.12;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.hypot(dx, dy);
  if (dy < -0.02) return false; // only upper half + slight overlap
  return dist <= rOuter && dist >= rInner;
}

function inKeyhole(x: number, y: number): boolean {
  const dx = x;
  const dy = y + 0.02;
  const inCircle = Math.hypot(dx, dy - 0.04) < 0.055;
  const inStem =
    Math.abs(dx) < 0.035 && dy > -0.12 && dy < 0.02;
  return inCircle || inStem;
}

/**
 * Shield + padlock for Data Perimeter:
 * outer/inner shield borders, solid fill, lock body/shackle, keyhole cutout.
 * Layer 2 = soft fill, 3 = bright outline / lock.
 */
export function generateShieldLockTarget(count: number): Float32Array {
  return getShieldLockFormationBuffers(count).positions;
}

export function getShieldLockFormationBuffers(count: number): FormationBuffers {
  const packed: number[] = [];
  const outer = shieldOutline(1);
  const inner = shieldOutline(0.82);

  const outlineN = Math.round(count * 0.48);
  const fillN = count - outlineN;

  const outerN = Math.round(outlineN * 0.38);
  const innerN = Math.round(outlineN * 0.22);
  const lockOutlineN = outlineN - outerN - innerN;
  const shackleN = Math.round(lockOutlineN * 0.4);
  const bodyN = lockOutlineN - shackleN;

  samplePolyline(packed, outer, outerN, true, 3, 1.25, 1, 11);
  samplePolyline(packed, inner, innerN, true, 3, 1.05, 1, 17);

  // Lock body rounded-rect outline
  const body: Pt[] = [
    { x: -0.28, y: 0.16 },
    { x: 0.28, y: 0.16 },
    { x: 0.28, y: -0.2 },
    { x: -0.28, y: -0.2 },
  ];
  samplePolyline(packed, body, Math.floor(bodyN * 0.7), true, 3, 1.15, 1, 23);

  // Shackle arc (upper semicircle polyline)
  const shacklePts: Pt[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const ang = Math.PI * (1 - t); // π → 0 (left to right over top)
    shacklePts.push({
      x: Math.cos(ang) * 0.18,
      y: 0.18 + Math.sin(ang) * 0.22,
    });
  }
  samplePolyline(packed, shacklePts, shackleN, false, 3, 1.2, 1, 29);

  // Extra lock-body density (solid white lock look)
  for (let i = 0; i < Math.ceil(bodyN * 0.3); i++) {
    const u = hash2(i, 4.1);
    const v = hash2(i, 5.2);
    const x = lerp(-0.24, 0.24, u);
    const y = lerp(-0.16, 0.12, v);
    if (!inLockBody(x, y) || inKeyhole(x, y)) continue;
    pushPoint(
      packed,
      x,
      y,
      (hash2(i, 6.3) - 0.5) * 0.1,
      3,
      1.05,
      0.95,
    );
  }

  // Keyhole rim (reads as cutout edge)
  sampleRing(packed, 0, 0.02, 0.055, 18, 2, 0.7, 0.55, 41);

  // Shield fill (avoid lock silhouette so padlock reads clearly)
  let placed = 0;
  let guard = 0;
  while (placed < fillN && guard < fillN * 8) {
    guard++;
    const i = placed + guard;
    const u = hash2(i, 7.1);
    const v = hash2(i, 8.4);
    const x = lerp(-0.85, 0.85, u);
    const y = lerp(-1.0, 0.85, v);
    if (!insideShield(x, y, outer)) continue;
    if (insideShield(x, y, shieldOutline(0.9)) === false && hash2(i, 1.1) > 0.35) {
      // slight bias toward interior
    }
    const onLock = inLockBody(x, y) || inShackle(x, y);
    if (onLock) {
      if (inKeyhole(x, y)) continue;
      // Lock fill — brighter
      pushPoint(
        packed,
        x,
        y,
        (hash2(i, 9.5) - 0.5) * 0.1,
        3,
        0.95,
        0.9,
      );
    } else {
      // Shield field
      const nearBorder = !insideShield(x, y, inner);
      pushPoint(
        packed,
        x,
        y,
        (hash2(i, 10.2) - 0.5) * 0.12,
        nearBorder ? 3 : 2,
        nearBorder ? 0.85 : 0.65,
        nearBorder ? 0.75 : 0.5,
      );
    }
    placed++;
  }

  // Top-up if underfilled
  while (Math.floor(packed.length / 6) < count) {
    const i = Math.floor(packed.length / 6);
    const u = hash2(i, 12.1);
    const v = hash2(i, 13.2);
    const x = lerp(-0.5, 0.5, u);
    const y = lerp(-0.5, 0.5, v);
    if (!insideShield(x, y, outer) || inKeyhole(x, y)) {
      pushPoint(packed, 0, 0.2, 0, 2, 0.6, 0.4);
      continue;
    }
    pushPoint(
      packed,
      x,
      y,
      (hash2(i, 14.3) - 0.5) * 0.1,
      2,
      0.65,
      0.45,
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
