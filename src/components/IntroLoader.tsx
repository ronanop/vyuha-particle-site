"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/utils/motion";
import { getLenis } from "@/lib/utils/lenis";

const MIN_LOADER_MS = 1400;
const TEXT_AFTER_FADE_MS = 240;
const RELEASE_SCROLL_MS = 1000;
const LETTERS = ["V", "Y", "U", "H", "A"] as const;

function setIntroAttr(value: "loading" | "ready") {
  document.documentElement.dataset.intro = value;
}

function freezeScroll() {
  document.documentElement.dataset.introLock = "";
  document.documentElement.style.overflow = "hidden";
  gsap.ticker.lagSmoothing(500, 33);
  getLenis()?.stop();
}

function releaseScroll() {
  delete document.documentElement.dataset.introLock;
  document.documentElement.style.overflow = "";
  gsap.ticker.lagSmoothing(0);
  getLenis()?.start();
}

function IntroWord({ tone }: { tone: "ghost" | "solid" }) {
  return (
    <p
      className={`flex justify-center font-display text-[clamp(2.85rem,8.8vw,6.75rem)] font-medium leading-none tracking-[0.16em] md:tracking-[0.24em] ${
        tone === "ghost" ? "text-white/50" : "text-white"
      }`}
    >
      {LETTERS.map((letter) => (
        <span
          key={`${tone}-${letter}`}
          className="inline-block overflow-hidden leading-none"
        >
          <span data-intro-letter className="intro-letter">
            {letter}
          </span>
        </span>
      ))}
    </p>
  );
}

/**
 * Typographic boot overlay. Progress fills the wordmark, then a staggered
 * exit hands off to the home hero copy.
 */
