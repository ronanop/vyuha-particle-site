import type { SlotRect } from "@/types/particles";
import type { Camera, PerspectiveCamera } from "three";
import { Vector3 } from "three";

const _ndc = new Vector3();
const _world = new Vector3();

/** Read a section's particle slot from the DOM. */
export function queryParticleSlot(slotId: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLElement>(
    `[data-particle-slot="${CSS.escape(slotId)}"]`,
  );
}

export function readSlotRect(el: HTMLElement): SlotRect {
  const r = el.getBoundingClientRect();
  return {
    left: r.left,
    top: r.top,
    width: r.width,
    height: r.height,
    centerX: r.left + r.width / 2,
    centerY: r.top + r.height / 2,
  };
}

/**
 * Project a screen-space point (CSS pixels, viewport) into world coords
 * on a plane at `planeZ` in front of a perspective camera.
 */
export function screenToWorldOnPlane(
  screenX: number,
  screenY: number,
  camera: Camera,
  viewportWidth: number,
  viewportHeight: number,
  planeZ = 0,
): Vector3 {
  const ndcX = (screenX / viewportWidth) * 2 - 1;
  const ndcY = -(screenY / viewportHeight) * 2 + 1;

  _ndc.set(ndcX, ndcY, 0.5);
  _ndc.unproject(camera);

  const origin = camera.position;
  const dir = _world.copy(_ndc).sub(origin).normalize();

  // Ray-plane intersection with plane z = planeZ (world)
  const denom = dir.z;
  if (Math.abs(denom) < 1e-6) {
    return new Vector3(0, 0, planeZ);
  }
  const t = (planeZ - origin.z) / denom;
  return origin.clone().add(dir.multiplyScalar(t));
}

/** World position for the center of a particle slot. */
export function slotCenterToWorld(
  slotId: string,
  camera: PerspectiveCamera | Camera,
  viewportWidth: number,
  viewportHeight: number,
  planeZ = 0,
): Vector3 | null {
  const el = queryParticleSlot(slotId);
  if (!el) return null;
  const rect = readSlotRect(el);
  if (rect.width < 2 || rect.height < 2) return null;
  return screenToWorldOnPlane(
    rect.centerX,
    rect.centerY,
    camera,
    viewportWidth,
    viewportHeight,
    planeZ,
  );
}

/**
 * Pick the most visible particle slot by intersection with the viewport center band.
 * Returns null if none are reasonably on-screen.
 */
export function findActiveSlotId(
  slotIds: readonly string[],
  viewportHeight: number,
): string | null {
  let bestId: string | null = null;
  let bestScore = -Infinity;
  const focusY = viewportHeight * 0.45;

  for (const id of slotIds) {
    const el = queryParticleSlot(id);
    if (!el) continue;
    const rect = readSlotRect(el);
    if (rect.width < 2 || rect.height < 2) continue;

    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(viewportHeight, rect.top + rect.height);
    const visible = Math.max(0, visibleBottom - visibleTop);
    if (visible <= 0) continue;

    const centerY = rect.centerY;
    const dist = Math.abs(centerY - focusY);
    const score = visible / rect.height - dist / viewportHeight;
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }

  return bestId;
}

/**
 * Soft-blend world anchors across visible slots so scroll moves feel continuous
 * instead of hard-snapping to one section at a time.
 */
export function resolveBlendedSlotWorld(
  slotIds: readonly string[],
  camera: PerspectiveCamera | Camera,
  viewportWidth: number,
  viewportHeight: number,
  planeZ = 0,
): {
  id: string | null;
  x: number;
  y: number;
  z: number;
  /** How contested the blend is (0 = one clear winner, 1 = evenly split). */
  contest: number;
} | null {
  const focusY = viewportHeight * 0.45;
  const scored: { id: string; score: number; x: number; y: number; z: number }[] =
    [];

  for (const id of slotIds) {
    const el = queryParticleSlot(id);
    if (!el) continue;
    const rect = readSlotRect(el);
    if (rect.width < 2 || rect.height < 2) continue;

    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(viewportHeight, rect.top + rect.height);
    const visible = Math.max(0, visibleBottom - visibleTop);
    if (visible <= 0) continue;

    const dist = Math.abs(rect.centerY - focusY);
    // Soft falloff — wider band so slot anchors glide instead of jumping
    const focusW = Math.exp(-(dist * dist) / (2 * (viewportHeight * 0.38) ** 2));
    const score = (visible / rect.height) * focusW;
    if (score < 0.015) continue;

    const world = screenToWorldOnPlane(
      rect.centerX,
      rect.centerY,
      camera,
      viewportWidth,
      viewportHeight,
      planeZ,
    );
    scored.push({ id, score, x: world.x, y: world.y, z: world.z });
  }

  if (scored.length === 0) return null;

  scored.sort((a, b) => b.score - a.score);
  // Use top two for a clean crossfade between neighboring sections
  const a = scored[0];
  const b = scored[1];
  if (!b) {
    return { id: a.id, x: a.x, y: a.y, z: a.z, contest: 0 };
  }

  const sum = a.score + b.score;
  const wA = a.score / sum;
  const wB = b.score / sum;
  const contest = 1 - Math.abs(wA - wB); // 1 when 50/50, 0 when one dominates

  return {
    id: wA >= wB ? a.id : b.id,
    x: a.x * wA + b.x * wB,
    y: a.y * wA + b.y * wB,
    z: a.z * wA + b.z * wB,
    contest,
  };
}

/** Collect every data-particle-slot id currently in the document. */
export function listParticleSlotIds(): string[] {
  if (typeof document === "undefined") return [];
  const nodes = document.querySelectorAll<HTMLElement>("[data-particle-slot]");
  const ids: string[] = [];
  nodes.forEach((node) => {
    const id = node.getAttribute("data-particle-slot");
    if (id) ids.push(id);
  });
  return ids;
}
