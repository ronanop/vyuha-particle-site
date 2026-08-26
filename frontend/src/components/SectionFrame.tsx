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
  /** Classes for the text column */
  contentClassName?: string;
}

/**
 * Split viewport section: copy left / right / center.
 */
export function SectionFrame({
  id,
  side = "left",
  children,
  className = "",
  align = "center",
  compact = false,
  contentClassName,
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

  const justify =
    side === "center"
      ? "justify-center"
      : side === "right"
        ? "justify-end"
        : "justify-start";

  const defaultContent =
    side === "center"
      ? "w-full max-w-xl text-center md:max-w-2xl"
      : "w-full max-w-xl md:max-w-2xl";

  return (
    <section
      id={id}
      data-section-side={side}
      className={`relative z-10 ${gutter} ${heightClass} ${compactPad} ${className}`}
    >
      <div
        className={`relative mx-auto flex w-full max-w-[1400px] ${justify} ${heightClass} ${alignClass}`}
      >
        <div className={contentClassName ?? defaultContent}>{children}</div>
      </div>
    </section>
  );
}
