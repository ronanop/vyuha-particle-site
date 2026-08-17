import { SectionFrame } from "@/components/SectionFrame";

const perimeterPoints = [
  {
    title: "Zero External Egress",
    body: "Core inference runs natively inside your isolated network.",
  },
  {
    title: "DPDP Act 2023 Alignment",
    body: "Built to exceed Indian data residency and regulatory compliance standards.",
  },
  {
    title: "Immunity from External Logging",
    body: "Your enterprise IP remains yours—never used to train public foundation models.",
  },
];

const deliveryModels = [
  {
    title: "Dedicated Private Cloud",
    body: "Fully isolated VPC infrastructure on your private AWS, Azure, or GCP tenant.",
  },
  {
    title: "Air-Gapped / Sena",
    body: "Complete offline deployment for defense, PSUs, and critical national infrastructure.",
  },
  {
    title: "On-Premise GPU",
    body: "Hardware-accelerated deployment on bare-metal GPU/NPU racks in your data center.",
  },
];

export function Problem() {
  return (
    <div id="box-block" className="mt-12 md:mt-20 pb-16 md:pb-24">
      <SectionFrame
        id="box"
        side="center"
        align="start"
        compact
        contentClassName="w-full max-w-5xl text-center px-2"
      >
        <p className="mb-5 text-[13px] uppercase tracking-[0.18em] text-white/50">
          Vyuha Box
        </p>
        <h2 className="font-display text-[clamp(1.65rem,7vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.035em] text-white">
          Sovereign Perimeter &amp; Delivery Engine
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-[17px] leading-relaxed text-white/60 md:text-[18px]">
          <span className="block">
            Complete data localization and perimeter defense.
          </span>
          <span className="block md:whitespace-nowrap">
            Proprietary telemetry, prompts, and agent logs never leave your
            private boundary.
          </span>
        </p>
      </SectionFrame>

      <SectionFrame id="box-perimeter" side="right" align="start" compact>
        <p className="mb-4 text-[13px] uppercase tracking-[0.18em] text-white/50">
          Data Perimeter Guarantee
        </p>
        <h3 className="font-display max-w-[14ch] text-[clamp(1.85rem,3.5vw,3rem)] font-medium leading-tight tracking-[-0.03em] text-white">
          Sovereign AI under your boundary
        </h3>
        <ul className="mt-10 space-y-8 border-t border-white/10 pt-8">
          {perimeterPoints.map((point, i) => (
            <li key={point.title}>
              <p className="font-display text-[13px] tracking-wider text-white/40">
                0{i + 1}
              </p>
              <h4 className="font-display mt-2 text-[clamp(1.25rem,2vw,1.65rem)] font-medium tracking-[-0.02em] text-white">
                {point.title}
              </h4>
              <p className="mt-2 max-w-md text-[16px] leading-relaxed text-white/55">
                {point.body}
              </p>
            </li>
          ))}
        </ul>
      </SectionFrame>

      <SectionFrame
        id="box-delivery"
        side="center"
        align="start"
        compact
        contentClassName="w-full max-w-[1200px] text-center"
      >
        <p className="mb-4 text-[13px] uppercase tracking-[0.18em] text-white/50">
          Flexible Sovereign Delivery
        </p>
        <h3 className="font-display mx-auto max-w-[18ch] text-[clamp(1.85rem,3.5vw,3rem)] font-medium leading-tight tracking-[-0.03em] text-white">
          Enterprise Vyuha Box provisioning
        </h3>
        <ul className="mt-12 grid grid-cols-1 gap-12 border-t border-white/10 pt-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          {deliveryModels.map((model, i) => (
            <li key={model.title} className="text-left">
              <span className="font-display block text-[clamp(3.25rem,5vw,5rem)] font-medium leading-none tracking-[-0.04em] text-white">
                0{i + 1}
              </span>
              <h4 className="font-display mt-5 text-[clamp(1.35rem,2vw,1.75rem)] font-medium leading-tight tracking-[-0.02em] text-white">
                {model.title}
              </h4>
              <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-white">
                {model.body}
              </p>
            </li>
          ))}
        </ul>
      </SectionFrame>

      <SectionFrame
        id="box-advantage"
        side="center"
        align="center"
        contentClassName="w-full max-w-4xl text-center px-2"
      >
        <p className="mb-6 text-[13px] uppercase tracking-[0.18em] text-white/50">
          The Vyuha Advantage
        </p>
        <h3 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white">
          Designed to replace,
          <br />
          not{" "}
          <span className="relative inline-block px-[0.06em] text-white/45">
            add
            <span
              aria-hidden
              className="pointer-events-none absolute left-[-0.04em] right-[-0.04em] top-[0.52em] h-[0.065em] rounded-full bg-white/80"
            />
          </span>
        </h3>
        <p className="mt-5 text-[13px] uppercase tracking-[0.14em] text-white/45">
          Collapse Entire Product Categories
        </p>
        <p className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-white/60 md:text-[18px]">
          Vyuha absorbs the function of brittle SOAR &amp; legacy RPA, narrow
          agentic point solutions, and generic agent builders—simplifying the
          stack and accelerating innovation.
        </p>
      </SectionFrame>
    </div>
  );
}
