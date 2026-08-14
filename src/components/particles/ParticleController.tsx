"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/utils/lenis";
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
import { readFormationStage } from "@/lib/particles/formationChain";
import { smoothstep } from "@/lib/particles/ParticleMorph";
import {
  listParticleSlotIds,
  resolveBlendedSlotWorld,
} from "@/lib/particles/slotProjection";
import { useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    particleState.reducedMotion = prefersReducedMotion();

    const syncProgress = () => {
      setScrollProgress(readScrollProgress());
    };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      // Higher scrub = particles trail scroll like Dala (less scrub-jitter)
      scrub: 1.35,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    const lenis = getLenis();
    const onLenis = () => syncProgress();
    lenis?.on("scroll", onLenis);
    window.addEventListener("scroll", syncProgress, { passive: true });
    syncProgress();

    const onResize = () => {
      ScrollTrigger.refresh();
      syncProgress();
    };
    window.addEventListener("resize", onResize);

    return () => {
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

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const rawStage = readFormationStage(size.height);
      if (prefersReducedMotion() || particleState.reducedMotion) {
        setFormationStage(Math.round(rawStage));
      } else {
        setFormationStage(rawStage);
      }

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
        raf = requestAnimationFrame(update);
        return;
      }

      // Pin toward center during field phases; release for icon / logo slots
      const stage = particleState.formationStage;
      const breakPin = smoothstep(Math.min(1, stage));
      const intoIcons = smoothstep(Math.min(1, Math.max(0, stage - 1)));
      // Re-pin for delivery field (stage ~6), then release again for final logo
      const deliveryField =
        smoothstep(Math.min(1, Math.max(0, stage - 5))) *
        (1 - smoothstep(Math.min(1, Math.max(0, stage - 6))));
      const iconRelease = intoIcons * (1 - deliveryField);
      const pin = breakPin * (1 - iconRelease);
      const target = {
        x: blended.x * (1 - pin),
        y: blended.y * (1 - pin * 0.85),
        z: blended.z * (1 - pin),
      };

      // No travel kicks — they fight the continuous morph and read as jitter
      lastSlotIdRef.current = blended.id;
      lastPosRef.current = target;
      hasPosRef.current = true;
      setActiveSlot(blended.id, target, 0);

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [camera, size.height, size.width]);
}
