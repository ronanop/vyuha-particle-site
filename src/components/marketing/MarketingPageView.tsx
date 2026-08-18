import {
  SolutionCtas,
  SolutionHero,
  SolutionSection,
} from "@/components/marketing/solutions/SolutionChrome";
import type {
  MarketingCard,
  MarketingPageContent,
  MarketingSection,
} from "@/content/solutions/types";

function cardGridClass(section: MarketingSection) {
  if (section.cardsColumns === 2) return "md:grid-cols-2";
  if (section.cardsColumns === 4) return "md:grid-cols-2 lg:grid-cols-4";
  return "md:grid-cols-3";
}

function MarketingCards({ cards, columnsClass }: { cards: MarketingCard[]; columnsClass: string }) {
  return (
    <ul className={`grid grid-cols-1 gap-5 ${columnsClass}`}>
      {cards.map((card) => (
        <li
          key={card.title}
          className="relative overflow-hidden border border-white/12 bg-white/[0.04] p-7 backdrop-blur-xl"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))]"
          />
          <div className="relative">
            <h3 className="font-display text-[clamp(1.2rem,1.8vw,1.5rem)] font-medium tracking-[-0.02em] text-white">
              {card.title}
            </h3>
            {card.comingSoon ? (
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-cyan-300/80">
                Coming soon
              </p>
            ) : null}
            {card.headline ? (
              <p className="mt-2 font-display text-[15px] font-medium leading-snug text-white/80">
                {card.headline}
              </p>
            ) : null}
            {card.body ? (
              <p className="mt-3 text-[15px] leading-relaxed text-white/62">{card.body}</p>
            ) : null}
            {card.items?.length ? (
              <>
                {card.itemsLabel ? (
                  <p className="mt-5 font-display text-[11px] uppercase tracking-[0.22em] text-white/35">
                    {card.itemsLabel}
                  </p>
                ) : null}
                <ul className={`space-y-2 text-[15px] leading-relaxed text-white/62 ${card.itemsLabel ? "mt-3" : "mt-4"}`}>
                  {card.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {card.outcomes?.length ? (
              <>
                <p className="mt-5 font-display text-[11px] uppercase tracking-[0.22em] text-white/35">
                  Outcomes
                </p>
                <ul className="mt-3 space-y-2 text-[14px] text-white/65">
                  {card.outcomes.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/50" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {card.outcome ? (
              <>
                <p className="mt-5 font-display text-[11px] uppercase tracking-[0.22em] text-white/35">
                  Outcome
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/62">{card.outcome}</p>
              </>
            ) : null}
            {card.cta ? (
              <div className="mt-6">
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
  return (
    <article>
      <SolutionHero
        eyebrow={content.eyebrow}
        title={content.title}
        headline={content.headline}
        quote={content.quote}
        body={content.body}
        ctas={content.primaryCtas}
      />

      {content.sections.map((section, index) => (
        <SolutionSection
          key={section.id || section.title || `section-${index}`}
          id={section.id}
          title={section.title}
          headline={section.headline}
          intro={section.intro}
        >
          {section.paragraphs?.length ? (
            <div className="max-w-3xl space-y-4 text-[15px] leading-relaxed text-white/65">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {section.items?.length ? (
            <ul className="max-w-3xl space-y-3 text-[15px] leading-relaxed text-white/65">
              {section.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {section.stats?.length ? (
            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {section.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border border-white/12 bg-white/[0.04] px-5 py-6"
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
            <div className={section.paragraphs?.length || section.stats?.length || section.items?.length ? "mt-8" : ""}>
              <MarketingCards
                cards={section.cards}
                columnsClass={cardGridClass(section)}
              />
            </div>
          ) : null}

          {section.pendingNotice ? (
            <p className="max-w-3xl border border-dashed border-white/25 bg-white/[0.03] px-5 py-6 text-[15px] leading-relaxed text-white/60">
              {section.pendingNotice}
            </p>
          ) : null}

          {section.closer ? (
            <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-white/55">
              {section.closer}
            </p>
          ) : null}

          {section.closerLines?.length ? (
            <div className="mt-8 max-w-3xl space-y-2 text-[15px] leading-relaxed text-white/70">
              {section.closerLines.map((line) => (
                <p key={line} className="font-display font-medium text-white">
                  {line}
                </p>
              ))}
            </div>
          ) : null}

          {section.cta ? (
            <div className="mt-8">
              <SolutionCtas ctas={[section.cta]} />
            </div>
          ) : null}
        </SolutionSection>
      ))}

      {content.finalHeadline || content.finalBody || content.finalCtas?.length ? (
        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            {content.finalEyebrow ? (
              <p className="mb-4 font-display text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-400/80">
                {content.finalEyebrow}
              </p>
            ) : null}
            {content.finalHeadline ? (
              <h2 className="max-w-3xl font-display text-2xl font-medium tracking-tight text-white md:text-3xl">
                {content.finalHeadline}
              </h2>
            ) : null}
            {content.finalBody ? (
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/55 md:text-base">
                {content.finalBody}
              </p>
            ) : null}
            {content.finalCtas?.length ? (
              <div className={content.finalHeadline || content.finalBody ? "mt-8" : ""}>
                <SolutionCtas ctas={content.finalCtas} />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </article>
  );
}
