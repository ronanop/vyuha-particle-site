import type { SolutionsFunctionContent } from "@/content/solutions/types";

export const securityCompliance: SolutionsFunctionContent = {
  path: "/solutions/security-compliance",
  eyebrow: "01 · Security & Compliance",
  title: "Security & Compliance",
  headline: "From reactive defense to autonomous, sovereign security",
  body: [
    "Security has outgrown reactive defense. From nonstop alerts and audit pressure to identity sprawl, vulnerability overload, cloud misconfigurations, and third-party risk, security and compliance teams are stretched thin by fragmented tools and reactive processes that can’t keep up.",
    "Layered on top, DPDP Act 2023 and RBI/CERT-In obligations demand continuous, evidence-backed compliance that most enterprises can only reconstruct manually, after the fact.",
    "Vyuha transcends traditional SecOps by delivering a unified, sovereign agentic platform that standardizes intelligence across SOC, GRC, and IAM — entirely inside your own perimeter.",
  ],
  primaryCtas: [
    { label: "Request Architecture Demo", href: "/book-a-demo" },
  ],
  pillars: [
    "Unify workflows across SOC, GRC, and IAM",
    "Reduce operational overhead and eliminate silos",
    "Bridge the talent shortage with dynamic, reasoning agents",
    "Consolidate the entire security and risk stack — without a byte leaving the enterprise boundary",
  ],
  capabilitiesTitle:
    "Security & compliance capabilities powered by sovereign agentic intelligence",
  capabilities: [
    {
      title: "Security Operations & Threat Intel Operationalization",
      eyebrow: "Autonomous defense at machine speed",
      body: "SOC teams drown in high volumes of low-fidelity alerts, and most “AI-SOC” tools are thin wrappers around a generic chat model — they summarize, but they don’t reason or act. Vyuha deploys a swarm of reasoning agents that correlate identity, endpoint, network, and cloud signals to investigate alerts end-to-end, using DSLMs fine-tuned on the organization’s own telemetry. Agents execute immediate containment actions directly — isolating a compromised endpoint or pushing a firewall rule update — while connecting natively into existing SIEM, EDR, and case-management tools.",
      outcomes: [
        "Materially faster investigation and response times",
        "Fewer alerts requiring manual eyes-on triage",
        "A defensible, inspectable reasoning trail for every closed case",
      ],
    },
    {
      title: "Identity Management & Access Governance",
      eyebrow: "Real-time least privilege at scale",
      body: "Access reviews, entitlement audits, and joiner-mover-leaver processes are manual, periodic, and consistently behind the actual state of who has access to what. Vyuha continuously reconciles identity, entitlement, and access-log data across IdPs, SaaS apps, and on-prem directories, flagging anomalous or excess privilege in real time, and automates evidence collection and sign-off workflows for audit and compliance teams.",
      outcomes: [
        "Access reviews move from periodic to continuous",
        "Reduced audit preparation effort",
        "Faster closure of excess-privilege and orphaned-account findings",
      ],
    },
    {
      title: "Third-Party Risk Assessment",
      eyebrow: "Always-on vendor defense",
      body: "Vendor questionnaires, security certificates, and contract clauses arrive as unstructured documents that security and procurement teams review largely by hand. Vyuha reads vendor security questionnaires, SOC 2 / ISO reports, and contracts to extract risk-relevant fields automatically, cross-references vendor claims against known control frameworks, and maintains a living risk register that updates as new vendor documentation arrives.",
      outcomes: [
        "Faster vendor onboarding and re-assessment cycles",
        "Consistent, evidence-linked risk scoring across the vendor portfolio",
        "Lower manual review burden on GRC teams",
      ],
    },
    {
      title: "Vulnerability & Exposure Management",
      eyebrow: "Pinpoint the vulnerabilities that matter",
      body: "Scanner output vastly outpaces remediation capacity, and prioritization is often based on raw severity rather than actual business exposure. Vyuha correlates vulnerability scan data with asset criticality, exploitability intelligence, and exposure context to re-rank the queue, auto-generates remediation tickets routed to the right owning team, and tracks remediation SLAs — re-verifying fixes without manual re-scanning requests.",
      outcomes: [
        "Remediation focused on genuinely exploitable, business-critical exposure",
        "Shorter mean-time-to-remediate",
        "Clear, board-ready exposure trend reporting",
      ],
    },
    {
      title: "AI Guardrails & Shadow AI Governance",
      eyebrow: "Secure GenAI adoption, without slowing it down",
      body: "Employees adopt public LLMs and GenAI tools faster than security teams can inventory or govern them, creating unmanaged data-exposure risk. Vyuha discovers and inventories LLM and GenAI usage across employees, applications, and tools; continuously monitors prompts and interactions for policy violations and sensitive-data exposure; and applies real-time governance controls — enforced dynamically, not through static policy reviews.",
      outcomes: [
        "Full visibility into enterprise GenAI and LLM usage",
        "Materially reduced risk from unsafe prompts and shadow AI tools",
        "Consistent policy enforcement across teams without slowing adoption",
      ],
    },
    {
      title: "DPDP Act Compliance & Automated GRC",
      eyebrow: "Continuous, evidence-backed regulatory posture",
      body: "Regulatory audits under the DPDP Act 2023 and RBI/CERT-In circulars require continuous evidence of how personal data is classified, redacted, and handled. Vyuha scans databases, logs, and customer interactions to automatically classify and redact sensitive PII in real time, runs continuous policy audits against current DPDP rules and RBI circulars, and generates audit-ready compliance reports automatically as regulations and internal systems change.",
      outcomes: [
        "Real-time PII classification and redaction instead of manual data-mapping",
        "Continuous, always-current regulatory audit posture",
        "Audit-ready reports available on demand",
      ],
    },
  ],
  audience:
    "Built for CISOs, SOC leaders, and compliance teams who need an open, inspectable, sovereign alternative to black-box AI-SOC tools.",
  whyTitle: "Why security & compliance teams choose Vyuha",
  whyItems: [
    "Prebuilt agentic apps with instant value — deploy product-ready apps for Security Operations, Identity, Vulnerability Management, AI Guardrails, and Third-Party Risk in seconds.",
    "Ready-to-go domain-specific security agents trained on your own telemetry for threat detection, incident response, compliance, identity, and risk.",
    "Create custom agents and agentic apps — no-code composition and orchestration, zero engineering effort.",
    "Adaptive, reasoning-driven automation — agents reason over context, correlate signals across tools, and take autonomous action, not just trigger rules.",
    "Enterprise-grade, sovereign governance — human-in-the-loop execution, auditability, RBAC, and policy-based autonomy by design, fully aligned with India’s DPDP Act 2023.",
  ],
  impactTitle: "Measurable business impact",
  impactItems: [
    "Up to 60× improvement in productivity across SOC, IAM, and GRC teams",
    "80–90% reduction in operational effort",
    "Offset the workload equivalent of two full-time hires within six months",
    "Lower spend — reduced dependence on managed services and incremental headcount",
  ],
  integrations:
    "Vyuha agents integrate across your existing environment — SIEM, XDR, IAM, cloud, and ticketing platforms including Splunk, CrowdStrike, Palo Alto Networks, Wiz, AWS, GCP, Azure, Snowflake, and ServiceNow — all reasoning and acting entirely inside your Vyuha One or Vyuha In a BOX perimeter.",
  finalCtas: [
    { label: "Request Architecture Demo", href: "/book-a-demo" },
  ],
};
