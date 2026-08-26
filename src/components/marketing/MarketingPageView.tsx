"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FluidButton } from "@/components/FluidButton";
import { SolutionCtas } from "@/components/marketing/solutions/SolutionChrome";
import FoldText from "@/components/ui/FoldText";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type {
  MarketingCard,
  MarketingPageContent,
  MarketingSection,
} from "@/content/solutions/types";
import { prefersReducedMotion } from "@/lib/utils/motion";

function sectionId(section: MarketingSection, index: number): string {
  if (section.id) return section.id;
  if (section.title) {
    return section.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 48);
  }
  return `section-${index}`;
}

function cardGridClass(section: MarketingSection) {
  if (section.cardsColumns === 2) return "md:grid-cols-2";
  if (section.cardsColumns === 4) return "md:grid-cols-2 lg:grid-cols-4";
  return "md:grid-cols-3";
}

function solutionAtmosphere(path: string): string {
  if (path.includes("security")) {
    return "radial-gradient(ellipse at 18% 0%, rgba(34,211,238,0.16), transparent 52%), radial-gradient(ellipse at 85% 20%, rgba(59,130,246,0.1), transparent 48%), radial-gradient(ellipse at 50% 100%, rgba(34,211,238,0.05), transparent 40%)";
  }
  if (path.includes("it-operations")) {
    return "radial-gradient(ellipse at 22% 0%, rgba(34,211,238,0.14), transparent 50%), radial-gradient(ellipse at 80% 18%, rgba(103,232,249,0.08), transparent 46%), radial-gradient(ellipse at 50% 100%, rgba(59,130,246,0.06), transparent 40%)";
  }
  if (path.includes("business")) {
    return "radial-gradient(ellipse at 16% 8%, rgba(34,211,238,0.13), transparent 50%), radial-gradient(ellipse at 78% 12%, rgba(249,115,22,0.07), transparent 45%), radial-gradient(ellipse at 50% 100%, rgba(34,211,238,0.05), transparent 42%)";
  }
  return "radial-gradient(ellipse at 20% 0%, rgba(34,211,238,0.15), transparent 52%), radial-gradient(ellipse at 82% 16%, rgba(19,136,8,0.07), transparent 46%), radial-gradient(ellipse at 50% 100%, rgba(34,211,238,0.05), transparent 40%)";
}

