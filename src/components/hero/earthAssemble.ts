import * as THREE from "three";

/**
 * Load-time "particles fly in from the background and form the earth" animation.
 *
 * Performance model: every value that does not change frame-to-frame (scatter
 * origin, per-vertex delay/span, and the start->target delta) is computed once
 * when the layer is created. The per-frame hot loop then does only a clamp,
 * a multiply-only ease, and three lerps per vertex — no Math.sin / Math.pow —
 * so it stays smooth on low-end phones.
 */

export type AssembleLayer = {
  mesh: THREE.Points | THREE.LineSegments;
  positions: Float32Array; // live buffer (mutated in place each frame)
  starts: Float32Array; // scatter origin
  delta: Float32Array; // target - start, precomputed
  delay: Float32Array; // per-vertex start offset in [0,1)
  invSpan: Float32Array; // 1 / per-vertex duration
  targetOpacity: number;
  fadeDelay: number; // opacity fade start in [0,1)
  invFadeSpan: number;
  kind: "points" | "lines";
  animatePosition: boolean; // false = static geometry, only opacity animates
};

export const EARTH_ASSEMBLE_MS = 3600;
export const LINE_ASSEMBLE_DELAY = 0.4;

function hash(i: number): number {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Smootherstep — gentle ease-in-out using only multiplies (no pow/sin). */
function smoother(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** Wide field behind the globe — particles drift in from the depth of the hero. */
export type AssembleField = {
  halfW: number;
  halfH: number;
  originX: number;
};

function createScatterStarts(
  targets: Float32Array,
  field?: AssembleField,
): Float32Array {
  const starts = new Float32Array(targets.length);
  const count = targets.length / 3;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const tx = targets[i3];
    const ty = targets[i3 + 1];
    const tz = targets[i3 + 2];
    const h = hash(i);
    const h2 = hash(i + 17);
    const h3 = hash(i + 41);
    if (field) {
      starts[i3] = (h - 0.5) * 2 * field.halfW * 1.18 - field.originX;
      starts[i3 + 1] = (h2 - 0.5) * 2 * field.halfH * 1.15;
      starts[i3 + 2] = -3 - h3 * 14;
      continue;
    }
    const angle = h * Math.PI * 2;
    const radius = 16 + h2 * 26;
    starts[i3] = tx + Math.cos(angle) * radius + (h - 0.5) * 10;
    starts[i3 + 1] = ty + Math.sin(angle) * radius * 0.82 + (h2 - 0.5) * 8;
    starts[i3 + 2] = tz - (10 + h3 * 24);
  }

  return starts;
}

/**
 * Advance every layer to the given global progress [0,1].
 * Only lerps + a cheap ease run here; all timing is precomputed.
 */
export function updateAssembleLayers(layers: AssembleLayer[], progress: number) {
  const p = progress < 0 ? 0 : progress > 1 ? 1 : progress;

  for (const layer of layers) {
    if (layer.animatePosition) {
      const { positions, starts, delta, delay, invSpan } = layer;
      const count = delay.length;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const local = (p - delay[i]) * invSpan[i];
        if (local <= 0) {
          positions[i3] = starts[i3];
          positions[i3 + 1] = starts[i3 + 1];
          positions[i3 + 2] = starts[i3 + 2];
          continue;
        }
        const t = local >= 1 ? 1 : smoother(local);
        positions[i3] = starts[i3] + delta[i3] * t;
        positions[i3 + 1] = starts[i3 + 1] + delta[i3 + 1] * t;
        positions[i3 + 2] = starts[i3 + 2] + delta[i3 + 2] * t;
      }

      (layer.mesh.geometry.getAttribute("position") as THREE.BufferAttribute)
        .needsUpdate = true;
    }

    const mat = layer.mesh.material as
      | THREE.PointsMaterial
      | THREE.LineBasicMaterial;
    const fade = (p - layer.fadeDelay) * layer.invFadeSpan;
    const fadeT = fade <= 0 ? 0 : fade >= 1 ? 1 : smoother(fade);
    if (layer.kind === "points") {
      // Points read faintly in the scatter field, then brighten as they land.
      mat.opacity = layer.targetOpacity * (0.28 + 0.72 * fadeT);
    } else {
      mat.opacity = layer.targetOpacity * fadeT;
    }
  }
}

