"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/particles/ParticlePerformance";

const Scanner = dynamic(() => import("./Scanner"), { ssr: false });

export function PlatformWhyScanner() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const probe = document.createElement("canvas");
    setEnabled(Boolean(probe.getContext("webgl2")));
  }, []);

  if (!enabled) return null;

  return (
    <Scanner
      color1="#083344"
      color2="#22d3ee"
      color3="#ecfeff"
      speed={0.32}
      sweepSpeed={0.18}
      sweepWidth={1.8}
      sweepFalloff={5.5}
      scale={1.35}
      frequency={1.8}
      ripple={0.18}
      bandDensity={9}
      lineSharpness={5}
      glow={0.18}
      scanDirection="vertical"
      colorSpread={0.45}
      brightness={0.72}
      contrast={1.1}
      softness={1.6}
      vignette={0.72}
      scanline
      grain
      grainIntensity={0.035}
      opacity={0.42}
      mouseInteraction={false}
      className="h-full w-full"
    />
  );
}
