import { SectionFrame } from "@/components/SectionFrame";

const layers = [
  {
    num: "01",
    title: "App Store",
    eyebrow: "Instant Value. Enterprise-Ready.",
    body: "A curated marketplace of pre-built, production-grade agentic applications—ready to deploy without months of custom engineering. Launch sovereign agentic apps in seconds across critical enterprise functions like Security Operations, Threat Intel Operationalization, Identity Management, IT service workflows, and FinOps automation. Every app ships with policy controls, auditability, and private-boundary execution so teams get instant value without compromising sovereignty.",
  },
  {
    num: "02",
    title: "Agents",
    eyebrow: "The Building Blocks of Agentic Intelligence.",
    body: "Composable autonomous building blocks that combine context-aware reasoning, enterprise context from proprietary data and tools, and policy-governed action. Assemble specialized agents for investigation, remediation, orchestration, and decision support—then reuse them across domains. Each agent operates with clear permissions, continuous situational awareness, and governed outcomes so autonomy scales safely inside your command plane.",
  },
  {
    num: "03",
    title: "AI Tools",
    eyebrow: "Precision Control for Advanced Teams.",
    body: "Create Domain-Specific Language Models tailored to your business language, workflows, and risk posture—then build deep-reasoning agents that collaborate through the Agent-to-Agent protocol. Give advanced teams fine-grained control over model behavior, tool access, evaluation, and runtime policy. Move from generic assistants to purpose-built intelligence that understands your environment and executes with enterprise-grade precision.",
  },
];

export function Intelligence() {
  return (
    <div id="command-block" className="pb-8 md:pb-12">
      <SectionFrame id="command" side="center" align="start" compact>
        <p className="mb-5 text-[13px] uppercase tracking-[0.18em] text-white/50">
          Vyuha Command
        </p>
        <h2 className="font-display mx-auto max-w-[20ch] text-[clamp(2.4rem,5vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white">
          The Sovereign{" "}
          <span className="whitespace-nowrap">Enterprise Agentic OS</span>
        </h2>
        <p className="mx-auto mt-8 max-w-lg text-[17px] leading-relaxed text-white/60 md:text-[18px]">
          One command plane. Infinite autonomous execution.
          <br />
          Purpose-built for Cybersecurity, IT, FinOps, and Business Operations
          leaders.
        </p>
      </SectionFrame>

      {layers.map((layer, i) => (
        <SectionFrame
          key={layer.num}
          id={`command-${layer.num}`}
          side={i % 2 === 0 ? "left" : "right"}
          align="start"
          compact
        >
          <span className="font-display text-[14px] tracking-wider text-white/45">
            {layer.num}
          </span>
          <h3 className="font-display mt-3 max-w-[12ch] text-[clamp(2rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.03em] text-white">
            {layer.title}
          </h3>
          <p className="mt-3 text-[13px] uppercase tracking-[0.14em] text-white/45">
            {layer.eyebrow}
          </p>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-white/60">
            {layer.body}
          </p>
        </SectionFrame>
      ))}
    </div>
  );
}
