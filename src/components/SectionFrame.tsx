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
      ? "items-end pb-16 pt-28 md:pb-24 md:pt-20"
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

  if (side === "center") {
    return (
      <section
        id={id}
        data-section-side="center"
        className={`relative z-10 px-6 md:px-10 ${heightClass} ${compactPad} ${className}`}
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
      className={`flex ${heightClass} ${alignClass} ${
        side === "left" ? "md:pr-4" : "md:pl-4"
      }`}
    >
      <div className="w-full">{children}</div>
    </div>
  );

  const particleSlot = (
    <div
      aria-hidden
      data-particle-slot={id}
      className={`pointer-events-none relative hidden md:block ${
        heightClass || "min-h-[8rem]"
      }`}
    />
  );

  return (
    <section
      id={id}
      data-section-side={side}
      className={`relative z-10 px-6 md:px-10 ${heightClass} ${compactPad} ${className}`}
    >
      <div
        className={`mx-auto grid w-full max-w-[1400px] grid-cols-1 items-stretch md:grid-cols-2 md:gap-10 lg:gap-16 ${heightClass}`}
      >
        {side === "left" ? (
          <>
            {contentCol}
            {particleSlot}
          </>
        ) : (
          <>
            {particleSlot}
            {contentCol}
          </>
        )}
      </div>
    </section>
  );
}
