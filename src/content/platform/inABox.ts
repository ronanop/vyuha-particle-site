import type { PlatformProductContent } from "@/content/platform/types";

export const platformInABox: PlatformProductContent = {
  path: "/platform/in-a-box",
  eyebrow: "Powered by Airrived Engine | On-Premise AI Appliance",
  title: "Vyuha In a BOX",
  headline: "The Turnkey Self-Governed On-Premises AI Appliance",
  body: [
    "The complete Vyuha.ONE OS pre-loaded onto enterprise GPU hardware. Complete physical data localization, zero external egress, and hardware-accelerated intelligence engineered for on-premise data centers and air-gapped defense environments.",
  ],
  primaryCtas: [
    { label: "Schedule On-Premise Demo", href: "/contact" },
    { label: "Explore Hardware Specifications", href: "/contact" },
  ],
  sections: [
    {
      title: "Plug-and-Play Self-Governed Infrastructure",
      paragraphs: [
        "Vyuha In a BOX delivers the full agentic intelligence, 200+ enterprise connectors, and multi-agent orchestration of Vyuha.ONE as a turnkey, hardware-accelerated appliance for organizations requiring physical containment and local performance.",
      ],
    },
    {
      title: "Self-Governed AI Under Your Physical Boundary",
      cards: [
        {
          title: "Zero External Egress",
          body: "Core inference and workflow execution run natively inside your physical network.",
        },
        {
          title: "DPDP Act 2023 Alignment",
          body: "Built around Indian data residency, data localization, and regulatory requirements.",
        },
        {
          title: "Immunity from External Logging",
          body: "Enterprise IP remains yours, never transmitted externally or used to train public models.",
        },
      ],
    },
    {
      title: "Hardware Delivery Models",
      cards: [
        {
          title: "Dedicated On-Premise GPU Provisioning",
          body: "Hardware-accelerated deployment within your data center.",
        },
        {
          title: "Air-Gapped / Sena Environment",
          body: "Offline, physically isolated deployment for defense, PSUs, and critical national infrastructure.",
        },
        {
          title: "Dedicated Private Edge Node",
          body: "Localized appliance units for distributed regional hubs requiring local AI autonomy under central governance.",
        },
      ],
    },
    {
      title: "Why Deploy Vyuha In a BOX?",
      cards: [
        {
          title: "Zero Latency Inference",
          body: "Direct local hardware access for rapid model execution, real-time response, and high-volume data ingestion.",
        },
        {
          title: "Total Containment of Proprietary Assets",
          body: "Custom DSLMs, agentic playbooks, and historical enterprise telemetry remain on local physical drives.",
        },
        {
          title: "Identical OS Capabilities",
          body: "Feature parity with Vyuha.ONE, including App Store, Composable Agents, A2A Mesh, and No-Code Orchestrator, delivered offline.",
        },
      ],
    },
    {
      title: "Vyuha.ONE vs Vyuha In a BOX",
      table: {
        headers: ["Dimension", "Vyuha.ONE", "Vyuha In a BOX"],
        rows: [
          ["Operating System", "Vyuha.ONE OS", "Vyuha.ONE OS (Pre-installed)"],
          ["Deployment", "AWS, Azure, GCP, Private VPC", "On-Premise / Enterprise GPU Infrastructure"],
          ["200+ Integrations", "Supported", "Supported"],
          ["App Store & Agents", "Included", "Included"],
          ["A2A Mesh", "Included", "Included"],
          ["Air-Gapped / Sena", "Optional", "Built-in Native"],
        ],
      },
    },
  ],
  finalHeadline: "Command Self-Governed AI Inside Your Physical Perimeter",
  finalBody:
    "Vyuha In a BOX provides infrastructure control, air-gapped security, and hardware-accelerated performance, enabling autonomous AI without data leaving your facility.",
  finalCtas: [
    { label: "Request On-Premise Demo", href: "/contact" },
    { label: "Contact Infrastructure Team", href: "/contact" },
  ],
};
