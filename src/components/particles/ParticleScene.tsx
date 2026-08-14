"use client";

import { useCallback, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ParticleSystem } from "@/components/particles/ParticleSystem";
import { useParticleController } from "@/components/particles/ParticleController";
import {
  getQualityProfile,
  isWebGLAvailable,
  prefersReducedMotion,
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

  const onQualityChange = useCallback((nextCount: number, nextTier: QualityTier) => {
    particleState.qualityTier = nextTier;
    particleState.particleCount = nextCount;
    setCount(nextCount);
    setTier(nextTier);
  }, []);

  if (!boot.webgl) {
    return <FallbackBackground />;
  }

  const dprCap = getQualityProfile(tier).dprCap;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden>
      <Canvas
        dpr={[1, dprCap]}
        camera={{ position: [0, 0.35, 11], fov: 50, near: 0.1, far: 80 }}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ParticleBridge count={count} onQualityChange={onQualityChange} />
      </Canvas>
    </div>
  );
}
