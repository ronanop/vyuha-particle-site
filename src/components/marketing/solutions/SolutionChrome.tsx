import type { ReactNode } from "react";
import { FluidButton } from "@/components/FluidButton";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { SolutionCta } from "@/content/solutions/types";

export function SolutionCtas({ ctas }: { ctas: SolutionCta[] }) {
  if (ctas.length === 0) return null;
  const [primary, ...rest] = ctas;
  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center md:gap-4">
      <FluidButton text={primary.label} href={primary.href} size="md" />
      {rest.map((cta) => (
        <TransitionLink
          key={cta.href + cta.label}
          href={cta.href}
          className="min-h-11 inline-flex items-center text-[13px] tracking-wide text-white/55 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          {cta.label}
        </TransitionLink>
      ))}
    </div>
  );
}

export function SolutionHero({
  eyebrow,
  title,
  headline,
  body,
  quote,
  ctas,
}: {
  eyebrow: string;
  title: string;
  headline?: string;
  body: string[];
  quote?: string;
  ctas: SolutionCta[];
}) {
  return (
    <header className="relative overflow-hidden border-b border-white/10 pb-14 md:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(34,211,238,0.12),transparent_55%),radial-gradient(ellipse_at_80%_20%,rgba(59,130,246,0.08),transparent_50%)]"
      />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 pt-24 md:px-10 md:pt-28">
        <p className="mb-4 font-display text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-400/80">
          {eyebrow}
        </p>
        <h1 className="max-w-4xl font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-medium leading-[1.05] tracking-tight text-white">
          {title}
        </h1>
        {headline ? (
          <p className="mt-5 max-w-3xl font-display text-xl font-medium leading-snug text-white/80 md:text-2xl">
            {headline}
          </p>
        ) : null}
        {quote ? (
          <blockquote className="mt-6 max-w-2xl border-l border-cyan-400/40 pl-5 text-[15px] leading-relaxed text-white/60 italic md:text-base">
            {quote}
          </blockquote>
        ) : null}
        <div className="mt-6 max-w-2xl space-y-4 text-[15px] leading-relaxed text-white/60 md:text-base">
          {body.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>
        {ctas.length > 0 ? (
          <div className="mt-8">
            <SolutionCtas ctas={ctas} />
          </div>
        ) : null}
      </div>
    </header>
  );
}

export function SolutionSection({
  title,
  headline,
  intro,
  id,
  children,
}: {
  title?: string;
  headline?: string;
  intro?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`border-b border-white/10 py-14 md:py-16${id ? " scroll-mt-28" : ""}`}
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        {title ? (
          <h2 className="max-w-3xl font-display text-2xl font-medium tracking-tight text-white md:text-3xl">
            {title}
          </h2>
        ) : null}
        {headline ? (
          <h3
            className={`max-w-3xl font-display text-xl font-medium tracking-tight text-white/90 md:text-2xl ${title ? "mt-4" : ""}`}
          >
            {headline}
          </h3>
        ) : null}
        {intro ? (
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/55 md:text-base">
            {intro}
          </p>
        ) : null}
        <div className={title || headline || intro ? "mt-10" : ""}>{children}</div>
      </div>
    </section>
  );
}