function buildTiming(
  targets: Float32Array,
  isLines: boolean,
  field?: AssembleField,
): {
  starts: Float32Array;
  delta: Float32Array;
  delay: Float32Array;
  invSpan: Float32Array;
} {
  const starts = createScatterStarts(targets, field);
  const count = targets.length / 3;
  const delta = new Float32Array(targets.length);
  const delay = new Float32Array(count);
  const invSpan = new Float32Array(count);
  const salt = isLines ? 500 : 0;
  const lineBias = isLines ? LINE_ASSEMBLE_DELAY : 0;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    delta[i3] = targets[i3] - starts[i3];
    delta[i3 + 1] = targets[i3 + 1] - starts[i3 + 1];
    delta[i3 + 2] = targets[i3 + 2] - starts[i3 + 2];
    const d = lineBias + hash(i + salt) * 0.18 + (i / count) * 0.22;
    const clamped = d > 0.9 ? 0.9 : d;
    delay[i] = clamped;
    invSpan[i] = 1 / Math.max(0.1, 1 - clamped);
  }

  return { starts, delta, delay, invSpan };
}

export function addAnimatedPoints(
  group: THREE.Group,
  meshes: Array<THREE.Points | THREE.LineSegments>,
  layers: AssembleLayer[],
  positions: Float32Array,
  color: string,
  size: number,
  opacity: number,
  field?: AssembleField,
) {
  if (positions.length < 3) return;

  const targets = positions.slice();
  const { starts, delta, delay, invSpan } = buildTiming(targets, false, field);
  const live = starts.slice();
  const geo = new THREE.BufferGeometry();
  const attr = new THREE.BufferAttribute(live, 3);
  attr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute("position", attr);

  // Per-particle vertex colors (start as the layer color) so later stages can
  // recolor each particle independently (e.g. sampling a logo texture).
  const count = targets.length / 3;
  const col = new THREE.Color(color);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }
  const colorAttr = new THREE.BufferAttribute(colors, 3);
  colorAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute("color", colorAttr);

  const mat = new THREE.PointsMaterial({
    size,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });
  const mesh = new THREE.Points(geo, mat);
  group.add(mesh);
  meshes.push(mesh);
  layers.push({
    mesh,
    positions: live,
    starts,
    delta,
    delay,
    invSpan,
    targetOpacity: opacity,
    fadeDelay: 0,
    invFadeSpan: 1 / 0.55,
    kind: "points",
    animatePosition: true,
  });
}

/** Sparse dust that stays across the hero so the formed icon is not a boxed island. */
export function addAmbientField(
  group: THREE.Group,
  meshes: Array<THREE.Points | THREE.LineSegments>,
  layers: AssembleLayer[],
  color: string,
  size: number,
  opacity: number,
  field: AssembleField,
  count = 1400,
) {
  const dummy = new Float32Array(count * 3);
  const starts = createScatterStarts(dummy, field);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(starts, 3));

  const col = new THREE.Color(color);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: size * 0.72,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });
  const mesh = new THREE.Points(geo, mat);
  group.add(mesh);
  meshes.push(mesh);
  const empty = new Float32Array(0);
  layers.push({
    mesh,
    positions: starts,
    starts,
    delta: empty,
    delay: empty,
    invSpan: empty,
    targetOpacity: opacity,
    fadeDelay: 0,
    invFadeSpan: 1 / 0.7,
    kind: "points",
    animatePosition: false,
  });
}

/**
 * Lines are the largest buffers, so they do NOT fly in — the geometry is static
 * at its final position and only the opacity fades in after the points land.
 * This removes the biggest per-frame vertex rewrite + GPU upload cost.
 */
export function addAnimatedLines(
  group: THREE.Group,
  meshes: Array<THREE.Points | THREE.LineSegments>,
  layers: AssembleLayer[],
  positions: Float32Array,
  color: string,
  opacity: number,
) {
  if (positions.length < 6) return;

  const targets = positions.slice();
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(targets, 3));

  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const mesh = new THREE.LineSegments(geo, mat);
  group.add(mesh);
  meshes.push(mesh);
  const empty = new Float32Array(0);
  layers.push({
    mesh,
    positions: targets,
    starts: targets,
    delta: empty,
    delay: empty,
    invSpan: empty,
    targetOpacity: opacity,
    fadeDelay: LINE_ASSEMBLE_DELAY,
    invFadeSpan: 1 / Math.max(0.12, 1 - LINE_ASSEMBLE_DELAY),
    kind: "lines",
    animatePosition: false,
  });
}
