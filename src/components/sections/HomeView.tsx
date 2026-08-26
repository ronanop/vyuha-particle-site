import { Children, type ReactNode } from "react";
import { SectionFrame } from "@/components/SectionFrame";
import { FluidButton } from "@/components/FluidButton";
import { StandardizeWheel } from "@/components/sections/StandardizeWheel";
import ScrollReveal from "@/components/marketing/ScrollReveal";
import WarpText from "@/components/marketing/platform/WarpText";
import { homeContent } from "@/content/home";

function HomeCopyBlock({
  children,
  align = "right",
}: {
  children: ReactNode;
  align?: "right" | "center";
}) {
  const inner =
    align === "center"
      ? "mx-auto w-full max-w-xl px-2 text-center md:max-w-2xl"
      : "w-full max-w-xl text-left md:ml-auto md:max-w-2xl md:pr-12 md:text-right lg:pr-20";
  return (
    <section className="relative z-10 py-14 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] md:py-24 md:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className={inner}>{children}</div>
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
    <div className="relative overflow-hidden rounded-[1.25rem] border border-white/12 bg-[#0a1018]/85 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl md:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.01))]"
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

// Turns a list of cards into a scroll-driven 3D stacked deck: each card is
// sticky, so as you scroll they pile up under a slight perspective tilt, with
// deeper cards scaled down and dimmed for depth. Pure CSS, no scroll JS.
function CardStack({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  const n = items.length;
  return (
    <div className="mt-8 [perspective:1600px]">
      <ul className="relative [transform-style:preserve-3d]">
        {items.map((child, i) => {
          const depth = n - 1 - i; // 0 = front card, higher = further back
          return (
            <li
              key={i}
              className="sticky"
              style={{
                top: `calc(5.25rem + ${i * 1.15}rem)`,
                zIndex: i + 1,
                marginBottom: i === n - 1 ? 0 : "1rem",
              }}
            >
              <div
                className="origin-top transition-[transform,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
                style={{
                  transform: `scale(${1 - depth * 0.04})`,
                  filter: `brightness(${1 - depth * 0.14})`,
                }}
              >
                {child}
              </div>
            </li>
          );
        })}
      </ul>
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
              <h1 className="font-display text-[clamp(2rem,9vw,5.8rem)] font-medium leading-[0.98] tracking-[-0.04em] text-white">
                {content.displayTitle.map((line, i) => (
                  <span
                    key={line}
                    data-hero-in
                    className={i === 0 ? "hero-tricolor block" : "block"}
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
            className="font-display max-w-[16ch] text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white md:ml-auto"
          >
            {block.title}
          </h2>
          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-white/60 md:ml-auto md:text-justify md:text-[17px]">
            {block.body}
          </p>
          <div className="mt-8 flex justify-start md:justify-end">
            <FluidButton text={block.cta.label} href={block.cta.href} />
          </div>
        </HomeCopyBlock>
      ))}

      <SectionFrame
        id="command"
        side="center"
        align="start"
        compact
        className="mb-24 md:mb-36"
        contentClassName="mx-auto w-full max-w-4xl text-center"
      >
        <div data-earth-morph="3">
          <h2 className="sr-only">Command the Agentic Enterprise</h2>
          <WarpText
            text={"Command the\nAgentic Enterprise"}
            color="#f8f5ff"
            warpStrength={0.08}
            warpScale={1.7}
            speed={0.55}
            pointerInfluence={0.42}
            pointerStrength={0.38}
            refraction={0.018}
            ripple
            fontSize="clamp(2.4rem, 9.6vw, 6.6rem)"
            fontWeight={500}
            fontFamily="var(--font-space-grotesk), var(--font-inter), system-ui, sans-serif"
            letterSpacing="-0.035em"
            lineHeight={0.95}
            className="font-display"
            style={{ height: "clamp(112px, 28vw, 264px)" }}
          />
        </div>
        <p className="mx-auto mt-3 max-w-2xl text-balance text-[17px] leading-relaxed text-white/60 md:text-[18px]">
          {content.command.body}
        </p>
        <div className="mt-8 flex justify-center">
          <FluidButton
            text={content.command.cta.label}
            href={content.command.cta.href}
          />
        </div>
      </SectionFrame>

      <SectionFrame
        id="box-perimeter"
        side="center"
        align="center"
        contentClassName="w-full"
      >
        <div className="grid w-full grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center lg:min-h-[min(50vh,28rem)] lg:pr-8">
            <h2 className="font-display text-left text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white">
              {content.operatingTitle.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <div className="mt-8 flex justify-start lg:mt-10">
              <FluidButton
                text={content.operatingCta.label}
                href={content.operatingCta.href}
              />
            </div>
          </div>
          <div className="lg:pl-8">
            <div className="space-y-10">
              {content.operatingBody.map((paragraph) => (
                <ScrollReveal
                  key={paragraph.slice(0, 48)}
                  baseOpacity={0}
                  enableBlur
                  baseRotation={5}
                  blurStrength={10}
                  containerClassName="text-left"
                  textClassName="font-display text-left text-white !text-[clamp(1.15rem,2.2vw,1.85rem)] !font-medium !leading-[1.45]"
                  wordAnimationEnd="bottom 70%"
                >
                  {paragraph}
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
        <StandardizeWheel
          cards={content.standardizeCards}
          title={content.standardizeTitle}
          intro={content.standardizeIntro}
        />
      </SectionFrame>

      <section
        id="box-delivery"
        className="relative z-10 overflow-hidden pt-0 pb-12 md:pt-0 md:pb-16 lg:pt-0 lg:pb-20"
      >
        <div className="relative mx-auto w-full max-w-[1400px] px-6 md:px-10">
          {/* Title block */}
          <div className="mb-16 max-w-3xl md:mb-20">
            <h2 className="font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-white">
              {content.controlTitle}
            </h2>
            <div
              aria-hidden
              className="mt-8 h-px w-24 bg-gradient-to-r from-cyan-400 to-transparent"
            />
          </div>

          {/* Pillar grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            {content.controlCards.map((card, ci) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.12] bg-[#070b12]/90 p-6 shadow-[0_40px_120px_-36px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:p-8 md:p-10 lg:p-12"
              >
                {/* Radial glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))]"
                />
                {/* Ghost number */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-3 -top-5 font-display text-[clamp(6rem,16vw,11rem)] font-medium leading-none tracking-[-0.07em] text-white/[0.04] md:-right-5 md:-top-7"
                >
                  {String(ci + 1).padStart(2, "0")}
                </div>

                <div className="relative">
                  <span className="font-display text-[12px] font-medium uppercase tracking-[0.28em] text-cyan-300/80">
                    Pillar {String(ci + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-4 text-[clamp(1.65rem,2.8vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.03em] text-white">
                    {card.title}
                  </h3>
                  <div
                    aria-hidden
                    className="mt-6 h-px w-12 bg-gradient-to-r from-cyan-400/60 to-transparent"
                  />
                  {card.items?.length ? (
                    <ul className="mt-8 space-y-5">
                      {card.items.map((item, ii) => (
                        <li key={item} className="flex items-start gap-4">
                          <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 font-display text-[11px] font-medium text-cyan-300/80">
                            {ii + 1}
                          </span>
                          <span className="text-[17px] leading-relaxed text-white/70 md:text-[18px]">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                {/* Kintsugi seam at bottom */}
                <svg
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full overflow-visible"
                >
                  <line
                    x1="0"
                    y1="1"
                    x2="100%"
                    y2="1"
                    stroke="url(#kintsugi-line)"
                    strokeWidth="2"
                    className="kintsugi-seam"
                  />
                  <defs>
                    <linearGradient id="kintsugi-line">
                      <stop offset="0%" stopColor="rgba(34,211,238,0.55)" />
                      <stop offset="100%" stopColor="rgba(34,211,238,0)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

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
