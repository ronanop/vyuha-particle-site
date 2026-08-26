import type { MarketingPageContent } from "@/content/solutions/types";

export const businessOperations: MarketingPageContent = {
  path: "/solutions/business-operations",
  eyebrow: "Business Operations & FinOps",
  title: "From Fragmented Reporting to Coordinated, Governed Execution",
  body: [
    "Cost, compliance, and operational reporting is stitched together manually from multiple systems, arriving too late to influence the decisions it should inform. Business Operations and FinOps leaders need a single reasoning layer across finance, security, and operations, not another dashboard that reports on yesterday's numbers.",
    "Vyuha reimagines Business Operations with sovereign agentic intelligence, composing reporting, reconciliation, and approval workflows that run continuously and stay entirely within the enterprise's own perimeter.",
  ],
  primaryCtas: [
    { label: "Request Architecture Demo", href: "/contact" },
  ],
  sections: [
    {
      id: "capabilities",
      title: "Core Business Operations Capabilities Enabled by Vyuha",
      cards: [
        {
          title: "Unified Reporting & Reconciliation",
          headline: "One View Across Finance, Security, and Operations",
          body: "Vyuha composes reporting and reconciliation agents that pull structured and unstructured data from finance, security, and operations systems into a single, always-current view, replacing manual, end-of-period stitching with continuous reconciliation.",
        },
        {
          title: "Governed Autonomous Approvals",
          headline: "Policy-Governed Action, Not Just Policy Documentation",
          body: "Agents apply policy-governed autonomous action for approvals, budget alerts, and compliance workflows, routing only genuine exceptions to human reviewers under configurable Human-in-the-Loop controls.",
        },
        {
          title: "Workforce Elevation for Operations Teams",
          headline: "Every Practitioner Becomes an Orchestrator",
          body: "A no-code visual builder elevates existing operators into orchestrators, no dedicated AI or data engineering team required, so Business Operations and FinOps teams can compose and adapt workflows themselves.",
        },
      ],
    },
    {
      title: "Why Business Operations & FinOps Teams Choose Vyuha",
      cardsColumns: 2,
      cards: [
        {
          title: "Real-Time Operational & Cost Intelligence",
          body: "Eliminate tedious manual reconciliation cycles with live, continuous operational and financial visibility.",
        },
        {
          title: "True No-Code Agility",
          body: "Build, deploy, and adapt living multi-agent workflows in minutes without waiting for engineering backlogs.",
        },
        {
          title: "Policy-Governed Autonomy",
          body: "Empower agents to reason and act independently within strict budget and compliance guardrails, backed by human sign-off where it matters most.",
        },
        {
          title: "Sovereign by Design",
          body: "Ensure every operational report, financial reconciliation, and decision log remains strictly contained inside your isolated Vyuha One or Vyuha In a BOX perimeter.",
        },
        {
          title: "A Consolidated Control Plane",
          body: "Collapse fragmented point solutions for reporting, reconciliation, and approval routing into one unified, deep-reasoning layer.",
        },
      ],
    },
    {
      title: "Measurable Business Impact",
      items: [
        "Reduced manual reconciliation effort across finance, security, and operations systems",
        "Faster, more consistent policy and budget compliance",
        "Up to a 60x boost in operational velocity via intelligent task routing and reduced tool sprawl",
      ],
    },
  ],
  finalCtas: [{ label: "Request Architecture Demo", href: "/contact" }],
};
