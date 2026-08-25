"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import OptionWheel from "@/components/OptionWheel";
import SplitText from "@/components/ui/SplitText";
import { prefersReducedMotion } from "@/lib/utils/motion";

type WheelCard = { title: string; body?: string };

type StandardizeWheelProps = {
  cards: WheelCard[];
  title?: string;
  intro?: string;
};

/** Viewport heights of pinned scroll per wheel step (lower = snappier). */
const SCROLL_VH_PER_STEP = 0.38;

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function StandardizeWheel({
  cards,
  title,
  intro,
}: StandardizeWheelProps) {
  const [selected, setSelected] = useState(0);
  const [isMd, setIsMd] = useState(false);
  const pinRef = useRef<HTMLDivElement>(null);
  const active = cards[selected] ?? cards[0];
  const count = cards.length;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsMd(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || count <= 1) return;

    const section = pinRef.current;
    if (!section) return;

    const mq = window.matchMedia("(min-width: 768px)");
    let trigger: ScrollTrigger | null = null;

    const mount = () => {
      trigger?.kill();
      trigger = null;
      if (!mq.matches) return;

      const scrollSteps = Math.max(count - 1, 1);

      trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () =>
          `+=${Math.round(window.innerHeight * SCROLL_VH_PER_STEP * scrollSteps)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx =
            count <= 1
              ? 0
              : Math.min(
                  count - 1,
                  Math.floor(self.progress * (count - 1) + 1e-4),
                );
          setSelected((prev) => (prev === idx ? prev : idx));
        },
      });
    };

    mount();
    mq.addEventListener("change", mount);

    const refresh = () => ScrollTrigger.refresh();
    const introWatch = new MutationObserver(refresh);
    introWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-intro", "data-intro-lock"],
    });
    requestAnimationFrame(refresh);

    return () => {
      mq.removeEventListener("change", mount);
      introWatch.disconnect();
      trigger?.kill();
    };
  }, [count]);

  return (
    <div className="w-full">
      {title || intro ? (
        <header className="mx-auto mb-6 mt-12 w-full max-w-4xl px-6 text-center md:mb-10 md:mt-16 md:px-10">
          {title ? (
            <SplitText
              tag="h3"
              text={title}
              className="font-display text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[0.98] tracking-[-0.04em] text-white"
              splitType="chars"
              delay={30}
              duration={0.8}
              ease="power3.out"
              from={{ opacity: 0, y: 30, filter: "blur(4px)" }}
              to={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              threshold={0.2}
              rootMargin="-50px"
            />
          ) : null}
          {intro ? (
            <SplitText
              tag="p"
              text={intro}
              className="mx-auto mt-6 max-w-2xl text-[clamp(1.05rem,1.8vw,1.35rem)] leading-[1.6] text-white/55"
              splitType="words"
              delay={40}
              duration={0.7}
              ease="power2.out"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-50px"
            />
          ) : null}
        </header>
      ) : (
        <div className="mt-12 md:mt-16" aria-hidden />
      )}

      <div
        ref={pinRef}
        className="flex w-full flex-col items-center justify-center px-6 md:h-svh md:px-10"
      >
        <div className="grid w-full max-w-[1400px] items-center gap-[2.25rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-[3.6rem]">
          <div className="relative h-[min(420px,55svh)] select-none overflow-visible md:h-[min(560px,62svh)] lg:h-[min(620px,68svh)]">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-16 bg-[radial-gradient(ellipse_at_30%_50%,rgba(34,211,238,0.16),transparent_58%)]"
            />
            <OptionWheel
              items={cards.map((c) => c.title)}
              defaultSelected={0}
              value={isMd ? selected : undefined}
              onChange={(index) => setSelected(index)}
              captureWheel={!isMd}
              textColor="#4a5568"
              activeColor="#a5f3fc"
              side="left"
              fontSize={3.2}
              spacing={1.58}
              curve={1.2}
              tilt={14}
              blur={2}
              fade={0.38}
              smoothing={200}
              inset={12}
              loop={false}
              className="font-display"
            />
          </div>

          <div className="relative flex min-h-[288px] flex-col justify-between overflow-hidden rounded-[1.6rem] border border-white/15 bg-[#070b12]/92 p-[1.8rem] shadow-[0_40px_120px_-36px_rgba(34,211,238,0.28)] backdrop-blur-2xl md:min-h-[min(432px,52svh)] md:p-[2.25rem] lg:min-h-[min(468px,56svh)] lg:p-[2.7rem]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_44%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-4 font-display text-[clamp(5rem,14vw,10rem)] font-medium leading-none tracking-[-0.07em] text-white/[0.045] md:-right-4 md:-top-6"
            >
              {String(selected + 1).padStart(2, "0")}
            </div>

            <div className="relative flex items-center gap-3">
              {cards.map((card, i) => (
                <span
                  key={card.title}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    i <= selected
                      ? "bg-gradient-to-r from-cyan-400 to-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.45)]"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>

            <div
              key={selected}
              className="ow-detail relative my-[1.8rem] md:my-[2.25rem]"
            >
              <span className="font-display text-[12px] font-medium uppercase tracking-[0.28em] text-cyan-300/85">
                {String(selected + 1).padStart(2, "0")} /{" "}
                {String(cards.length).padStart(2, "0")}
              </span>
              <h4 className="font-display mt-[1.125rem] text-[clamp(1.6rem,2.7vw,2.4rem)] font-medium leading-[1.08] tracking-[-0.03em] text-white">
                {active.title}
              </h4>
              {active.body ? (
                <p className="mt-[1.125rem] max-w-xl text-[15px] leading-relaxed text-white/65 md:text-[16px] md:leading-[1.65]">
                  {active.body}
                </p>
              ) : null}
            </div>

            <p className="relative font-display text-[11px] uppercase tracking-[0.24em] text-white/30">
              {isMd ? "Scroll to explore" : "Swipe the wheel"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
