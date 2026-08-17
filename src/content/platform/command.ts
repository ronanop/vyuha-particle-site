import type { PlatformProductContent } from "@/content/platform/types";

export const platformCommand: PlatformProductContent = {
  path: "/platform/command",
  eyebrow: "Platform · Command",
  title: "Vyuha Command",
  headline: "Build, orchestrate, and govern autonomous agents — without code",
  body: [
    "Vyuha Command is the no-code visual orchestrator at the center of the platform. It gives Indian enterprises a clean canvas to create and scale autonomous agents — without hiring AI talent, without brittle scripts, and without a single byte leaving the perimeter.",
    "A generic model does not know your internal topology, your risk appetite, or the frameworks that govern your industry. Command solves that by grounding agents in Domain-Specific Language Models trained on your own telemetry and documentation — so they reason, not just summarize.",
  ],
  primaryCtas: [
    { label: "Request Architecture Demo", href: "/book-a-demo" },
    { label: "Explore In a BOX", href: "/platform/in-a-box" },
  ],
  sections: [
    {
      title: "What Command does",
      items: [
        "Compose domain-specific agents and agentic apps with no-code orchestration — zero engineering effort.",
        "Ground agents in local enterprise telemetry so they understand internal naming, asset criticality, and past incident history.",
        "Run living, self-healing workflows that continuously adapt, self-correct, and optimize in real time.",
        "Keep human-in-the-loop execution, auditability, RBAC, and policy-based autonomy by design.",
      ],
    },
    {
      title: "Making the workforce AI-enabled",
      intro:
        "The friction of silos falls on human shoulders. Command binds tools with reasoning agents that absorb repetitive triage and alert fatigue.",
      items: [
        "Upgrade existing L1 and L2 operators into elite orchestrators — no dedicated AI or data-engineering team required.",
        "Bridge the talent shortage with dynamic agents that operate under strict human-in-the-loop control.",
        "Replace static rules and legacy RPA with adaptive, reasoning-driven execution.",
      ],
    },
    {
      title: "Replacing silos, not sitting beside them",
      intro:
        "Command does not add another dashboard to a fragmented stack. It absorbs the function of the tools it replaces:",
      items: [
        "Brittle SOAR platforms and legacy RPA scripts",
        "Narrow, single-use agentic point solutions",
        "Generic, un-governed AI toolkits and shadow-AI usage",
      ],
      closer:
        "Every capability runs on the same sovereign foundation — the Airrived Engine — deployed on Vyuha One or fully air-gapped on Vyuha In a BOX.",
    },
  ],
  finalCtas: [
    { label: "Request Architecture Demo", href: "/book-a-demo" },
    { label: "See Security & IT Solutions", href: "/solutions" },
  ],
};
