import type { MarketingPageContent } from "@/content/solutions/types";

export const bookADemo: MarketingPageContent = {
  path: "/book-a-demo",
  eyebrow: "BOOK A DEMO",
  title: "Request an Architecture Demo",
  body: [
    "Start with a high-value opportunity and explore how Vyuha can help build secure, governed, production-ready agentic intelligence for your enterprise.",
  ],
  primaryCtas: [
    { label: "Request Architecture Demo", href: "/book-a-demo" },
    { label: "Request Architecture Sprint", href: "/contact" },
  ],
  sections: [
    {
      title: "What We Can Discuss",
      cards: [
        {
          title: "Enterprise AI Architecture",
          body: "Explore how Vyuha fits into your existing enterprise environment.",
        },
        {
          title: "Agentic Workflows",
          body: "Discuss autonomous agents, multi-agent collaboration, and orchestration.",
        },
        {
          title: "Deployment & Control",
          body: "Explore cloud/private VPC and on-premise Vyuha In a BOX deployment models.",
        },
      ],
    },
    {
      pendingNotice:
        "Form fields pending: The source material provides CTA language but does not define the final lead-capture form fields. Add the approved form specification here.",
    },
  ],
};
