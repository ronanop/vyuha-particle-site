import type { PlatformProductContent } from "@/content/platform/types";

export const platformIntegrations: PlatformProductContent = {
  path: "/platform/integrations",
  eyebrow: "Platform · Integrations",
  title: "Integrations",
  headline: "Connect the stack you already run — then let agents reason across it",
  body: [
    "We do not believe in forcing a massive rip-and-replace of the tools you already trust. Vyuha flows into the cracks of the organization: correlating signals across silos, absorbing repetitive triage, and taking autonomous action — without a query ever leaving your perimeter.",
    "With 200+ cyber and IT integrations available on day one, Vyuha instantly connects the enterprise stack into a single intelligent foundation. No massive engineering overhaul required.",
  ],
  primaryCtas: [
    { label: "Request Architecture Demo", href: "/book-a-demo" },
    { label: "Explore Command", href: "/platform/command" },
  ],
  sections: [
    {
      title: "Security, identity, and cloud",
      intro:
        "Agents connect natively into existing SIEM, EDR, IAM, and case-management tools rather than replacing them outright — then reason and act entirely inside your Vyuha One or In a BOX perimeter.",
      items: [
        "SIEM, XDR, and detection: Splunk, CrowdStrike, Palo Alto Networks, Wiz",
        "Cloud and data: AWS, GCP, Azure, Snowflake",
        "Identity and ITSM: IAM platforms and ServiceNow",
      ],
    },
    {
      title: "Conversational operations",
      intro:
        "Talk to machine data like a human expert — across the collaboration and operations tools the team already lives in.",
      items: [
        "Snowflake, Slack, Microsoft Teams, ServiceNow, SharePoint, and more",
        "Natural-language access to operational data without switching tools",
        "No query leaves the perimeter",
      ],
    },
    {
      title: "What the gold fills",
      items: [
        "Context across silos — agents apply context-aware reasoning instead of surface-level insights.",
        "Workforce load — reasoning agents absorb alert fatigue and upgrade analysts into orchestrators.",
        "Structural control — data, custom agents, and models remain exclusively yours, with policy-based autonomy that meets Indian compliance requirements.",
      ],
      closer:
        "By filling operational cracks with reasoning, automation, and deep integrations, Vyuha turns a fragmented set of tools into an autonomous, self-healing enterprise.",
    },
  ],
  finalCtas: [
    { label: "Book a Demo", href: "/book-a-demo" },
    { label: "See Industry Use Cases", href: "/solutions/industry-use-cases" },
  ],
};
