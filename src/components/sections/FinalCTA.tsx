import { SectionFrame } from "@/components/SectionFrame";
import { FluidButton } from "@/components/FluidButton";

export function FinalCTA() {
  return (
    <SectionFrame id="demo" side="left">
      <p className="mb-5 text-[13px] uppercase tracking-[0.18em] text-white/50">
        Next Step
      </p>
      <h2 className="font-display max-w-[14ch] text-[clamp(2.4rem,5vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white">
        Take back control with sovereign AI.
      </h2>
      <p className="mt-8 max-w-md text-[17px] leading-relaxed text-white/60 md:text-[18px]">
        Own, lead, and govern your AI assets and operational workflows, under
        your perimeter, with uncompromising governance.
      </p>
      <div className="mt-10 flex w-full flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
        <FluidButton text="Request Architecture Sprint" href="/contact" className="w-full sm:w-auto" />
        <p className="text-[15px] text-white/55">Or write to hello@vyuha.ai</p>
      </div>
    </SectionFrame>
  );
}
