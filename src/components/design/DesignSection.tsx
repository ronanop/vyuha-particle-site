import type { ReactNode } from "react";

interface DesignSectionProps {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}

/** Anchored lab block for one component (or token) family. */
export function DesignSection({
  id,
  title,
  description,
  children,
}: DesignSectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-white/10 py-14 md:py-16"
    >
      <header className="mb-8 max-w-2xl">
        <p className="mb-2 font-display text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">
          {id}
        </p>
        <h2 className="font-display text-2xl font-medium tracking-tight text-white md:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-[15px] leading-relaxed text-white/55">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
