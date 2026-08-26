import type { PlatformProductContent } from "@/content/platform/types";

export const platformIntegrations: PlatformProductContent = {
  path: "/platform/integrations",
  eyebrow: "Integrations",
  title: "ONE PLATFORM. EVERY SYSTEM.",
  headline:
    "With 200+ cyber, IT, and enterprise integrations available on day one, Vyuha plugs into your environment instantly, no re-architecture, no rip-and-replace.",
  body: [
    "This isn't about merely wiring tools together. It's about binding fragmented silos into a context-aware fabric that enables autonomous agents to reason and act across the enterprise stack.",
  ],
  primaryCtas: [{ label: "Request A Demo", href: "/book-a-demo" }],
  sections: [
    {
      title: "Built For The Stack You Already Trust",
      intro:
        "Unify security platforms, cloud & IT infrastructure, ERP/FinOps tools, collaboration networks, knowledge bases, data lakes, and vector stores into a single self-governed foundation.",
      cards: [
        {
          title: "Correlate Signals Across Silos",
          body: "Bridge isolated telemetry into a shared, context-rich intelligence layer.",
        },
        {
          title: "Apply Context-Aware Reasoning",
          body: "Evaluate events through your organization's operational, financial, and risk lens.",
        },
        {
          title: "Take Real, Autonomous Action",
          body: "Execute policy-governed remediation directly inside your tools.",
        },
      ],
    },
    {
      title: "Operational Impact & Ecosystem Reach",
      paragraphs: [
        "Vyuha unifies SIEM, XDR, IAM, Cloud, ITSM, and ERP platforms across Splunk, CrowdStrike, Palo Alto Networks, Wiz, AWS, GCP, Azure, Snowflake, ServiceNow, SAP, and Salesforce.",
        "Agents can monitor, assess, and autonomously resolve operational, financial, and security risks across these systems at enterprise scale.",
      ],
      cta: { label: "Explore Solutions", href: "/solutions" },
    },
    {
      title: "Integration Categories",
      cards: [
        {
          title: "Security",
          body: "SIEM, XDR, IAM and security platforms.",
        },
        {
          title: "Cloud & IT",
          body: "Cloud infrastructure, IT operations and service management.",
        },
        {
          title: "ERP & FinOps",
          body: "ERP and financial operations systems.",
        },
        {
          title: "Collaboration",
          body: "Collaboration networks and enterprise communication.",
        },
        {
          title: "Knowledge & Data",
          body: "Knowledge bases and data lakes.",
        },
        {
          title: "Model & Vector Stores",
          body: "Enterprise model and vector-store environments.",
        },
      ],
    },
  ],
  finalCtas: [
    { label: "Request A Demo", href: "/book-a-demo" },
    { label: "Explore Solutions", href: "/solutions" },
  ],
};
