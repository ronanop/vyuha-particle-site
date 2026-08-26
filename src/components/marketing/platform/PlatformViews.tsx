"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FluidButton } from "@/components/FluidButton";
import { ProductGlyph } from "@/components/marketing/platform/ProductGlyph";
import { SolutionCtas } from "@/components/marketing/solutions/SolutionChrome";
import FoldText from "@/components/ui/FoldText";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type {
  PlatformProductContent,
  PlatformProductSection,
} from "@/content/platform/types";
import { prefersReducedMotion } from "@/lib/utils/motion";

export { PlatformOverviewView } from "@/components/marketing/platform/PlatformOverview";

type ProductKind = "command" | "box" | "integrations";

function productKindFromPath(path: string): ProductKind {
  if (path.includes("in-a-box")) return "box";
  if (path.includes("integrations")) return "integrations";
  return "command";
}

function sectionId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function parseLayerTitle(title: string): { index?: string; label: string } {
  const match = title.match(/^(\d{2})\s*\|\s*(.+)$/);
  if (!match) return { label: title };
  return { index: match[1], label: match[2] };
}

const HERO_ATMOSPHERE: Record<ProductKind, string> = {
  command:
    "radial-gradient(ellipse at 18% 0%, rgba(34,211,238,0.16), transparent 52%), radial-gradient(ellipse at 82% 18%, rgba(59,130,246,0.1), transparent 48%), radial-gradient(ellipse at 50% 100%, rgba(34,211,238,0.06), transparent 40%)",
  box: "radial-gradient(ellipse at 20% 0%, rgba(34,211,238,0.14), transparent 50%), radial-gradient(ellipse at 78% 22%, rgba(19,136,8,0.08), transparent 46%), radial-gradient(ellipse at 50% 100%, rgba(34,211,238,0.05), transparent 40%)",
  integrations:
    "radial-gradient(ellipse at 16% 8%, rgba(34,211,238,0.15), transparent 50%), radial-gradient(ellipse at 88% 12%, rgba(59,130,246,0.12), transparent 45%), radial-gradient(ellipse at 50% 100%, rgba(103,232,249,0.05), transparent 42%)",
};

