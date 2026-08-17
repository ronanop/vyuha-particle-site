import { SectionFrame } from "@/components/SectionFrame";
import { FluidButton } from "@/components/FluidButton";

export function Hero() {
  return (
    <SectionFrame id="top" side="left" align="end">
      <div className="hero-copy">
        <h1 className="font-display text-[clamp(2rem,9vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.04em] text-white">
          <span data-hero-in className="block">
            Sovereign
          </span>
          <span data-hero-in className="block">
            Agentic AI
          </span>
          <span data-hero-in className="block">
            for the Enterprise
          </span>
        </h1>
        <p
          data-hero-in
          className="mt-8 max-w-md text-[17px] leading-relaxed text-white/60 md:text-[18px]"
        >
          One platform. Infinite autonomous outcomes.
        </p>
        <p
          data-hero-in
          className="mt-4 max-w-md text-[17px] leading-relaxed text-white/60 md:text-[18px]"
        >
          Democratizing intelligent automation across Cybersecurity, IT, FinOps,
          and Business Operations, giving AI deep enterprise context while
          operating under uncompromising governance.
        </p>
        <div data-hero-in className="mt-10 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <FluidButton text="Discover Platform" href="#command" className="w-full sm:w-auto" />
          <FluidButton text="Request Architecture Sprint" href="#demo" className="w-full sm:w-auto" />
        </div>
      </div>
    </SectionFrame>
  );
}
