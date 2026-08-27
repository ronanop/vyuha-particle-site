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

function MobileSwipeCards({ cards }: { cards: WheelCard[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const width = el.clientWidth;
      if (width <= 0) return;
      const idx = Math.round(el.scrollLeft / width);
      setActive(Math.min(cards.length - 1, Math.max(0, idx)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [cards.length]);

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const next = Math.min(cards.length - 1, Math.max(0, index));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const canPrev = active > 0;
  const canNext = active < cards.length - 1;

  return (
    <div className="w-full md:hidden">
      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
          aria-label="Capability cards"
        >
          {cards.map((card, i) => (
            <article
              key={card.title}
              className="relative w-full shrink-0 snap-center px-1"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${cards.length}: ${card.title}`}
            >
              <div className="relative flex min-h-[20rem] flex-col overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#070b12]/92 p-6 shadow-[0_40px_120px_-36px_rgba(34,211,238,0.28)] backdrop-blur-2xl">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_44%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -top-4 font-display text-[5.5rem] font-medium leading-none tracking-[-0.07em] text-white/[0.045]"
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="relative">
                  <span className="font-display text-[12px] font-medium uppercase tracking-[0.28em] text-cyan-300/85">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(cards.length).padStart(2, "0")}
                  </span>
                  <h4 className="font-display mt-5 text-[clamp(1.55rem,7vw,2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-white">
                    {card.title}
                  </h4>
                  {card.body ? (
                    <p className="mt-4 text-[15px] leading-relaxed text-white/70">
                      {card.body}
                    </p>
                  ) : null}
                </div>

                <p className="relative mt-auto pt-8 font-display text-[11px] uppercase tracking-[0.24em] text-white/30">
                  Swipe or tap arrows
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 px-1">
        <button
          type="button"
          aria-label="Previous card"
          disabled={!canPrev}
          onClick={() => goTo(active - 1)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div
          className="flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Card pages"
        >
          {cards.map((card, i) => (
            <button
              key={card.title}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${card.title}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-7 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.45)]"
                  : "w-1.5 bg-white/25"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next card"
          disabled={!canNext}
          onClick={() => goTo(active + 1)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
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
        <header className="mx-auto mb-6 mt-20 w-full max-w-4xl px-6 text-center md:mb-10 md:mt-16 md:px-10">
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
              className="mx-auto mt-6 max-w-2xl text-[clamp(1.05rem,1.8vw,1.35rem)] leading-[1.6] text-white md:text-white/55"
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

      {/* Mobile: simple 3-card swipe carousel */}
      <div className="px-5 pb-4 md:hidden">
        <MobileSwipeCards cards={cards} />
      </div>

      {/* Desktop: existing option wheel + detail panel */}
      <div
        ref={pinRef}
        className="hidden w-full flex-col items-center justify-center px-6 md:flex md:h-svh md:px-10"
      >
        <div className="grid w-full max-w-[1400px] items-center gap-8 md:gap-[2.25rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-[3.6rem]">
          <div className="relative h-[min(560px,62svh)] min-w-0 select-none overflow-visible lg:h-[min(620px,68svh)]">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 bg-[radial-gradient(ellipse_at_30%_50%,rgba(34,211,238,0.16),transparent_58%)] md:-inset-16"
            />
            <OptionWheel
              items={cards.map((c) => c.title)}
              defaultSelected={0}
              value={isMd ? selected : undefined}
              onChange={(index) => setSelected(index)}
              captureWheel={false}
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

          <div className="relative flex min-h-[min(432px,52svh)] flex-col justify-between overflow-hidden rounded-[1.6rem] border border-white/15 bg-[#070b12]/92 p-[2.25rem] shadow-[0_40px_120px_-36px_rgba(34,211,238,0.28)] backdrop-blur-2xl lg:min-h-[min(468px,56svh)] lg:p-[2.7rem]">
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
              className="ow-detail relative my-[2.25rem]"
            >
              <span className="font-display text-[12px] font-medium uppercase tracking-[0.28em] text-cyan-300/85">
                {String(selected + 1).padStart(2, "0")} /{" "}
                {String(cards.length).padStart(2, "0")}
              </span>
              <h4 className="font-display mt-[1.125rem] text-[clamp(1.6rem,2.7vw,2.4rem)] font-medium leading-[1.08] tracking-[-0.03em] text-white">
                {active.title}
              </h4>
              {active.body ? (
                <p className="mt-[1.125rem] max-w-xl text-[16px] leading-[1.65] text-white/65">
                  {active.body}
                </p>
              ) : null}
            </div>

            <p className="relative font-display text-[11px] uppercase tracking-[0.24em] text-white/30">
              Scroll to explore
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
