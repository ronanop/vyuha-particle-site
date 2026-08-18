"use client";

import Link from "next/link";
import { useEffect, useRef, type HTMLAttributes } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FluidButton } from "@/components/FluidButton";
import BlurText from "@/components/marketing/platform/BlurText";
import { PlatformHeroTunnel } from "@/components/marketing/platform/PlatformHeroTunnel";
import { SolutionCtas } from "@/components/marketing/solutions/SolutionChrome";
import type { SolutionsOverviewContent } from "@/content/solutions/types";

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

export function SolutionsOverviewView({
  content,
}: {
  content: SolutionsOverviewContent;
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
    }, root);

    return () => ctx.revert();
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
              <a href="#solutions-functions" className="transition-colors hover:text-white">
                By function
              </a>
              <a href="#solutions-replace" className="transition-colors hover:text-white">
                Replace
              </a>
              <a href="#solutions-industries" className="transition-colors hover:text-white">
                Industries
              </a>
            </nav>
          </div>
        </div>
      </header>

      <section
        id="solutions-functions"
        className="scroll-mt-28 border-b border-white/10 py-20 md:py-28"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div data-reveal className="max-w-3xl">
            <div className="mb-5 flex items-center gap-4">
              <div aria-hidden className="h-px w-16 bg-cyan-300/70" />
              <BlurText
                text="BY FUNCTION"
                delay={90}
                animateBy="letters"
                direction="top"
                className="font-display text-[13px] uppercase tracking-[0.18em] text-cyan-300"
              />
            </div>
            <h2 className="max-w-[16ch] font-display text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white">
              {content.functionsTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/55 md:text-[17px]">
              {content.functionsIntro}
            </p>
          </div>

          <div className="relative mt-16">
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-cyan-300 via-white/20 to-cyan-300/50"
            />
            <ul aria-label="Solutions by function" className="border-b border-white/10">
              {content.functions.map((item) => (
                <li key={item.href} data-reveal>
                  <div className="grid gap-6 border-t border-white/10 py-10 pl-7 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-16 md:py-14 md:pl-10">
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
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="solutions-replace"
        className="scroll-mt-28 border-b border-white/10 py-20 md:py-28"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div data-reveal className="max-w-3xl">
            <SectionLabel>What it absorbs</SectionLabel>
            <h2 className="max-w-[16ch] font-display text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white">
              {content.replaceTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/55 md:text-[17px]">
              {content.replaceIntro}
            </p>
          </div>
          <ul className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6 lg:gap-8">
            {content.replacements.map((item) => (
              <li
                key={item.title}
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
              </li>
            ))}
          </ul>
          <p
            data-reveal
            className="mt-12 max-w-3xl text-[16px] leading-relaxed text-white/55 md:text-[17px]"
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
          <div data-reveal className="max-w-3xl">
            <div className="mb-5 flex items-center gap-4">
              <div aria-hidden className="h-px w-16 bg-cyan-300/70" />
              <BlurText
                text="INDUSTRIES"
                delay={90}
                animateBy="letters"
                direction="top"
                className="font-display text-[13px] uppercase tracking-[0.18em] text-cyan-300"
              />
            </div>
            <h2 className="max-w-[18ch] font-display text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white">
              {content.industriesTitle}
            </h2>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/55 md:text-[17px]">
              {content.industriesIntro}
            </p>
          </div>

          <ul
            data-reveal
            className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-white/12 bg-white/12 md:grid-cols-2"
          >
            {content.industries.map((industry, i) => (
              <li
                key={industry.title}
                className="bg-black p-7 md:min-h-[16rem] md:p-10"
              >
                <p className="font-display text-[12px] uppercase tracking-[0.2em] text-cyan-300/80">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-[clamp(1.5rem,2.4vw,2.1rem)] font-medium tracking-[-0.03em] text-white">
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
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10" data-reveal>
          <p className="mb-5 text-[13px] uppercase tracking-[0.18em] text-white/50">
            Next step
          </p>
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
      </section>
    </article>
  );
}
