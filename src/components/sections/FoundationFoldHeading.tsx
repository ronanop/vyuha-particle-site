"use client";

import FoldText from "@/components/ui/FoldText";

const TITLE_CLASS =
  "font-display max-w-[22ch] text-[clamp(1.85rem,4vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white md:ml-auto";

type FoundationFoldHeadingProps = {
  text: string;
  earthDock?: boolean;
  earthMorph?: "1" | "2";
};

/**
 * FoldText scroll unfold for foundation headings — animation only, same visual style.
 */
export function FoundationFoldHeading({
  text,
  earthDock,
  earthMorph,
}: FoundationFoldHeadingProps) {
  return (
    <h2
      data-earth-dock={earthDock ? "" : undefined}
      data-earth-morph={earthMorph}
      className={TITLE_CLASS}
    >
      <FoldText
        text={text}
        splitBy="char"
        hinge="top"
        trigger="scroll"
        duration={0.65}
        stagger={0.045}
        ease="power3.out"
        perspective={700}
        creaseShading={0.55}
        fontSize="clamp(1.85rem, 4vw, 3.25rem)"
        fontWeight={500}
        color="#ffffff"
        className="tracking-[-0.035em]"
        style={{
          lineHeight: 0.98,
          letterSpacing: "-0.035em",
          whiteSpace: "pre-wrap",
        }}
      />
    </h2>
  );
}
