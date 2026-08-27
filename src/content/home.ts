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

export type HomeContent = {
  displayTitle: [string, string, string];
  lead: string;
  primaryCtas: SolutionCta[];
  foundations: HomeCopyBlock[];
  command: HomeCopyBlock;
  operatingTitle: [string, string];
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
  displayTitle: ["Sovereign", "Agentic AI", "for the Enterprise"],
  lead: "One platform. Infinite autonomous outcomes. Purpose-built for Cybersecurity, IT, FinOps, and Business Operations leaders to provide deep enterprise context to AI under uncompromising governance.",
  primaryCtas: [
    { label: "Discover Platform", href: "/platform" },
    { label: "Request Architecture Sprint", href: "/contact" },
  ],
  foundations: [
    {
      title: "The Foundation for\nAgentic\u00A0Intelligence",
      body: "Unlock capabilities that were once restricted to hyperscalers. Vyuha empowers your existing teams to provide context to AI, fine-tuning models on proprietary data, building deep-reasoning agents, and intelligently orchestrating workflows at scale.",
      cta: { label: "Explore AI In a BOX", href: "/platform/in-a-box" },
    },
    {
      title: "Architected for Builders and Operators",
      body: "Built to scale with you, from instantly deploying pre-built apps to orchestrating custom workflows. We are democratizing AI in INDIA, empowering your teams to drive massive productivity without ever compromising your data perimeter.",
      cta: { label: "Read More", href: "/company" },
    },
    {
      title: "Reimagine the Enterprise with Agentic AI",
      body: "One Agentic Fabric. Countless workflows transformed. Take the leap to shape, own, and scale your operations, providing deep context to AI across Cybersecurity, IT, and business functions.",
      cta: { label: "See the Apps in Action", href: "/platform/command" },
    },
  ],
  command: {
    title: "Command the Agentic Enterprise",
    body: "One Agentic Fabric for Cybersecurity, IT, FinOps, and Business Operations. Deploy agentic apps instantly to shape, own, and scale your intelligence.",
    cta: { label: "Explore Agentic Apps", href: "/platform/command" },
  },
  operatingTitle: [
    "The Operating Engine for",
    "Enterprise-Controlled Intelligence",
  ],
  operatingBody: [
    "Vyuha transforms advanced AI into real-world operational velocity, enabling your enterprise to fine-tune models on local telemetry, deploy deep-reasoning agents, and intelligently orchestrate workflows across your entire stack.",
    "No complexity. No specialized AI research team required. Just unified control, delivered entirely within your own private boundary.",
  ],
  operatingCta: { label: "Schedule Platform Demo", href: "/contact" },
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
  controlTitle: "Intelligence on Your Terms: Sovereign, Private, Governed",
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
  closingCta: { label: "Request a Demo", href: "/contact" },
};
