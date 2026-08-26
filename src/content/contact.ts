export type ContactTopic = {
  title: string;
  body: string;
};

export type ContactContent = {
  path: string;
  eyebrow: string;
  title: string;
  email: string;
  phone: string;
  phoneHref: string;
  formIntro: string;
  discussTitle: string;
  discussTopics: ContactTopic[];
};

export const contactPage: ContactContent = {
  path: "/contact",
  eyebrow: "CONTACT",
  title: "Get in touch",
  email: "hello@vyuha.ai",
  phone: "+91 11 4108 2200",
  phoneHref: "tel:+911141082200",
  formIntro: "Send a message and we will follow up.",
  discussTitle: "What We Can Discuss",
  discussTopics: [
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
};
