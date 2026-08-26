"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FluidButton } from "@/components/FluidButton";
import BlurText from "@/components/marketing/platform/BlurText";
import FoldText from "@/components/marketing/platform/FoldText";
import { SolutionCtas } from "@/components/marketing/solutions/SolutionChrome";
import { PlatformHeroTunnel } from "@/components/marketing/platform/PlatformHeroTunnel";
import WarpText from "@/components/marketing/platform/WarpText";
import DecryptedText from "@/components/marketing/platform/DecryptedText";
import { TypewriterText } from "@/components/marketing/platform/TypewriterText";
import TiltedCard from "@/components/TiltedCard";
import { ScrambleText } from "@/components/marketing/platform/ScrambleText";
import { PlatformWaysSlider } from "@/components/marketing/platform/PlatformWaysSlider";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { PlatformOverviewContent } from "@/content/platform/types";

const PlatformWhyScanner = dynamic(
  () =>
    import("@/components/marketing/platform/PlatformWhyScanner").then(
      (m) => m.PlatformWhyScanner,
    ),
  { ssr: false },
);

export function PlatformOverviewView({
  content,
}: {
  content: PlatformOverviewContent;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const heroReadyRef = useRef(false);
  const [heroReady, setHeroReady] = useState(false);

  const markHeroReady = useCallback(() => {
    if (heroReadyRef.current) return;
    heroReadyRef.current = true;
    rootRef.current?.classList.add("hero-ready");
    setHeroReady(true);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      markHeroReady();
      return;
    }

    const readyTimer = setTimeout(markHeroReady, 900);

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

      const kintsugiHeading = root.querySelector<HTMLElement>("[data-kintsugi-heading]");
      if (kintsugiHeading) {
        const parts = kintsugiHeading.querySelectorAll<HTMLElement>("[data-kintsugi-fade]");
        gsap.fromTo(
          parts,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 1.15,
            stagger: 0.16,
            ease: "power2.out",
            immediateRender: true,
            scrollTrigger: {
              trigger: kintsugiHeading,
              start: "top 82%",
              once: true,
            },
          },
        );
      }
    }, root);

    return () => {
      clearTimeout(readyTimer);
      ctx.revert();
    };
  }, [markHeroReady]);

  const titleText = content.displayTitle.join("\n");
  const bodyText = content.body.join("\n\n");

  return (
    <article ref={rootRef} className="platform-page">
      <a
        href="#platform-architecture"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-24 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to platform architecture
      </a>

      <header className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#0b1f4d_0%,#050505_55%,#000_100%)]" />
          <PlatformHeroTunnel onReady={markHeroReady} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.55)_55%,#000_100%)]" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1400px] items-center justify-center px-6 pt-28 pb-10 md:px-10 md:pt-32 lg:pb-6">
          <div className="mx-auto w-full max-w-5xl text-center">
            <h1 className="font-display text-[clamp(2.6rem,7vw,6.25rem)] font-medium leading-[0.9] tracking-[-0.045em] text-white">
              {heroReady ? (
                <FoldText
                  text={titleText}
                  splitBy="line"
                  hinge="top"
                  trigger="mount"
                  duration={0.7}
                  stagger={0.12}
                  ease="power3.out"
                  perspective={900}
                  creaseShading={0.45}
                  fontSize="clamp(2.6rem, 7vw, 6.25rem)"
                  fontWeight={500}
                  color="#ffffff"
                  className="font-display w-full"
                  style={{ letterSpacing: "-0.045em", lineHeight: 0.9 }}
                />
              ) : (
                <span className="invisible block" aria-hidden>
                  {content.displayTitle.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              )}
            </h1>

            <div className="mt-6">
              {heroReady ? (
                <FoldText
                  text={content.leitmotif}
                  splitBy="word"
                  hinge="top"
                  trigger="mount"
                  delay={0.35}
                  duration={0.55}
                  stagger={0.05}
                  ease="power3.out"
                  perspective={700}
                  creaseShading={0.4}
                  fontSize="clamp(1.125rem, 2vw, 1.25rem)"
                  fontWeight={500}
                  color="rgba(255,255,255,0.75)"
                  className="font-display"
                  style={{ letterSpacing: "-0.02em", lineHeight: 1.3 }}
                />
              ) : (
                <p className="invisible font-display text-lg font-medium md:text-xl" aria-hidden>
                  {content.leitmotif}
                </p>
              )}
            </div>

            <blockquote className="mx-auto mt-8 max-w-4xl border-t border-kintsugi pt-5">
              {heroReady ? (
                <FoldText
                  text={content.quote}
                  splitBy="word"
                  hinge="top"
                  trigger="mount"
                  delay={0.55}
                  duration={0.5}
                  stagger={0.028}
                  ease="power3.out"
                  perspective={650}
                  creaseShading={0.35}
                  fontSize="clamp(1rem, 1.4vw, 1.0625rem)"
                  fontWeight={400}
                  color="rgba(255,255,255,0.65)"
                  style={{ letterSpacing: "0", lineHeight: 1.65 }}
                />
              ) : (
                <p className="invisible text-[16px] leading-relaxed md:text-[17px]" aria-hidden>
                  {content.quote}
                </p>
              )}
            </blockquote>

            <div className="mx-auto mt-6 max-w-4xl">
              {heroReady ? (
                <FoldText
                  text={bodyText}
                  splitBy="word"
                  hinge="top"
                  trigger="mount"
                  delay={0.75}
                  duration={0.48}
                  stagger={0.022}
                  ease="power3.out"
                  perspective={650}
                  creaseShading={0.3}
                  fontSize="clamp(1rem, 1.4vw, 1.0625rem)"
                  fontWeight={400}
                  color="rgba(255,255,255,0.55)"
                  style={{ letterSpacing: "0", lineHeight: 1.65 }}
                />
              ) : (
                <div className="invisible space-y-4 text-[16px] leading-relaxed md:text-[17px]" aria-hidden>
                  {content.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>

            <div
              data-hero-in
              className="mt-10 flex flex-wrap items-center justify-center gap-4 [animation-delay:380ms]"
            >
              <FluidButton
                text={content.primaryCtas[0].label}
                href={content.primaryCtas[0].href}
              />
              {content.primaryCtas[1] ? (
                <TransitionLink
                  href={content.primaryCtas[1].href}
                  className="inline-flex min-h-11 items-center text-[13px] tracking-wide text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  {content.primaryCtas[1].label}
                </TransitionLink>
              ) : null}
            </div>
            <nav
              aria-label="On this page"
              className="mt-12 hidden justify-center gap-6 border-t border-white/10 pt-6 text-[12px] uppercase tracking-[0.16em] text-white/40 sm:flex"
            >
              <a href="#platform-architecture" className="transition-colors hover:text-white">
                Delivery
              </a>
              <a href="#platform-why" className="transition-colors hover:text-white">
                Architecture
              </a>
              <a href="#platform-kintsugi" className="transition-colors hover:text-white">
                Govern
              </a>
            </nav>
          </div>
        </div>

        <dl className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 divide-y divide-white/10 border-t border-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {content.stats.map((stat, i) => (
            <div key={stat.label} className="px-6 py-7 md:px-10">
              <dt className="sr-only">{stat.label}</dt>
              <dd
                aria-label={stat.value}
                className="font-display text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-none tracking-[-0.04em] text-white"
              >
                <ScrambleText
                  text={stat.value}
                  delay={180 + i * 140}
                  tickMs={28}
                  holdTicks={3}
                />
              </dd>
              <p className="mt-3 text-[13px] uppercase tracking-[0.16em] text-white/45">
                <ScrambleText
                  text={stat.label.toUpperCase()}
                  delay={320 + i * 140}
                  tickMs={18}
                  holdTicks={1}
                />
              </p>
            </div>
          ))}
        </dl>
      </header>

      <section className="border-b border-white/10 pt-20 pb-10 md:pt-28 md:pb-12">
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div data-reveal className="max-w-3xl">
            <div className="mb-5 flex items-center gap-4">
              <div aria-hidden className="h-px w-16 bg-cyan-300/70" />
              <BlurText
                text="CONTROLLED AUTONOMY"
                delay={90}
                animateBy="letters"
                direction="top"
                className="font-display text-[13px] uppercase tracking-[0.18em] text-cyan-300"
              />
            </div>
            <BlurText
              text={content.problemsTitle}
              delay={120}
              animateBy="words"
              direction="top"
              className="max-w-[18ch] font-display text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white"
            />
            {content.problemsIntro ? (
              <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/55 md:text-[17px]">
                {content.problemsIntro}
              </p>
            ) : null}
          </div>
          <ul className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6 lg:gap-8">
            {content.problems.map((problem) => (
              <li
                key={problem.index}
                data-reveal
                className="group relative overflow-hidden border border-white/12 bg-white/[0.04] p-7 backdrop-blur-xl transition-colors hover:border-cyan-300/30 md:min-h-[17rem] md:p-8"
              >
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
                    {problem.index}
                  </span>
                  <div
                    aria-hidden
                    className="mt-5 h-px w-16 bg-gradient-to-r from-cyan-300/80 to-transparent"
                  />
                </div>
                <h3 className="relative mt-6 font-display text-[clamp(1.35rem,2vw,1.75rem)] font-medium tracking-[-0.02em] text-white">
                  {problem.title}
                </h3>
                <p className="relative mt-4 max-w-sm text-[16px] leading-relaxed text-white/62">
                  {problem.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="platform-architecture"
        className="scroll-mt-28 border-b border-white/10 pt-10 pb-6 md:pt-12 md:pb-8"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div data-ways-pin className="pt-16 md:pt-20">
          <div>
            <h2 className="sr-only">One foundation. Three ways in.</h2>
            <WarpText
              text={"One foundation.\nThree ways in."}
              color="#f8f5ff"
              warpStrength={0.08}
              warpScale={1.7}
              speed={0.55}
              pointerInfluence={0.42}
              pointerStrength={0.38}
              refraction={0.018}
              ripple
              fontSize="clamp(2.34rem, 6.3vw, 5.18rem)"
              fontWeight={500}
              fontFamily="var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif"
              letterSpacing="-0.04em"
              lineHeight={0.92}
              className="font-display"
              style={{ height: "clamp(158px, 18vw, 216px)", minHeight: 0 }}
            />
            {content.productsIntro ? (
              <p
                data-reveal
                className="mx-auto mt-2 max-w-2xl text-center text-[16px] leading-relaxed text-white/55 md:text-[17px]"
              >
                {content.productsIntro}
              </p>
            ) : null}
          </div>

          <PlatformWaysSlider products={content.products} />
        </div>
        </div>
      </section>

      <section
        id="platform-why"
        className="relative scroll-mt-28 overflow-hidden border-b border-white/10 pt-6 pb-20 md:pt-8 md:pb-28"
      >
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <PlatformWhyScanner />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.42)_40%,rgba(0,0,0,0.7)_100%)]" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div>
            <h2 className="sr-only">{content.pillarsTitle}</h2>
            <WarpText
              text={"CREATE. ACTIVATE.\nBUILD."}
              color="#f8f5ff"
              warpStrength={0.08}
              warpScale={1.7}
              speed={0.55}
              pointerInfluence={0.42}
              pointerStrength={0.38}
              refraction={0.012}
              ripple
              fontSize="clamp(2.6rem, 7vw, 5.75rem)"
              fontWeight={700}
              fontFamily="var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif"
              letterSpacing="-0.04em"
              lineHeight={0.92}
              className="font-display"
              style={{ height: "clamp(158px, 18vw, 216px)", minHeight: 0 }}
            />
            {content.pillarsIntro ? (
              <p
                data-reveal
                className="mx-auto mt-2 max-w-2xl text-center text-[16px] leading-relaxed text-white/55 md:text-[17px]"
              >
                {content.pillarsIntro}
              </p>
            ) : null}
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-3 md:gap-6 lg:gap-8">
            {content.pillars.map((pillar, i) => (
              <li key={pillar.title} data-reveal className="min-h-[22rem]">
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
                    <div className="relative h-full overflow-hidden border border-white/12 bg-white/[0.04] p-7 backdrop-blur-xl md:p-8">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-px border border-white/8"
                      />
                      <div className="relative flex h-full flex-col">
                        <span className="font-display block text-[clamp(2.6rem,4.5vw,3.75rem)] font-medium leading-none tracking-[-0.05em] text-cyan-300/90">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div
                          aria-hidden
                          className="mt-5 h-px w-16 bg-gradient-to-r from-cyan-300/80 to-transparent"
                        />
                        <h3 className="mt-6 font-display text-[clamp(1.5rem,2.2vw,2rem)] font-medium tracking-[-0.03em] text-white">
                          {pillar.title}
                        </h3>
                        {pillar.body ? (
                          <p className="mt-4 text-[16px] leading-relaxed text-white/62">
                            {pillar.body}
                          </p>
                        ) : null}
                        {pillar.items?.length ? (
                          <ul className="mt-5 space-y-2.5 text-[15px] leading-relaxed text-white/58">
                            {pillar.items.map((item) => (
                              <li key={item} className="flex gap-3">
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </div>
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-white/10 py-20 md:py-28">
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div data-reveal className="max-w-4xl">
            <h2 className="font-display text-[clamp(1.9rem,4vw,3.4rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white">
              {content.integrationStrategyTitle}
            </h2>
          </div>

          <ul className="mt-12 space-y-0 border-t border-white/10 md:mt-14">
            {content.integrationStrategy.map((point) => (
              <li
                key={point.index}
                data-reveal
                className="grid gap-5 border-b border-white/10 py-8 md:grid-cols-[minmax(0,0.22fr)_minmax(0,1fr)] md:gap-10 md:py-10"
              >
                <p className="font-display text-[clamp(2.3rem,5vw,4rem)] font-medium leading-none tracking-[-0.04em] text-cyan-300/90">
                  {point.index}
                </p>
                <div>
                  <h3 className="font-display text-[clamp(1.35rem,2.2vw,2.1rem)] font-medium leading-[1.07] tracking-[-0.02em] text-white">
                    <DecryptedText
                      text={point.title}
                      animateOn="view"
                      sequential
                      revealDirection="start"
                      speed={28}
                      encryptedClassName="text-white/25"
                      parentClassName="block"
                    />
                  </h3>
                  <p className="mt-4 max-w-4xl text-[16px] leading-relaxed text-white/62 md:text-[17px]">
                    <DecryptedText
                      text={point.body}
                      animateOn="view"
                      sequential
                      revealDirection="start"
                      speed={12}
                      encryptedClassName="text-white/20"
                      parentClassName="block"
                    />
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="platform-kintsugi"
        className="scroll-mt-28 border-b border-white/10 py-20 md:py-28"
      >
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-20">
          <div>
            <div data-kintsugi-heading>
              <h2
                data-kintsugi-fade=""
                className="font-display text-[clamp(1.85rem,4vw,3.4rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white motion-safe:opacity-0"
              >
                {content.kintsugiTitle}
              </h2>
            </div>
            {content.kintsugiSignature ? (
              <TypewriterText
                lang="ja"
                text={content.kintsugiSignature}
                delayMs={1280}
                charMs={170}
                className="font-jp-serif mt-6 ml-auto w-fit origin-right -rotate-[6deg] text-[clamp(2.1rem,4.4vw,3.5rem)] font-bold leading-none tracking-[0.08em] text-cyan-300"
              />
            ) : null}
            <div
              aria-hidden
              className="mt-8 h-px w-24 bg-gradient-to-r from-kintsugi to-transparent"
            />
          </div>
          <div className="space-y-4 text-[16px] leading-relaxed text-white/60 md:text-[17px]">
            {content.kintsugiBody.map((p, i) => (
              <p key={p.slice(0, 48)} className="flex gap-3">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" />
                <DecryptedText
                  text={p}
                  animateOn="view"
                  sequential
                  revealDirection="start"
                  speed={18}
                  delay={i * 240}
                  parentClassName="block w-full"
                  className="text-white/60"
                  encryptedClassName="text-cyan-300/35"
                />
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div
          className="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16"
          data-reveal
        >
          <div>
            <h2 className="font-display text-[clamp(1.95rem,3.6vw,3.15rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white">
              <span className="block">The Operating Engine</span>
              <span className="block md:whitespace-nowrap">for Enterprise-Controlled</span>
              <span className="block">Intelligence</span>
            </h2>
            {content.finalBody ? (
              <p className="mt-8 max-w-md text-[17px] leading-relaxed text-white/60">
                {content.finalBody}
              </p>
            ) : null}
            <div className="mt-10">
              <SolutionCtas ctas={content.finalCtas} />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <Image
              src="/platform/vyuha-mark.png"
              alt="Vyuha"
              width={1024}
              height={576}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 42vw, 90vw"
            />
          </div>
        </div>
      </section>
    </article>
  );
}
