"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SmoothScroll } from "@/components/SmoothScroll";
import { IntroLoader } from "@/components/IntroLoader";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/sections/Hero";
import { Intelligence } from "@/components/sections/Intelligence";
import { Problem } from "@/components/sections/Problem";
import { Capabilities } from "@/components/sections/Capabilities";
import { FoundedBy } from "@/components/sections/FoundedBy";
import { FinalCTA } from "@/components/sections/FinalCTA";

const ParticleScene = dynamic(
  () =>
    import("@/components/particles/ParticleScene").then(
      (mod) => mod.ParticleScene,
    ),
  { ssr: false },
);

function ParticleLayer() {
  const searchParams = useSearchParams();
  // Remount only when the query string changes (dev replay), not on every render.
  const replayKey = useMemo(
    () => searchParams.toString() || "particles",
    [searchParams],
  );
  return <ParticleScene key={replayKey} />;
}

export function PageContent() {
  return (
    <SmoothScroll>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, #0a1a1f 0%, #000000 55%, #050505 100%)",
        }}
      />
      <Suspense fallback={null}>
        <ParticleLayer />
      </Suspense>
      <IntroLoader />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <Intelligence />
        <Problem />
        <Capabilities />
        <FoundedBy />
        <FinalCTA />
      </main>
    </SmoothScroll>
  );
}
