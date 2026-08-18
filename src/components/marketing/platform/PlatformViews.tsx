import {
  SolutionCtas,
  SolutionHero,
  SolutionSection,
} from "@/components/marketing/solutions/SolutionChrome";
import type {
  PlatformProductContent,
  PlatformProductSection,
} from "@/content/platform/types";

export { PlatformOverviewView } from "@/components/marketing/platform/PlatformOverview";

function ProductCards({ section }: { section: PlatformProductSection }) {
  if (!section.cards?.length) return null;
  const columns = section.cardsColumns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <ul className={`grid grid-cols-1 gap-5 ${columns}`}>
      {section.cards.map((card) => (
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
            {card.body ? (
              <p className="mt-3 text-[15px] leading-relaxed text-white/62">{card.body}</p>
            ) : null}
            {card.items?.length ? (
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-white/62">
                {card.items.map((item) => (
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
  );
}

function ProductTable({ section }: { section: PlatformProductSection }) {
  if (!section.table) return null;
  const [firstHeader, ...restHeaders] = section.table.headers;

  return (
    <div className="overflow-x-auto border border-white/12">
      <table className="w-full min-w-[40rem] border-collapse text-left text-[14px] leading-relaxed md:text-[15px]">
        <caption className="sr-only">{section.title}</caption>
        <thead>
          <tr className="border-b border-white/12 bg-white/[0.04]">
            <th scope="col" className="px-4 py-3 font-display font-medium tracking-[-0.02em] text-white md:px-5">
              {firstHeader}
            </th>
            {restHeaders.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-4 py-3 font-display font-medium tracking-[-0.02em] text-cyan-300 md:px-5"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {section.table.rows.map((row) => (
            <tr key={row.join("-")} className="border-b border-white/8 last:border-b-0">
              {row.map((cell, i) => (
                <td
                  key={`${row[0]}-${i}`}
                  className={
                    i === 0
                      ? "px-4 py-3 font-medium text-white/85 md:px-5"
                      : "px-4 py-3 text-white/60 md:px-5"
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PlatformProductView({
  content,
}: {
  content: PlatformProductContent;
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

      {content.sections.map((section) => (
        <SolutionSection
          key={section.title}
          title={section.title}
          intro={section.intro}
        >
          {section.paragraphs?.length ? (
            <div className="mb-8 max-w-3xl space-y-4 text-[15px] leading-relaxed text-white/65">
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

          <ProductCards section={section} />
          <ProductTable section={section} />

          {section.closer ? (
            <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-white/55">
              {section.closer}
            </p>
          ) : null}

          {section.cta ? (
            <div className={section.paragraphs?.length || section.cards?.length ? "mt-8" : ""}>
              <SolutionCtas ctas={[section.cta]} />
            </div>
          ) : null}
        </SolutionSection>
      ))}

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
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
          <div className={content.finalHeadline || content.finalBody ? "mt-8" : ""}>
            <SolutionCtas ctas={content.finalCtas} />
          </div>
        </div>
      </section>
    </article>
  );
}
