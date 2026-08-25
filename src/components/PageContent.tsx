"use client";

import { ViewTransition } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { IntroLoader } from "@/components/IntroLoader";
import { Navigation } from "@/components/Navigation";
import { HomeView } from "@/components/sections/HomeView";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroParticle } from "@/components/hero/HeroParticle";

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
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <HeroParticle />
      </div>
      <IntroLoader />
      <ViewTransition name="site-header">
        <Navigation />
      </ViewTransition>
      <main className="relative z-10">
        <HomeView />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
