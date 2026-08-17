"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ParticleSystem } from "@/components/particles/ParticleSystem";
import { useParticleController } from "@/components/particles/ParticleController";
import {
  getQualityProfile,
  isWebGLAvailable,
  markDocumentTier,
  prefersReducedMotion,
  wantsDemandFrameloop,
} from "@/lib/particles/ParticlePerformance";
import { bootParticleState, particleState } from "@/lib/particles/ParticleState";
import type { QualityTier } from "@/types/particles";

function ParticleBridge({
  count,
  onQualityChange,
}: {
  count: number;
  onQualityChange: (count: number, tier: QualityTier) => void;
}) {
  useParticleController();
  return <ParticleSystem count={count} onQualityChange={onQualityChange} />;
}

function FallbackBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #0a1a1f 0%, #000000 55%, #050505 100%)",
      }}
    />
  );
}

export function ParticleScene() {
  const boot = useMemo(() => {
    const webgl = typeof window !== "undefined" && isWebGLAvailable();
    const reduced = typeof window !== "undefined" && prefersReducedMotion();
    const profile = getQualityProfile();
    bootParticleState({
      webglAvailable: webgl,
      reducedMotion: reduced,
      qualityTier: profile.tier,
    });
    return { webgl, profile };
  }, []);

  const [count, setCount] = useState(boot.profile.count);
  const [tier, setTier] = useState<QualityTier>(boot.profile.tier);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onQualityChange = useCallback((nextCount: number, nextTier: QualityTier) => {
    particleState.qualityTier = nextTier;
    particleState.particleCount = nextCount;
    markDocumentTier(nextTier);
    // SmoothScroll listens — a drop to LOW/MINIMAL hands scroll back to the browser
    window.dispatchEvent(
      new CustomEvent("particle-tier-change", { detail: { tier: nextTier } }),
    );
    setTier(nextTier);
    setCount((prev) => (prev === nextCount ? prev : nextCount));
  }, []);

  if (!boot.webgl) {
    return <FallbackBackground />;
  }

  const profile = getQualityProfile(tier);
  const dprCap = profile.dprCap;
  const demand = wantsDemandFrameloop(tier);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[1] h-[100svh] w-full"
      aria-hidden
    >
      <Canvas
        dpr={dprCap}
        frameloop={hidden ? "never" : demand ? "demand" : "always"}
        flat
        resize={{ debounce: 280, scroll: false }}
        camera={{ position: [0, 0.35, 11], fov: 50, near: 0.1, far: 80 }}
        performance={{ min: 0.45, max: 1, debounce: 1200 }}
        gl={{
          alpha: true,
          antialias: false,
          stencil: false,
          // Single Points draw with depthWrite off — a depth buffer only costs bandwidth
          depth: false,
          powerPreference: demand ? "low-power" : "high-performance",
          preserveDrawingBuffer: false,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ParticleBridge count={count} onQualityChange={onQualityChange} />
      </Canvas>
    </div>
  );
}
