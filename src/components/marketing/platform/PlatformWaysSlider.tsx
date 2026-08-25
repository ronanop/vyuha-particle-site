"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FluidButton } from "@/components/FluidButton";
import type { SolutionLinkCard } from "@/content/solutions/types";

const WAYS = ["Orchestrate", "Deploy", "Bind"] as const;
const ST_ID = "platform-ways";

export function PlatformWaysSlider({ products }: { products: SolutionLinkCard[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const last = Math.max(products.length - 1, 1);

  const goTo = useCallback((i: number) => {
    const next = Math.max(0, Math.min(products.length - 1, i));
    const st = ScrollTrigger.getById(ST_ID);
    if (st) {
      const p = products.length <= 1 ? 0 : next / last;
      st.scroll(st.start + p * (st.end - st.start));
      return;
    }
    setIndex(next);
  }, [last, products.length]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const pin = rootRef.current?.closest<HTMLElement>("[data-ways-pin]");
    const viewport = track?.parentElement;
    if (!track || !pin || !viewport || typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const maxX = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

    const tween = gsap.to(track, {
      x: () => -maxX(),
      ease: "none",
      scrollTrigger: {
        id: ST_ID,
        trigger: pin,
        start: "top top",
        end: () => `+=${Math.max(maxX() * 1.15, window.innerHeight * 1.35)}`,
        pin: true,
        scrub: 0.55,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: products.length > 1
          ? {
              snapTo: 1 / last,
              duration: 0.22,
              delay: 0.02,
              ease: "power1.out",
            }
          : undefined,
        onUpdate: (self) => {
          setIndex(Math.round(self.progress * last));
        },
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    const raf = window.requestAnimationFrame(refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", refresh);
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(track, { clearProps: "transform" });
    };
  }, [last, products.length]);

  return (
    <div ref={rootRef} className="relative mt-4">
      <div className="ml-[calc(50%-50vw)] w-screen overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max gap-5 pr-6 will-change-transform md:pr-10"
          aria-label="Platform ways"
        >
          {products.map((product, i) => (
            <article
              key={product.href}
              className="relative w-[min(100vw,52rem)] shrink-0 overflow-hidden border border-white/12 bg-white/[0.04] p-7 backdrop-blur-xl first:border-l-0 md:w-[min(100vw,64rem)] md:p-10 md:pl-12"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]"
              />
              <div className="relative grid gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-center md:gap-14">
                <div>
                  <p className="font-display text-[12px] uppercase tracking-[0.2em] text-cyan-300">
                    {String(i + 1).padStart(2, "0")} · {WAYS[i]}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(1.85rem,3.4vw,3rem)] font-medium leading-[1.02] tracking-[-0.035em] text-white">
                    <Link href={product.href} className="transition-colors hover:text-cyan-300">
                      {product.title}
                    </Link>
                  </h3>
                </div>
                <div>
                  <p className="font-display text-[17px] font-medium leading-snug tracking-[-0.02em] text-white/88 md:text-[19px]">
                    {product.headline}
                  </p>
                  <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/55 md:text-[17px]">
                    {product.body}
                  </p>
                  <div className="mt-8">
                    <FluidButton
                      text={product.cta}
                      href={product.href}
                      size="sm"
                      className="bg-cyan-300"
                      firstTextColor="rgb(0, 0, 0)"
                      secondTextColor="rgb(0, 0, 0)"
                      overlayColor="rgb(250, 250, 250)"
                      borderColor="rgb(34, 211, 238)"
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {products.map((product, i) => (
          <button
            key={product.href}
            type="button"
            aria-label={`Go to ${WAYS[i]}`}
            onClick={() => goTo(i)}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-8 bg-cyan-300" : "w-3 bg-white/20 hover:bg-white/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
