import type { SolutionCta } from "@/content/solutions/types";

export type HomeCard = {
  title: string;
  headline?: string;
  body?: string;
  items?: string[];
};

export type HomeCopyBlock = {
  title: string;
  body: string;
  cta: SolutionCta;
};

export type HomeArchitectureLayer = {
  id: "command-01" | "command-02" | "command-03";
  title: string;
  headline: string;
  items: string[];
};

export type HomeContent = {
  eyebrow: string;
  displayTitle: [string, string, string];
  lead: string;
  primaryCtas: SolutionCta[];
  foundations: HomeCopyBlock[];
  command: HomeCopyBlock;
  architectureTitle: string;
  architectureIntro: string;
  architecture: HomeArchitectureLayer[];
  operatingTitle: string;
  operatingBody: string[];
  operatingCta: SolutionCta;
  standardizeTitle: string;
  standardizeIntro: string;
  standardizeCards: HomeCard[];
  controlTitle: string;
  controlCards: HomeCard[];
  closingEyebrow: string;
  closingTitle: string;
  closingBody: string;
  closingCta: SolutionCta;
};

export const homeContent: HomeContent = {
  eyebrow: "Democratizing AI in INDIA • Engineered for Visionaries",
  displayTitle: ["Sovereign", "Agentic AI", "for the Enterprise"],
  lead: "One platform. Infinite autonomous outcomes. Purpose-built for Cybersecurity, IT, FinOps, and Business Operations leaders to provide deep enterprise context to AI under uncompromising governance.",
  primaryCtas: [
    { label: "Discover Platform", href: "/platform" },
    { label: "Request Architecture Sprint", href: "/book-a-demo" },
  ],
  foundations: [
    {
      title: "The Foundation for Agentic Intelligence",
      body: "Unlock capabilities that were once restricted to hyperscalers. Vyuha empowers your existing teams to provide context to AI—fine-tuning models on proprietary data, building deep-reasoning agents, and intelligently orchestrating workflows at scale.",
      cta: { label: "Explore AI In a BOX", href: "/platform/in-a-box" },
    },
    {
      title: "Architected for Builders and Operators",
      body: "Built to scale with you—from instantly deploying pre-built apps to orchestrating custom workflows. We are democratizing AI in INDIA, empowering your teams to drive massive productivity without ever compromising your data perimeter.",
      cta: { label: "Read More", href: "/company/about" },
    },
    {
      title: "Reimagine the Enterprise with Agentic AI",
      body: "One platform. Countless workflows transformed. Take the leap to shape, own, and scale your operations, providing deep context to AI across Cybersecurity, IT, and business functions.",
      cta: { label: "See the Apps in Action", href: "/platform/command" },
    },
  ],
  command: {
    title: "Command the Agentic Enterprise",
    body: "One platform, many teams transformed across Cybersecurity, IT, FinOps, and Business Operations. Deploy agentic apps instantly to shape, own, and scale your intelligence.",
    cta: { label: "Explore Agentic Apps", href: "/platform/command" },
  },
  architectureTitle: "Platform Architecture",
  architectureIntro:
    "Open, agentic, and fully integrated with your existing stack. Built on Airrived's proven engine, Vyuha delivers true AI ownership, complete data control, and an adaptable architecture.",
  architecture: [
    {
      id: "command-01",
      title: "01 | CREATE",
      headline: "Providing Context to AI",
      items: [
        "Democratize Fine-Tuning",
        "Ground Models in Enterprise Telemetry",
        "Domain-Specific Language Models (DSLMs)",
      ],
    },
    {
      id: "command-02",
      title: "02 | ACTIVATE",
      headline: "Deep Reasoning Agents",
      items: [
        "Agent-to-Agent (A2A) Mesh",
        "Composable Agent Ecosystem",
        "Multi-Agent Collaboration",
      ],
    },
    {
      id: "command-03",
      title: "03 | BUILD",
      headline: "Autonomous Orchestration",
      items: [
        "Living Workflows in Minutes",
        "Beyond SOAR & RPA",
        "Self-Healing Execution",
      ],
    },
  ],
  operatingTitle: "The Operating Engine for Enterprise-Controlled Intelligence",
  operatingBody: [
    "Vyuha transforms advanced AI into real-world operational velocity—enabling your enterprise to fine-tune models on local telemetry, deploy deep-reasoning agents, and intelligently orchestrate workflows across your entire stack.",
    "No complexity. No specialized AI research team required. Just unified control, delivered entirely within your own private boundary.",
  ],
  operatingCta: { label: "Schedule Platform Demo", href: "/book-a-demo" },
  standardizeTitle: "Standardize on Controlled Autonomy",
  standardizeIntro:
    "The enterprise-grade control plane purpose-built for Cybersecurity, IT, FinOps, and Business Operations leaders.",
  standardizeCards: [
    {
      title: "Deploy Anywhere",
      body: "Build and deploy autonomous agents without engineering roadblocks. Powered by a no-code visual orchestrator, enterprise connectors, and seamless edge-deployment via Vyuha In a BOX.",
    },
    {
      title: "Measurable Impact",
      body: "Reduce tool sprawl, eliminate unnecessary cloud API burn through intelligent task routing, and achieve up to a 60x boost in operational velocity.",
    },
    {
      title: "Workforce Elevation",
      body: "Harness deep-reasoning agents without hiring armies of specialized AI engineers. Upgrade existing L1 and L2 operators into elite orchestrators.",
    },
  ],
  controlTitle: "Take Back Control with Enterprise-Controlled AI",
  controlCards: [
    {
      title: "Empower, Adapt, & Evolve",
      items: [
        "Built for Practitioners",
        "No-Code Composition",
        "Future-Proof Modularity",
      ],
    },
    {
      title: "Own, Lead, & Govern",
      items: [
        "Absolute Asset Ownership",
        "Human-in-the-Loop Controls",
        "Uncompromising Governance",
      ],
    },
  ],
  closingEyebrow: "Lead the Agentic Transition",
  closingTitle: "The Sovereign AI Blueprint",
  closingBody:
    "Explore the strategies, insights, and engineering breakthroughs empowering Indian enterprises to build secure, autonomous operations.",
  closingCta: { label: "Request a Demo", href: "/book-a-demo" },
};
