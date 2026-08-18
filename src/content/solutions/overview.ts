import type { MarketingPageContent } from "@/content/solutions/types";

export const solutionsOverview: MarketingPageContent = {
  path: "/solutions",
  eyebrow: "Solutions Overview",
  title: "Build, Orchestrate, and Deploy Sovereign AI Solutions in Seconds",
  quote:
    "India has built for digital scale. Now, it’s time to build intelligence on our own terms.",
  body: [
    "Vyuha gives Indian enterprises a clean canvas to create and scale autonomous agents — without code, complexity, or a single byte leaving their perimeter. Transform security, IT, and business operations into connected, self-governed ecosystems that think, learn, and act in real time.",
  ],
  primaryCtas: [
    { label: "Explore the Platform", href: "/platform" },
    { label: "Request Architecture Demo", href: "/book-a-demo" },
  ],
  sections: [
    {
      id: "by-function",
      title: "Vyuha Solutions — By Function",
      intro:
        "Transform how your organization operates — across Security, IT, and Business Operations — with intelligent, autonomous systems that reduce operational load and eliminate tool fragmentation, all under complete data sovereignty.",
      cards: [
        {
          title: "01 | Security & Compliance",
          headline: "From Conventional Security to Autonomous, Sovereign Defense",
          body: "Transform every security and compliance function into a continuously learning, autonomous system. Reduce audit fatigue, accelerate DPDP Act and RBI/CERT-In compliance, and automate identity reviews and third-party risk audits — without added headcount or data leaving your boundary.",
          cta: {
            label: "Explore Security & Compliance Solutions",
            href: "/solutions/security-compliance",
          },
        },
        {
          title: "02 | IT Operations",
          headline: "Autonomous Operations, Powered by Agentic AI",
          body: "Reimagine IT operations with agents that think, learn, and act across systems. Apply reasoning agents to predict issues, model congestion, and unify operational signals across large, distributed networks — entirely within your own infrastructure.",
          cta: {
            label: "Explore IT Solutions",
            href: "/solutions/it-operations",
          },
        },
        {
          title: "03 | Business Operations & FinOps",
          headline: "Turn Operational Complexity Into Coordinated Execution",
          body: "Give Business Operations and FinOps leaders a single reasoning layer across cost, compliance, and operational reporting — replacing manual reconciliation with real-time, policy-governed autonomy.",
          cta: {
            label: "Explore Business Operations Solutions",
            href: "/solutions/business-operations",
          },
        },
      ],
    },
    {
      title: "Replacing Silos, Not Sitting Beside Them",
      intro:
        "Vyuha doesn't add another dashboard to an already-fragmented stack — it absorbs the function of the tools it replaces:",
      items: [
        "Context-blind, rule-bound SOAR engines",
        "Narrow, single-use agentic point solutions",
        "Generic, un-governed AI toolkits and shadow-AI usage",
      ],
      closer:
        "A no-code visual orchestrator upgrades existing L1 and L2 operators into elite orchestrators, while self-healing, living workflows continuously adapt, self-correct, and optimize in real time.",
    },
  ],
  finalCtas: [
    { label: "Experience Sovereign Agentic AI in Seconds", href: "/book-a-demo" },
    { label: "Request A Demo", href: "/book-a-demo" },
  ],
};
