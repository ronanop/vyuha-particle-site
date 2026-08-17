import type { ReactNode } from "react";

type SectionSide = "left" | "right" | "center";

interface SectionFrameProps {
  id: string;
  side?: SectionSide;
  children: ReactNode;
  className?: string;
  /** Vertical placement of copy within the section */
  align?: "center" | "end" | "start";
  /** Drop full-viewport height — flows with natural padding */
  compact?: boolean;
  /** Classes for the centered text column (center side only) */
  contentClassName?: string;
}

/**
 * Split viewport section: copy left / right / center.
 * Left & right keep the opposite half free for particles.
 * Center places copy in the middle of the screen horizontally.
 */
export function SectionFrame({
  id,
  side = "left",
  children,
  className = "",
  align = "center",
  compact = false,
  contentClassName = "w-full max-w-xl text-center md:max-w-2xl",
}: SectionFrameProps) {
  const heightClass = compact ? "" : "min-h-svh";

  const alignClass =
    align === "end"
      ? "items-end pb-[max(4rem,env(safe-area-inset-bottom))] pt-28 md:pb-24 md:pt-20"
      : align === "start"
        ? compact
          ? "items-start"
          : "items-start pb-20 pt-10 md:pb-28 md:pt-12"
        : "items-center";

  const compactPad =
    compact && side === "center"
      ? "pb-6 pt-10 md:pb-8 md:pt-12"
      : compact
        ? "py-8 md:py-12"
        : "";

  const gutter =
    "pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] md:px-10";

  if (side === "center") {
    return (
      <section
        id={id}
        data-section-side="center"
        className={`relative z-10 ${gutter} ${heightClass} ${compactPad} ${className}`}
      >
        <div
          aria-hidden
          data-particle-slot={id}
          className="pointer-events-none absolute inset-0"
        />
        <div
          className={`relative mx-auto flex w-full max-w-[1400px] justify-center ${heightClass} ${alignClass}`}
        >
          <div className={contentClassName}>{children}</div>
        </div>
      </section>
    );
  }

  const contentCol = (
    <div
      className={`flex ${compact ? "" : "md:min-h-svh"} ${alignClass} ${
        side === "left" ? "order-2 md:order-1 md:pr-4" : "order-2 md:pl-4"
      }`}
    >
      <div className="w-full min-w-0">{children}</div>
    </div>
  );

  const particleSlot = (
    <div
      aria-hidden
      data-particle-slot={id}
      className={`pointer-events-none relative order-1 h-[min(38svh,280px)] w-full md:h-auto ${
        side === "left" ? "md:order-2" : "md:order-1"
      } ${compact ? "md:min-h-[8rem]" : "md:min-h-svh"}`}
    />
  );

  return (
    <section
      id={id}
      data-section-side={side}
      className={`relative z-10 ${gutter} ${heightClass} ${compactPad} ${className}`}
    >
      <div
        className={`mx-auto grid w-full max-w-[1400px] grid-cols-1 items-stretch md:grid-cols-2 md:gap-10 lg:gap-16 ${heightClass} ${
          compact ? "" : "max-md:grid-rows-[auto_minmax(0,1fr)]"
        }`}
      >
        {contentCol}
        {particleSlot}
      </div>
    </section>
  );
}
