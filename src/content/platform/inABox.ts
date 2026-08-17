import type { PlatformProductContent } from "@/content/platform/types";

export const platformInABox: PlatformProductContent = {
  path: "/platform/in-a-box",
  eyebrow: "Platform · In a BOX",
  title: "Vyuha In a BOX",
  headline: "AI at the edge — plug-and-play, air-gapped if you need it",
  body: [
    "The complexity of standing up AI infrastructure often derails digital transformation before it begins. Organizations spend months wrestling with cloud integrations, compute scaling, and architecture redesigns.",
    "Vyuha In a BOX bypasses that friction. This plug-and-play, edge-deployable infrastructure gives enterprises a clean canvas to activate deep reasoning agents immediately — on-premise, in an air-gapped environment, or within a private cloud.",
  ],
  primaryCtas: [
    { label: "Request Architecture Demo", href: "/book-a-demo" },
    { label: "Explore Command", href: "/platform/command" },
  ],
  sections: [
    {
      title: "Deploy without the engineering roadblock",
      items: [
        "Activate agentic workflows in seconds — no massive architecture redesign required.",
        "Run entirely on-premise, air-gapped, or in a private cloud. Your data never has to leave the building.",
        "Teams of any skill level can consume, build, and deploy — Command sits on top of the box, not a specialist toolchain.",
        "To be effective, the gold must set inside your environment. In a BOX is designed as a localized platform that fits the perimeter you already operate.",
      ],
    },
    {
      title: "Sovereign by construction",
      intro:
        "Every report, reconciliation, containment action, and agent log stays inside your Vyuha One or Vyuha In a BOX perimeter.",
      items: [
        "Absolute ownership of data, models, agents, and execution logs — no vendor lock-in.",
        "Built for DPDP Act 2023 and sectoral rules that make sending proprietary data to external APIs a non-starter.",
        "Policy-based autonomy with RBAC and human-in-the-loop — control where data lives and how AI acts.",
      ],
      closer:
        "The future of Indian enterprise intelligence will not be rented; it will be owned. In a BOX hands the keys directly to the enterprises that drive the nation forward.",
    },
  ],
  finalCtas: [
    { label: "Book a Demo", href: "/book-a-demo" },
    { label: "See Integrations", href: "/platform/integrations" },
  ],
};
