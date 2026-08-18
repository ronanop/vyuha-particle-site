"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const IsometricParticleCluster = dynamic(
  () => import("./IsometricParticleCluster"),
  { ssr: false },
);

/**
 * Hero-only port of the Framer isometric particle cluster.
 */
export function HeroParticle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const probe = document.createElement("canvas");
    const gl =
      probe.getContext("webgl2", { alpha: true }) ||
      probe.getContext("webgl", { alpha: true });
    setEnabled(Boolean(gl));
  }, []);

  if (!enabled) return null;

  return (
    <IsometricParticleCluster
      shape="earth"
      morphStages={[
        { image: "/hero-morph-icon.png", selector: '[data-earth-morph="1"]' },
        { image: "/hero-morph-plane.png", selector: '[data-earth-morph="2"]' },
        { spread: true, selector: '[data-earth-morph="3"]' },
        {
          image: "/hero-morph-logo.png",
          selector: '[data-earth-morph="4"]',
          logo: true,
        },
      ]}
      particleColor="#22d3ee"
      particleBrightness={1}
      lineColor="#67e8f9"
      particleSize={0.14}
      lineOpacity={0.18}
      particleDensity={520}
      autoRotationSpeed={0.85}
      interactionStrength={0}
      damping={0.05}
      className="absolute inset-0"
    />
  );
}
