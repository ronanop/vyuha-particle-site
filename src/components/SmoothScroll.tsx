"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenisInstance } from "@/lib/utils/lenis";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * Lenis smooth scroll synced with GSAP ScrollTrigger.
 * Disabled when prefers-reduced-motion is set.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      setLenisInstance(null);
      return;
    }

    const lenis = new Lenis({
      // Longer glide — closer to Dala’s buttery scroll inertia
      duration: 1.45,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.25,
      autoRaf: false,
      wheelMultiplier: 0.85,
    });

    setLenisInstance(lenis);

    const onLenisScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onLenisScroll);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
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
      lenis.scrollTo(el as HTMLElement, {
        offset: 0,
        duration: 1.25,
      });
    };
    document.addEventListener("click", onClick);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      if (mq.matches) {
        lenis.stop();
      } else {
        lenis.start();
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
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return <>{children}</>;
}
