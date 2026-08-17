import Link from "next/link";
import {
  SolutionCtas,
  SolutionHero,
  SolutionSection,
} from "@/components/marketing/solutions/SolutionChrome";
import type {
  SolutionsFunctionContent,
  SolutionsIndustryContent,
  SolutionsOverviewContent,
} from "@/content/solutions/types";

export function SolutionsOverviewView({
  content,
}: {
  content: SolutionsOverviewContent;
}) {
  return (
    <article>
      <SolutionHero
        eyebrow={content.eyebrow}
        title={content.title}
        headline={content.subtitle}
        quote={content.quote}
        body={content.body}
        ctas={content.primaryCtas}
      />

      <SolutionSection
        title="Vyuha Solutions — by function"
        intro={content.functionsIntro}
      >
        <ul className="space-y-10">
          {content.functions.map((fn, i) => (
            <li
              key={fn.href}
              className="grid gap-4 border-t border-white/10 pt-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] md:gap-10"
            >
              <div>
                <p className="font-display text-[11px] uppercase tracking-[0.24em] text-white/35">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-xl font-medium text-white md:text-2xl">
                  {fn.title}
                </h3>
              </div>
              <div>
                <p className="font-display text-lg font-medium leading-snug text-white/85">
                  {fn.headline}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/55">
                  {fn.body}
                </p>
                <Link
                  href={fn.href}
                  className="mt-5 inline-flex text-[13px] tracking-wide text-cyan-300/90 transition-colors hover:text-cyan-200"
                >
                  {fn.cta} →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </SolutionSection>

      <SolutionSection title={content.replaceTitle} intro={content.replaceBody}>
        <ul className="max-w-2xl space-y-3 text-[15px] text-white/65">
          {content.replaceItems.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-white/55">
          {content.replaceCloser}
        </p>
      </SolutionSection>

      <SolutionSection title={content.sovereigntyTitle}>
        <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-white/60 md:text-base">
          {content.sovereigntyBody.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
        <div className="mt-10">
          <SolutionCtas ctas={content.finalCtas} />
        </div>
      </SolutionSection>
    </article>
  );
}

export function SolutionsFunctionView({
  content,
}: {
  content: SolutionsFunctionContent;
}) {
  return (
    <article>
      <SolutionHero
        eyebrow={content.eyebrow}
        title={content.title}
        headline={content.headline}
        body={content.body}
        ctas={content.primaryCtas}
      />

      {content.pillars ? (
        <SolutionSection title="What changes">
          <ul className="grid gap-4 md:grid-cols-2">
            {content.pillars.map((item) => (
              <li
                key={item}
                className="border-l border-cyan-400/30 pl-4 text-[15px] leading-relaxed text-white/65"
              >
                {item}
              </li>
            ))}
          </ul>
        </SolutionSection>
      ) : null}

      <SolutionSection
        title={content.capabilitiesTitle}
        intro={content.capabilitiesIntro}
      >
        <div className="space-y-14">
          {content.capabilities.map((cap) => (
            <div
              key={cap.title}
              className="grid gap-6 border-t border-white/10 pt-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] md:gap-12"
            >
              <div>
                <p className="font-display text-[11px] uppercase tracking-[0.22em] text-cyan-400/70">
                  {cap.eyebrow}
                </p>
                <h3 className="mt-3 font-display text-xl font-medium leading-snug text-white md:text-2xl">
                  {cap.title}
                </h3>
              </div>
              <div>
                <p className="text-[15px] leading-relaxed text-white/60">
                  {cap.body}
                </p>
                <p className="mt-5 font-display text-[11px] uppercase tracking-[0.22em] text-white/35">
                  Outcomes
                </p>
                <ul className="mt-3 space-y-2 text-[14px] text-white/65">
                  {cap.outcomes.map((o) => (
                    <li key={o} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/50" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </SolutionSection>

      {content.audience ? (
        <section className="border-b border-white/10 py-10">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <p className="max-w-3xl text-[15px] leading-relaxed text-white/50 italic">
              {content.audience}
            </p>
          </div>
        </section>
      ) : null}

      <SolutionSection title={content.whyTitle}>
        <ul className="max-w-3xl space-y-4 text-[15px] leading-relaxed text-white/65">
          {content.whyItems.map((item) => (
            <li key={item.slice(0, 48)} className="flex gap-3">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </SolutionSection>

      <SolutionSection title={content.impactTitle}>
        <ul className="grid gap-6 sm:grid-cols-2">
          {content.impactItems.map((item) => (
            <li
              key={item}
              className="border-t border-white/15 pt-4 font-display text-lg font-medium leading-snug text-white/90"
            >
              {item}
            </li>
          ))}
        </ul>
      </SolutionSection>

      {content.integrations ? (
        <SolutionSection title="Deep integration across the stack">
          <p className="max-w-3xl text-[15px] leading-relaxed text-white/60">
            {content.integrations}
          </p>
        </SolutionSection>
      ) : null}

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <SolutionCtas ctas={content.finalCtas} />
        </div>
      </section>
    </article>
  );
}

export function SolutionsIndustryView({
  content,
}: {
  content: SolutionsIndustryContent;
}) {
  return (
    <article>
      <SolutionHero
        eyebrow={content.eyebrow}
        title={content.title}
        headline={content.headline}
        body={[content.body]}
        ctas={content.finalCtas.slice(0, 1)}
      />

      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        {content.industries.map((ind) => (
          <section
            key={ind.title}
            className="border-b border-white/10 py-14 md:py-16"
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="font-display text-2xl font-medium tracking-tight text-white md:text-3xl">
                {ind.title}
              </h2>
              {ind.comingSoon ? (
                <span className="font-display text-[11px] uppercase tracking-[0.22em] text-orange-400/80">
                  Coming soon
                </span>
              ) : null}
            </div>
            <p className="mt-4 max-w-3xl font-display text-lg font-medium leading-snug text-white/80 md:text-xl">
              {ind.headline}
            </p>
            <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-white/55">
              {ind.body}
            </p>
            <p className="mt-8 font-display text-[11px] uppercase tracking-[0.22em] text-cyan-400/70">
              How Vyuha helps
            </p>
            <ul className="mt-4 max-w-3xl space-y-3 text-[15px] text-white/65">
              {ind.howHelps.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-display text-[11px] uppercase tracking-[0.22em] text-white/35">
              Outcome
            </p>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-white/70">
              {ind.outcome}
            </p>
          </section>
        ))}
      </div>

      <SolutionSection title={content.foundationTitle}>
        <p className="max-w-3xl text-[15px] leading-relaxed text-white/60">
          {content.foundationBody}
        </p>
        <div className="mt-10">
          <SolutionCtas ctas={content.finalCtas} />
        </div>
      </SolutionSection>
    </article>
  );
}
