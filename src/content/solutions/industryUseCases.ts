import type { SolutionsIndustryContent } from "@/content/solutions/types";

export const industryUseCases: SolutionsIndustryContent = {
  path: "/solutions/industry-use-cases",
  eyebrow: "Industry-Wise Use Cases",
  title: "Industry-Wise Use Cases",
  headline:
    "Agentic mesh adapted to each sector’s regulatory pressure and operational reality",
  body: "Vyuha adapts its agentic mesh to the regulatory pressure, document types, and operational realities of each sector it serves — with security and IT covered as dedicated function pages, and industry verticals here.",
  industries: [
    {
      title: "Financial Services",
      headline:
        "Autonomous fraud & compliance intelligence, without data ever leaving the bank",
      body: "Fraud, AML, and KYC teams sit on data that legally cannot leave the institution — yet they’re buried in false-positive alerts pulled from siloed transaction, behavioral, and identity systems. Layered on top, generative AI adoption spreads faster than banks can govern it: shadow AI, unsafe prompts, and uncontrolled data exposure create real business, security, and regulatory risk under RBI and DPDP Act 2023 oversight.",
      howHelps: [
        "Fraud-pattern agent — reasons across historical and live transaction behavior",
        "KYC-verification agent — cross-checks identity data against onboarding and watchlist sources",
        "Transaction-anomaly agent — flags deviations in real time across accounts",
        "AI-governance agent — discovers GenAI usage, monitors prompts for policy violations, and applies real-time governance controls",
      ],
      outcome:
        "Faster fraud triage, audit-ready decision trails, full visibility into enterprise GenAI usage, and zero data egress.",
    },
    {
      title: "Telecom",
      headline: "Real-time network & fraud defense at carrier scale",
      body: "Network operations generate telemetry at a volume no human SOC/NOC team can triage — CDRs, signaling traffic, and subscriber metadata never stop, across massive, distributed infrastructure.",
      howHelps: [
        "Network-anomaly agent — detects irregular traffic and infrastructure signals, predicting asset health before failures occur",
        "SIM/roaming-fraud agent — catches fraudulent SIM and roaming activity",
        "DDoS-detection agent — identifies and responds to attack patterns in real time",
        "Capacity-modeling agent — models network congestion and capacity constraints to protect SLAs proactively",
      ],
      outcome:
        "Autonomous, real-time threat response at carrier scale, predictive network health modeling across distributed assets, and full data sovereignty.",
    },
    {
      title: "Retail",
      headline: "Fraud and compliance defense without expanding PCI scope",
      body: "PCI-DSS-scoped payment data plus high-volume e-commerce fraud, constant workforce churn, and growing vendor exposure make identity, fraud, and compliance a moving target — one that most AI vendors can’t touch without expanding compliance scope.",
      howHelps: [
        "POS/payment-fraud agent — detects fraudulent transaction patterns",
        "Inventory-shrinkage agent — flags shrinkage and loss patterns across locations",
        "Omnichannel account-takeover agent — defends customer accounts across channels",
        "Identity & vendor-compliance agent — instant access reviews, automated third-party risk audits, and consistent policies across franchise locations",
      ],
      outcome:
        "Tighter PCI scope, fraud caught in real time, instant identity reviews for high-turnover workforces, automated vendor audits, and no third-party data exposure.",
    },
    {
      title: "Insurance",
      headline:
        "Coordinated claims, underwriting & firewall intelligence under full sovereignty",
      body: "Claims fraud and underwriting risk hinge on policyholder and medical data that IRDAI-regulated insurers can’t freely expose to cloud AI — and the same regulated networks generate constant firewall change requests where manual review is slow and mistakes are costly.",
      howHelps: [
        "Claims-fraud agent — identifies fraudulent or suspicious claims patterns",
        "Underwriting-risk agent — assesses risk factors during policy issuance",
        "Subrogation agent — surfaces recovery opportunities across claims",
        "Firewall-intelligence agent — analyzes ServiceNow change requests, generates precise firewall rules, and applies low- and medium-risk changes autonomously",
      ],
      outcome:
        "Faster claims processing, fewer fraudulent payouts, faster firewall change turnaround without increasing risk, and compliant by default.",
    },
    {
      title: "Hi-Tech",
      headline: "An internal agentic SOC + DevSecOps layer",
      body: "SaaS and product companies run at cloud scale — shipping code continuously, generating massive alert volumes, and facing nonstop threat activity — where proprietary source code and customer data can’t be routed through an external AI vendor. Traditional SOC models depend on human triage and static automation, creating bottlenecks at L1, L2, and L3 just as velocity accelerates.",
      howHelps: [
        "Runs SOC operations autonomously, resolving the majority of alerts without human involvement",
        "Applies DSLMs trained on the company’s own environment, threat patterns, and historical SOC decisions",
        "Generates dynamic, context-aware workflows that adapt per incident — not static playbooks",
        "Escalates only high-risk or novel threats to L2/L3 teams, preserving expert focus",
      ],
      outcome:
        "Significant reduction in L1/L2/L3 analyst workload, faster alert triage and lower MTTR, and zero exposure of source code or customer data.",
      comingSoon: true,
    },
  ],
  foundationTitle: "Why Vyuha",
  foundationBody:
    "Every capability above runs on the same sovereign foundation — the Airrived Engine, deployed either on Vyuha One or fully air-gapped on Vyuha In a BOX. Enterprises get absolute ownership of their data, models, agents, and execution logs, with no vendor lock-in. Vyuha does not sit alongside an organization’s existing tools — it absorbs their function, replacing brittle SOAR and legacy RPA, narrow point solutions, and ungoverned AI toolkits with a single, reasoning-driven orchestration layer built, governed, and owned entirely on the enterprise’s own terms.",
  finalCtas: [
    { label: "Request Architecture Demo", href: "/book-a-demo" },
    { label: "Explore the Platform", href: "/platform" },
  ],
};
