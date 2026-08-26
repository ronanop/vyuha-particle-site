import type { MarketingPageContent } from "@/content/solutions/types";

export const securityCompliance: MarketingPageContent = {
  path: "/solutions/security-compliance",
  eyebrow: "Security & Compliance",
  title: "From Reactive Defense to Autonomous, Sovereign Security",
  headline:
    "Zero-Trust Security & continuous regulatory Assurance, powered by Sovereign AI",
  body: [
    "Security has outgrown reactive defense. From nonstop alerts and audit pressure to identity sprawl, vulnerability overload, cloud misconfigurations, and third-party risk, security and compliance teams are stretched thin by fragmented tools and reactive processes that can't keep up, and layered on top, DPDP Act 2023 and RBI/CERT-In obligations demand continuous, evidence-backed compliance that most enterprises can only reconstruct manually, after the fact.",
    "Vyuha transcends traditional SecOps by delivering a unified, sovereign agentic platform that standardizes intelligence across SOC, GRC, and IAM, entirely inside your own perimeter. Whether automating incident response, enforcing continuous compliance, or managing identity governance, domain-specific agents reason and act to eliminate silos and tool sprawl across the enterprise.",
  ],
  primaryCtas: [
    { label: "Request Architecture Demo", href: "/book-a-demo" },
  ],
  sections: [
    {
      title: "What changes",
      items: [
        "Unify workflows across SOC, GRC, and IAM",
        "Reduce operational overhead and eliminate silos",
        "Bridge the talent shortage with dynamic, reasoning agents",
        "Consolidate the entire security and risk stack, without a byte leaving the enterprise boundary",
      ],
    },
    {
      id: "capabilities",
      title: "Security & compliance capabilities",
      cardsColumns: 2,
      cards: [
        {
          title: "Security Operations & Threat Intel Operationalization",
          headline: "Autonomous Defense at Machine Speed",
          body: "SOC teams drown in high volumes of low-fidelity alerts, and most “AI-SOC” tools are thin wrappers around a generic chat model, they summarize, but they don't reason or act. Vyuha deploys a swarm of reasoning agents that correlate identity, endpoint, network, and cloud signals to investigate alerts end-to-end, using DSLMs fine-tuned on the organization's own telemetry so agents understand internal naming, asset criticality, and past incident history. Agents execute immediate containment actions directly, isolating a compromised endpoint or pushing a firewall rule update, not just recommending them, while connecting natively into existing SIEM, EDR, and case-management tools rather than replacing them outright.",
          outcomes: [
            "Materially faster investigation and response times; fewer alerts requiring manual eyes-on triage; a defensible, inspectable reasoning trail for every closed case.",
          ],
        },
        {
          title: "Identity Management & Access Governance",
          headline: "Real-Time Least Privilege at Scale",
          body: "Access reviews, entitlement audits, and joiner-mover-leaver processes are manual, periodic, and consistently behind the actual state of who has access to what. Vyuha continuously reconciles identity, entitlement, and access-log data across IdPs, SaaS apps, and on-prem directories, flagging anomalous or excess privilege in real time instead of waiting for the next quarterly review cycle, and automates evidence collection and sign-off workflows for audit and compliance teams.",
          outcomes: [
            "Access reviews move from periodic to continuous; reduced audit preparation effort; faster closure of excess-privilege and orphaned-account findings.",
          ],
        },
        {
          title: "Third-Party Risk Assessment",
          headline: "Always-On Vendor Defense",
          body: "Vendor questionnaires, security certificates, and contract clauses arrive as unstructured documents that security and procurement teams review largely by hand. Vyuha reads vendor security questionnaires, SOC 2 / ISO reports, and contracts to extract risk-relevant fields automatically, cross-references vendor claims against known control frameworks, and maintains a living risk register that updates as new vendor documentation arrives.",
          outcomes: [
            "Faster vendor onboarding and re-assessment cycles; consistent, evidence-linked risk scoring across the vendor portfolio; lower manual review burden on GRC teams.",
          ],
        },
        {
          title: "Vulnerability & Exposure Management",
          headline: "Pinpoint the Vulnerabilities That Matter",
          body: "Scanner output vastly outpaces remediation capacity, and prioritization is often based on raw severity rather than actual business exposure. Vyuha correlates vulnerability scan data with asset criticality, exploitability intelligence, and exposure context to re-rank the queue, auto-generates remediation tickets routed to the right owning team, and tracks remediation SLAs, re-verifying fixes without manual re-scanning requests.",
          outcomes: [
            "Remediation effort focused on genuinely exploitable, business-critical exposure; shorter mean-time-to-remediate; clear, board-ready exposure trend reporting.",
          ],
        },
        {
          title: "AI Guardrails & Shadow AI Governance",
          headline: "Secure GenAI Adoption, Without Slowing It Down",
          body: "Employees adopt public LLMs and GenAI tools faster than security teams can inventory or govern them, creating unmanaged data-exposure risk. Vyuha discovers and inventories LLM and GenAI usage across employees, applications, and tools; continuously monitors prompts and interactions for policy violations and sensitive-data exposure; and applies real-time governance controls to prompts, models, and usage patterns, enforced dynamically, not through static policy reviews.",
          outcomes: [
            "Full visibility into enterprise GenAI and LLM usage; materially reduced risk from unsafe prompts and shadow AI tools; consistent policy enforcement across teams without slowing adoption.",
          ],
        },
        {
          title: "DPDP Act Compliance & Automated GRC",
          headline: "Continuous, Evidence-Backed Regulatory Posture",
          body: "Regulatory audits under the DPDP Act 2023 and RBI/CERT-In circulars require continuous evidence of how personal data is classified, redacted, and handled, evidence most enterprises can only reconstruct manually, after the fact. Vyuha scans databases, logs, and customer interactions to automatically classify and redact sensitive PII in real time, runs continuous policy audits against current DPDP rules and RBI circulars rather than a point-in-time annual review, and generates audit-ready compliance reports automatically as regulations and internal systems change.",
          outcomes: [
            "Real-time PII classification and redaction instead of manual data-mapping exercises; continuous, always-current regulatory audit posture; audit-ready reports available on demand rather than assembled under deadline pressure.",
          ],
        },
      ],
      closer:
        "Built for CISOs, SOC leaders, and compliance teams who need an open, inspectable, sovereign alternative to black-box AI-SOC tools.",
    },
    {
      title: "Vyuha: The Sovereign Standard for Cyber and Compliance Leaders",
      items: [
        "Deploy Instant-Value Prebuilt Apps: Launch production-ready AI workflows for Security Operations, Identity, Vulnerability Management, AI Guardrails, and Vendor Risk in seconds.",
        "Activate Domain-Specific Security Agents: Train pre-configured AI agents on your proprietary telemetry to automate threat detection, incident response, compliance, and risk management.",
        "Build Custom Agents Without Code: Compose, test, and orchestrate tailored multi-agent applications effortlessly with zero engineering overhead.",
        "Drive Reasoning-Based Automation: Empower agents to evaluate real-time context, correlate multi-source signals, and execute autonomous decisions, moving far beyond static rules.",
        "Enforce Sovereign Enterprise Governance: Guarantee 100% DPDP Act (2023) compliance with strict Human-in-the-Loop controls, granular RBAC, immutable audit trails, and policy-backed autonomy.",
      ],
    },
    {
      title: "Deploy. Activate. Compose. Reason. Govern.",
      items: [
        "DEPLOY production-ready agentic apps for SOC, Identity, Vulnerability Management, Guardrails, and Risk in seconds.",
        "ACTIVATE specialized security agents trained on your telemetry for automated threat detection, triage, and compliance.",
        "COMPOSE custom multi-agent workflows effortlessly using a no-code orchestration engine with zero engineering delay.",
        "REASON through complex operational context, correlating cross-system telemetry to take autonomous action beyond static rules.",
        "GOVERN AI execution with 100% DPDP Act alignment, Human-in-the-Loop oversight, granular RBAC, and audit-ready logging.",
      ],
    },
    {
      title: "Measurable Business Impact",
      items: [
        "Up to 60x improvement in productivity across SOC, IAM, and GRC teams",
        "80-90% reduction in operational effort",
        "2 FTE: offset the workload equivalent of two full-time hires within six months",
        "Lower spend: reduced dependence on managed services and incremental headcount",
      ],
    },
    {
      title: "Deep Integration Across all the enterprise Stack",
      paragraphs: [
        "Vyuha agents integrate seamlessly across your existing environment, SIEM, XDR, IAM, cloud, and ticketing platforms including Splunk, CrowdStrike, Palo Alto Networks, Wiz, AWS, GCP, Azure, Snowflake, and ServiceNow, all reasoning and acting entirely inside your Vyuha One or Vyuha In a BOX perimeter.",
      ],
    },
  ],
  finalCtas: [{ label: "Request Architecture Demo", href: "/book-a-demo" }],
};
