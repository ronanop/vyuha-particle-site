"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, type HTMLAttributes } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FluidButton } from "@/components/FluidButton";
import BlurText from "@/components/marketing/platform/BlurText";
import { SolutionCtas } from "@/components/marketing/solutions/SolutionChrome";
import { PlatformHeroTunnel } from "@/components/marketing/platform/PlatformHeroTunnel";
import WarpText from "@/components/marketing/platform/WarpText";
import ScrollRevealText from "@/components/marketing/platform/ScrollRevealText";
import DecryptedText from "@/components/marketing/platform/DecryptedText";
import { TypewriterText } from "@/components/marketing/platform/TypewriterText";
import { PlatformWhyScanner } from "@/components/marketing/platform/PlatformWhyScanner";
import { ScrambleText } from "@/components/marketing/platform/ScrambleText";
import type { PlatformOverviewContent } from "@/content/platform/types";

const PRODUCT_WAY = ["Orchestrate", "Deploy", "Bind"] as const;

function SectionLabel({
  children,
  className = "",
  ...rest
}: {
  children: string;
  className?: string;
} & HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`mb-5 font-display text-[13px] uppercase tracking-[0.18em] text-white/50 ${className}`.trim()}
      {...rest}
    >
      {children}
    </p>
  );
}

export function PlatformOverviewView({
  content,
}: {
  content: PlatformOverviewContent;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

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

    return () => ctx.revert();
  }, []);

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
          <PlatformHeroTunnel />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.55)_55%,#000_100%)]" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-6.5rem)] w-full max-w-[1400px] items-center justify-center px-6 py-10 md:px-10 lg:py-6">
          <div className="mx-auto w-full max-w-5xl text-center">
            <p
              data-hero-in
              className="mb-5 font-display text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-300/85"
            >
              {content.eyebrow}
            </p>
            <h1
              data-hero-in
              className="font-display text-[clamp(2.6rem,7vw,6.25rem)] font-medium leading-[0.9] tracking-[-0.045em] text-white"
            >
              <span className="block">{content.displayTitle[0]}</span>
              <span className="block">{content.displayTitle[1]}</span>
            </h1>
            <p
              data-hero-in
              className="mt-6 font-display text-lg font-medium tracking-[-0.02em] text-white/75 [animation-delay:160ms] md:text-xl"
            >
              {content.leitmotif}
            </p>
            <blockquote
              data-hero-in
              className="mx-auto mt-8 max-w-4xl border-t border-kintsugi pt-5 text-[16px] leading-relaxed text-white/65 [animation-delay:240ms] md:text-[17px]"
            >
              {content.quote}
            </blockquote>
            <div
              data-hero-in
              className="mx-auto mt-6 max-w-4xl space-y-4 text-[16px] leading-relaxed text-white/55 [animation-delay:300ms] md:text-[17px]"
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
              {content.primaryCtas[1] ? (
                <Link
                  href={content.primaryCtas[1].href}
                  className="inline-flex min-h-11 items-center text-[13px] tracking-wide text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  {content.primaryCtas[1].label}
                </Link>
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

        <dl className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 divide-y divide-white/10 border-t border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {content.stats.map((stat, i) => (
            <div key={stat.label} className="px-6 py-7 md:px-10">
              <dt className="sr-only">{stat.label}</dt>
              <dd
                aria-label={stat.value}
                className="font-display text-[clamp(2rem,4vw,3.25rem)] font-medium leading-none tracking-[-0.04em] text-white"
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

      <section className="border-b border-white/10 py-20 md:py-28">
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
        className="scroll-mt-28 border-b border-white/10 py-20 md:py-28"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div>
            <SectionLabel className="text-center">How it is delivered</SectionLabel>
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
              fontSize="clamp(2.6rem, 7vw, 5.75rem)"
              fontWeight={500}
              fontFamily="var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif"
              letterSpacing="-0.04em"
              lineHeight={0.92}
              className="font-display"
              style={{ height: "clamp(220px, 28vw, 320px)" }}
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

          <div className="relative mt-16">
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-cyan-300 via-white/20 to-cyan-300/50"
            />
            <ul aria-label="Three ways into the platform" className="border-b border-white/10">
              {content.products.map((product, i) => (
                <li key={product.href} data-reveal>
                  <div className="grid gap-6 border-t border-white/10 py-10 pl-7 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16 md:py-14 md:pl-10">
                    <div>
                      <p className="font-display text-[12px] uppercase tracking-[0.2em] text-cyan-300">
                        {PRODUCT_WAY[i]}
                      </p>
                      <h3 className="mt-3 font-display text-[clamp(1.85rem,3.4vw,3rem)] font-medium leading-[1.02] tracking-[-0.035em] text-white">
                        <Link href={product.href} className="transition-colors hover:text-cyan-300">
                          {product.title}
                        </Link>
                      </h3>
                    </div>
                    <div className="flex flex-col justify-center">
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
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="platform-why"
        className="relative scroll-mt-28 overflow-hidden border-b border-white/10 py-20 md:py-28"
      >
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <PlatformWhyScanner />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.42)_40%,rgba(0,0,0,0.7)_100%)]" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div>
            <SectionLabel className="text-center">Built on Airrived</SectionLabel>
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
              style={{ height: "clamp(220px, 28vw, 320px)" }}
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
          <ul className="mt-8 space-y-0 md:mt-12">
            {content.pillars.map((pillar, i) => (
              <li
                key={pillar.title}
                className="grid items-start gap-6 border-t border-white/10 py-12 md:grid-cols-[minmax(0,0.42fr)_minmax(0,1.58fr)] md:gap-10 md:py-16"
              >
                <p
                  aria-hidden
                  className="font-display select-none text-[clamp(6.5rem,16vw,12rem)] font-medium leading-[0.75] tracking-[-0.07em] text-white/25"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="pt-2 md:pt-6">
                  <ScrollRevealText
                    text={pillar.title}
                    tag="h3"
                    splitMode="Words"
                    stagger={0.08}
                    yOffset={8}
                    blur={2}
                    offsetStart={92}
                    offsetEnd={38}
                    colorHidden="rgba(255,255,255,0.18)"
                    colorRevealed="#f8f5ff"
                    className="max-w-[16ch] font-display text-[clamp(1.6rem,2.6vw,2.35rem)] font-medium leading-[1.12] tracking-[-0.03em]"
                  />
                  {pillar.body ? (
                    <ScrollRevealText
                      text={pillar.body}
                      tag="p"
                      splitMode="Words"
                      stagger={0.045}
                      yOffset={6}
                      blur={1.5}
                      offsetStart={94}
                      offsetEnd={32}
                      colorHidden="rgba(255,255,255,0.14)"
                      colorRevealed="rgba(255,255,255,0.72)"
                      className="mt-5 max-w-2xl text-[16px] leading-relaxed md:text-[17px]"
                    />
                  ) : null}
                  {pillar.items?.length ? (
                    <ul className="mt-6 max-w-xl space-y-2 text-[15px] leading-relaxed text-white/58">
                      {pillar.items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
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
              <SectionLabel className="motion-safe:opacity-0" data-kintsugi-fade="">
                {content.kintsugiEyebrow}
              </SectionLabel>
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
            <p className="mb-5 text-[13px] uppercase tracking-[0.18em] text-white/50">
              Next step
            </p>
            <h2 className="font-display max-w-[14ch] text-[clamp(2.4rem,5vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white">
              {content.finalHeadline}
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
