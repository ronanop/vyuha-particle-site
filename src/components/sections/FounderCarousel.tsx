"use client";

import Image from "next/image";
import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

export type Founder = {
  name: string;
  role: string;
  initials: string;
  image: string | null;
};

const MORPH_DURATION = 0.55;
const MORPH_EASE = "power2.inOut";
const REDUCED_MOTION_DURATION = 0.01;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isLaidOut(el: HTMLElement): boolean {
  return el.getClientRects().length > 0;
}

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "prev" ? (
        <path d="M14.5 5.5 8 12l6.5 6.5" />
      ) : (
        <path d="M9.5 5.5 16 12l-6.5 6.5" />
      )}
    </svg>
  );
}

function PortraitCard({
  founder,
  active,
  className = "",
}: {
  founder: Founder;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(160deg,#1a1f24_0%,#0c0e10_55%,#151a1e_100%)] shadow-[0_28px_56px_-16px_rgba(0,0,0,0.9)] sm:rounded-[36px] ${className}`}
    >
      {founder.image ? (
        <Image
          src={founder.image}
          alt={founder.name}
          fill
          className="object-cover"
          sizes={
            active
              ? "(max-width: 768px) 70vw, 320px"
              : "(max-width: 768px) 40vw, 220px"
          }
          priority={active}
        />
      ) : (
        <>
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08), transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(120,160,180,0.12), transparent 50%)",
            }}
          />
          <span className="font-display absolute inset-0 flex items-center justify-center text-[clamp(2.5rem,6vw,4rem)] font-medium tracking-[-0.04em] text-white/20">
            {founder.initials}
          </span>
        </>
      )}
    </div>
  );
}

function NameBlock({
  founder,
  nameRef,
}: {
  founder: Founder;
  nameRef?: RefObject<HTMLDivElement | null>;
}) {
  const parts = founder.name.split(" ");
  const first = parts[0] ?? founder.name;
  const rest = parts.slice(1).join(" ");

  return (
    <div ref={nameRef} className="text-center lg:text-left">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/45 sm:text-[12px]">
        {founder.role}
      </p>
      <h3 className="font-display mt-3 text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white">
        <span className="block">{first}</span>
        {rest ? <span className="block">{rest}</span> : null}
      </h3>
    </div>
  );
}

function NavArrows({
  onPrev,
  onNext,
  disabled,
}: {
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={disabled}
        aria-label="Previous founder"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white/70 transition-colors duration-300 hover:border-white/40 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 disabled:pointer-events-none disabled:opacity-50"
      >
        <ChevronIcon direction="prev" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        aria-label="Next founder"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.04] text-white/70 transition-colors duration-300 hover:border-white/40 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 disabled:pointer-events-none disabled:opacity-50"
      >
        <ChevronIcon direction="next" />
      </button>
    </div>
  );
}

type SlotRefs = {
  left: HTMLDivElement | null;
  center: HTMLDivElement | null;
  right: HTMLDivElement | null;
};

function deltaToTarget(
  from: DOMRect,
  to: DOMRect,
): { x: number; y: number; scale: number } {
  const scale = to.width / Math.max(from.width, 1);
  return {
    x: to.left + to.width / 2 - (from.left + from.width / 2),
    y: to.top + to.height / 2 - (from.top + from.height / 2),
    scale,
  };
}

