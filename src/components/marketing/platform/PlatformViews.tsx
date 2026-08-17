import {
  SolutionCtas,
  SolutionHero,
  SolutionSection,
} from "@/components/marketing/solutions/SolutionChrome";
import type { PlatformProductContent } from "@/content/platform/types";

export { PlatformOverviewView } from "@/components/marketing/platform/PlatformOverview";

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
