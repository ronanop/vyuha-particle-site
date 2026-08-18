import type { ReactNode } from "react";
import { SectionFrame } from "@/components/SectionFrame";
import { FluidButton } from "@/components/FluidButton";
import { ArchitectureTimeline } from "@/components/sections/ArchitectureTimeline";
import { homeContent } from "@/content/home";

function HomeCopyBlock({ children }: { children: ReactNode }) {
  return (
    <section className="relative z-10 py-16 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] md:py-24 md:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="ml-auto w-full max-w-xl pr-2 text-right md:max-w-2xl md:pr-12 lg:pr-20">
          {children}
        </div>
      </div>
    </section>
  );
}

function GlassCard({
  title,
  headline,
  body,
  items,
}: {
  title: string;
  headline?: string;
  body?: string;
  items?: string[];
}) {
  return (
    <div className="relative overflow-hidden border border-white/12 bg-white/[0.04] p-6 backdrop-blur-xl md:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]"
      />
      <div className="relative">
        <h3 className="font-display text-[clamp(1.2rem,1.8vw,1.5rem)] font-medium tracking-[-0.02em] text-white">
          {title}
        </h3>
        {headline ? (
          <p className="mt-2 font-display text-[15px] font-medium text-white/80">
            {headline}
          </p>
        ) : null}
        {body ? (
          <p className="mt-3 text-[16px] leading-relaxed text-white/62">{body}</p>
        ) : null}
        {items?.length ? (
          <ul className="mt-4 space-y-2 text-[16px] leading-relaxed text-white/62">
            {items.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export function HomeView() {
  const content = homeContent;

  return (
    <>
      <section
        id="top"
        data-section-side="left"
        className="relative z-10 min-h-svh pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] md:px-10"
      >
        <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1400px] items-end pb-[max(4rem,env(safe-area-inset-bottom))] pt-28 md:pb-24 md:pt-20">
          <div className="hero-copy w-full min-w-0 max-w-xl md:max-w-2xl">
              <p
                data-hero-in
                className="mb-5 font-display text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-300/85"
              >
                {content.eyebrow}
              </p>
              <h1 className="font-display text-[clamp(2rem,9vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.04em] text-white">
                {content.displayTitle.map((line, i) => (
                  <span
                    key={line}
                    data-hero-in
                    className={i === 0 ? "hero-tricolor" : "block"}
                  >
                    {line}
                  </span>
                ))}
              </h1>
              <p
                data-hero-in
                className="mt-8 max-w-xl text-[17px] leading-relaxed text-white/60 md:text-[18px]"
              >
                {content.lead}
              </p>
              <div
                data-hero-in
                className="mt-10 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
              >
                <FluidButton
                  text={content.primaryCtas[0].label}
                  href={content.primaryCtas[0].href}
                  className="w-full sm:w-auto"
                />
                {content.primaryCtas[1] ? (
                  <FluidButton
                    text={content.primaryCtas[1].label}
                    href={content.primaryCtas[1].href}
                    className="w-full sm:w-auto"
                  />
                ) : null}
              </div>
            </div>
          </div>
      </section>

      {content.foundations.map((block, i) => (
        <HomeCopyBlock key={block.title}>
          <h2
            data-earth-dock={i === 0 ? "" : undefined}
            data-earth-morph={i === 1 ? "1" : i === 2 ? "2" : undefined}
            className="font-display ml-auto max-w-[16ch] text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white"
          >
            {block.title}
          </h2>
          <p className="ml-auto mt-6 max-w-lg text-[17px] leading-relaxed text-white/60">
            {block.body}
          </p>
          <div className="mt-8 flex justify-end">
            <FluidButton text={block.cta.label} href={block.cta.href} />
          </div>
        </HomeCopyBlock>
      ))}

      <SectionFrame id="command" side="center" align="start" compact>
        <h2
          data-earth-morph="3"
          className="font-display mx-auto max-w-[18ch] text-balance text-[clamp(2rem,8vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white"
        >
          Command the <span className="whitespace-nowrap">Agentic Enterprise</span>
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-balance text-[17px] leading-relaxed text-white/60 md:text-[18px]">
          {content.command.body}
        </p>
        <div className="mt-8 flex justify-center">
          <FluidButton
            text={content.command.cta.label}
            href={content.command.cta.href}
          />
        </div>
      </SectionFrame>

      <HomeCopyBlock>
        <h2 className="font-display ml-auto max-w-[16ch] text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white">
          {content.architectureTitle}
        </h2>
        <p className="ml-auto mt-6 max-w-lg text-[17px] leading-relaxed text-white/60">
          {content.architectureIntro}
        </p>
      </HomeCopyBlock>

      <ArchitectureTimeline layers={content.architecture} />

      <SectionFrame id="box-perimeter" side="right" align="start">
        <h2 className="font-display max-w-[16ch] text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white">
          {content.operatingTitle}
        </h2>
        <div className="mt-6 max-w-lg space-y-4 text-[17px] leading-relaxed text-white/60">
          {content.operatingBody.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8">
          <FluidButton
            text={content.operatingCta.label}
            href={content.operatingCta.href}
          />
        </div>
        <h3 className="font-display mt-16 text-[clamp(1.5rem,2.4vw,2.1rem)] font-medium tracking-[-0.03em] text-white">
          {content.standardizeTitle}
        </h3>
        <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/55">
          {content.standardizeIntro}
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-4">
          {content.standardizeCards.map((card) => (
            <li key={card.title}>
              <GlassCard title={card.title} body={card.body} />
            </li>
          ))}
        </ul>
      </SectionFrame>

      <SectionFrame id="box-delivery" side="left" align="start">
        <h2 className="font-display max-w-[16ch] text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white">
          {content.controlTitle}
        </h2>
        <ul className="mt-10 grid grid-cols-1 gap-4">
          {content.controlCards.map((card) => (
            <li key={card.title}>
              <GlassCard title={card.title} items={card.items} />
            </li>
          ))}
        </ul>
      </SectionFrame>

      <SectionFrame id="demo" side="left">
        <p className="mb-5 text-[13px] uppercase tracking-[0.18em] text-white/50">
          {content.closingEyebrow}
        </p>
        <h2
          data-earth-morph="4"
          className="font-display max-w-[14ch] text-[clamp(2.4rem,5vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white"
        >
          {content.closingTitle}
        </h2>
        <p className="mt-8 max-w-md text-[17px] leading-relaxed text-white/60 md:text-[18px]">
          {content.closingBody}
        </p>
        <div className="mt-10">
          <FluidButton
            text={content.closingCta.label}
            href={content.closingCta.href}
          />
        </div>
      </SectionFrame>
    </>
  );
}
