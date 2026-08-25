"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FluidButton } from "@/components/FluidButton";
import { HeroParticle } from "@/components/hero/HeroParticle";
import { LeaderProfileCard } from "@/components/marketing/company/LeaderProfileCard";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import BlurText from "@/components/marketing/platform/BlurText";
import { SolutionCtas } from "@/components/marketing/solutions/SolutionChrome";
import FoldText from "@/components/ui/FoldText";
import type { CompanyContent } from "@/content/company/types";

export function CompanyOverviewView({ content }: { content: CompanyContent }) {
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
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, #0a1a1f 0%, #000000 55%, #050505 100%)",
        }}
      />

      <article ref={rootRef} className="company-page relative z-10">
      <a
        href="#company-intelligence"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-24 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to company content
      </a>

      <header className="relative overflow-hidden border-b border-white/10">
        <HeroParticle
          logoImage="/company-lightbulb.png?v=3"
          className="pointer-events-none absolute inset-0 z-0"
        />
        <div className="relative z-10 mx-auto grid min-h-svh w-full max-w-[1400px] items-center gap-10 px-6 pt-28 pb-10 md:px-10 md:pt-32 lg:grid-cols-2 lg:gap-8 lg:pb-6">
          <div className="w-full max-w-xl text-left lg:max-w-none">
            <h1 data-hero-in className="font-display">
              <FoldText
                text={content.displayTitle.join("\n")}
                splitBy="char"
                hinge="top"
                trigger="mount"
                duration={0.65}
                stagger={0.028}
                ease="power3.out"
                perspective={700}
                creaseShading={0.45}
                fontSize="clamp(2.4rem, 5.5vw, 5.25rem)"
                fontWeight={500}
                color="#ffffff"
                className="tracking-[-0.045em]"
              />
            </h1>
            <div
              data-hero-in
              className="mt-8 max-w-xl space-y-4 border-t border-kintsugi pt-5 [animation-delay:240ms]"
            >
              {content.body.map((paragraph) => (
                <FoldText
                  key={paragraph.slice(0, 48)}
                  text={paragraph}
                  splitBy="word"
                  hinge="top"
                  trigger="mount"
                  duration={0.55}
                  stagger={0.018}
                  ease="power3.out"
                  perspective={700}
                  creaseShading={0.4}
                  fontSize="clamp(1rem, 1.15vw, 1.0625rem)"
                  fontWeight={400}
                  color="rgba(255,255,255,0.65)"
                  className="leading-relaxed tracking-normal"
                  style={{
                    display: "block",
                    letterSpacing: "0",
                    lineHeight: 1.65,
                  }}
                />
              ))}
            </div>
            <div
              data-hero-in
              className="mt-10 flex flex-wrap items-center justify-start gap-4 [animation-delay:380ms]"
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
          </div>

          <div className="hidden min-h-[min(52vh,20rem)] lg:block" aria-hidden />
        </div>
      </header>

      <section
        id="company-intelligence"
        className="scroll-mt-28 border-b border-white/10 py-20 md:py-28"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div data-reveal className="max-w-3xl">
            <h2 className="max-w-[18ch] font-display text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white">
              {content.intelligence.title}
            </h2>
          </div>

          <ul className="mt-14 flex w-full flex-col border border-white/12 lg:flex-row">
            {content.intelligence.pillars.map((pillar) => (
              <li
                key={pillar.title}
                data-reveal
                className="group relative flex-1 overflow-hidden border-b border-white/12 bg-white/[0.04] p-7 backdrop-blur-xl transition-colors hover:bg-white/[0.06] last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0 md:p-8"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-px border border-white/8"
                />
                <h3 className="relative font-display text-[clamp(1.2rem,1.6vw,1.5rem)] font-medium tracking-[-0.02em] text-white">
                  {pillar.title}
                </h3>
                <p className="relative mt-4 text-[15px] leading-relaxed text-white/62 md:text-[16px]">
                  {pillar.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="company-why"
        className="scroll-mt-28 border-b border-white/10 py-20 md:py-28"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div data-reveal className="mx-auto max-w-3xl text-center">
            <h2 className="mx-auto max-w-[14ch] font-display text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white">
              {content.why.title}
            </h2>
          </div>

          <div className="mt-16 grid w-full grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div data-reveal className="lg:sticky lg:top-28 lg:pt-2">
              <p className="max-w-md text-left font-display text-[clamp(1.35rem,2.4vw,1.85rem)] font-medium leading-snug tracking-[-0.025em] text-white/90">
                {content.why.paragraphs[0]}
              </p>
            </div>

            <div className="flex w-full flex-col gap-8 text-left">
              {content.why.paragraphs.slice(1).map((paragraph) => (
                <ScrollReveal
                  key={paragraph.slice(0, 48)}
                  baseOpacity={0}
                  enableBlur
                  baseRotation={3}
                  blurStrength={8}
                  transformOrigin="0% 50%"
                  containerClassName="w-full !my-0 text-left"
                  textClassName="w-full !text-[16px] !font-medium !leading-relaxed !tracking-[-0.01em] text-left text-white/80 md:!text-[17px] [text-shadow:0_0_24px_rgba(255,255,255,0.18),0_0_2px_rgba(165,243,252,0.35)]"
                  wordAnimationEnd="bottom 75%"
                >
                  {paragraph}
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div
            data-reveal
            className="mx-auto mt-16 max-w-4xl border-t border-kintsugi pt-8 text-center"
          >
            <FoldText
              text={content.why.closer}
              splitBy="word"
              hinge="top"
              trigger="scroll"
              duration={0.65}
              stagger={0.04}
              ease="power3.out"
              perspective={700}
              creaseShading={0.5}
              fontSize="clamp(1.35rem, 2.6vw, 2rem)"
              fontWeight={500}
              color="#ffffff"
              className="font-display tracking-[-0.03em]"
              style={{
                display: "block",
                lineHeight: 1.25,
                textAlign: "center",
              }}
            />
          </div>
        </div>
      </section>

      <section
        id="leadership"
        className="scroll-mt-28 border-b border-white/10 pt-20 pb-20 md:pt-28 md:pb-28"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div data-reveal className="max-w-3xl">
            <div className="mb-5 flex items-center gap-4">
              <div aria-hidden className="h-px w-16 bg-cyan-300/70" />
              <BlurText
                text="THE PEOPLE"
                delay={90}
                animateBy="letters"
                direction="top"
                className="font-display text-[13px] uppercase tracking-[0.18em] text-cyan-300"
              />
            </div>
            <h2 className="font-display text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white">
              {content.leadership.title}
            </h2>
          </div>

          <ul className="mt-16 space-y-16 md:space-y-20">
            {content.leadership.people.map((person) => (
              <li key={person.name} data-reveal className="border-t border-white/10 pt-12 md:pt-16">
                <article className="grid items-start gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16">
                  <LeaderProfileCard person={person} />
                  <div className="flex flex-col justify-center md:min-h-[28rem]">
                    <blockquote className="mb-8 font-purgatory text-[clamp(1.25rem,2.2vw,1.75rem)] font-normal leading-snug tracking-[-0.01em] text-white/90">
                      {person.quote}
                    </blockquote>
                    <div className="space-y-4 text-[16px] leading-relaxed text-white/55 md:text-[17px]">
                      {person.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                      ))}
                    </div>
                    <div className="mt-8 space-y-1 font-display text-[14px] tracking-[-0.01em] text-white/75">
                      {person.signoff.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 bg-black pb-24 pt-16 md:pb-32 md:pt-20">
        <div
          className="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16"
          data-reveal
        >
          <div>
            <p className="mb-5 text-[13px] uppercase tracking-[0.18em] text-white/50">
              Next step
            </p>
            <h2 className="font-display max-w-[16ch] text-[clamp(2.4rem,5vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white">
              {content.why.paragraphs[0]}
            </h2>
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
    </>
  );
}
