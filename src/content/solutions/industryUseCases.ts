import type { MarketingPageContent } from "@/content/solutions/types";

export const industryUseCases: MarketingPageContent = {
  path: "/solutions/industry-use-cases",
  eyebrow: "Industry-Wise Use Cases",
  title: "Industry-Wise Use Cases",
  body: [
    "Vyuha adapts its agentic mesh to the regulatory pressure, document types, and operational realities of each sector it serves.",
  ],
  primaryCtas: [
    { label: "Request Architecture Demo", href: "/contact" },
  ],
  sections: [
    {
      id: "industries",
      title: "Verticals",
      cardsColumns: 2,
      cards: [
        {
          title: "Financial Services",
          headline:
            "Autonomous Fraud & Compliance Intelligence, Without Data Ever Leaving the Bank",
          body: "Fraud, AML, and KYC teams sit on data that legally cannot leave the institution, yet they're buried in false-positive alerts pulled from siloed transaction, behavioral, and identity systems. Layered on top, generative AI adoption by employees spreads faster than banks can govern it: shadow AI, unsafe prompts, and uncontrolled data exposure create real business, security, and regulatory risk under RBI and DPDP Act 2023 oversight.",
          itemsLabel: "How Vyuha Helps",
          items: [
            "Fraud-pattern agent: reasons across historical and live transaction behavior",
            "KYC-verification agent: cross-checks identity data against onboarding and watchlist sources",
            "Transaction-anomaly agent: flags deviations in real time across accounts",
            "AI-governance agent: discovers and inventories LLM/GenAI usage across employees and applications, continuously monitors prompts for policy violations and sensitive-data exposure, and applies real-time governance controls dynamically rather than through static reviews",
          ],
          outcome:
            "Faster fraud triage, audit-ready decision trails, full visibility into enterprise GenAI usage, and zero data egress.",
        },
        {
          title: "Telecom",
          headline: "Real-Time Network & Fraud Defense at Carrier Scale",
          body: "Network operations generate telemetry at a volume no human SOC/NOC team can triage, CDRs, signaling traffic, and subscriber metadata never stop, across massive, distributed infrastructure.",
          itemsLabel: "How Vyuha Helps",
          items: [
            "Network-anomaly agent: detects irregular traffic and infrastructure signals, predicting asset health before failures occur",
            "SIM/roaming-fraud agent: catches fraudulent SIM and roaming activity",
            "DDoS-detection agent: identifies and responds to attack patterns in real time",
            "Capacity-modeling agent: models network congestion and capacity constraints to protect SLAs proactively",
          ],
          outcome:
            "Autonomous, real-time threat response at carrier scale, predictive network health modeling across distributed assets, and full data sovereignty.",
        },
        {
          title: "Retail",
          headline: "Fraud and Compliance Defense Without Expanding PCI Scope",
          body: "PCI-DSS-scoped payment data plus high-volume e-commerce fraud, constant workforce churn, and growing vendor exposure make identity, fraud, and compliance a moving target, one that most AI vendors can't touch without expanding compliance scope.",
          itemsLabel: "How Vyuha Helps",
          items: [
            "POS/payment-fraud agent: detects fraudulent transaction patterns",
            "Inventory-shrinkage agent: flags shrinkage and loss patterns across locations",
            "Omnichannel account-takeover agent: defends customer accounts across channels",
            "Identity & vendor-compliance agent: performs instant access and identity reviews as staff change, runs automated third-party risk and compliance audits, and enforces consistent policies across distributed franchise locations",
          ],
          outcome:
            "Tighter PCI scope, fraud caught in real time, instant identity reviews for high-turnover workforces, automated vendor audits with no manual effort, and no third-party data exposure.",
        },
        {
          title: "Insurance",
          headline:
            "Coordinated Claims, Underwriting & Firewall Intelligence Under Full Sovereignty",
          body: "Claims fraud and underwriting risk hinge on policyholder and medical data that IRDAI-regulated insurers can't freely expose to cloud AI, and the same regulated networks generate constant firewall change requests where manual review is slow and mistakes are costly.",
          itemsLabel: "How Vyuha Helps",
          items: [
            "Claims-fraud agent: identifies fraudulent or suspicious claims patterns",
            "Underwriting-risk agent: assesses risk factors during policy issuance",
            "Subrogation agent: surfaces recovery opportunities across claims",
            "Firewall-intelligence agent: ingests change requests from ServiceNow, analyzes them against assets, applications, data sensitivity, and dependencies, generates precise firewall rules, and applies low- and medium-risk changes autonomously, routing only high-risk rules to security teams for approval",
          ],
          outcome:
            "Faster claims processing, fewer fraudulent payouts, faster firewall change turnaround without increasing risk, and compliant by default.",
        },
        {
          title: "Hi-Tech",
          headline: "An Internal Agentic SOC + DevSecOps Layer",
          comingSoon: true,
          body: "SaaS and product companies run at cloud scale, shipping code continuously, generating massive alert volumes, and facing nonstop threat activity, where proprietary source code and customer data can't be routed through an external AI vendor. Traditional SOC models depend on human triage and static automation, creating bottlenecks at L1, L2, and L3 just as velocity accelerates. Vyuha runs internally as a truly autonomous SOC and DevSecOps orchestration layer, purpose-built for AI-native, high-growth environments.",
          itemsLabel: "How Vyuha Helps",
          items: [
            "Runs SOC operations autonomously, resolving the majority of alerts without human involvement",
            "Applies DSLMs trained on the company's own environment, threat patterns, and historical SOC decisions",
            "Generates dynamic, context-aware workflows that adapt per incident, not static playbooks",
            "Escalates only high-risk or novel threats to L2/L3 teams, preserving expert focus",
            "All of it secures the company's own CI/CD pipelines and customer data end-to-end, with no code or data leaving the company's perimeter.",
          ],
          outcome:
            "Significant reduction in L1/L2/L3 analyst workload, faster alert triage and lower MTTR, and zero exposure of source code or customer data.",
        },
      ],
    },
    {
      title: "Why Vyuha",
      paragraphs: [
        "Every capability above runs on the same sovereign foundation: The Airrived Engine, deployed either on Vyuha One or fully air-gapped on Vyuha In a BOX. That means enterprises get absolute ownership of their data, models, agents, and execution logs, with no vendor lock-in.",
        "Vyuha does not sit alongside an organization's existing tools, it absorbs their function, replacing brittle SOAR and legacy RPA, narrow point solutions, and ungoverned AI toolkits with a single, reasoning-driven orchestration layer that is built, governed, and owned entirely on the enterprise's own terms.",
      ],
    },
  ],
  finalCtas: [{ label: "Request Architecture Demo", href: "/contact" }],
};
