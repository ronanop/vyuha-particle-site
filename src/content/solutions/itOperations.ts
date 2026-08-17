import type { SolutionsFunctionContent } from "@/content/solutions/types";

export const itOperations: SolutionsFunctionContent = {
  path: "/solutions/it-operations",
  eyebrow: "02 · IT Operations",
  title: "IT Operations",
  headline: "The IT mandate has outgrown the model",
  body: [
    "IT exists to operate reliably, transform continuously, and enable the business at scale. Yet the mandate has outgrown the model. As environments become more dynamic and interconnected, IT is expected to deliver always-on reliability, continuous change, and frictionless enablement — without additional headcount.",
    "Script-based automation and static workflows were built for a simpler era; they fracture as systems evolve, leaving IT teams reacting instead of leading.",
    "Vyuha reimagines IT operations with sovereign agentic intelligence — reasoning agents that think, learn, and act across systems, entirely within your own infrastructure boundary.",
  ],
  primaryCtas: [
    { label: "Request Architecture Demo", href: "/book-a-demo" },
  ],
  capabilitiesTitle: "Core IT capabilities enabled by Vyuha",
  capabilitiesIntro:
    "Vyuha isn’t another IT automation product. It’s the agentic operating system for autonomous, self-governed IT.",
  capabilities: [
    {
      title: "Autonomous IT Resolution",
      eyebrow: "Resolve issues faster, often without human intervention",
      body: "Vyuha agents classify, prioritize, and resolve incidents using historical patterns and live telemetry — resolving common L1/L2 tickets end-to-end (VPN failures, access provisioning, server memory spikes) rather than just routing them faster.",
      outcomes: [
        "80–90% reduction in operational effort across incident workflows",
        "Speed MTTR without extra headcount",
        "Reduce ticket volume and triage",
      ],
    },
    {
      title: "Real-Time Root Cause Analysis",
      eyebrow: "Understand the why, not just the what",
      body: "Agents correlate signals across infrastructure, applications, and services to identify root causes in complex, distributed environments.",
      outcomes: [
        "Faster diagnosis in multi-system dependencies",
        "Reduce repeat incidents through learned outcomes",
        "Improve service reliability and uptime",
      ],
    },
    {
      title: "Configuration Management (CMDB) Automation",
      eyebrow: "Living system context for autonomous IT",
      body: "Vyuha agents continuously discover, correlate, and maintain system relationships across applications, infrastructure, and services.",
      outcomes: [
        "Keep CMDBs continuously accurate and up to date",
        "Automatically map dependencies for impact and root-cause analysis",
        "Power change, incident, and outage decisions with real-time context",
      ],
    },
    {
      title: "Enterprise Automation",
      eyebrow: "Autonomous execution across systems",
      body: "Vyuha agents reason over context, coordinate across platforms, and execute workflows autonomously — without brittle scripts or manual orchestration.",
      outcomes: [
        "Automate complex, multi-step workflows across IT, security, and enterprise systems",
        "Replace static rules and scripts with adaptive, agent-driven execution",
        "Continuously adjust automation as environments, dependencies, and policies change",
      ],
    },
    {
      title: "Conversational IT Operations",
      eyebrow: "Talk to your systems like a human expert",
      body: "Converse with machine data across Snowflake, Slack, Microsoft Teams, ServiceNow, SharePoint, and more — all without a query ever leaving your perimeter.",
      outcomes: [
        "Get quick insight without switching tools",
        "Natural language access to operational data",
        "Accelerate troubleshooting and decision-making",
      ],
    },
  ],
  whyTitle: "Why IT teams choose Vyuha",
  whyItems: [
    "No-code platform designed for practitioners — harness the power of AI without hiring AI talent.",
    "Leverage prebuilt agents with immediate ROI or create custom agents and agentic apps with no-code composition and zero engineering effort.",
    "Replace multiple tools and legacy RPA with a single, unified, sovereign platform.",
    "Reasoning-driven automation, not static scripts.",
    "Enterprise-grade security, governance, and auditability, aligned with India’s DPDP Act 2023.",
  ],
  impactTitle: "Measurable business impact",
  impactItems: [
    "Up to 60× productivity gains across IT",
    "80–90% reduction in operational effort",
    "Consolidate and replace fragmented IT automation tools",
    "Offset the workload equivalent of two full-time hires within six months",
  ],
  finalCtas: [
    { label: "Request Architecture Demo", href: "/book-a-demo" },
  ],
};
