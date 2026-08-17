"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenisInstance } from "@/lib/utils/lenis";
import { getScrollFeel, luxuryEase } from "@/lib/utils/scrollFeel";
import {
  shouldUseSmoothScroll,
  tierWantsNativeScroll,
} from "@/lib/particles/ParticlePerformance";
import type { QualityTier } from "@/types/particles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * Lenis smooth scroll synced with GSAP ScrollTrigger.
 * Disabled when prefers-reduced-motion is set or the quality tier is
 * LOW/MINIMAL — on weak devices Lenis ties page scroll to the WebGL rAF
 * budget, so dropped canvas frames would stutter the whole page.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;

    const destroyLenis = () => {
      if (!lenis) return;
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
        tickerCallback = null;
      }
      lenis.destroy();
      lenis = null;
      setLenisInstance(null);
    };

    if (shouldUseSmoothScroll()) {
      const feel = getScrollFeel();
      // lerp only — passing duration/easing would override and kill the lag
      lenis = new Lenis({
        lerp: feel.lerp,
        smoothWheel: true,
        touchMultiplier: feel.touchMultiplier,
        wheelMultiplier: feel.wheelMultiplier,
        autoRaf: false,
        overscroll: true,
      });

      setLenisInstance(lenis);

      lenis.on("scroll", () => {
        ScrollTrigger.update();
      });

      tickerCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    // Runtime FPS downgrade to LOW/MINIMAL → hand scroll back to the browser
    const onTierChange = (event: Event) => {
      const tier = (event as CustomEvent<{ tier: QualityTier }>).detail?.tier;
      if (tier && tierWantsNativeScroll(tier)) {
        destroyLenis();
      }
    };
    window.addEventListener("particle-tier-change", onTierChange);

    // Debounced — mobile URL-bar resizes fire mid-scroll and refresh is heavy
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        lenis?.resize();
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.(
        "a[href^='#']",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const el = document.querySelector(hash);
      if (!el) return;

      event.preventDefault();
      if (lenis) {
        lenis.scrollTo(el as HTMLElement, {
          offset: 0,
          duration: getScrollFeel().anchorDuration,
          easing: luxuryEase,
        });
      } else {
        (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", onClick);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      if (mq.matches) {
        lenis?.stop();
      } else {
        lenis?.start();
      }
    };
    mq.addEventListener("change", onMotionChange);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      mq.removeEventListener("change", onMotionChange);
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("particle-tier-change", onTierChange);
      window.clearTimeout(resizeTimer);
      destroyLenis();
    };
  }, []);

  return <>{children}</>;
}
