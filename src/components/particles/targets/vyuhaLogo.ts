/**
 * Vyuha logo formation — baked from crisp brand-mark PNG.
 * Rebake: npm run bake:vyuha
 */

import type { FormationBuffers, TargetGenerator } from "@/types/particles";
import { QUALITY_COUNTS } from "@/lib/particles/ParticlePerformance";
import highData from "@/lib/particles/vyuhaLogoData/high.json";
import mediumData from "@/lib/particles/vyuhaLogoData/medium.json";
import lowData from "@/lib/particles/vyuhaLogoData/low.json";

export const VYUHA_LOGO_FORMATION = "vyuha-logo";

interface VyuhaBakeFile {
  count: number;
  radius: number;
  positions: string;
  layers: string;
  sizes: string;
  opacities: string;
}

function base64ToFloat32(b64: string): Float32Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Float32Array(bytes.buffer);
}

function decodeBake(data: VyuhaBakeFile): FormationBuffers {
  return {
    positions: base64ToFloat32(data.positions),
    layers: base64ToFloat32(data.layers),
    sizes: base64ToFloat32(data.sizes),
    opacities: base64ToFloat32(data.opacities),
  };
}

const BAKES: Record<number, FormationBuffers> = {
  [QUALITY_COUNTS.HIGH.target]: decodeBake(highData as VyuhaBakeFile),
  [QUALITY_COUNTS.MEDIUM.target]: decodeBake(mediumData as VyuhaBakeFile),
  [QUALITY_COUNTS.LOW.target]: decodeBake(lowData as VyuhaBakeFile),
};

function nearestBake(count: number): FormationBuffers {
  const exact = BAKES[count];
  if (exact) return exact;
  const keys = Object.keys(BAKES).map(Number);
  keys.sort((a, b) => Math.abs(a - count) - Math.abs(b - count));
  return BAKES[keys[0]];
}

function fitCount(
  source: Float32Array,
  count: number,
  stride: 1 | 3,
): Float32Array {
  const srcCount = source.length / stride;
  const out = new Float32Array(count * stride);
  if (srcCount === count) {
    out.set(source);
    return out;
  }
  for (let i = 0; i < count; i++) {
    const src = Math.floor((i / count) * srcCount) % srcCount;
    for (let s = 0; s < stride; s++) {
      out[i * stride + s] = source[src * stride + s];
    }
  }
  return out;
}

export function getVyuhaLogoFormationBuffers(count: number): FormationBuffers {
  const bake = nearestBake(count);
  return {
    positions: fitCount(bake.positions, count, 3),
    layers: bake.layers ? fitCount(bake.layers, count, 1) : undefined,
    sizes: bake.sizes ? fitCount(bake.sizes, count, 1) : undefined,
    opacities: bake.opacities
      ? fitCount(bake.opacities, count, 1)
      : undefined,
  };
}

export const generateVyuhaLogoTarget: TargetGenerator = (count) =>
  getVyuhaLogoFormationBuffers(count).positions;