export function IntroLoader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);
  const [visible, setVisible] = useState(true);
  const dismissedRef = useRef(false);
  const startedAtRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisible(false);
      setIntroAttr("ready");
      releaseScroll();
      return;
    }

    setIntroAttr("loading");
    freezeScroll();
    const catchLenis = window.setTimeout(freezeScroll, 80);
    const catchLenis2 = window.setTimeout(freezeScroll, 400);

    let raf = 0;
    let displayed = 0;
    let motionGen = 0;
    const delayed: gsap.core.Tween[] = [];
    const timelines: gsap.core.Timeline[] = [];

    const letterLayers = () => {
      const nodes = [
        ...(stackRef.current?.querySelectorAll<HTMLElement>(
          "[data-intro-letter]",
        ) ?? []),
      ];
      const mid = Math.floor(nodes.length / 2);
      return { ghost: nodes.slice(0, mid), fill: nodes.slice(mid), all: nodes };
    };

    const paintProgress = (value: number) => {
      const clipped = Math.max(0, Math.min(100, value));
      if (counterRef.current) {
        counterRef.current.textContent = String(Math.round(clipped)).padStart(
          3,
          "0",
        );
      }
      if (fillRef.current) {
        fillRef.current.style.clipPath = `inset(0 ${100 - clipped}% 0 0)`;
      }
    };

    const killMotion = () => {
      delayed.forEach((t) => t.kill());
      delayed.length = 0;
      timelines.forEach((t) => t.kill());
      timelines.length = 0;
      gsap.killTweensOf(overlayRef.current);
      gsap.killTweensOf(stackRef.current);
      gsap.killTweensOf(counterRef.current);
      gsap.killTweensOf(letterLayers().all);
    };

    const playEnter = () => {
      const { ghost, fill, all } = letterLayers();
      const counter = counterRef.current;
      if (!all.length) return;

      gsap.set(all, { y: 0, yPercent: 110 });
      gsap.set(counter, { opacity: 0, y: 10 });
      paintProgress(0);

      const enter = gsap.timeline();
      enter.to(
        ghost,
        {
          y: 0,
          yPercent: 0,
          duration: 0.9,
          stagger: 0.05,
          ease: "expo.out",
          force3D: true,
        },
        0,
      );
      enter.to(
        fill,
        {
          y: 0,
          yPercent: 0,
          duration: 0.9,
          stagger: 0.05,
          ease: "expo.out",
          force3D: true,
        },
        0,
      );
      enter.to(
        counter,
        { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
        0.38,
      );
      timelines.push(enter);
    };

    const beginLoad = () => {
      dismissedRef.current = false;
      motionGen += 1;
      const gen = motionGen;
      startedAtRef.current = performance.now();
      displayed = 0;
      setVisible(true);
      setIntroAttr("loading");
      freezeScroll();
      if (overlayRef.current) {
        overlayRef.current.style.pointerEvents = "";
        gsap.set(overlayRef.current, { opacity: 1 });
      }
      if (stackRef.current) gsap.set(stackRef.current, { opacity: 1, y: 0 });
      const startEnter = () => {
        if (gen !== motionGen || dismissedRef.current) return;
        playEnter();
      };
      if (stackRef.current?.querySelector("[data-intro-letter]")) {
        startEnter();
      } else {
        requestAnimationFrame(startEnter);
      }
    };

    beginLoad();

    const openPage = () => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      displayed = 100;
      paintProgress(100);

      timelines.forEach((t) => t.kill());
      timelines.length = 0;

      const overlay = overlayRef.current;
      const counter = counterRef.current;
      const { ghost, fill } = letterLayers();
      if (overlay) overlay.style.pointerEvents = "none";

      const exit = gsap.timeline({
        onComplete: () => setVisible(false),
      });
      if (ghost.length) {
        exit.to(
          ghost,
          {
            y: 0,
            yPercent: -110,
            duration: 0.48,
            stagger: 0.028,
            ease: "power3.in",
            force3D: true,
          },
          0,
        );
        exit.to(
          fill,
          {
            y: 0,
            yPercent: -110,
            duration: 0.48,
            stagger: 0.028,
            ease: "power3.in",
            force3D: true,
          },
          0,
        );
      }
      if (counter) {
        exit.to(
          counter,
          { opacity: 0, y: -12, duration: 0.32, ease: "power2.in" },
          0,
        );
      }
      if (overlay) {
        exit.to(
          overlay,
          { opacity: 0, duration: 0.52, ease: "power2.inOut" },
          0.16,
        );
      } else {
        setVisible(false);
      }
      timelines.push(exit);

      delayed.push(
        gsap.delayedCall(TEXT_AFTER_FADE_MS / 1000, () => {
          setIntroAttr("ready");
        }),
        gsap.delayedCall(RELEASE_SCROLL_MS / 1000, () => {
          releaseScroll();
        }),
      );
    };

    const tick = () => {
      if (!dismissedRef.current) {
        const elapsed = performance.now() - startedAtRef.current;
        const timeT = Math.min(1, elapsed / MIN_LOADER_MS);
        const target = timeT * 100;
        displayed += (target - displayed) * 0.18;
        if (elapsed >= MIN_LOADER_MS && displayed >= 99.4) {
          displayed = 100;
          paintProgress(100);
          openPage();
        } else {
          paintProgress(displayed);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const failsafe = window.setTimeout(openPage, 10000);

    const onVisibility = () => {
      const last = timelines[timelines.length - 1];
      if (!last || dismissedRef.current) return;
      if (document.hidden) last.pause();
      else last.resume();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      killMotion();
      window.clearTimeout(catchLenis);
      window.clearTimeout(catchLenis2);
      window.clearTimeout(failsafe);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="intro-loader fixed inset-0 z-40 flex cursor-wait items-center justify-center px-6 select-none"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-busy="true"
    >
      <span className="sr-only">Loading Vyuha</span>
      <div
        ref={stackRef}
        className="flex flex-col items-center gap-10 text-center"
        aria-hidden="true"
      >
        <div className="relative">
          <IntroWord tone="ghost" />
          <div
            ref={fillRef}
            className="intro-fill pointer-events-none absolute inset-0"
          >
            <IntroWord tone="solid" />
          </div>
        </div>
        <p
          ref={counterRef}
          className="intro-count font-display text-[13px] font-medium tabular-nums tracking-[0.42em] text-white/80"
        >
          000
        </p>
      </div>
    </div>
  );
}
