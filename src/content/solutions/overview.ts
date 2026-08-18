import type { SolutionsOverviewContent } from "@/content/solutions/types";

export const solutionsOverview: SolutionsOverviewContent = {
  path: "/solutions",
  eyebrow: "Solutions Overview",
  title: "Build, Orchestrate, and Deploy Sovereign AI Solutions in Seconds",
  displayTitle: ["Sovereign AI.", "In Operation."],
  leitmotif: "Build, orchestrate, and deploy — without a byte leaving your perimeter.",
  quote:
    "India has built for digital scale. Now, it’s time to build intelligence on our own terms.",
  body: [
    "Vyuha gives Indian enterprises a clean canvas to create and scale autonomous agents — without code, complexity, or a single byte leaving their perimeter. Transform security, IT, and business operations into connected, self-governed ecosystems that think, learn, and act in real time.",
  ],
  primaryCtas: [
    { label: "Explore by Function", href: "#solutions-functions" },
    { label: "Request Architecture Demo", href: "/book-a-demo" },
  ],
  functionsTitle: "Intelligence built around your operations",
  functionsIntro:
    "Transform how your organization operates — across Security, IT, and Business Operations — with intelligent, autonomous systems that reduce operational load and eliminate tool fragmentation, all under complete data sovereignty.",
  functions: [
    {
      index: "01",
      way: "Defend",
      title: "Security & Compliance",
      headline: "From conventional security to autonomous, sovereign defense",
      body: "Transform every security and compliance function into a continuously learning, autonomous system. Reduce audit fatigue, accelerate DPDP Act and RBI/CERT-In compliance, and automate identity reviews and third-party risk audits — without added headcount or data leaving your boundary.",
      href: "/solutions/security-compliance",
      cta: "Explore Security & Compliance",
    },
    {
      index: "02",
      way: "Operate",
      title: "IT Operations",
      headline: "Autonomous operations, powered by agentic AI",
      body: "Reimagine IT operations with agents that think, learn, and act across systems. Apply reasoning agents to predict issues, model congestion, and unify operational signals across large, distributed networks — entirely within your own infrastructure.",
      href: "/solutions/it-operations",
      cta: "Explore IT Solutions",
    },
    {
      index: "03",
      way: "Govern",
      title: "Business Operations & FinOps",
      headline: "Turn operational complexity into coordinated execution",
      body: "Give Business Operations and FinOps leaders a single reasoning layer across cost, compliance, and operational reporting — replacing manual reconciliation with real-time, policy-governed autonomy.",
      href: "/solutions/business-operations",
      cta: "Explore Business Operations",
    },
  ],
  replaceTitle: "Replacing silos, not sitting beside them",
  replaceIntro:
    "Vyuha doesn’t add another dashboard to an already-fragmented stack — it absorbs the function of the tools it replaces.",
  replacements: [
    {
      index: "01",
      title: "Context-blind SOAR",
      body: "Rule-bound engines that fire playbooks without enterprise context, leaving operators to stitch the story together after the fact.",
    },
    {
      index: "02",
      title: "Point-solution agents",
      body: "Narrow, single-use agentic tools that can’t reason across security, IT, and operations — and can’t be governed as one system.",
    },
    {
      index: "03",
      title: "Ungoverned AI toolkits",
      body: "Generic builders and shadow-AI usage that leak data, skip policy, and leave no inspectable trail for regulators or the board.",
    },
  ],
  replaceCloser:
    "A no-code visual orchestrator upgrades existing L1 and L2 operators into elite orchestrators, while self-healing, living workflows continuously adapt, self-correct, and optimize in real time.",
  industriesTitle: "Agentic intelligence for high-impact industries",
  industriesIntro:
    "Deploy enterprise AI where operational complexity, security, and scale matter most — with the same sovereign mesh, tuned to each sector’s regulatory pressure.",
  industries: [
    {
      title: "Financial Services",
      headline: "Sovereign AI for trusted financial operations",
      body: "Fraud, AML, and KYC stay inside the bank. Agents reason across transaction, identity, and GenAI usage — under RBI and DPDP Act 2023 — with zero data egress.",
    },
    {
      title: "Telecom",
      headline: "Autonomous intelligence for connected networks",
      body: "Carrier-scale telemetry, SIM/roaming fraud, and capacity modeling — predicted and acted on in real time, entirely on your infrastructure.",
    },
    {
      title: "Retail",
      headline: "Fraud defense without expanding PCI scope",
      body: "POS fraud, shrinkage, account takeover, and vendor compliance — without sending cardholder or customer data to a third-party model.",
    },
    {
      title: "Insurance",
      headline: "Claims, underwriting, and firewall intelligence",
      body: "IRDAI-regulated data stays inside. Agents coordinate fraud detection, risk assessment, and firewall change with an inspectable trail.",
    },
  ],
  industriesCta: {
    label: "See all industry use cases",
    href: "/solutions/industry-use-cases",
  },
  finalHeadline: "From pilots to autonomous operations",
  finalBody:
    "Start with a high-value use case and build toward a governed enterprise AI formation — designed around your systems, data, and operational priorities, on your own terms.",
  finalCtas: [
    { label: "Request Architecture Demo", href: "/book-a-demo" },
    { label: "Explore the Platform", href: "/platform" },
  ],
};