function ProductCards({ section }: { section: PlatformProductSection }) {
  if (!section.cards?.length) return null;
  const columns = section.cardsColumns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <ul className={`grid grid-cols-1 gap-5 ${columns} md:gap-6`}>
      {section.cards.map((card, i) => {
        const layer = parseLayerTitle(card.title);
        return (
          <li
            key={card.title}
            data-reveal
            className="group relative overflow-hidden border border-white/12 bg-white/[0.04] p-7 backdrop-blur-xl transition-[border-color,background-color] duration-200 hover:border-cyan-300/30 hover:bg-white/[0.055] md:min-h-[15rem] md:p-8"
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
            <div className="relative">
              {layer.index ? (
                <>
                  <span className="font-display block text-[clamp(2.5rem,4vw,3.75rem)] font-medium leading-none tracking-[-0.05em] text-cyan-300/90">
                    {layer.index}
                  </span>
                  <div
                    aria-hidden
                    className="mt-4 h-px w-14 bg-gradient-to-r from-cyan-300/80 to-transparent"
                  />
                  <h3 className="mt-5 font-display text-[clamp(1.2rem,1.8vw,1.5rem)] font-medium tracking-[-0.02em] text-white">
                    {layer.label}
                  </h3>
                </>
              ) : (
                <h3 className="font-display text-[clamp(1.2rem,1.8vw,1.5rem)] font-medium tracking-[-0.02em] text-white">
                  {card.title}
                </h3>
              )}
              {card.body ? (
                <p className="mt-3 text-[15px] leading-relaxed text-white/62 md:text-[16px]">
                  {card.body}
                </p>
              ) : null}
              {card.items?.length ? (
                <ul className="mt-5 space-y-2.5 text-[15px] leading-relaxed text-white/62">
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
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function ProductTable({ section }: { section: PlatformProductSection }) {
  if (!section.table) return null;
  const [firstHeader, ...restHeaders] = section.table.headers;

  return (
    <>
      <ul className="space-y-4 md:hidden">
        {section.table.rows.map((row) => (
          <li
            key={row.join("-")}
            data-reveal
            className="border border-white/12 bg-white/[0.04] p-5 backdrop-blur-xl"
          >
            <p className="font-display text-[15px] font-medium tracking-[-0.02em] text-white">
              {row[0]}
            </p>
            <dl className="mt-4 space-y-3">
              {restHeaders.map((header, i) => (
                <div key={header}>
                  <dt className="font-display text-[11px] uppercase tracking-[0.18em] text-cyan-300/90">
                    {header}
                  </dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-white/60">
                    {row[i + 1]}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      <div
        data-reveal
        className="hidden overflow-x-auto border border-white/12 bg-white/[0.02] md:block"
      >
        <table className="w-full min-w-[40rem] border-collapse text-left text-[14px] leading-relaxed md:text-[15px]">
          <caption className="sr-only">{section.title}</caption>
          <thead>
            <tr className="border-b border-white/12 bg-white/[0.04]">
              <th
                scope="col"
                className="px-4 py-4 font-display font-medium tracking-[-0.02em] text-white md:px-6"
              >
                {firstHeader}
              </th>
              {restHeaders.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-4 font-display font-medium tracking-[-0.02em] text-cyan-300 md:px-6"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.table.rows.map((row) => (
              <tr
                key={row.join("-")}
                className="border-b border-white/8 transition-colors duration-150 last:border-b-0 hover:bg-white/[0.03]"
              >
                {row.map((cell, i) => (
                  <td
                    key={`${row[0]}-${i}`}
                    className={
                      i === 0
                        ? "px-4 py-4 font-medium text-white/85 md:px-6"
                        : "px-4 py-4 text-white/60 md:px-6"
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
    </>
  );
}

export function PlatformProductView({
  content,
}: {
  content: PlatformProductContent;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const kind = productKindFromPath(content.path);
  const navSections = content.sections.slice(0, 3).map((section) => ({
    id: sectionId(section.title),
    label: section.title.split(/[:.|]/)[0]?.trim() || section.title,
  }));
  const firstSectionId = content.sections[0]
    ? sectionId(content.sections[0].title)
    : "product-content";

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

      <article ref={rootRef} className="platform-page relative z-10">
        <a
          href={`#${firstSectionId}`}
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-24 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to product content
        </a>

        <header className="relative overflow-hidden border-b border-white/10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: HERO_ATMOSPHERE[kind] }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] items-center opacity-[0.18] lg:flex"
          >
            <div className="w-full scale-[2.4] origin-center translate-x-[-4%]">
              <ProductGlyph kind={kind} />
            </div>
          </div>
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

              <h1 className="font-display text-[clamp(2.6rem,6.5vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.045em] text-white">
                <FoldText
                  text={content.title}
                  splitBy="word"
                  hinge="top"
                  trigger="mount"
                  duration={0.65}
                  stagger={0.06}
                  ease="power3.out"
                  perspective={800}
                  creaseShading={0.4}
                  fontSize="clamp(2.6rem, 6.5vw, 5.5rem)"
                  fontWeight={500}
                  color="#ffffff"
                  className="font-display"
                  style={{ letterSpacing: "-0.045em", lineHeight: 0.92 }}
                />
              </h1>

              <p
                data-hero-in
                className="mt-6 max-w-2xl font-display text-[clamp(1.15rem,2.2vw,1.65rem)] font-medium leading-snug tracking-[-0.02em] text-white/80 [animation-delay:160ms]"
              >
                {content.headline}
              </p>

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

        {content.sections.map((section) => {
          const id = sectionId(section.title);
          return (
            <section
              key={section.title}
              id={id}
              className="scroll-mt-28 border-b border-white/10 py-16 md:py-24"
            >
              <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
                <div data-reveal className="max-w-3xl">
                  <div aria-hidden className="mb-5 h-px w-14 bg-cyan-300/70" />
                  <h2 className="max-w-[22ch] font-display text-[clamp(1.75rem,3.6vw,3rem)] font-medium leading-[1.02] tracking-[-0.035em] text-white">
                    {section.title}
                  </h2>
                  {section.intro ? (
                    <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/55 md:text-[17px]">
                      {section.intro}
                    </p>
                  ) : null}
                </div>

                <div className="mt-10 md:mt-12">
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

                  <ProductCards section={section} />
                  <ProductTable section={section} />

                  {section.closer ? (
                    <p
                      data-reveal
                      className="mt-10 max-w-3xl text-[16px] leading-relaxed text-white/55"
                    >
                      {section.closer}
                    </p>
                  ) : null}

                  {section.cta ? (
                    <div
                      data-reveal
                      className={
                        section.paragraphs?.length ||
                        section.cards?.length ||
                        section.items?.length ||
                        section.table
                          ? "mt-10"
                          : ""
                      }
                    >
                      <SolutionCtas ctas={[section.cta]} />
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          );
        })}

        <section className="relative overflow-hidden py-20 md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(34,211,238,0.12),transparent_55%)]"
          />
          <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
            <div data-reveal className="max-w-3xl">
              {content.finalHeadline ? (
                <>
                  <div className="mb-5 flex items-center gap-4">
                    <div aria-hidden className="h-px w-14 bg-cyan-300/70" />
                    <span className="font-display text-[12px] uppercase tracking-[0.18em] text-cyan-300">
                      Next step
                    </span>
                  </div>
                  <h2 className="font-display text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.035em] text-white">
                    {content.finalHeadline}
                  </h2>
                </>
              ) : null}
              {content.finalBody ? (
                <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-white/55 md:text-[17px]">
                  {content.finalBody}
                </p>
              ) : null}
              <div
                className={
                  content.finalHeadline || content.finalBody ? "mt-10" : ""
                }
              >
                <SolutionCtas ctas={content.finalCtas} />
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
