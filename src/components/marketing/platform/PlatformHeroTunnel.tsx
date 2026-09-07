"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/utils/motion";

const LightTunnel = dynamic(() => import("./LightTunnel"), { ssr: false });

type PlatformHeroTunnelProps = {
  onReady?: () => void;
};

/**
 * Fibre-optic tunnel behind marketing heroes.
 */
export function PlatformHeroTunnel({ onReady }: PlatformHeroTunnelProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onReady?.();
      return;
    }
    const probe = document.createElement("canvas");
    const ok = Boolean(probe.getContext("webgl2"));
    setEnabled(ok);
    if (!ok) onReady?.();
  }, [onReady]);

  if (!enabled) return null;

  return (
    <LightTunnel
      cableColor="#22d3ee"
      pulseColor="#67e8f9"
      tunnelColor="#0b1f4d"
      tunnelOpacity={0}
      speed={0.08}
      flowDirection="outward"
      pulseSpeed={1.6}
      pulseLength={0.32}
      pulseBlend={1}
      pulseWidth={1}
      cableCount={16}
      thickness={0.32}
      rimWidth={0.18}
      waviness={0.28}
      sway={0.4}
      size={1.05}
      centerX={0}
      centerY={0}
      glow={0.9}
      fadeNear={0.4}
      fadeFar={1.85}
      brightness={0.72}
      colorVariance
      grain
      grainIntensity={0.04}
      opacity={0.9}
      mouseInteraction
      mouseStrength={0.08}
      className="h-full w-full"
      onReady={onReady}
    />
  );
}
