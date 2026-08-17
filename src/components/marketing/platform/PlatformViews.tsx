import Link from "next/link";
import {
  SolutionCtas,
  SolutionHero,
  SolutionSection,
} from "@/components/marketing/solutions/SolutionChrome";
import type {
  PlatformOverviewContent,
  PlatformProductContent,
} from "@/content/platform/types";

export function PlatformOverviewView({
  content,
}: {
  content: PlatformOverviewContent;
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
        title="How the platform is delivered"
        intro={content.productsIntro}
      >
        <ul className="space-y-10">
          {content.products.map((product, i) => (
            <li
              key={product.href}
              className="grid gap-4 border-t border-white/10 pt-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] md:gap-10"
            >
              <div>
                <p className="font-display text-[11px] uppercase tracking-[0.24em] text-white/35">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-xl font-medium text-white md:text-2xl">
                  {product.title}
                </h3>
              </div>
              <div>
                <p className="font-display text-lg font-medium leading-snug text-white/85">
                  {product.headline}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-white/55">
                  {product.body}
                </p>
                <Link
                  href={product.href}
                  className="mt-5 inline-flex text-[13px] tracking-wide text-cyan-300/90 transition-colors hover:text-cyan-200"
                >
                  {product.cta} →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </SolutionSection>

      <SolutionSection title={content.pillarsTitle}>
        <ul className="grid gap-10 md:grid-cols-3">
          {content.pillars.map((pillar) => (
            <li key={pillar.title}>
              <h3 className="font-display text-lg font-medium leading-snug text-white">
                {pillar.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/55">
                {pillar.body}
              </p>
            </li>
          ))}
        </ul>
      </SolutionSection>

      <SolutionSection title={content.kintsugiTitle}>
        <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-white/60 md:text-base">
          {content.kintsugiBody.map((p) => (
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
          <ul className="max-w-3xl space-y-3 text-[15px] leading-relaxed text-white/65">
            {section.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/80" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {section.closer ? (
            <p className="mt-8 max-w-3xl text-[15px] leading-relaxed text-white/55">
              {section.closer}
            </p>
          ) : null}
        </SolutionSection>
      ))}

      <section className="py-14 md:py-16">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <SolutionCtas ctas={content.finalCtas} />
        </div>
      </section>
    </article>
  );
}
