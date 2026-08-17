"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/utils/lenis";
import { getScrollFeel } from "@/lib/utils/scrollFeel";
import {
  getQualityProfile,
  isTouchDevice,
  prefersReducedMotion,
} from "@/lib/particles/ParticlePerformance";
import {
  setActiveSlot,
  setFormationStage,
  setMouse,
  setScrollProgress,
  particleState,
} from "@/lib/particles/ParticleState";
import {
  invalidateFormationDomCache,
  readFormationStage,
} from "@/lib/particles/formationChain";
import { smoothstep } from "@/lib/particles/ParticleMorph";
import {
  invalidateParticleSlotCache,
  listParticleSlotIds,
  resolveBlendedSlotWorld,
} from "@/lib/particles/slotProjection";
import type { PerspectiveCamera } from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function readScrollProgress(): number {
  const lenis = getLenis();
  if (lenis) {
    return Math.min(1, Math.max(0, lenis.progress));
  }
  const el = document.documentElement;
  const max = el.scrollHeight - el.clientHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / max));
}

/**
 * Drives scroll progress, unified formation stage, pointer parallax,
 * and slot → world anchoring. Must run inside the R3F Canvas.
 */
export function useParticleController(): void {
  const { camera, size } = useThree();
  const mouseEnabled = getQualityProfile(particleState.qualityTier).mouseEnabled;
  const lastSlotIdRef = useRef<string | null>(null);
  const lastPosRef = useRef({ x: 0, y: 0, z: 0 });
  const hasPosRef = useRef(false);
  const primedRef = useRef(false);
  const slotAccRef = useRef(0);

  useEffect(() => {
    particleState.reducedMotion = prefersReducedMotion();

    const syncProgress = () => {
      setScrollProgress(readScrollProgress());
    };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      scrub: getScrollFeel().scrub,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    const lenis = getLenis();
    const onLenis = () => syncProgress();
    lenis?.on("scroll", onLenis);
    window.addEventListener("scroll", syncProgress, { passive: true });
    syncProgress();

    // Invalidate caches immediately (cheap — next frame re-measures), but
    // debounce the heavy refresh: mobile URL-bar resizes fire mid-scroll.
    let resizeTimer = 0;
    const onResize = () => {
      invalidateFormationDomCache();
      invalidateParticleSlotCache();
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        syncProgress();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    const warm = window.setTimeout(() => {
      invalidateFormationDomCache();
      invalidateParticleSlotCache();
    }, 400);

    return () => {
      window.clearTimeout(warm);
      window.clearTimeout(resizeTimer);
      trigger.kill();
      lenis?.off("scroll", onLenis);
      window.removeEventListener("scroll", syncProgress);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!mouseEnabled || prefersReducedMotion() || isTouchDevice()) {
      setMouse(0, 0, false);
      return;
    }

    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -((event.clientY / window.innerHeight) * 2 - 1);
      setMouse(x, y, true);
    };
    const onLeave = () => setMouse(0, 0, false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [mouseEnabled]);

  useFrame((_, delta) => {
    if (!primedRef.current && particleState.scrollWarmed) {
      primedRef.current = true;
      invalidateFormationDomCache();
      invalidateParticleSlotCache();
      ScrollTrigger.refresh();
      getLenis()?.resize();
      readFormationStage(size.height);
      listParticleSlotIds();
    }

    const rawStage = readFormationStage(size.height);
    if (particleState.reducedMotion) {
      setFormationStage(Math.round(rawStage));
    } else {
      setFormationStage(rawStage);
    }

    const stage = particleState.formationStage;
    const breakPin = smoothstep(Math.min(1, stage));
    const intoIcons = smoothstep(Math.min(1, Math.max(0, stage - 1)));
    const deliveryField =
      smoothstep(Math.min(1, Math.max(0, stage - 5))) *
      (1 - smoothstep(Math.min(1, Math.max(0, stage - 6))));
    const iconRelease = intoIcons * (1 - deliveryField);
    const pin = breakPin * (1 - iconRelease);

    // Earth / field are viewport-centered — skip slot layout work
    if (pin > 0.97) {
      lastSlotIdRef.current = null;
      lastPosRef.current = { x: 0, y: 0, z: 0 };
      hasPosRef.current = true;
      setActiveSlot(null, { x: 0, y: 0, z: 0 }, 0);
      return;
    }

    const slotMs = getQualityProfile(particleState.qualityTier).slotMs;
    slotAccRef.current += delta * 1000;
    if (slotAccRef.current < slotMs) return;
    slotAccRef.current = 0;

    const ids = listParticleSlotIds();
    const blended = resolveBlendedSlotWorld(
      ids,
      camera as PerspectiveCamera,
      size.width,
      size.height,
      0,
    );

    if (!blended) {
      setActiveSlot(null);
      return;
    }

    const target = {
      x: blended.x * (1 - pin),
      y: blended.y * (1 - pin * 0.85),
      z: blended.z * (1 - pin),
    };

    lastSlotIdRef.current = blended.id;
    lastPosRef.current = target;
    hasPosRef.current = true;
    setActiveSlot(blended.id, target, 0);
  }, -1);
}
