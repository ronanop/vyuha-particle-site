import type { PlatformOverviewContent } from "@/content/platform/types";

export const platformOverview: PlatformOverviewContent = {
  path: "/platform",
  eyebrow: "Platform",
  title: "Platform",
  subtitle: "Intelligence. Orchestrated. Adapt. Think. Act.",
  quote:
    "India has built for digital scale. Now, it’s time to build intelligence on our own terms.",
  body: [
    "The AI revolution is no longer a distant horizon — it is the current operational reality. For Indian enterprises, PSUs, and highly regulated industries, the barriers remain steep: scarce AI talent, prohibitive cloud costs, and the risk of sending sensitive, localized data to foreign-hosted models.",
    "Vyuha is a sovereign agentic platform, built on the Airrived Engine, that lets organizations build, deploy, and scale autonomous agents without code, complexity, or a single byte leaving their perimeter.",
  ],
  primaryCtas: [
    { label: "Request Architecture Demo", href: "/book-a-demo" },
    { label: "Explore Solutions", href: "/solutions" },
  ],
  productsIntro:
    "One foundation. Three ways to run it — Command to orchestrate agents, In a BOX to deploy at the edge, and native integrations that bind the stack you already have.",
  products: [
    {
      title: "Vyuha Command",
      headline: "A no-code canvas for sovereign agentic orchestration",
      body: "Give operators a clean canvas to create, compose, and govern autonomous agents. Domain-specific models grounded in your telemetry. Human-in-the-loop where it matters. No dedicated AI engineering team required.",
      href: "/platform/command",
      cta: "Explore Vyuha Command",
    },
    {
      title: "Vyuha In a BOX",
      headline: "Plug-and-play intelligence at the edge",
      body: "Bypass months of cloud integrations and architecture redesign. Deploy on-premise, air-gapped, or in a private cloud — and activate reasoning agents in seconds.",
      href: "/platform/in-a-box",
      cta: "Explore In a BOX",
    },
    {
      title: "Integrations",
      headline: "Bind the stack. Don’t rip and replace it.",
      body: "Connect SIEM, ITSM, identity, cloud, and collaboration tools on day one. Vyuha flows into the seams of the enterprise — correlating signals and acting across systems that already run the business.",
      href: "/platform/integrations",
      cta: "Explore Integrations",
    },
  ],
  kintsugiTitle: "The art of Kintsugi — strength in the seams",
  kintsugiBody: [
    "Kintsugi is the Japanese art of repairing broken pottery with gold. The repair does not hide the damage; it illuminates it. The golden seams create an object more resilient than the original unbroken piece.",
    "In the modern enterprise, Vyuha is the gold. We do not force a massive rip-and-replace of the tools you already trust. Vyuha binds fragmented systems with agentic AI — filling operational cracks with reasoning, automation, and deep integrations.",
    "The result is an autonomous, self-healing enterprise: you own your intelligence, bind your systems, and build infrastructure designed for the long term.",
  ],
  pillarsTitle: "Why the Indian enterprise needs a new approach",
  pillars: [
    {
      title: "Sovereign AI & uncompromising governance",
      body: "With the DPDP Act and sectoral regulation, data localization is the law. Vyuha keeps your data, custom models, and agents exclusively yours — with RBAC, human-in-the-loop oversight, and policy-based autonomy built into the architecture.",
    },
    {
      title: "Context beyond generic chatbots",
      body: "Off-the-shelf models do not know your network topology, risk appetite, or regulatory frame. Vyuha lets you create Domain-Specific Language Models grounded in local enterprise telemetry and documentation — so agents reason on the exact realities of your operations.",
    },
    {
      title: "Deploy at the edge",
      body: "Standing up AI infrastructure often derails transformation before it begins. Vyuha In a BOX is plug-and-play, edge-deployable infrastructure — on-premise, air-gapped, or private cloud — so teams of any skill level can consume, build, and deploy agentic workflows in seconds.",
    },
  ],
  finalCtas: [
    { label: "Book a Demo", href: "/book-a-demo" },
    { label: "See Solutions", href: "/solutions" },
  ],
};