function MarketingCards({
  cards,
  columnsClass,
}: {
  cards: MarketingCard[];
  columnsClass: string;
}) {
  return (
    <ul className={`grid grid-cols-1 gap-5 ${columnsClass} md:gap-6`}>
      {cards.map((card, i) => (
        <li
          key={card.title}
          data-reveal
          className="group relative overflow-hidden border border-white/12 bg-white/[0.04] p-7 backdrop-blur-xl transition-[border-color,background-color] duration-200 hover:border-cyan-300/30 hover:bg-white/[0.055] md:p-8"
          style={{ transitionDelay: `${Math.min(i, 5) * 40}ms` }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-px border border-white/8 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />
          <div className="relative flex h-full flex-col">
            <h3 className="font-display text-[clamp(1.2rem,1.8vw,1.5rem)] font-medium tracking-[-0.02em] text-white">
              {card.title}
            </h3>
            {card.comingSoon ? (
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-cyan-300/80">
                Coming soon
              </p>
            ) : null}
            {card.headline ? (
              <p className="mt-3 font-display text-[15px] font-medium leading-snug text-white/80 md:text-[16px]">
                {card.headline}
              </p>
            ) : null}
            {card.body ? (
              <p className="mt-3 text-[15px] leading-relaxed text-white/62 md:text-[16px]">
                {card.body}
              </p>
            ) : null}
            {card.items?.length ? (
              <>
                {card.itemsLabel ? (
                  <p className="mt-5 font-display text-[11px] uppercase tracking-[0.22em] text-cyan-300/70">
                    {card.itemsLabel}
                  </p>
                ) : null}
                <ul
                  className={`space-y-2.5 text-[15px] leading-relaxed text-white/62 ${card.itemsLabel ? "mt-3" : "mt-5"}`}
                >
                  {card.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {card.outcomes?.length ? (
              <>
                <p className="mt-5 font-display text-[11px] uppercase tracking-[0.22em] text-cyan-300/70">
                  Outcomes
                </p>
                <ul className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-white/65 md:text-[15px]">
                  {card.outcomes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/50"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {card.outcome ? (
              <>
                <p className="mt-5 font-display text-[11px] uppercase tracking-[0.22em] text-cyan-300/70">
                  Outcome
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/62">
                  {card.outcome}
                </p>
              </>
            ) : null}
            {card.cta ? (
              <div className="mt-auto pt-6">
                <SolutionCtas ctas={[card.cta]} />
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function MarketingPageView({
  content,
}: {
  content: MarketingPageContent;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const navSections = content.sections
    .filter((section) => section.title)
    .slice(0, 3)
    .map((section, index) => ({
      id: sectionId(section, index),
      label: section.title!.split(/[:.|]/)[0]?.trim() || section.title!,
    }));
  const firstSectionId = content.sections[0]
    ? sectionId(content.sections[0], 0)
    : "solution-content";

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;

    if (prefersReducedMotion()) {
      root.classList.add("hero-ready");
      return;
    }

    const readyTimer = setTimeout(() => root.classList.add("hero-ready"), 280);

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
            "radial-gradient(ellipse at 50% 35%, #0a1a1f 0%, #000000 55%, #050505 100%)",
        }}
      />

      <article ref={rootRef} className="solutions-page relative z-10">
        <a
          href={`#${firstSectionId}`}
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-24 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to solution content
        </a>

        <header className="relative overflow-hidden border-b border-white/10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: solutionAtmosphere(content.path) }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.55)_70%,#000_100%)]"
          />

          <div className="relative z-10 mx-auto flex min-h-[min(100svh,56rem)] w-full max-w-[1400px] flex-col justify-end px-6 pt-28 pb-14 md:px-10 md:pt-32 md:pb-16">
            <div className="max-w-3xl">
              <p
                data-hero-in
                className="mb-5 font-display text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-400/85"
              >
                {content.eyebrow}
              </p>

              <h1 className="font-display text-[clamp(2.2rem,5.5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.04em] text-white">
                <FoldText
                  text={content.title}
                  splitBy="word"
                  hinge="top"
                  trigger="mount"
                  duration={0.6}
                  stagger={0.045}
                  ease="power3.out"
                  perspective={800}
                  creaseShading={0.4}
                  fontSize="clamp(2.2rem, 5.5vw, 4.5rem)"
                  fontWeight={500}
                  color="#ffffff"
                  className="font-display"
                  style={{ letterSpacing: "-0.04em", lineHeight: 0.98 }}
                />
              </h1>

              {content.headline ? (
                <p
                  data-hero-in
                  className="mt-6 max-w-2xl font-display text-[clamp(1.1rem,2vw,1.5rem)] font-medium leading-snug tracking-[-0.02em] text-white/80 [animation-delay:160ms]"
                >
                  {content.headline}
                </p>
              ) : null}

              {content.quote ? (
                <blockquote
                  data-hero-in
                  className="mt-6 max-w-2xl border-l border-cyan-400/40 pl-5 text-[15px] leading-relaxed text-white/60 italic [animation-delay:220ms] md:text-base"
                >
                  {content.quote}
                </blockquote>
              ) : null}

              <div
                data-hero-in
                className="mt-6 max-w-2xl space-y-4 border-t border-kintsugi pt-5 text-[16px] leading-relaxed text-white/60 [animation-delay:260ms] md:text-[17px]"
              >
                {content.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>

              {content.primaryCtas.length > 0 ? (
                <div
                  data-hero-in
                  className="mt-10 flex flex-col items-stretch gap-3 [animation-delay:380ms] sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
                >
                  <FluidButton
                    text={content.primaryCtas[0].label}
                    href={content.primaryCtas[0].href}
                    className="w-full cursor-pointer sm:w-auto"
                  />
                  {content.primaryCtas.slice(1).map((cta) => (
                    <TransitionLink
                      key={cta.href + cta.label}
                      href={cta.href}
                      className="inline-flex min-h-11 cursor-pointer items-center justify-center text-[13px] tracking-wide text-white/55 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 sm:justify-start"
                    >
                      {cta.label}
                    </TransitionLink>
                  ))}
                </div>
              ) : null}
            </div>

            {navSections.length > 0 ? (
              <nav
                aria-label="On this page"
                data-hero-in
                className="mt-12 hidden gap-6 border-t border-white/10 pt-6 text-[12px] uppercase tracking-[0.16em] text-white/40 [animation-delay:460ms] sm:flex"
              >
                {navSections.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="max-w-[14rem] truncate cursor-pointer transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            ) : null}
          </div>
        </header>

        {content.sections.map((section, index) => {
          const id = sectionId(section, index);
          const hasLead =
            Boolean(section.paragraphs?.length) ||
            Boolean(section.items?.length) ||
            Boolean(section.stats?.length);

          return (
            <section
              key={id}
              id={id}
              className="scroll-mt-28 border-b border-white/10 py-16 md:py-24"
            >
              <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
                {(section.title || section.headline || section.intro) && (
                  <div data-reveal className="max-w-3xl">
                    <div aria-hidden className="mb-5 h-px w-14 bg-cyan-300/70" />
                    {section.title ? (
                      <h2 className="max-w-[24ch] font-display text-[clamp(1.75rem,3.6vw,3rem)] font-medium leading-[1.02] tracking-[-0.035em] text-white">
                        {section.title}
                      </h2>
                    ) : null}
                    {section.headline ? (
                      <h3
                        className={`max-w-3xl font-display text-xl font-medium tracking-tight text-white/90 md:text-2xl ${section.title ? "mt-4" : ""}`}
                      >
                        {section.headline}
                      </h3>
                    ) : null}
                    {section.intro ? (
                      <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/55 md:text-[17px]">
                        {section.intro}
                      </p>
                    ) : null}
                  </div>
                )}

                <div
                  className={
                    section.title || section.headline || section.intro
                      ? "mt-10 md:mt-12"
                      : ""
                  }
                >
                  {section.paragraphs?.length ? (
                    <div
                      data-reveal
                      className="mb-10 max-w-3xl space-y-4 text-[16px] leading-relaxed text-white/65 md:text-[17px]"
                    >
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                      ))}
                    </div>
                  ) : null}

                  {section.items?.length ? (
                    <ul
                      data-reveal
                      className="mb-10 max-w-3xl space-y-3 text-[16px] leading-relaxed text-white/65"
                    >
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span
                            aria-hidden
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {section.stats?.length ? (
                    <dl
                      data-reveal
                      className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    >
                      {section.stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="border border-white/12 bg-white/[0.04] px-5 py-6 backdrop-blur-xl"
                        >
                          <dt className="sr-only">{stat.label}</dt>
                          <dd className="font-display text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-none tracking-[-0.04em] text-white">
                            {stat.value}
                          </dd>
                          <p className="mt-3 text-[13px] uppercase tracking-[0.16em] text-white/45">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {section.cards?.length ? (
                    <div className={hasLead ? "mt-2" : ""}>
                      <MarketingCards
                        cards={section.cards}
                        columnsClass={cardGridClass(section)}
                      />
                    </div>
                  ) : null}

                  {section.pendingNotice ? (
                    <p
                      data-reveal
                      className="mt-8 max-w-3xl border border-dashed border-white/25 bg-white/[0.03] px-5 py-6 text-[15px] leading-relaxed text-white/60"
                    >
                      {section.pendingNotice}
                    </p>
                  ) : null}

                  {section.closer ? (
                    <p
                      data-reveal
                      className="mt-10 max-w-3xl text-[16px] leading-relaxed text-white/55"
                    >
                      {section.closer}
                    </p>
                  ) : null}

                  {section.closerLines?.length ? (
                    <div
                      data-reveal
                      className="mt-10 max-w-3xl space-y-2 text-[16px] leading-relaxed"
                    >
                      {section.closerLines.map((line) => (
                        <p
                          key={line}
                          className="font-display font-medium text-white"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  ) : null}

                  {section.cta ? (
                    <div data-reveal className="mt-10">
                      <SolutionCtas ctas={[section.cta]} />
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          );
        })}

        {content.finalHeadline ||
        content.finalBody ||
        content.finalCtas?.length ? (
          <section className="relative overflow-hidden py-20 md:py-28">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(34,211,238,0.12),transparent_55%)]"
            />
            <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
              <div data-reveal className="max-w-3xl">
                {content.finalEyebrow || content.finalHeadline ? (
                  <div className="mb-5 flex items-center gap-4">
                    <div aria-hidden className="h-px w-14 bg-cyan-300/70" />
                    <span className="font-display text-[12px] uppercase tracking-[0.18em] text-cyan-300">
                      {content.finalEyebrow || "Next step"}
                    </span>
                  </div>
                ) : null}
                {content.finalHeadline ? (
                  <h2 className="font-display text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.035em] text-white">
                    {content.finalHeadline}
                  </h2>
                ) : null}
                {content.finalBody ? (
                  <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/55 md:text-[17px]">
                    {content.finalBody}
                  </p>
                ) : null}
                {content.finalCtas?.length ? (
                  <div
                    className={
                      content.finalHeadline || content.finalBody ? "mt-10" : ""
                    }
                  >
                    <SolutionCtas ctas={content.finalCtas} />
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
