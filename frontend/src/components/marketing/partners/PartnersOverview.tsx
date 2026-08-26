import Image from "next/image";
import { PartnersHero } from "@/components/marketing/partners/PartnersHero";
import { SolutionCtas } from "@/components/marketing/solutions/SolutionChrome";
import SplitText from "@/components/ui/SplitText";
import type { PartnerDetail, PartnersContent } from "@/content/partners";

function PartnerSection({
  partner,
  reverse,
}: {
  partner: PartnerDetail;
  reverse: boolean;
}) {
  return (
    <section
      id={partner.id}
      className="scroll-mt-28 border-b border-white/10 py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <article
          className={`grid items-start gap-10 lg:grid-cols-2 lg:gap-16 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="flex flex-col gap-5">
            <div
              className={`relative min-h-[18rem] overflow-hidden border border-white/12 md:min-h-[22rem] lg:min-h-[28rem] ${
                partner.imageFit === "contain"
                  ? partner.id === "dell"
                    ? "bg-white"
                    : "bg-black"
                  : "bg-white/[0.03]"
              }`}
            >
              {partner.image ? (
                <Image
                  src={partner.image}
                  alt={`${partner.name} logo`}
                  fill
                  className={
                    partner.imageFit === "contain"
                      ? "object-contain p-8 md:p-12 lg:p-16"
                      : "object-cover"
                  }
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  priority={partner.id === "airrived"}
                />
              ) : (
                <>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-px border border-white/8"
                  />
                </>
              )}
            </div>
            <div>
              <h3 className="font-display text-[clamp(2.4rem,5vw,4.25rem)] font-medium leading-[0.95] tracking-[-0.04em] text-white">
                {partner.name}
              </h3>
              <p className="mt-5 max-w-md border-t border-white/15 pt-5 font-display text-[15px] font-medium leading-snug tracking-[-0.01em] text-white/75 md:text-base">
                {partner.role}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center lg:min-h-[28rem]">
            <p className="font-display text-[clamp(1.25rem,2.2vw,1.65rem)] font-medium leading-snug tracking-[-0.02em] text-white/90">
              {partner.lead}
            </p>

            <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-white/60 md:text-[16px]">
              {partner.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="font-display text-[11px] uppercase tracking-[0.22em] text-white/35">
                Focus
              </p>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-white/70">
                {partner.focus.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export function PartnersOverview({ content }: { content: PartnersContent }) {
  return (
    <article>
      <PartnersHero
        eyebrow={content.eyebrow}
        title={content.title}
        body={content.body}
        ctas={content.primaryCtas}
      />

      <section
        id="intelligence-augmented"
        className="scroll-mt-28 border-b border-white/10 py-16 md:py-24"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 text-center md:px-10">
          <div className="mx-auto flex max-w-5xl flex-col items-center">
            <SplitText
              tag="h2"
              text={content.intelligence.title}
              className="font-display text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white"
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
            <SplitText
              tag="p"
              text={content.intelligence.headline}
              className="mt-6 font-display text-[clamp(1rem,1.55vw,1.25rem)] font-medium leading-snug tracking-[-0.02em] text-white/80 lg:whitespace-nowrap"
              textAlign="center"
              whiteSpace="normal"
              splitType="words"
              delay={40}
              duration={0.65}
              ease="power3.out"
              from={{ opacity: 0, y: 22 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-80px"
            />
            <div className="mt-8 flex w-full flex-col items-center space-y-4 text-[15px] leading-relaxed text-white/60 md:text-base">
              {content.intelligence.paragraphs.map((paragraph, index) => (
                <SplitText
                  key={paragraph.slice(0, 48)}
                  tag="p"
                  text={paragraph}
                  className={
                    index === 0
                      ? "w-full lg:whitespace-nowrap"
                      : "mx-auto w-full max-w-5xl whitespace-pre-line"
                  }
                  textAlign="center"
                  whiteSpace={index === 0 ? "normal" : "pre-line"}
                  splitType="words"
                  delay={index === 0 ? 36 : 22}
                  duration={0.6}
                  ease="power3.out"
                  from={{ opacity: 0, y: 18 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.15}
                  rootMargin="-60px"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="our-partners"
        className="scroll-mt-28 border-b border-white/10 py-16 md:py-20"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 text-center md:px-10">
          <h2 className="mx-auto max-w-3xl font-display text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white">
            {content.partnersTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/55 md:text-base">
            {content.partnersIntro}
          </p>
        </div>
      </section>

      {content.partners.map((partner, index) => (
        <PartnerSection
          key={partner.id}
          partner={partner}
          reverse={index % 2 === 1}
        />
      ))}

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <h2 className="max-w-3xl font-display text-[clamp(1.85rem,4vw,3rem)] font-medium tracking-tight text-white">
            {content.finalHeadline}
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/55 md:text-base">
            {content.finalBody}
          </p>
          <div className="mt-8">
            <SolutionCtas ctas={content.finalCtas} />
          </div>
        </div>
      </section>
    </article>
  );
}