function useCarouselMorph(count: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const activeIndexRef = useRef(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const pendingFadeIn = useRef(false);

  const mobileSlots = useRef<SlotRefs>({ left: null, center: null, right: null });
  const desktopSlots = useRef<SlotRefs>({
    left: null,
    center: null,
    right: null,
  });
  const mobileNameRef = useRef<HTMLDivElement | null>(null);
  const desktopNameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useLayoutEffect(() => {
    const names = [mobileNameRef.current, desktopNameRef.current].filter(
      (el): el is HTMLDivElement => el != null && isLaidOut(el),
    );

    const slots = [
      mobileSlots.current.left,
      mobileSlots.current.center,
      mobileSlots.current.right,
      desktopSlots.current.left,
      desktopSlots.current.center,
      desktopSlots.current.right,
    ].filter((el): el is HTMLDivElement => Boolean(el));

    gsap.set(slots, { clearProps: "transform,opacity,zIndex,filter" });

    if (pendingFadeIn.current && names.length) {
      pendingFadeIn.current = false;
      gsap.fromTo(
        names,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: prefersReducedMotion() ? REDUCED_MOTION_DURATION : 0.4,
          ease: "power2.out",
          overwrite: true,
        },
      );
    } else if (names.length) {
      gsap.set(names, { clearProps: "transform,opacity" });
    }

    setIsAnimating(false);
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  const morph = useCallback(
    (direction: 1 | -1) => {
      if (timelineRef.current?.isActive()) return;

      const nextIndex = (activeIndexRef.current + direction + count) % count;
      const reduced = prefersReducedMotion();
      const duration = reduced ? REDUCED_MOTION_DURATION : MORPH_DURATION;

      const runForSlots = (
        slots: SlotRefs,
        nameEl: HTMLDivElement | null,
      ): gsap.core.Timeline | null => {
        const { left, center, right } = slots;
        if (!left || !center || !right) return null;
        if (!isLaidOut(center)) return null;

        const leftRect = left.getBoundingClientRect();
        const centerRect = center.getBoundingClientRect();
        const rightRect = right.getBoundingClientRect();

        const centerToLeft = deltaToTarget(centerRect, leftRect);
        const centerToRight = deltaToTarget(centerRect, rightRect);
        const leftToCenter = deltaToTarget(leftRect, centerRect);
        const rightToCenter = deltaToTarget(rightRect, centerRect);

        gsap.set([left, center, right], {
          transformOrigin: "50% 50%",
          force3D: true,
        });

        const tl = gsap.timeline({ defaults: { duration, ease: MORPH_EASE } });

        if (nameEl && isLaidOut(nameEl)) {
          tl.to(
            nameEl,
            {
              opacity: 0,
              y: direction > 0 ? -10 : 10,
              duration: reduced ? duration : duration * 0.45,
              ease: "power2.in",
            },
            0,
          );
        }

        if (direction > 0) {
          tl.to(
            center,
            {
              x: centerToLeft.x,
              y: centerToLeft.y,
              scale: centerToLeft.scale,
              opacity: 0.26,
              zIndex: 1,
            },
            0,
          );
          tl.to(
            right,
            {
              x: rightToCenter.x,
              y: rightToCenter.y,
              scale: rightToCenter.scale,
              opacity: 1,
              zIndex: 10,
            },
            0,
          );
          tl.to(
            left,
            {
              x: "-18%",
              scale: 0.78,
              opacity: 0,
              zIndex: 0,
            },
            0,
          );
        } else {
          tl.to(
            center,
            {
              x: centerToRight.x,
              y: centerToRight.y,
              scale: centerToRight.scale,
              opacity: 0.26,
              zIndex: 1,
            },
            0,
          );
          tl.to(
            left,
            {
              x: leftToCenter.x,
              y: leftToCenter.y,
              scale: leftToCenter.scale,
              opacity: 1,
              zIndex: 10,
            },
            0,
          );
          tl.to(
            right,
            {
              x: "18%",
              scale: 0.78,
              opacity: 0,
              zIndex: 0,
            },
            0,
          );
        }

        return tl;
      };

      setIsAnimating(true);
      pendingFadeIn.current = true;

      const mobileTl = runForSlots(mobileSlots.current, mobileNameRef.current);
      const desktopTl = runForSlots(
        desktopSlots.current,
        desktopNameRef.current,
      );

      if (!mobileTl && !desktopTl) {
        pendingFadeIn.current = false;
        setActiveIndex(nextIndex);
        return;
      }

      const master = gsap.timeline({
        onComplete: () => {
          timelineRef.current = null;
          setActiveIndex(nextIndex);
        },
      });

      if (mobileTl) master.add(mobileTl, 0);
      if (desktopTl) master.add(desktopTl, 0);
      timelineRef.current = master;
    },
    [count],
  );

  const goPrev = useCallback(() => morph(-1), [morph]);
  const goNext = useCallback(() => morph(1), [morph]);

  return {
    activeIndex,
    isAnimating,
    goPrev,
    goNext,
    mobileSlots,
    desktopSlots,
    mobileNameRef,
    desktopNameRef,
  };
}

export function FounderCarousel({ founders }: { founders: readonly Founder[] }) {
  const count = founders.length;
  const {
    activeIndex,
    isAnimating,
    goPrev,
    goNext,
    mobileSlots,
    desktopSlots,
    mobileNameRef,
    desktopNameRef,
  } = useCarouselMorph(count);

  const active = founders[activeIndex]!;
  const prev = founders[(activeIndex - 1 + count) % count]!;
  const next = founders[(activeIndex + 1) % count]!;

  return (
    <div className="flex w-full flex-col items-center">
      {/* Mobile / tablet — resting positions avoid CSS transforms so GSAP can morph cleanly */}
      <div className="flex w-full flex-col items-center lg:hidden">
        <div className="relative w-full max-w-[min(100%,420px)] overflow-hidden px-2">
          <div className="relative mx-auto aspect-[3/4] w-[68%] max-w-[260px]">
            <div
              ref={(el) => {
                mobileSlots.current.left = el;
              }}
              aria-hidden
              className="pointer-events-none absolute top-[9%] z-0 w-[62%] opacity-25"
              style={{ left: "-48%" }}
            >
              <PortraitCard founder={prev} />
            </div>
            <div
              ref={(el) => {
                mobileSlots.current.right = el;
              }}
              aria-hidden
              className="pointer-events-none absolute top-[9%] z-0 w-[62%] opacity-25"
              style={{ right: "-48%" }}
            >
              <PortraitCard founder={next} />
            </div>
            <div
              ref={(el) => {
                mobileSlots.current.center = el;
              }}
              className="relative z-10 w-full"
            >
              <PortraitCard founder={active} active />
            </div>
          </div>
        </div>

        <div className="mt-8 w-full max-w-sm px-2">
          <NameBlock founder={active} nameRef={mobileNameRef} />
        </div>

        <div className="mt-8">
          <NavArrows onPrev={goPrev} onNext={goNext} disabled={isAnimating} />
        </div>
      </div>

      {/* Desktop: peeks + active card (arrows under) + identity */}
      <div className="hidden w-full items-start justify-center gap-5 lg:flex xl:gap-8">
        <div
          ref={(el) => {
            desktopSlots.current.left = el;
          }}
          aria-hidden
          className="mt-[8%] w-[min(14vw,158px)] shrink-0 opacity-[0.26]"
        >
          <PortraitCard founder={prev} />
        </div>

        <div className="relative z-10 flex w-[min(28vw,300px)] shrink-0 flex-col items-center xl:w-[min(26vw,320px)]">
          <div
            ref={(el) => {
              desktopSlots.current.center = el;
            }}
            className="w-full"
          >
            <PortraitCard founder={active} active />
          </div>
          <div className="mt-10">
            <NavArrows onPrev={goPrev} onNext={goNext} disabled={isAnimating} />
          </div>
        </div>

        <div className="mt-[18%] flex min-w-[11rem] max-w-[16rem] shrink-0 flex-col justify-center xl:min-w-[13rem]">
          <NameBlock founder={active} nameRef={desktopNameRef} />
        </div>

        <div
          ref={(el) => {
            desktopSlots.current.right = el;
          }}
          aria-hidden
          className="mt-[8%] w-[min(14vw,158px)] shrink-0 opacity-[0.26]"
        >
          <PortraitCard founder={next} />
        </div>
      </div>
    </div>
  );
}
