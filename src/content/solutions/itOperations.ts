import type { MarketingPageContent } from "@/content/solutions/types";

export const itOperations: MarketingPageContent = {
  path: "/solutions/it-operations",
  eyebrow: "IT Operations",
  title: "The IT Mandate Has Outgrown the Model",
  body: [
    "IT exists to operate reliably, transform continuously, and enable the business at scale. Yet the mandate has outgrown the model. As environments become more dynamic and interconnected, IT is expected to deliver always-on reliability, continuous change, and frictionless enablement, without additional headcount. Script-based automation and static workflows were built for a simpler era; they fracture as systems evolve, leaving IT teams reacting instead of leading.",
    "Vyuha reimagines IT operations with sovereign agentic intelligence, reasoning agents that think, learn, and act across systems, entirely within your own infrastructure boundary.",
  ],
  primaryCtas: [
    { label: "Request Architecture Demo", href: "/book-a-demo" },
  ],
  sections: [
    {
      id: "capabilities",
      title: "Core IT Capabilities Enabled by Vyuha",
      intro:
        "Vyuha isn't another IT automation product. It's the agentic operating system for autonomous, self-governed IT.",
      cardsColumns: 2,
      cards: [
        {
          title: "Autonomous IT Resolution",
          headline: "Resolve Issues Faster, Often Without Human Intervention",
          body: "Vyuha agents classify, prioritize, and resolve incidents using historical patterns and live telemetry, resolving common L1/L2 tickets end-to-end (VPN failures, access provisioning, server memory spikes) rather than just routing them faster.",
          items: [
            "Achieve 80-90% reduction in operational effort across incident workflows",
            "Speed MTTR without extra headcount",
            "Reduce ticket volume and triage",
          ],
        },
        {
          title: "Real-Time Root Cause Analysis",
          headline: "Understand the Why, Not Just the What",
          body: "Agents correlate signals across infrastructure, applications, and services to identify root causes in complex, distributed environments.",
          items: [
            "Faster diagnosis in multi-system dependencies",
            "Reduce repeat incidents through learned outcomes",
            "Improve service reliability and uptime",
          ],
        },
        {
          title: "Configuration Management (CMDB) Automation",
          headline: "Living System Context for Autonomous IT",
          body: "Vyuha agents continuously discover, correlate, and maintain system relationships across applications, infrastructure, and services.",
          items: [
            "Keep CMDBs continuously accurate and up to date",
            "Automatically map dependencies for impact and root-cause analysis",
            "Power change, incident, and outage decisions with real-time context",
          ],
        },
        {
          title: "Enterprise Automation",
          headline: "Autonomous Execution Across Systems",
          body: "Vyuha agents reason over context, coordinate across platforms, and execute workflows autonomously, without brittle scripts or manual orchestration.",
          items: [
            "Automate complex, multi-step workflows across IT, security, and enterprise systems",
            "Replace static rules and scripts with adaptive, agent-driven execution",
            "Continuously adjust automation as environments, dependencies, and policies change",
          ],
        },
        {
          title: "Conversational IT Operations",
          headline: "Talk to Your Systems Like a Human Expert",
          body: "Converse with machine data across Snowflake, Slack, Microsoft Teams, ServiceNow, SharePoint, and more, all without a query ever leaving your perimeter.",
          items: [
            "Get quick insight without switching tools",
            "Natural language access to operational data",
            "Accelerate troubleshooting and decision-making",
          ],
        },
      ],
    },
    {
      title: "Vyuha: The Autonomous Operating Standard for Enterprise IT",
      items: [
        "No-code platform designed for practitioners, harness the power of AI without hiring AI talent.",
        "Leverage prebuilt agents with immediate ROI or create custom agents and agentic apps with no-code composition and zero engineering effort.",
        "Replace multiple tools and legacy RPA with a single, unified, sovereign platform.",
        "Reasoning-driven automation, not static scripts.",
        "Enterprise-grade security, governance, and auditability, aligned with India's DPDP Act 2023.",
      ],
    },
    {
      title: "Measurable Business Impact",
      items: [
        "Up to 60x productivity gains across IT",
        "80-90% reduction in operational effort",
        "Consolidate and replace fragmented IT automation tools",
        "2 FTE: offset the workload equivalent of two full-time hires within six months",
      ],
    },
  ],
  finalCtas: [{ label: "Request Architecture Demo", href: "/book-a-demo" }],
};
