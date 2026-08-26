import { SectionFrame } from "@/components/SectionFrame";
import { FounderCarousel, type Founder } from "./FounderCarousel";

const founders = [
  {
    name: "Prarthana Gupta",
    role: "Co-Founder",
    initials: "PG",
    /** Drop files in /public/founders/ and set paths here */
    image: null as string | null,
  },
  {
    name: "Tharun Sanaka",
    role: "Co-Founder",
    initials: "TS",
    image: null as string | null,
  },
] as const satisfies readonly Founder[];

export function FoundedBy() {
  return (
    <SectionFrame
      id="founders"
      side="center"
      align="center"
      contentClassName="w-full max-w-[1400px]"
    >
      <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.55fr)] lg:gap-10 xl:gap-16">
        <div className="max-w-md text-left lg:max-w-[22rem] xl:max-w-md">
          <h2 className="font-display text-[clamp(2rem,4.2vw,4.25rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white">
            <span className="block">Built in India,</span>
            <span className="block md:whitespace-nowrap">
              for sovereign{" "}
              <span className="whitespace-nowrap">enterprise AI.</span>
            </span>
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed text-white/60 sm:mt-8 sm:text-[17px] md:text-[18px]">
            Vyuha is led by founders committed to putting agentic intelligence
            under enterprise perimeter control, with governance Indian
            institutions can trust.
          </p>
        </div>

        <FounderCarousel founders={founders} />
      </div>
    </SectionFrame>
  );
}
