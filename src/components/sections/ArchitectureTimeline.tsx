"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/utils/motion";

type TimelineLayer = {
  id: string;
  title: string;
  headline: string;
  items: string[];
};

export function ArchitectureTimeline({ layers }: { layers: TimelineLayer[] }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-step]"));

    if (prefersReducedMotion()) {
      setRevealed(new Set(steps.map((s) => s.id)));
      setActiveId(steps[0]?.id ?? null);
      return;
    }

    // Reveal each step once as it scrolls into view.
    const revealObs = new IntersectionObserver(
      (entries) => {
        setRevealed((prev) => {
          let next = prev;
          for (const e of entries) {
            if (e.isIntersecting && !prev.has(e.target.id)) {
              if (next === prev) next = new Set(prev);
              next.add(e.target.id);
            }
          }
          return next;
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.2 },
    );

    // A thin band at the vertical center marks the "current" step.
    const activeObs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    steps.forEach((s) => {
      revealObs.observe(s);
      activeObs.observe(s);
    });

    return () => {
      revealObs.disconnect();
      activeObs.disconnect();
    };
  }, [layers]);

  return (
    <section className="relative z-10 py-12 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] md:py-16 md:px-10">
      <ol ref={listRef} className="relative mx-auto w-full max-w-[880px]">
        <span
          aria-hidden
          className="pointer-events-none absolute left-[27px] top-3 bottom-3 w-px bg-gradient-to-b from-cyan-400/60 via-cyan-300/25 to-transparent md:left-[31px]"
        />
        {layers.map((layer, i) => {
          const [num, label] = layer.title.split("|").map((s) => s.trim());
          const isRevealed = revealed.has(layer.id);
          const isActive = activeId === layer.id;
          return (
            <li
              key={layer.id}
              id={layer.id}
              data-step
              style={{ transitionDelay: isRevealed ? `${i * 90}ms` : "0ms" }}
              className={`relative scroll-mt-28 pb-10 pl-[70px] transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] last:pb-0 md:pl-[92px] ${
                isRevealed
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <span
                className={`absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-full border bg-black/50 backdrop-blur-md transition-all duration-500 md:h-16 md:w-16 ${
                  isActive
                    ? "scale-105 border-cyan-300 shadow-[0_0_26px_rgba(34,211,238,0.5)]"
                    : "border-cyan-400/40"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-0 rounded-full bg-cyan-400/25 blur-md transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span
                  className={`relative font-display text-lg font-medium transition-colors duration-500 md:text-xl ${
                    isActive ? "text-cyan-100" : "text-cyan-300"
                  }`}
                >
                  {num}
                </span>
              </span>
              <div
                className={`relative overflow-hidden border bg-white/[0.05] p-5 backdrop-blur-xl transition-all duration-500 md:p-6 ${
                  isActive
                    ? "border-cyan-300/30 bg-white/[0.07]"
                    : "border-white/12"
                }`}
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_42%)] transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-50"
                  }`}
                />
                <div className="relative">
                  <span className="font-display text-[12px] font-medium uppercase tracking-[0.24em] text-cyan-300/85">
                    {label}
                  </span>
                  <h3 className="mt-2 font-display text-[clamp(1.35rem,2.6vw,2rem)] font-medium leading-tight tracking-[-0.02em] text-white">
                    {layer.headline}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {layer.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[15px] leading-relaxed text-white/75 md:text-[16px]"
                      >
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/90" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
