"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FluidButton } from "@/components/FluidButton";
import TiltedCard from "@/components/TiltedCard";
import SplitText from "@/components/ui/SplitText";
import TextType from "@/components/ui/TextType";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { HeroParticle } from "@/components/hero/HeroParticle";
import { SolutionCtas } from "@/components/marketing/solutions/SolutionChrome";
import type { SolutionsOverviewContent } from "@/content/solutions/types";

const InfiniteScrollTunnel = dynamic(
  () => import("@/components/marketing/solutions/InfiniteScrollTunnel"),
  { ssr: false },
);

function EarthQuoteHeading({ quote }: { quote: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [inView, setInView] = useState(false);
  const [secondLine, setSecondLine] = useState(false);
  const lines = quote.split(/(?<=\.)\s+/);
  const first = lines[0] ?? "";
  const rest = lines.slice(1).join(" ");
  const afterIndia = first.replace(/^INDIA\b/, "");

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setInView(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <h2
      ref={headingRef}
      aria-label={quote}
      className="flex max-w-[13ch] flex-col gap-[0.42em] text-left font-display text-[clamp(2.1528rem,5.796vw,4.968rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-white [text-shadow:0_4px_32px_rgba(0,0,0,0.8)]"
    >
      <span className="block">
        <span className="hero-tricolor align-baseline">INDIA</span>
        {inView ? (
          <TextType
            as="span"
            text={afterIndia}
            loop={false}
            initialDelay={180}
            typingSpeed={38}
            variableSpeed={{ min: 28, max: 52 }}
            showCursor={!secondLine}
            cursorCharacter="|"
            cursorClassName="align-baseline text-white"
            onSentenceComplete={() => setSecondLine(true)}
          />
        ) : null}
      </span>
      <span className="block">
        {secondLine ? (
          <TextType
            as="span"
            text={rest}
            loop={false}
            typingSpeed={38}
            variableSpeed={{ min: 28, max: 52 }}
            showCursor
            cursorCharacter="|"
            cursorClassName="align-baseline text-white"
          />
        ) : (
          <span className="invisible" aria-hidden>
            {rest}
          </span>
        )}
      </span>
    </h2>
  );
}

export function SolutionsOverviewView({
  content,
}: {
  content: SolutionsOverviewContent;
}) {
  const [sovereignWord, ...sovereignRest] = content.displayTitle[0].split(" ");
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      root.classList.add("hero-ready");
      return;
    }

    const readyTimer = setTimeout(() => root.classList.add("hero-ready"), 350);

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        });
      });
    }, root);

    return () => {
      clearTimeout(readyTimer);
      ctx.revert();
    };
  }, []);

  return (
    <article ref={rootRef} className="solutions-page">
      <a
        href="#solutions-functions"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-24 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to solutions by function
      </a>

      <header className="relative overflow-hidden border-b border-white/10">
        <div
          className="pointer-events-none absolute inset-0 z-0 [contain:paint]"
          aria-hidden
        >
          <InfiniteScrollTunnel className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.32)_50%,rgba(0,0,0,0.78)_100%)]" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1400px] flex-col items-center justify-center px-6 pt-28 pb-16 md:px-10 md:pt-32 md:pb-16">
          <div className="hero-copy w-full min-w-0 max-w-xl text-center md:max-w-2xl">
            <h1
              data-hero-in
              className="isolate overflow-visible font-display text-[clamp(2.99rem,8.05vw,7.1875rem)] font-medium leading-none tracking-[-0.045em] text-white"
            >
              <span className="relative z-20 block overflow-visible pb-[0.22em] leading-[1.12]">
                <span className="hero-tricolor align-baseline">{sovereignWord}</span>
                {sovereignRest.length ? ` ${sovereignRest.join(" ")}` : null}
              </span>
              <span className="relative z-0 -mt-[0.2em] block leading-none">
                {content.displayTitle[1]}
              </span>
            </h1>
            <p
              data-hero-in
              className="relative left-1/2 mt-6 w-[min(92vw,70rem)] max-w-none -translate-x-1/2 whitespace-nowrap font-display text-[clamp(0.8rem,calc((100vw-4rem)/44),1.5rem)] font-bold tracking-[-0.02em] text-white/90 [animation-delay:160ms]"
            >
              {content.leitmotif}
            </p>
            <div
              data-hero-in
              className="mx-auto mt-6 w-full max-w-2xl text-center text-[16px] font-bold leading-snug text-white/90 [animation-delay:300ms] md:text-[17px]"
            >
              {content.body.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
            <div
              data-hero-in
              className="mt-10 flex flex-wrap items-center justify-center gap-4 [animation-delay:380ms]"
            >
              <FluidButton
                text={content.primaryCtas[0].label}
                href={content.primaryCtas[0].href}
              />
            </div>
          </div>
        </div>
      </header>

      <section
        id="solutions-earth"
        className="relative min-h-svh overflow-hidden border-b border-white/10"
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, #0a1a1f 0%, #000000 55%, #050505 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <HeroParticle lockHero />
        </div>
        <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1400px] items-center justify-start px-6 md:px-10">
          <EarthQuoteHeading quote={content.quote} />
        </div>
      </section>

      <section
        id="solutions-functions"
        className="scroll-mt-28 border-b border-white/10 pt-20 pb-8 md:pt-28 md:pb-10"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div>
            <SplitText
              tag="h2"
              text={content.functionsTitle}
              className="whitespace-nowrap font-display text-[clamp(0.95rem,calc((100vw-3rem)/24),3.25rem)] font-medium leading-none tracking-[-0.035em] text-white"
              textAlign="left"
              whiteSpace="nowrap"
              splitType="chars"
              delay={28}
              duration={0.7}
              ease="power3.out"
              from={{ opacity: 0, y: 28 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-80px"
            />
            <p data-reveal className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white md:text-[17px]">
              {content.functionsIntro}
            </p>
          </div>

          <ScrollStack
            className="mt-10"
            useWindowScroll
            itemDistance={120}
            itemStackDistance={28}
            stackPosition="22%"
            scaleEndPosition="12%"
            baseScale={0.88}
            itemScale={0.04}
            blurAmount={0.8}
          >
            {content.functions.map((item) => (
              <ScrollStackItem
                key={item.href}
                itemClassName="overflow-hidden border border-white/12 bg-[#0a1018]/90 p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl md:p-10"
              >
                <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
                  <div>
                    <p className="font-display text-[12px] uppercase tracking-[0.2em] text-cyan-300">
                      {item.way}
                    </p>
                    <p className="mt-3 font-display text-[clamp(3rem,6vw,5rem)] font-medium leading-none tracking-[-0.06em] text-white/18">
                      {item.index}
                    </p>
                    <h3 className="mt-3 font-display text-[clamp(1.85rem,3.4vw,3rem)] font-medium leading-[1.02] tracking-[-0.035em] text-white">
                      <Link href={item.href} className="transition-colors hover:text-cyan-300">
                        {item.title}
                      </Link>
                    </h3>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="font-display text-[17px] font-medium leading-snug tracking-[-0.02em] text-white/88 md:text-[19px]">
                      {item.headline}
                    </p>
                    <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/55 md:text-[17px]">
                      {item.body}
                    </p>
                    <div className="mt-8">
                      <FluidButton
                        text={item.cta}
                        href={item.href}
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
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </section>

      <section
        id="solutions-replace"
        className="scroll-mt-28 border-b border-white/10 pt-8 pb-20 md:pt-12 md:pb-28"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <SplitText
              tag="h2"
              text={content.replaceTitle}
              className="mx-auto max-w-[16ch] font-display text-[clamp(2.405rem,5.2vw,4.225rem)] font-bold leading-[0.98] tracking-[-0.035em] text-white"
              textAlign="center"
              splitType="chars"
              delay={28}
              duration={0.7}
              ease="power3.out"
              from={{ opacity: 0, y: 28 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-80px"
            />
            <p data-reveal className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-white/55 md:text-[17px]">
              {content.replaceIntro}
            </p>
          </div>
          <ul className="mt-14 grid grid-cols-1 items-stretch gap-5 md:grid-cols-3 md:gap-6 lg:gap-8">
            {content.replacements.map((item) => (
              <li key={item.title} data-reveal className="min-h-[24rem] md:min-h-[28rem]">
                <TiltedCard
                  containerHeight="100%"
                  containerWidth="100%"
                  imageHeight="100%"
                  imageWidth="100%"
                  rotateAmplitude={12}
                  scaleOnHover={1.06}
                  showMobileWarning={false}
                  showTooltip={false}
                  displayOverlayContent
                  overlayContent={
                    <div className="relative flex h-full min-h-full flex-col overflow-hidden border border-white/12 bg-white/[0.04] p-7 backdrop-blur-xl md:p-8">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-px border border-white/8"
                      />
                      <div className="relative">
                        <span className="font-display block text-[clamp(3rem,5vw,4.75rem)] font-medium leading-none tracking-[-0.05em] text-cyan-300/90">
                          {item.index}
                        </span>
                        <div
                          aria-hidden
                          className="mt-5 h-px w-16 bg-gradient-to-r from-cyan-300/80 to-transparent"
                        />
                      </div>
                      <h3 className="relative mt-6 font-display text-[clamp(1.35rem,2vw,1.75rem)] font-medium tracking-[-0.02em] text-white">
                        {item.title}
                      </h3>
                      <p className="relative mt-4 max-w-sm text-[16px] leading-relaxed text-white/62">
                        {item.body}
                      </p>
                    </div>
                  }
                />
              </li>
            ))}
          </ul>
          <p
            data-reveal
            className="mx-auto mt-12 max-w-3xl text-center text-[16px] leading-relaxed text-white/55 md:text-[17px]"
          >
            {content.replaceCloser}
          </p>
        </div>
      </section>

      <section
        id="solutions-industries"
        className="scroll-mt-28 border-b border-white/10 py-20 md:py-28"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div className="max-w-3xl">
            <SplitText
              tag="h2"
              text={content.industriesTitle}
              className="max-w-[18ch] font-display text-[clamp(2.035rem,4.4vw,3.575rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white"
              textAlign="left"
              splitType="chars"
              delay={28}
              duration={0.7}
              ease="power3.out"
              from={{ opacity: 0, y: 28 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-80px"
            />
            <p data-reveal className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/55 md:text-[17px]">
              {content.industriesIntro}
            </p>
          </div>

          <ul
            data-reveal
            className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-white/12 bg-white/12 md:grid-cols-2"
          >
            {content.industries.map((industry) => (
              <li
                key={industry.title}
                className="relative bg-black p-7 md:min-h-[16rem] md:p-10"
              >
                <img
                  src={industry.icon}
                  alt=""
                  width={180}
                  height={180}
                  className="ml-auto h-[180px] w-[180px] shrink-0 object-contain"
                />
                <h3 className="mt-5 font-display text-[clamp(1.5rem,2.4vw,2.1rem)] font-medium tracking-[-0.03em] text-white">
                  {industry.title}
                </h3>
                <p className="mt-3 font-display text-[16px] font-medium leading-snug tracking-[-0.02em] text-white/80">
                  {industry.headline}
                </p>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/55 md:text-[16px]">
                  {industry.body}
                </p>
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-10">
            <span className="inline-block origin-left scale-[1.3]">
              <FluidButton
                text={content.industriesCta.label}
                href={content.industriesCta.href}
                size="sm"
                className="bg-cyan-300"
                firstTextColor="rgb(0, 0, 0)"
                secondTextColor="rgb(0, 0, 0)"
                overlayColor="rgb(250, 250, 250)"
                borderColor="rgb(34, 211, 238)"
              />
            </span>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div
          className="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16"
          data-reveal
        >
          <div>
            <h2 className="font-display max-w-[14ch] text-[clamp(2.4rem,5vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white">
              {content.finalHeadline}
            </h2>
            <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-white/60">
              {content.finalBody}
            </p>
            <div className="mt-10">
              <SolutionCtas ctas={content.finalCtas} />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <Image
              src="/solutions/network-mark.png"
              alt="Vyuha agentic network mark"
              width={828}
              height={466}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 42vw, 90vw"
            />
          </div>
        </div>
      </section>
    </article>
  );
}
