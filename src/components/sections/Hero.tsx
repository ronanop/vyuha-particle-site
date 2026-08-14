import { SectionFrame } from "@/components/SectionFrame";
import { FluidButton } from "@/components/FluidButton";

export function Hero() {
  return (
    <SectionFrame id="top" side="left" align="end">
      <div className="hero-copy">
        <h1 className="font-display text-[clamp(2.38rem,5.4vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.04em] text-white">
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
        <div data-hero-in className="mt-10 flex flex-wrap items-center gap-4">
          <FluidButton text="Discover Platform" href="#command" />
          <FluidButton text="Request Architecture Sprint" href="#demo" />
        </div>
      </div>
    </SectionFrame>
  );
}
