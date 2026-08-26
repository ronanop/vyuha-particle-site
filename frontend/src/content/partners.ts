import type { SolutionCta } from "@/content/solutions/types";

export type PartnerDetail = {
  id: string;
  name: string;
  role: string;
  lead: string;
  paragraphs: string[];
  focus: string[];
  image?: string;
  /** How the logo fills the panel. Defaults to cover. */
  imageFit?: "cover" | "contain";
};

export type PartnersContent = {
  path: string;
  eyebrow: string;
  title: string;
  body: string[];
  primaryCtas: SolutionCta[];
  intelligence: {
    title: string;
    headline: string;
    paragraphs: string[];
  };
  partnersTitle: string;
  partnersIntro: string;
  partners: PartnerDetail[];
  finalHeadline: string;
  finalBody: string;
  finalCtas: SolutionCta[];
};

export const partnersPage: PartnersContent = {
  path: "/partners",
  eyebrow: "Partnership",
  title: "Building the Enterprise AI Ecosystem Together",
  body: [
    "Constant innovation needs a strong ecosystem.",
    "At Vyuha.AI, collaboration with tech innovators is our DNA.",
  ],
  primaryCtas: [{ label: "Become a Partner", href: "/contact" }],
  intelligence: {
    title: "Intelligence, Augmented.",
    headline:
      "The future of AI isn't about replacing human intelligence. It's about amplifying it.",
    paragraphs: [
      "Vyuha.AI combines human expertise with intelligent AI to accelerate innovation, decision-making and execution.",
      [
        "We partner with technology leaders and solution providers to help enterprises move from AI experimentation to real-world business impact.",
        "By bringing together enterprise-grade technology, intelligent orchestration, and domain expertise,",
        "we help organizations connect, reason, and execute at scale.",
      ].join("\n"),
    ],
  },
  partnersTitle: "Our Partners",
  partnersIntro:
    "Technology leaders and solution providers who help enterprises move from AI experimentation to real-world business impact.",
  partners: [
    {
      id: "airrived",
      name: "Airrived",
      role: "Exclusive Partner for India",
      image: "/partners/airrived.png",
      lead: "Driving AI-powered innovation and intelligent enterprise solutions — with an intelligence engine that powers the capabilities of Vyuha.AI agents.",
      paragraphs: [
        "Airrived is Vyuha.AI’s exclusive partner for India, anchoring our regional go-to-market with deep technology collaboration.",
        "At the center of that collaboration is the Airrived Engine — the intelligence layer that powers how Vyuha.AI agents reason, orchestrate, and execute across enterprise workflows.",
        "Together we help organizations in India adopt sovereign, production-ready AI: combining human expertise with intelligent systems so teams can innovate faster, decide with more context, and execute at scale.",
      ],
      focus: [
        "Exclusive partnership coverage for India",
        "Intelligence engine behind Vyuha.AI agents",
        "AI-powered enterprise innovation and solutions",
      ],
    },
    {
      id: "dell",
      name: "Dell Technologies",
      role: "OEM Solutions Partner",
      image: "/partners/dell.png",
      imageFit: "contain",
      lead: "Our Dell Technologies partnership is a key lever for Vyuha Box, bringing enterprise-grade infrastructure and technology to Vyuha.AI deployments.",
      paragraphs: [
        "Dell Technologies is an OEM Solutions Partner for Vyuha.AI — a critical enabler of how we deliver sovereign AI where enterprises need it most.",
        "This partnership is a key lever for Vyuha Box: pairing Vyuha’s intelligent orchestration with Dell’s enterprise-grade infrastructure so deployments can run with the reliability, performance, and operational standards large organizations expect.",
        "From on-premise and air-gapped environments to production-scale appliance deployments, Dell helps ensure Vyuha.AI reaches the enterprise on infrastructure built for mission-critical workloads.",
      ],
      focus: [
        "OEM Solutions Partner for Vyuha.AI",
        "Infrastructure foundation for Vyuha Box",
        "Enterprise-grade technology for production deployments",
      ],
    },
    {
      id: "curate",
      name: "Slash Curate",
      role: "Ecosystem & Innovation Partner",
      image: "/partners/curate.png",
      imageFit: "contain",
      lead: "The data platform powering connected intelligence, bringing together technology, expertise and innovation to accelerate enterprise AI adoption.",
      paragraphs: [
        "Slash Curate is Vyuha.AI’s Ecosystem & Innovation Partner — focused on the data foundation that connected intelligence requires.",
        "As a data platform, Slash Curate helps bring together technology, expertise, and innovation so enterprises can move beyond isolated AI pilots into systems that connect, reason, and act with shared context.",
        "Through this partnership we accelerate enterprise AI adoption: linking data readiness with intelligent orchestration so organizations can scale real-world business impact, not just experiments.",
      ],
      focus: [
        "Ecosystem and innovation collaboration",
        "Data platform for connected intelligence",
        "Accelerating enterprise AI adoption",
      ],
    },
  ],
  finalHeadline: "Partner With Vyuha.AI",
  finalBody:
    "Together, let's build and scale the future of Enterprise Intelligence.",
  finalCtas: [{ label: "Become a Partner", href: "/contact" }],
};
