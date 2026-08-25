"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { IsometricParticleClusterProps } from "./IsometricParticleCluster";

const IsometricParticleCluster = dynamic(
  () => import("./IsometricParticleCluster"),
  { ssr: false },
);

const HOME_MORPH_STAGES: NonNullable<
  IsometricParticleClusterProps["morphStages"]
> = [
  { image: "/hero-morph-icon.png", selector: '[data-earth-morph="1"]' },
  { image: "/hero-morph-plane.png", selector: '[data-earth-morph="2"]' },
  { spread: true, selector: '[data-earth-morph="3"]' },
  {
    image: "/hero-morph-logo.png",
    selector: '[data-earth-morph="4"]',
    logo: true,
  },
];

type HeroParticleProps = {
  /** Scroll morph chain (homepage). Ignored when `logoImage` is set. */
  morphStages?: IsometricParticleClusterProps["morphStages"];
  /** Pin the earth to the homepage hero pose (right side). */
  lockHero?: boolean;
  /** Build the cluster from an icon silhouette (e.g. lightbulb on company). */
  logoImage?: string;
  className?: string;
};

/**
 * Port of the Framer isometric particle cluster used on the homepage.
 */
export function HeroParticle({
  morphStages,
  lockHero = false,
  logoImage,
  className = "absolute inset-0",
}: HeroParticleProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const probe = document.createElement("canvas");
    const gl =
      probe.getContext("webgl2", { alpha: true }) ||
      probe.getContext("webgl", { alpha: true });
    setEnabled(Boolean(gl));
  }, []);

  if (!enabled) return null;

  if (logoImage) {
    return (
      <IsometricParticleCluster
        logoImage={logoImage}
        particleColor="#22d3ee"
        particleBrightness={1.15}
        lineColor="#67e8f9"
        particleSize={0.12}
        lineOpacity={0.28}
        particleDensity={640}
        autoRotationSpeed={0}
        interactionStrength={0}
        damping={0.06}
        className={className}
      />
    );
  }

  const stages = lockHero
    ? (morphStages ?? [])
    : (morphStages ?? HOME_MORPH_STAGES);

  return (
    <IsometricParticleCluster
      shape="earth"
      morphStages={stages}
      lockHero={lockHero}
      particleColor="#22d3ee"
      particleBrightness={1}
      lineColor="#67e8f9"
      particleSize={0.14}
      lineOpacity={0.18}
      particleDensity={520}
      autoRotationSpeed={0.85}
      interactionStrength={0}
      damping={0.05}
      className={className}
    />
  );
}
