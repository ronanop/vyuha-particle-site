import type { SolutionsOverviewContent } from "@/content/solutions/types";

export const solutionsOverview: SolutionsOverviewContent = {
  path: "/solutions",
  eyebrow: "Solutions",
  title: "Solutions Overview",
  subtitle:
    "Build, orchestrate, and deploy sovereign AI solutions in seconds.",
  quote:
    "India has built for digital scale. Now, it’s time to build intelligence on our own terms.",
  body: [
    "Vyuha gives Indian enterprises a clean canvas to create and scale autonomous agents — without code, complexity, or a single byte leaving their perimeter.",
    "Transform security, IT, and business operations into connected, self-governed ecosystems that think, learn, and act in real time.",
  ],
  primaryCtas: [
    { label: "Explore the Platform", href: "/platform" },
    { label: "Request Architecture Demo", href: "/book-a-demo" },
  ],
  functionsIntro:
    "Transform how your organization operates — across Security, IT, and Business Operations — with intelligent, autonomous systems that reduce operational load and eliminate tool fragmentation, all under complete data sovereignty.",
  functions: [
    {
      title: "Security & Compliance",
      headline: "From conventional security to autonomous, sovereign defense",
      body: "Transform every security and compliance function into a continuously learning, autonomous system. Reduce audit fatigue, accelerate DPDP Act and RBI/CERT-In compliance, and automate identity reviews and third-party risk audits — without added headcount or data leaving your boundary.",
      href: "/solutions/security-compliance",
      cta: "Explore Security & Compliance",
    },
    {
      title: "IT Operations",
      headline: "Autonomous operations, powered by agentic AI",
      body: "Reimagine IT operations with agents that think, learn, and act across systems. Apply reasoning agents to predict issues, model congestion, and unify operational signals across large, distributed networks — entirely within your own infrastructure.",
      href: "/solutions/it-operations",
      cta: "Explore IT Solutions",
    },
    {
      title: "Business Operations & FinOps",
      headline: "Turn operational complexity into coordinated execution",
      body: "Give Business Operations and FinOps leaders a single reasoning layer across cost, compliance, and operational reporting — replacing manual reconciliation with real-time, policy-governed autonomy.",
      href: "/solutions/business-operations",
      cta: "Explore Business Operations",
    },
  ],
  replaceTitle: "Replacing silos, not sitting beside them",
  replaceBody:
    "Vyuha doesn’t add another dashboard to an already-fragmented stack — it absorbs the function of the tools it replaces:",
  replaceItems: [
    "Brittle SOAR platforms and legacy RPA scripts",
    "Narrow, single-use agentic point solutions",
    "Generic, un-governed AI toolkits and shadow-AI usage",
  ],
  replaceCloser:
    "A no-code visual orchestrator upgrades existing L1 and L2 operators into elite orchestrators, while self-healing, living workflows continuously adapt, self-correct, and optimize in real time.",
  sovereigntyTitle: "Democratizing AI in India",
  sovereigntyBody: [
    "With DPDP Act enforcement and sectoral regulation, data localization is no longer a preference — it is the law. Sending proprietary financial, telecom, or citizen data to external APIs is a non-starter.",
    "Vyuha is architected for sovereign AI: your data, custom models, and autonomous agents remain exclusively yours — with RBAC, human-in-the-loop oversight, and policy-based autonomy built in.",
    "The future of Indian enterprise intelligence will not be rented; it will be owned.",
  ],
  finalCtas: [
    { label: "Experience Sovereign Agentic AI", href: "/book-a-demo" },
    { label: "Request a Demo", href: "/book-a-demo" },
  ],
};
