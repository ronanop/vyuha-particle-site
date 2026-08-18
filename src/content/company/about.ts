import type { MarketingPageContent } from "@/content/solutions/types";

export const companyAbout: MarketingPageContent = {
  path: "/company/about",
  eyebrow: "ENGINEERED FOR ENTERPRISE INTELLIGENCE",
  title: "Building the Formation for Autonomous Enterprise",
  body: [
    "Vyuha.ai helps enterprises move from fragmented AI tools to coordinated, autonomous operations. We combine agentic intelligence, sovereign infrastructure, cybersecurity, and enterprise engineering to build AI systems that operate securely within real-world business environments.",
  ],
  primaryCtas: [
    { label: "Request an Architecture Sprint", href: "/book-a-demo" },
  ],
  sections: [
    {
      title: "Our Story",
      headline: "From Strategic Formation to Enterprise Intelligence",
      paragraphs: [
        "The name Vyuha comes from an ancient concept of a dynamic formation—multiple elements working together toward a common objective.",
        "We bring that principle to enterprise AI. Instead of deploying isolated tools, Vyuha connects intelligent agents, enterprise systems, data, security, and human expertise into a coordinated operating model built to adapt as the mission evolves.",
      ],
    },
    {
      title: "Built for Enterprise Reality",
      intro:
        "Vyuha is built by enterprise practitioners with experience across AI, cybersecurity, architecture, and large-scale transformation. We understand environments where regulatory requirements, data sovereignty, legacy infrastructure, and operational resilience are fundamental to every technology decision.",
      stats: [
        { value: "25+", label: "Years — Combined Enterprise Leadership" },
        { value: "5", label: "Regulated Industries" },
        { value: "3", label: "Live Enterprise Deployments" },
        { value: "100%", label: "FDE-Led Engagements" },
      ],
    },
    {
      title: "Our Philosophy",
      headline: "AI That Works Within Your Enterprise",
      paragraphs: [
        "Enterprise AI should operate within the systems, policies, and security boundaries that define your organization.",
        "Vyuha combines autonomous execution with governance and human oversight—allowing AI to handle operational complexity while people retain control over critical decisions.",
      ],
    },
    {
      title: "Our Approach",
      headline: "From Architecture to Production",
      intro:
        "We don't simply deliver software. Our Forward Deployed Engineers work alongside your teams, inside your environment, to turn high-value AI opportunities into governed production systems.",
      cards: [
        {
          title: "01 Architecture Sprint",
          body: "Map your environment, identify operational friction, and prioritize high-value use cases.",
        },
        {
          title: "02 Foundation Build",
          body: "Connect systems, establish agent workflows, and create the governance foundation.",
        },
        {
          title: "03 Formation Deployment",
          body: "Introduce autonomous capabilities through controlled, human-governed production rollout.",
        },
        {
          title: "04 Continuous Evolution",
          body: "Expand the formation with new agents, workflows, and capabilities as your organization evolves.",
        },
      ],
    },
    {
      title: "Build With You. Leave Capability Behind.",
      paragraphs: [
        "Vyuha is designed to create lasting enterprise capability—not dependency. Your organization retains ownership of its data, AI assets, workflows, and models, while your teams gain the knowledge and experience to operate and extend what has been built.",
      ],
      closerLines: [
        "Data. Agents. Models. Workflows.",
        "Built for your enterprise. Owned by your enterprise.",
      ],
    },
  ],
  finalEyebrow: "READY TO MOVE BEYOND AI PILOTS?",
  finalHeadline: "Build the Autonomous Enterprise",
  finalBody:
    "Turn AI experimentation into secure, governed, production-ready intelligence with a team built for enterprise reality.",
  finalCtas: [
    { label: "Request an Architecture Sprint", href: "/book-a-demo" },
  ],
};
