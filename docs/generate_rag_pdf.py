#!/usr/bin/env python3
"""Generate a page-wise, section-structured PDF of all Vyuha.ai website content for RAG."""

from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUT = Path(__file__).resolve().parent / "Vyuha.ai-Website-Content-RAG.pdf"

# ---------------------------------------------------------------------------
# Styles
# ---------------------------------------------------------------------------

styles = getSampleStyleSheet()

S = {
    "cover_brand": ParagraphStyle(
        "cover_brand",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=28,
        leading=34,
        textColor=colors.HexColor("#0B1F2A"),
        alignment=TA_CENTER,
        spaceAfter=8,
    ),
    "cover_sub": ParagraphStyle(
        "cover_sub",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#3D5A66"),
        alignment=TA_CENTER,
        spaceAfter=6,
    ),
    "cover_meta": ParagraphStyle(
        "cover_meta",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#6B7F88"),
        alignment=TA_CENTER,
    ),
    "toc_h": ParagraphStyle(
        "toc_h",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=16,
        leading=20,
        textColor=colors.HexColor("#0B1F2A"),
        spaceBefore=0,
        spaceAfter=14,
    ),
    "toc_item": ParagraphStyle(
        "toc_item",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#1A2E38"),
        leftIndent=0,
        spaceAfter=3,
    ),
    "toc_sub": ParagraphStyle(
        "toc_sub",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#4A606A"),
        leftIndent=14,
        spaceAfter=2,
    ),
    "page_path": ParagraphStyle(
        "page_path",
        parent=styles["Normal"],
        fontName="Courier",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0B6E7A"),
        spaceBefore=0,
        spaceAfter=4,
    ),
    "page_eyebrow": ParagraphStyle(
        "page_eyebrow",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#6B7F88"),
        spaceAfter=4,
    ),
    "page_title": ParagraphStyle(
        "page_title",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=16,
        leading=20,
        textColor=colors.HexColor("#0B1F2A"),
        spaceAfter=6,
    ),
    "page_headline": ParagraphStyle(
        "page_headline",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#1A4A55"),
        spaceAfter=8,
    ),
    "section": ParagraphStyle(
        "section",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        textColor=colors.HexColor("#0B1F2A"),
        spaceBefore=14,
        spaceAfter=6,
        borderPadding=2,
    ),
    "subsection": ParagraphStyle(
        "subsection",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13,
        textColor=colors.HexColor("#0B4A55"),
        spaceBefore=10,
        spaceAfter=4,
    ),
    "card_title": ParagraphStyle(
        "card_title",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#122C36"),
        spaceBefore=8,
        spaceAfter=2,
    ),
    "body": ParagraphStyle(
        "body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#1A2E38"),
        alignment=TA_JUSTIFY,
        spaceAfter=5,
    ),
    "body_left": ParagraphStyle(
        "body_left",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#1A2E38"),
        alignment=TA_LEFT,
        spaceAfter=5,
    ),
    "label": ParagraphStyle(
        "label",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#5A7078"),
        spaceBefore=4,
        spaceAfter=2,
    ),
    "bullet": ParagraphStyle(
        "bullet",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#1A2E38"),
        leftIndent=12,
        spaceAfter=2,
    ),
    "quote": ParagraphStyle(
        "quote",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#0B4A55"),
        leftIndent=8,
        rightIndent=8,
        spaceBefore=6,
        spaceAfter=6,
    ),
    "notice": ParagraphStyle(
        "notice",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#8A5A20"),
        spaceBefore=4,
        spaceAfter=4,
    ),
    "footer": ParagraphStyle(
        "footer",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=9,
        textColor=colors.HexColor("#8A9AA2"),
        alignment=TA_CENTER,
    ),
    "cta": ParagraphStyle(
        "cta",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0B6E7A"),
        spaceAfter=2,
    ),
    "table_cell": ParagraphStyle(
        "table_cell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#1A2E38"),
    ),
    "table_header": ParagraphStyle(
        "table_header",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0B1F2A"),
    ),
}


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\n", "<br/>")
    )


def p(text: str, style: str = "body"):
    return Paragraph(esc(text), S[style])


def bullets(items: list[str]):
    flow = []
    for item in items:
        flow.append(Paragraph(f"• {esc(item)}", S["bullet"]))
    return flow


def ctas(items: list[dict]):
    if not items:
        return []
    flow = [p("CTAs / Links", "label")]
    for c in items:
        flow.append(p(f"→ {c['label']}  ({c['href']})", "cta"))
    return flow


def page_header(path: str, title: str, eyebrow: str | None = None, headline: str | None = None):
    flow = [
        p(f"PAGE PATH: {path}", "page_path"),
    ]
    if eyebrow:
        flow.append(p(eyebrow.upper() if eyebrow == eyebrow else eyebrow, "page_eyebrow"))
    flow.append(p(title, "page_title"))
    if headline:
        flow.append(p(headline, "page_headline"))
    return flow


def section_title(text: str):
    return p(text, "section")


def add_card(card: dict):
    flow = []
    title = card.get("title", "")
    if title:
        flow.append(p(title, "card_title"))
    if card.get("comingSoon"):
        flow.append(p("[Coming Soon]", "notice"))
    if card.get("headline"):
        flow.append(p(card["headline"], "page_headline"))
    if card.get("role"):
        flow.append(p(f"Role: {card['role']}", "label"))
    if card.get("lead"):
        flow.append(p(card["lead"], "body"))
    if card.get("body"):
        flow.append(p(card["body"], "body"))
    for para in card.get("paragraphs", []) or []:
        flow.append(p(para, "body"))
    if card.get("itemsLabel"):
        flow.append(p(card["itemsLabel"], "label"))
    if card.get("items"):
        flow.extend(bullets(card["items"]))
    if card.get("focus"):
        flow.append(p("Focus", "label"))
        flow.extend(bullets(card["focus"]))
    if card.get("outcomes"):
        flow.append(p("Outcomes", "label"))
        flow.extend(bullets(card["outcomes"]))
    if card.get("outcome"):
        flow.append(p("Outcome", "label"))
        flow.append(p(card["outcome"], "body"))
    return flow


# ---------------------------------------------------------------------------
# Document content (full website copy — nothing omitted)
# ---------------------------------------------------------------------------

def build_story():
    story = []

    # ===== COVER =====
    story.append(Spacer(1, 50 * mm))
    story.append(p("Vyuha.ai", "cover_brand"))
    story.append(p("Website Content Document", "cover_sub"))
    story.append(p("Complete page-wise & section-wise content for RAG / knowledge base", "cover_sub"))
    story.append(Spacer(1, 12 * mm))
    story.append(p("Source: Canonical marketing content in src/content/", "cover_meta"))
    story.append(p("Structure: One chapter per public page · Sections preserved · All copy included", "cover_meta"))
    story.append(p("Generated for internal RAG ingestion · Vyuha.ai", "cover_meta"))
    story.append(PageBreak())

    # ===== TOC =====
    story.append(p("Table of Contents", "toc_h"))
    toc = [
        ("1. Home", "/"),
        ("2. Platform", "/platform"),
        ("   2.1 Vyuha.ONE (Command)", "/platform/command"),
        ("   2.2 Vyuha In a BOX", "/platform/in-a-box"),
        ("   2.3 Integrations", "/platform/integrations"),
        ("3. Solutions", "/solutions"),
        ("   3.1 Security & Compliance", "/solutions/security-compliance"),
        ("   3.2 IT Operations", "/solutions/it-operations"),
        ("   3.3 Business Operations & FinOps", "/solutions/business-operations"),
        ("   3.4 Industry-Wise Use Cases", "/solutions/industry-use-cases"),
        ("4. Company", "/company"),
        ("5. Partners", "/partners"),
        ("6. Resources", "/resources"),
        ("   6.1 News & Events", "/resources/news-events"),
        ("   6.2 Blog / Insights", "/resources/blog"),
        ("7. Contact", "/contact"),
        ("8. Sitemap", "/sitemap"),
    ]
    for label, path in toc:
        style = "toc_sub" if label.startswith(" ") else "toc_item"
        story.append(p(f"{label}  —  {path}", style))
    story.append(PageBreak())

    # =====================================================================
    # 1. HOME
    # =====================================================================
    story.extend(page_header("/", "Home — Sovereign Agentic AI for the Enterprise", eyebrow="HOME"))
    story.append(p("Display Title", "label"))
    story.append(p("Sovereign / Agentic AI / for the Enterprise", "page_headline"))
    story.append(
        p(
            "One platform. Infinite autonomous outcomes. Purpose-built for Cybersecurity, IT, FinOps, and Business Operations leaders to provide deep enterprise context to AI under uncompromising governance.",
            "body",
        )
    )
    story.extend(
        ctas(
            [
                {"label": "Discover Platform", "href": "/platform"},
                {"label": "Request Architecture Sprint", "href": "/contact"},
            ]
        )
    )

    story.append(section_title("Section: Foundations"))
    for block in [
        {
            "title": "The Foundation for Agentic Intelligence",
            "body": "Unlock capabilities that were once restricted to hyperscalers. Vyuha empowers your existing teams to provide context to AI, fine-tuning models on proprietary data, building deep-reasoning agents, and intelligently orchestrating workflows at scale.",
            "cta": {"label": "Explore AI In a BOX", "href": "/platform/in-a-box"},
        },
        {
            "title": "Architected for Builders and Operators",
            "body": "Built to scale with you, from instantly deploying pre-built apps to orchestrating custom workflows. We are democratizing AI in INDIA, empowering your teams to drive massive productivity without ever compromising your data perimeter.",
            "cta": {"label": "Read More", "href": "/company"},
        },
        {
            "title": "Reimagine the Enterprise with Agentic AI",
            "body": "One Agentic Fabric. Countless workflows transformed. Take the leap to shape, own, and scale your operations, providing deep context to AI across Cybersecurity, IT, and business functions.",
            "cta": {"label": "See the Apps in Action", "href": "/platform/command"},
        },
    ]:
        story.append(p(block["title"], "card_title"))
        story.append(p(block["body"], "body"))
        story.extend(ctas([block["cta"]]))

    story.append(section_title("Section: Command the Agentic Enterprise"))
    story.append(
        p(
            "One Agentic Fabric for Cybersecurity, IT, FinOps, and Business Operations. Deploy agentic apps instantly to shape, own, and scale your intelligence.",
            "body",
        )
    )
    story.extend(ctas([{"label": "Explore Agentic Apps", "href": "/platform/command"}]))

    story.append(section_title("Section: The Operating Engine for Enterprise-Controlled Intelligence"))
    story.append(
        p(
            "Vyuha transforms advanced AI into real-world operational velocity, enabling your enterprise to fine-tune models on local telemetry, deploy deep-reasoning agents, and intelligently orchestrate workflows across your entire stack.",
            "body",
        )
    )
    story.append(
        p(
            "No complexity. No specialized AI research team required. Just unified control, delivered entirely within your own private boundary.",
            "body",
        )
    )
    story.extend(ctas([{"label": "Schedule Platform Demo", "href": "/contact"}]))

    story.append(section_title("Section: Standardize on Controlled Autonomy"))
    story.append(
        p(
            "The enterprise-grade control plane purpose-built for Cybersecurity, IT, FinOps, and Business Operations leaders.",
            "body",
        )
    )
    for card in [
        {
            "title": "Deploy Anywhere",
            "body": "Build and deploy autonomous agents without engineering roadblocks. Powered by a no-code visual orchestrator, enterprise connectors, and seamless edge-deployment via Vyuha In a BOX.",
        },
        {
            "title": "Measurable Impact",
            "body": "Reduce tool sprawl, eliminate unnecessary cloud API burn through intelligent task routing, and achieve up to a 60x boost in operational velocity.",
        },
        {
            "title": "Workforce Elevation",
            "body": "Harness deep-reasoning agents without hiring armies of specialized AI engineers. Upgrade existing L1 and L2 operators into elite orchestrators.",
        },
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: Intelligence on Your Terms: Sovereign, Private, Governed"))
    story.append(p("Empower, Adapt, & Evolve", "card_title"))
    story.extend(bullets(["Built for Practitioners", "No-Code Composition", "Future-Proof Modularity"]))
    story.append(p("Own, Lead, & Govern", "card_title"))
    story.extend(
        bullets(["Absolute Asset Ownership", "Human-in-the-Loop Controls", "Uncompromising Governance"])
    )

    story.append(section_title("Section: Closing — Lead the Agentic Transition"))
    story.append(p("The Sovereign AI Blueprint", "card_title"))
    story.append(
        p(
            "Explore the strategies, insights, and engineering breakthroughs empowering Indian enterprises to build secure, autonomous operations.",
            "body",
        )
    )
    story.extend(ctas([{"label": "Request a Demo", "href": "/contact"}]))
    story.append(PageBreak())

    # =====================================================================
    # 2. PLATFORM OVERVIEW
    # =====================================================================
    story.extend(
        page_header(
            "/platform",
            "Vyuha: The Enterprise Agentic Platform",
            eyebrow="Powered by Airrived Engine | Democratizing AI in India",
            headline="One command plane. Infinite autonomous execution.",
        )
    )
    story.append(p("Display Title: The Enterprise / Agentic Platform.", "label"))
    story.append(
        p(
            "One command plane. Infinite autonomous execution. Purpose-built for Cybersecurity, IT, FinOps, and Business Operations leaders.",
            "body",
        )
    )
    story.append(
        p(
            "Purpose-built for Cybersecurity, IT, FinOps, and Business Operations leaders, multi-agent workflows with total perimeter control.",
            "quote",
        )
    )
    story.append(
        p(
            "Fine-tune models on local telemetry, deploy reasoning agents, and orchestrate your stack. No research team required, unified control, entirely inside your private boundary.",
            "body",
        )
    )
    story.append(p("Engine: Airrived Engine", "label"))
    story.extend(
        ctas(
            [
                {"label": "Request Architecture Demo", "href": "/contact"},
                {"label": "Explore Vyuha.ai", "href": "/"},
            ]
        )
    )

    story.append(section_title("Section: Platform Stats"))
    story.extend(
        bullets(
            [
                "200+ — enterprise security and IT integrations",
                "60x — boost in operational velocity",
                "0 — specialized AI research team required",
            ]
        )
    )

    story.append(section_title("Section: Standardize on Controlled Autonomy"))
    story.append(
        p(
            "The enterprise-grade control plane purpose-built for Cybersecurity, IT, FinOps, and Business Operations leaders.",
            "body",
        )
    )
    for card in [
        {
            "title": "01 — Deploy Anywhere",
            "body": "Build AI YOUR way, with YOUR data, aligned with your industry-specific guardrails. Create and launch autonomous agents without engineering roadblocks, powered by a no-code visual orchestrator, robust enterprise connectors, and secure edge-deployment via Vyuha In a BOX.",
        },
        {
            "title": "02 — Measurable Impact",
            "body": "Experience Exponential Impact & FinOps Efficiency. Achieve massive operational returns. Reduce tool sprawl, eliminate unnecessary cloud API burn through intelligent task routing, and achieve up to a 60x boost in operational velocity.",
        },
        {
            "title": "03 — Achieve 60x Operational Velocity",
            "body": "Harness deep-reasoning agentic power without hiring costly external specialists. Supercharge your current L1, L2, and domain practitioners into elite orchestrators who build and scale intelligence from within.",
        },
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: Platform Products"))
    for card in [
        {
            "title": "Vyuha.ONE",
            "headline": "The Enterprise Agentic OS for Your Private Cloud",
            "body": "Deploy one agentic fabric across all core operations under a single command plane with infinite autonomous execution. Purpose-built for Cybersecurity, IT, FinOps, and Business Operations leaders to orchestrate multi-agent workflows across your cloud infrastructure and entire enterprise stack with total perimeter control and military-grade precision.",
            "cta": {"label": "Explore Vyuha.ONE", "href": "/platform/command"},
        },
        {
            "title": "Vyuha In a BOX",
            "headline": "The Turnkey Self-Governed On-Premises Agentic AI Platform",
            "body": "The complete Vyuha.ONE OS pre-loaded onto enterprise GPU hardware. Complete physical data localization, zero external egress, and hardware-accelerated intelligence engineered for on-premise data centers and air-gapped defense environments.",
            "cta": {"label": "Explore In a BOX", "href": "/platform/in-a-box"},
        },
        {
            "title": "Integrations",
            "headline": "ONE PLATFORM. EVERY SYSTEM.",
            "body": "With 200+ cyber, IT, and enterprise integrations available on day one, Vyuha plugs into your environment instantly, no re-architecture, no rip-and-replace.",
            "cta": {"label": "Explore Integrations", "href": "/platform/integrations"},
        },
    ]:
        story.extend(add_card(card))
        story.extend(ctas([card["cta"]]))

    story.append(section_title("Section: Platform Integration & Replacement Strategy"))
    for card in [
        {
            "title": "01 — Where Insight Meets Execution: Instantly",
            "body": "Vyuha integrates seamlessly across your enterprise technology stack, including Security and IT tools, Collaboration platforms, Knowledge bases and data lakes, and Model and vector stores. The platform provides the reasoning and automation layer that connects insight to execution, enabling full-blown autonomous systems rather than static workflows.",
        },
        {
            "title": "02 — Consolidate the Stack, Not Just the Vendors",
            "body": "Vyuha doesn't sit alongside existing tools; it absorbs their function. By combining agentic reasoning, orchestration, and automation, Vyuha replaces brittle SOAR and legacy RPA platforms, narrow, single-use agentic point solutions, and generic Agent Builders and un-governed AI toolkits. The result is a simplified stack, reduced operational cost, and dramatically faster innovation.",
        },
        {
            "title": "03 — Own Your Intelligence, Not Just Your License",
            "body": "Vyuha ensures complete ownership of Data (proprietary enterprise context and logs), Agents (custom multi-agent logic and workflows), Models (fine-tuned domain-specific language models), and Workflows (autonomous playbooks and orchestration rules). Built on a modular, extensible architecture, Vyuha evolves as AI advances without vendor lock-in or forced re-platforming. This is AI infrastructure designed for the long term.",
        },
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: Own, Lead, & Govern"))
    story.append(p("Enterprise-controlled intelligence", "label"))
    story.extend(
        bullets(
            [
                "Absolute Asset Ownership",
                "Human-in-the-Loop Controls",
                "Uncompromising Governance with auditability and lineage",
                "200+ enterprise security and IT integrations",
            ]
        )
    )

    story.append(section_title("Section: Platform Architecture"))
    story.append(
        p(
            "Open, agentic, and fully integrated with your existing stack. Built on Airrived's proven engine, Vyuha delivers true AI ownership, complete data control, and adaptable architecture.",
            "body",
        )
    )
    story.append(p("CREATE", "card_title"))
    story.extend(bullets(["Democratize Fine-Tuning", "Ground Models in Enterprise Telemetry", "Domain-Specific Language Models"]))
    story.append(p("ACTIVATE", "card_title"))
    story.extend(bullets(["Agent-to-Agent Mesh", "Composable Agent Ecosystem", "Multi-Agent Collaboration"]))
    story.append(p("BUILD", "card_title"))
    story.extend(bullets(["Living Workflows", "Beyond SOAR & RPA", "Self-Healing Execution"]))

    story.append(section_title("Section: Closing"))
    story.append(p("The Operating Engine for Enterprise-Controlled Intelligence", "card_title"))
    story.append(
        p(
            "No complexity. No specialized AI research team required. Just unified control, delivered entirely within your own private boundary.",
            "body",
        )
    )
    story.extend(
        ctas(
            [
                {"label": "Schedule Platform Demo", "href": "/contact"},
                {"label": "Explore Vyuha.ai", "href": "/"},
            ]
        )
    )
    story.append(PageBreak())

    # =====================================================================
    # 2.1 VYUHA.ONE
    # =====================================================================
    story.extend(
        page_header(
            "/platform/command",
            "Vyuha.ONE",
            eyebrow="Powered by Airrived Engine | Cloud & Private VPC Deployment",
            headline="The Enterprise Agentic OS for Your Private Cloud",
        )
    )
    story.append(
        p(
            "One command plane. Infinite autonomous execution. Purpose-built for Cybersecurity, IT, FinOps, and Business Operations leaders to orchestrate multi-agent workflows across your cloud infrastructure and enterprise stack.",
            "body",
        )
    )
    story.extend(
        ctas(
            [
                {"label": "Request Architecture Demo", "href": "/contact"},
                {"label": "Explore Command Plane", "href": "/platform"},
            ]
        )
    )

    story.append(section_title("Section: The Operating Engine for Controlled Cloud Intelligence"))
    story.append(
        p(
            "Vyuha.ONE transforms advanced AI into real-world operational velocity, enabling your enterprise to fine-tune models on local telemetry, deploy deep-reasoning agents, and intelligently orchestrate workflows across your entire stack.",
            "body",
        )
    )
    story.append(
        p(
            "No complexity. No specialized AI research team required. Just unified control within your private cloud boundary (AWS, Azure, GCP, or hybrid VPCs).",
            "body",
        )
    )
    story.extend(ctas([{"label": "Schedule Control Plane Demo", "href": "/contact"}]))

    story.append(section_title("Section: Standardize on Controlled Cloud Autonomy"))
    for card in [
        {
            "title": "Deploy Anywhere",
            "body": "Build and deploy autonomous agents directly inside your private cloud VPC or hybrid stack using a no-code visual orchestrator and native enterprise connectors.",
        },
        {
            "title": "Measurable Impact",
            "body": "Reduce tool sprawl, eliminate unnecessary cloud API burn through intelligent task routing, and achieve up to a 60x boost in operational velocity.",
        },
        {
            "title": "Workforce Elevation",
            "body": "Harness deep-reasoning agents without hiring armies of specialized AI engineers. Upgrade existing L1 and L2 operators into elite orchestrators.",
        },
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: Three Layers, One Control Plane"))
    for card in [
        {
            "title": "01 | App Store",
            "body": "Curated marketplace of production-grade agentic applications across Security Operations, Identity, Third-Party Risk, Vulnerability Management, AI Guardrails, and Agentic Security & IT Automation.",
        },
        {
            "title": "02 | Agents",
            "body": "Composable autonomous building blocks combining context-aware reasoning, enterprise context, and policy-governed action.",
        },
        {
            "title": "03 | AI Tools",
            "body": "Create DSLMs, build deep-reasoning agents through A2A protocols, and orchestrate advanced autonomous systems.",
        },
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: Capability Breakdown"))
    story.append(p("CREATE", "card_title"))
    story.extend(bullets(["Democratize Fine-Tuning", "Ground Models in Enterprise Telemetry", "Domain-Specific Language Models"]))
    story.append(p("ACTIVATE", "card_title"))
    story.extend(bullets(["A2A Mesh", "Composable Agents", "Multi-Agent Collaboration"]))
    story.append(p("BUILD", "card_title"))
    story.extend(bullets(["Living Workflows", "Beyond SOAR & RPA", "Self-Healing Execution"]))

    story.append(section_title("Section: Take Back Control with Enterprise-Controlled AI"))
    story.append(p("Empower, Adapt, & Evolve", "card_title"))
    story.extend(bullets(["Built for Practitioners", "No-Code Composition", "Future-Proof Modularity"]))
    story.append(p("Own, Lead, & Govern", "card_title"))
    story.extend(bullets(["Absolute Asset Ownership", "Human-in-the-Loop Controls", "Uncompromising Governance"]))

    story.append(section_title("Section: Closing"))
    story.append(p("Experience Controlled Agentic AI in Seconds", "card_title"))
    story.append(
        p(
            "Vyuha.ONE lets your organization securely build, deploy, and scale autonomous AI agents across private cloud infrastructure without sacrificing data privacy, financial efficiency, or operational control.",
            "body",
        )
    )
    story.extend(
        ctas(
            [
                {"label": "Request Architecture Demo", "href": "/contact"},
                {"label": "Explore Enterprise Connectors", "href": "/platform/integrations"},
            ]
        )
    )
    story.append(PageBreak())

    # =====================================================================
    # 2.2 IN A BOX
    # =====================================================================
    story.extend(
        page_header(
            "/platform/in-a-box",
            "Vyuha In a BOX",
            eyebrow="Powered by Airrived Engine | On-Premise AI Appliance",
            headline="The Turnkey Self-Governed On-Premises AI Appliance",
        )
    )
    story.append(
        p(
            "The complete Vyuha.ONE OS pre-loaded onto enterprise GPU hardware. Complete physical data localization, zero external egress, and hardware-accelerated intelligence engineered for on-premise data centers and air-gapped defense environments.",
            "body",
        )
    )
    story.extend(
        ctas(
            [
                {"label": "Schedule On-Premise Demo", "href": "/contact"},
                {"label": "Explore Hardware Specifications", "href": "/contact"},
            ]
        )
    )

    story.append(section_title("Section: Plug-and-Play Self-Governed Infrastructure"))
    story.append(
        p(
            "Vyuha In a BOX delivers the full agentic intelligence, 200+ enterprise connectors, and multi-agent orchestration of Vyuha.ONE as a turnkey, hardware-accelerated appliance for organizations requiring physical containment and local performance.",
            "body",
        )
    )

    story.append(section_title("Section: Self-Governed AI Under Your Physical Boundary"))
    for card in [
        {"title": "Zero External Egress", "body": "Core inference and workflow execution run natively inside your physical network."},
        {"title": "DPDP Act 2023 Alignment", "body": "Built around Indian data residency, data localization, and regulatory requirements."},
        {"title": "Immunity from External Logging", "body": "Enterprise IP remains yours, never transmitted externally or used to train public models."},
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: Hardware Delivery Models"))
    for card in [
        {"title": "Dedicated On-Premise GPU Provisioning", "body": "Hardware-accelerated deployment within your data center."},
        {"title": "Air-Gapped / Sena Environment", "body": "Offline, physically isolated deployment for defense, PSUs, and critical national infrastructure."},
        {"title": "Dedicated Private Edge Node", "body": "Localized appliance units for distributed regional hubs requiring local AI autonomy under central governance."},
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: Why Deploy Vyuha In a BOX?"))
    for card in [
        {"title": "Zero Latency Inference", "body": "Direct local hardware access for rapid model execution, real-time response, and high-volume data ingestion."},
        {"title": "Total Containment of Proprietary Assets", "body": "Custom DSLMs, agentic playbooks, and historical enterprise telemetry remain on local physical drives."},
        {"title": "Identical OS Capabilities", "body": "Feature parity with Vyuha.ONE, including App Store, Composable Agents, A2A Mesh, and No-Code Orchestrator, delivered offline."},
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: Vyuha.ONE vs Vyuha In a BOX"))
    table_data = [
        [Paragraph(esc(h), S["table_header"]) for h in ["Dimension", "Vyuha.ONE", "Vyuha In a BOX"]],
        [Paragraph(esc(c), S["table_cell"]) for c in ["Operating System", "Vyuha.ONE OS", "Vyuha.ONE OS (Pre-installed)"]],
        [Paragraph(esc(c), S["table_cell"]) for c in ["Deployment", "AWS, Azure, GCP, Private VPC", "On-Premise / Enterprise GPU Infrastructure"]],
        [Paragraph(esc(c), S["table_cell"]) for c in ["200+ Integrations", "Supported", "Supported"]],
        [Paragraph(esc(c), S["table_cell"]) for c in ["App Store & Agents", "Included", "Included"]],
        [Paragraph(esc(c), S["table_cell"]) for c in ["A2A Mesh", "Included", "Included"]],
        [Paragraph(esc(c), S["table_cell"]) for c in ["Air-Gapped / Sena", "Optional", "Built-in Native"]],
    ]
    t = Table(table_data, colWidths=[42 * mm, 55 * mm, 65 * mm])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E8F2F4")),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#B8C8CE")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(Spacer(1, 4 * mm))
    story.append(t)

    story.append(section_title("Section: Closing"))
    story.append(p("Command Self-Governed AI Inside Your Physical Perimeter", "card_title"))
    story.append(
        p(
            "Vyuha In a BOX provides infrastructure control, air-gapped security, and hardware-accelerated performance, enabling autonomous AI without data leaving your facility.",
            "body",
        )
    )
    story.extend(
        ctas(
            [
                {"label": "Request On-Premise Demo", "href": "/contact"},
                {"label": "Contact Infrastructure Team", "href": "/contact"},
            ]
        )
    )
    story.append(PageBreak())

    # =====================================================================
    # 2.3 INTEGRATIONS
    # =====================================================================
    story.extend(
        page_header(
            "/platform/integrations",
            "ONE PLATFORM. EVERY SYSTEM.",
            eyebrow="Integrations",
            headline="With 200+ cyber, IT, and enterprise integrations available on day one, Vyuha plugs into your environment instantly, no re-architecture, no rip-and-replace.",
        )
    )
    story.append(
        p(
            "This isn't about merely wiring tools together. It's about binding fragmented silos into a context-aware fabric that enables autonomous agents to reason and act across the enterprise stack.",
            "body",
        )
    )
    story.extend(ctas([{"label": "Request A Demo", "href": "/contact"}]))

    story.append(section_title("Section: Built For The Stack You Already Trust"))
    story.append(
        p(
            "Unify security platforms, cloud & IT infrastructure, ERP/FinOps tools, collaboration networks, knowledge bases, data lakes, and vector stores into a single self-governed foundation.",
            "body",
        )
    )
    for card in [
        {"title": "Correlate Signals Across Silos", "body": "Bridge isolated telemetry into a shared, context-rich intelligence layer."},
        {"title": "Apply Context-Aware Reasoning", "body": "Evaluate events through your organization's operational, financial, and risk lens."},
        {"title": "Take Real, Autonomous Action", "body": "Execute policy-governed remediation directly inside your tools."},
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: Operational Impact & Ecosystem Reach"))
    story.append(
        p(
            "Vyuha unifies SIEM, XDR, IAM, Cloud, ITSM, and ERP platforms across Splunk, CrowdStrike, Palo Alto Networks, Wiz, AWS, GCP, Azure, Snowflake, ServiceNow, SAP, and Salesforce.",
            "body",
        )
    )
    story.append(
        p(
            "Agents can monitor, assess, and autonomously resolve operational, financial, and security risks across these systems at enterprise scale.",
            "body",
        )
    )
    story.extend(ctas([{"label": "Explore Solutions", "href": "/solutions"}]))

    story.append(section_title("Section: Integration Categories"))
    for card in [
        {"title": "Security", "body": "SIEM, XDR, IAM and security platforms."},
        {"title": "Cloud & IT", "body": "Cloud infrastructure, IT operations and service management."},
        {"title": "ERP & FinOps", "body": "ERP and financial operations systems."},
        {"title": "Collaboration", "body": "Collaboration networks and enterprise communication."},
        {"title": "Knowledge & Data", "body": "Knowledge bases and data lakes."},
        {"title": "Model & Vector Stores", "body": "Enterprise model and vector-store environments."},
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: Closing CTAs"))
    story.extend(
        ctas(
            [
                {"label": "Request A Demo", "href": "/contact"},
                {"label": "Explore Solutions", "href": "/solutions"},
            ]
        )
    )
    story.append(PageBreak())

    # =====================================================================
    # 3. SOLUTIONS OVERVIEW
    # =====================================================================
    story.extend(
        page_header(
            "/solutions",
            "Build, Orchestrate, and Deploy Sovereign AI Solutions in Seconds",
            eyebrow="Solutions Overview",
            headline="Sovereign AI. In Operation.",
        )
    )
    story.append(p("Build, orchestrate, and deploy, without a byte leaving your perimeter.", "page_headline"))
    story.append(
        p(
            "INDIA has built for digital scale. Now, it’s time to build intelligence on our own terms.",
            "quote",
        )
    )
    story.append(
        p(
            "Vyuha gives Indian enterprises a clean canvas to create and scale autonomous agents, without code, complexity, or a single byte leaving their perimeter. Transform security, IT, and business operations into connected, self-governed ecosystems that think, learn, and act in real time.",
            "body",
        )
    )
    story.extend(ctas([{"label": "Explore by Function", "href": "#solutions-functions"}]))

    story.append(section_title("Section: Intelligence built around your operations"))
    story.append(
        p(
            "Transform how your organization operates, across Security, IT, and Business Operations, with intelligent, autonomous systems that reduce operational load and eliminate tool fragmentation, all under complete data sovereignty.",
            "body",
        )
    )
    for card in [
        {
            "title": "01 Defend — Security & Compliance",
            "headline": "From conventional security to autonomous, sovereign defense",
            "body": "Transform every security and compliance function into a continuously learning, autonomous system. Reduce audit fatigue, accelerate DPDP Act and RBI/CERT-In compliance, and automate identity reviews and third-party risk audits, without added headcount or data leaving your boundary.",
            "cta": {"label": "Explore Security & Compliance", "href": "/solutions/security-compliance"},
        },
        {
            "title": "02 Operate — IT Operations",
            "headline": "Autonomous operations, powered by agentic AI",
            "body": "Reimagine IT operations with agents that think, learn, and act across systems. Apply reasoning agents to predict issues, model congestion, and unify operational signals across large, distributed networks, entirely within your own infrastructure.",
            "cta": {"label": "Explore IT Solutions", "href": "/solutions/it-operations"},
        },
        {
            "title": "03 Govern — Business Operations & FinOps",
            "headline": "Turn operational complexity into coordinated execution",
            "body": "Give Business Operations and FinOps leaders a single reasoning layer across cost, compliance, and operational reporting, replacing manual reconciliation with real-time, policy-governed autonomy.",
            "cta": {"label": "Explore Business Operations", "href": "/solutions/business-operations"},
        },
    ]:
        story.extend(add_card(card))
        story.extend(ctas([card["cta"]]))

    story.append(section_title("Section: Replacing silos, not sitting beside them"))
    story.append(
        p(
            "Vyuha doesn’t add another dashboard to an already-fragmented stack, it absorbs the function of the tools it replaces.",
            "body",
        )
    )
    for card in [
        {
            "title": "01 — Context-blind SOAR",
            "body": "Rule-bound engines that fire playbooks without enterprise context, leaving operators to stitch the story together after the fact.",
        },
        {
            "title": "02 — Point-solution agents",
            "body": "Narrow, single-use agentic tools that can’t reason across security, IT, and operations, and can’t be governed as one system.",
        },
        {
            "title": "03 — Ungoverned AI toolkits",
            "body": "Generic builders and shadow-AI usage that leak data, skip policy, and leave no inspectable trail for regulators or the board.",
        },
    ]:
        story.extend(add_card(card))
    story.append(
        p(
            "A no-code visual orchestrator upgrades existing L1 and L2 operators into elite orchestrators, while self-healing, living workflows continuously adapt, self-correct, and optimize in real time.",
            "body",
        )
    )

    story.append(section_title("Section: Agentic intelligence for high-impact industries"))
    story.append(
        p(
            "Deploy enterprise AI where operational complexity, security, and scale matter most, with the same sovereign mesh, tuned to each sector’s regulatory pressure.",
            "body",
        )
    )
    for card in [
        {
            "title": "Financial Services",
            "headline": "Sovereign AI for trusted financial operations",
            "body": "Fraud, AML, and KYC stay inside the bank. Agents reason across transaction, identity, and GenAI usage, under RBI and DPDP Act 2023, with zero data egress.",
        },
        {
            "title": "Telecom",
            "headline": "Autonomous intelligence for connected networks",
            "body": "Carrier-scale telemetry, SIM/roaming fraud, and capacity modeling, predicted and acted on in real time, entirely on your infrastructure.",
        },
        {
            "title": "Retail",
            "headline": "Fraud defense without expanding PCI scope",
            "body": "POS fraud, shrinkage, account takeover, and vendor compliance, without sending cardholder or customer data to a third-party model.",
        },
        {
            "title": "Insurance",
            "headline": "Claims, underwriting, and firewall intelligence",
            "body": "IRDAI-regulated data stays inside. Agents coordinate fraud detection, risk assessment, and firewall change with an inspectable trail.",
        },
    ]:
        story.extend(add_card(card))
    story.extend(ctas([{"label": "See all industry use cases", "href": "/solutions/industry-use-cases"}]))

    story.append(section_title("Section: Closing"))
    story.append(p("From pilots to autonomous operations", "card_title"))
    story.append(
        p(
            "Start with a high-value use case and build toward a governed enterprise AI formation, designed around your systems, data, and operational priorities, on your own terms.",
            "body",
        )
    )
    story.extend(
        ctas(
            [
                {"label": "Request Architecture Demo", "href": "/contact"},
                {"label": "Explore the Platform", "href": "/platform"},
            ]
        )
    )
    story.append(PageBreak())

    # =====================================================================
    # 3.1 SECURITY & COMPLIANCE
    # =====================================================================
    story.extend(
        page_header(
            "/solutions/security-compliance",
            "From Reactive Defense to Autonomous, Sovereign Security",
            eyebrow="Security & Compliance",
            headline="Zero-Trust Security & continuous regulatory Assurance, powered by Sovereign AI",
        )
    )
    story.append(
        p(
            "Security has outgrown reactive defense. From nonstop alerts and audit pressure to identity sprawl, vulnerability overload, cloud misconfigurations, and third-party risk, security and compliance teams are stretched thin by fragmented tools and reactive processes that can't keep up, and layered on top, DPDP Act 2023 and RBI/CERT-In obligations demand continuous, evidence-backed compliance that most enterprises can only reconstruct manually, after the fact.",
            "body",
        )
    )
    story.append(
        p(
            "Vyuha transcends traditional SecOps by delivering a unified, sovereign agentic platform that standardizes intelligence across SOC, GRC, and IAM, entirely inside your own perimeter. Whether automating incident response, enforcing continuous compliance, or managing identity governance, domain-specific agents reason and act to eliminate silos and tool sprawl across the enterprise.",
            "body",
        )
    )
    story.extend(ctas([{"label": "Request Architecture Demo", "href": "/contact"}]))

    story.append(section_title("Section: What changes"))
    story.extend(
        bullets(
            [
                "Unify workflows across SOC, GRC, and IAM",
                "Reduce operational overhead and eliminate silos",
                "Bridge the talent shortage with dynamic, reasoning agents",
                "Consolidate the entire security and risk stack, without a byte leaving the enterprise boundary",
            ]
        )
    )

    story.append(section_title("Section: Security & compliance capabilities"))
    for card in [
        {
            "title": "Security Operations & Threat Intel Operationalization",
            "headline": "Autonomous Defense at Machine Speed",
            "body": "SOC teams drown in high volumes of low-fidelity alerts, and most “AI-SOC” tools are thin wrappers around a generic chat model, they summarize, but they don't reason or act. Vyuha deploys a swarm of reasoning agents that correlate identity, endpoint, network, and cloud signals to investigate alerts end-to-end, using DSLMs fine-tuned on the organization's own telemetry so agents understand internal naming, asset criticality, and past incident history. Agents execute immediate containment actions directly, isolating a compromised endpoint or pushing a firewall rule update, not just recommending them, while connecting natively into existing SIEM, EDR, and case-management tools rather than replacing them outright.",
            "outcomes": [
                "Materially faster investigation and response times; fewer alerts requiring manual eyes-on triage; a defensible, inspectable reasoning trail for every closed case."
            ],
        },
        {
            "title": "Identity Management & Access Governance",
            "headline": "Real-Time Least Privilege at Scale",
            "body": "Access reviews, entitlement audits, and joiner-mover-leaver processes are manual, periodic, and consistently behind the actual state of who has access to what. Vyuha continuously reconciles identity, entitlement, and access-log data across IdPs, SaaS apps, and on-prem directories, flagging anomalous or excess privilege in real time instead of waiting for the next quarterly review cycle, and automates evidence collection and sign-off workflows for audit and compliance teams.",
            "outcomes": [
                "Access reviews move from periodic to continuous; reduced audit preparation effort; faster closure of excess-privilege and orphaned-account findings."
            ],
        },
        {
            "title": "Third-Party Risk Assessment",
            "headline": "Always-On Vendor Defense",
            "body": "Vendor questionnaires, security certificates, and contract clauses arrive as unstructured documents that security and procurement teams review largely by hand. Vyuha reads vendor security questionnaires, SOC 2 / ISO reports, and contracts to extract risk-relevant fields automatically, cross-references vendor claims against known control frameworks, and maintains a living risk register that updates as new vendor documentation arrives.",
            "outcomes": [
                "Faster vendor onboarding and re-assessment cycles; consistent, evidence-linked risk scoring across the vendor portfolio; lower manual review burden on GRC teams."
            ],
        },
        {
            "title": "Vulnerability & Exposure Management",
            "headline": "Pinpoint the Vulnerabilities That Matter",
            "body": "Scanner output vastly outpaces remediation capacity, and prioritization is often based on raw severity rather than actual business exposure. Vyuha correlates vulnerability scan data with asset criticality, exploitability intelligence, and exposure context to re-rank the queue, auto-generates remediation tickets routed to the right owning team, and tracks remediation SLAs, re-verifying fixes without manual re-scanning requests.",
            "outcomes": [
                "Remediation effort focused on genuinely exploitable, business-critical exposure; shorter mean-time-to-remediate; clear, board-ready exposure trend reporting."
            ],
        },
        {
            "title": "AI Guardrails & Shadow AI Governance",
            "headline": "Secure GenAI Adoption, Without Slowing It Down",
            "body": "Employees adopt public LLMs and GenAI tools faster than security teams can inventory or govern them, creating unmanaged data-exposure risk. Vyuha discovers and inventories LLM and GenAI usage across employees, applications, and tools; continuously monitors prompts and interactions for policy violations and sensitive-data exposure; and applies real-time governance controls to prompts, models, and usage patterns, enforced dynamically, not through static policy reviews.",
            "outcomes": [
                "Full visibility into enterprise GenAI and LLM usage; materially reduced risk from unsafe prompts and shadow AI tools; consistent policy enforcement across teams without slowing adoption."
            ],
        },
        {
            "title": "DPDP Act Compliance & Automated GRC",
            "headline": "Continuous, Evidence-Backed Regulatory Posture",
            "body": "Regulatory audits under the DPDP Act 2023 and RBI/CERT-In circulars require continuous evidence of how personal data is classified, redacted, and handled, evidence most enterprises can only reconstruct manually, after the fact. Vyuha scans databases, logs, and customer interactions to automatically classify and redact sensitive PII in real time, runs continuous policy audits against current DPDP rules and RBI circulars rather than a point-in-time annual review, and generates audit-ready compliance reports automatically as regulations and internal systems change.",
            "outcomes": [
                "Real-time PII classification and redaction instead of manual data-mapping exercises; continuous, always-current regulatory audit posture; audit-ready reports available on demand rather than assembled under deadline pressure."
            ],
        },
    ]:
        story.extend(add_card(card))
    story.append(
        p(
            "Built for CISOs, SOC leaders, and compliance teams who need an open, inspectable, sovereign alternative to black-box AI-SOC tools.",
            "body",
        )
    )

    story.append(section_title("Section: Vyuha: The Sovereign Standard for Cyber and Compliance Leaders"))
    story.extend(
        bullets(
            [
                "Deploy Instant-Value Prebuilt Apps: Launch production-ready AI workflows for Security Operations, Identity, Vulnerability Management, AI Guardrails, and Vendor Risk in seconds.",
                "Activate Domain-Specific Security Agents: Train pre-configured AI agents on your proprietary telemetry to automate threat detection, incident response, compliance, and risk management.",
                "Build Custom Agents Without Code: Compose, test, and orchestrate tailored multi-agent applications effortlessly with zero engineering overhead.",
                "Drive Reasoning-Based Automation: Empower agents to evaluate real-time context, correlate multi-source signals, and execute autonomous decisions, moving far beyond static rules.",
                "Enforce Sovereign Enterprise Governance: Guarantee 100% DPDP Act (2023) compliance with strict Human-in-the-Loop controls, granular RBAC, immutable audit trails, and policy-backed autonomy.",
            ]
        )
    )

    story.append(section_title("Section: Deploy. Activate. Compose. Reason. Govern."))
    story.extend(
        bullets(
            [
                "DEPLOY production-ready agentic apps for SOC, Identity, Vulnerability Management, Guardrails, and Risk in seconds.",
                "ACTIVATE specialized security agents trained on your telemetry for automated threat detection, triage, and compliance.",
                "COMPOSE custom multi-agent workflows effortlessly using a no-code orchestration engine with zero engineering delay.",
                "REASON through complex operational context, correlating cross-system telemetry to take autonomous action beyond static rules.",
                "GOVERN AI execution with 100% DPDP Act alignment, Human-in-the-Loop oversight, granular RBAC, and audit-ready logging.",
            ]
        )
    )

    story.append(section_title("Section: Measurable Business Impact"))
    story.extend(
        bullets(
            [
                "Up to 60x improvement in productivity across SOC, IAM, and GRC teams",
                "80-90% reduction in operational effort",
                "2 FTE: offset the workload equivalent of two full-time hires within six months",
                "Lower spend: reduced dependence on managed services and incremental headcount",
            ]
        )
    )

    story.append(section_title("Section: Deep Integration Across all the enterprise Stack"))
    story.append(
        p(
            "Vyuha agents integrate seamlessly across your existing environment, SIEM, XDR, IAM, cloud, and ticketing platforms including Splunk, CrowdStrike, Palo Alto Networks, Wiz, AWS, GCP, Azure, Snowflake, and ServiceNow, all reasoning and acting entirely inside your Vyuha One or Vyuha In a BOX perimeter.",
            "body",
        )
    )
    story.extend(ctas([{"label": "Request Architecture Demo", "href": "/contact"}]))
    story.append(PageBreak())

    # =====================================================================
    # 3.2 IT OPERATIONS
    # =====================================================================
    story.extend(
        page_header(
            "/solutions/it-operations",
            "The IT Mandate Has Outgrown the Model",
            eyebrow="IT Operations",
        )
    )
    story.append(
        p(
            "IT exists to operate reliably, transform continuously, and enable the business at scale. Yet the mandate has outgrown the model. As environments become more dynamic and interconnected, IT is expected to deliver always-on reliability, continuous change, and frictionless enablement, without additional headcount. Script-based automation and static workflows were built for a simpler era; they fracture as systems evolve, leaving IT teams reacting instead of leading.",
            "body",
        )
    )
    story.append(
        p(
            "Vyuha reimagines IT operations with sovereign agentic intelligence, reasoning agents that think, learn, and act across systems, entirely within your own infrastructure boundary.",
            "body",
        )
    )
    story.extend(ctas([{"label": "Request Architecture Demo", "href": "/contact"}]))

    story.append(section_title("Section: Core IT Capabilities Enabled by Vyuha"))
    story.append(
        p(
            "Vyuha isn't another IT automation product. It's the agentic operating system for autonomous, self-governed IT.",
            "body",
        )
    )
    for card in [
        {
            "title": "Autonomous IT Resolution",
            "headline": "Resolve Issues Faster, Often Without Human Intervention",
            "body": "Vyuha agents classify, prioritize, and resolve incidents using historical patterns and live telemetry, resolving common L1/L2 tickets end-to-end (VPN failures, access provisioning, server memory spikes) rather than just routing them faster.",
            "items": [
                "Achieve 80-90% reduction in operational effort across incident workflows",
                "Speed MTTR without extra headcount",
                "Reduce ticket volume and triage",
            ],
        },
        {
            "title": "Real-Time Root Cause Analysis",
            "headline": "Understand the Why, Not Just the What",
            "body": "Agents correlate signals across infrastructure, applications, and services to identify root causes in complex, distributed environments.",
            "items": [
                "Faster diagnosis in multi-system dependencies",
                "Reduce repeat incidents through learned outcomes",
                "Improve service reliability and uptime",
            ],
        },
        {
            "title": "Configuration Management (CMDB) Automation",
            "headline": "Living System Context for Autonomous IT",
            "body": "Vyuha agents continuously discover, correlate, and maintain system relationships across applications, infrastructure, and services.",
            "items": [
                "Keep CMDBs continuously accurate and up to date",
                "Automatically map dependencies for impact and root-cause analysis",
                "Power change, incident, and outage decisions with real-time context",
            ],
        },
        {
            "title": "Enterprise Automation",
            "headline": "Autonomous Execution Across Systems",
            "body": "Vyuha agents reason over context, coordinate across platforms, and execute workflows autonomously, without brittle scripts or manual orchestration.",
            "items": [
                "Automate complex, multi-step workflows across IT, security, and enterprise systems",
                "Replace static rules and scripts with adaptive, agent-driven execution",
                "Continuously adjust automation as environments, dependencies, and policies change",
            ],
        },
        {
            "title": "Conversational IT Operations",
            "headline": "Talk to Your Systems Like a Human Expert",
            "body": "Converse with machine data across Snowflake, Slack, Microsoft Teams, ServiceNow, SharePoint, and more, all without a query ever leaving your perimeter.",
            "items": [
                "Get quick insight without switching tools",
                "Natural language access to operational data",
                "Accelerate troubleshooting and decision-making",
            ],
        },
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: Vyuha: The Autonomous Operating Standard for Enterprise IT"))
    story.extend(
        bullets(
            [
                "No-code platform designed for practitioners, harness the power of AI without hiring AI talent.",
                "Leverage prebuilt agents with immediate ROI or create custom agents and agentic apps with no-code composition and zero engineering effort.",
                "Replace multiple tools and legacy RPA with a single, unified, sovereign platform.",
                "Reasoning-driven automation, not static scripts.",
                "Enterprise-grade security, governance, and auditability, aligned with India's DPDP Act 2023.",
            ]
        )
    )

    story.append(section_title("Section: Measurable Business Impact"))
    story.extend(
        bullets(
            [
                "Up to 60x productivity gains across IT",
                "80-90% reduction in operational effort",
                "Consolidate and replace fragmented IT automation tools",
                "2 FTE: offset the workload equivalent of two full-time hires within six months",
            ]
        )
    )
    story.extend(ctas([{"label": "Request Architecture Demo", "href": "/contact"}]))
    story.append(PageBreak())

    # =====================================================================
    # 3.3 BUSINESS OPERATIONS
    # =====================================================================
    story.extend(
        page_header(
            "/solutions/business-operations",
            "From Fragmented Reporting to Coordinated, Governed Execution",
            eyebrow="Business Operations & FinOps",
        )
    )
    story.append(
        p(
            "Cost, compliance, and operational reporting is stitched together manually from multiple systems, arriving too late to influence the decisions it should inform. Business Operations and FinOps leaders need a single reasoning layer across finance, security, and operations, not another dashboard that reports on yesterday's numbers.",
            "body",
        )
    )
    story.append(
        p(
            "Vyuha reimagines Business Operations with sovereign agentic intelligence, composing reporting, reconciliation, and approval workflows that run continuously and stay entirely within the enterprise's own perimeter.",
            "body",
        )
    )
    story.extend(ctas([{"label": "Request Architecture Demo", "href": "/contact"}]))

    story.append(section_title("Section: Core Business Operations Capabilities Enabled by Vyuha"))
    for card in [
        {
            "title": "Unified Reporting & Reconciliation",
            "headline": "One View Across Finance, Security, and Operations",
            "body": "Vyuha composes reporting and reconciliation agents that pull structured and unstructured data from finance, security, and operations systems into a single, always-current view, replacing manual, end-of-period stitching with continuous reconciliation.",
        },
        {
            "title": "Governed Autonomous Approvals",
            "headline": "Policy-Governed Action, Not Just Policy Documentation",
            "body": "Agents apply policy-governed autonomous action for approvals, budget alerts, and compliance workflows, routing only genuine exceptions to human reviewers under configurable Human-in-the-Loop controls.",
        },
        {
            "title": "Workforce Elevation for Operations Teams",
            "headline": "Every Practitioner Becomes an Orchestrator",
            "body": "A no-code visual builder elevates existing operators into orchestrators, no dedicated AI or data engineering team required, so Business Operations and FinOps teams can compose and adapt workflows themselves.",
        },
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: Why Business Operations & FinOps Teams Choose Vyuha"))
    for card in [
        {
            "title": "Real-Time Operational & Cost Intelligence",
            "body": "Eliminate tedious manual reconciliation cycles with live, continuous operational and financial visibility.",
        },
        {
            "title": "True No-Code Agility",
            "body": "Build, deploy, and adapt living multi-agent workflows in minutes without waiting for engineering backlogs.",
        },
        {
            "title": "Policy-Governed Autonomy",
            "body": "Empower agents to reason and act independently within strict budget and compliance guardrails, backed by human sign-off where it matters most.",
        },
        {
            "title": "Sovereign by Design",
            "body": "Ensure every operational report, financial reconciliation, and decision log remains strictly contained inside your isolated Vyuha One or Vyuha In a BOX perimeter.",
        },
        {
            "title": "A Consolidated Control Plane",
            "body": "Collapse fragmented point solutions for reporting, reconciliation, and approval routing into one unified, deep-reasoning layer.",
        },
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: Measurable Business Impact"))
    story.extend(
        bullets(
            [
                "Reduced manual reconciliation effort across finance, security, and operations systems",
                "Faster, more consistent policy and budget compliance",
                "Up to a 60x boost in operational velocity via intelligent task routing and reduced tool sprawl",
            ]
        )
    )
    story.extend(ctas([{"label": "Request Architecture Demo", "href": "/contact"}]))
    story.append(PageBreak())

    # =====================================================================
    # 3.4 INDUSTRY USE CASES
    # =====================================================================
    story.extend(
        page_header(
            "/solutions/industry-use-cases",
            "Industry-Wise Use Cases",
            eyebrow="Industry-Wise Use Cases",
        )
    )
    story.append(
        p(
            "Vyuha adapts its agentic mesh to the regulatory pressure, document types, and operational realities of each sector it serves.",
            "body",
        )
    )
    story.extend(ctas([{"label": "Request Architecture Demo", "href": "/contact"}]))

    story.append(section_title("Section: Verticals"))
    for card in [
        {
            "title": "Financial Services",
            "headline": "Autonomous Fraud & Compliance Intelligence, Without Data Ever Leaving the Bank",
            "body": "Fraud, AML, and KYC teams sit on data that legally cannot leave the institution, yet they're buried in false-positive alerts pulled from siloed transaction, behavioral, and identity systems. Layered on top, generative AI adoption by employees spreads faster than banks can govern it: shadow AI, unsafe prompts, and uncontrolled data exposure create real business, security, and regulatory risk under RBI and DPDP Act 2023 oversight.",
            "itemsLabel": "How Vyuha Helps",
            "items": [
                "Fraud-pattern agent: reasons across historical and live transaction behavior",
                "KYC-verification agent: cross-checks identity data against onboarding and watchlist sources",
                "Transaction-anomaly agent: flags deviations in real time across accounts",
                "AI-governance agent: discovers and inventories LLM/GenAI usage across employees and applications, continuously monitors prompts for policy violations and sensitive-data exposure, and applies real-time governance controls dynamically rather than through static reviews",
            ],
            "outcome": "Faster fraud triage, audit-ready decision trails, full visibility into enterprise GenAI usage, and zero data egress.",
        },
        {
            "title": "Telecom",
            "headline": "Real-Time Network & Fraud Defense at Carrier Scale",
            "body": "Network operations generate telemetry at a volume no human SOC/NOC team can triage, CDRs, signaling traffic, and subscriber metadata never stop, across massive, distributed infrastructure.",
            "itemsLabel": "How Vyuha Helps",
            "items": [
                "Network-anomaly agent: detects irregular traffic and infrastructure signals, predicting asset health before failures occur",
                "SIM/roaming-fraud agent: catches fraudulent SIM and roaming activity",
                "DDoS-detection agent: identifies and responds to attack patterns in real time",
                "Capacity-modeling agent: models network congestion and capacity constraints to protect SLAs proactively",
            ],
            "outcome": "Autonomous, real-time threat response at carrier scale, predictive network health modeling across distributed assets, and full data sovereignty.",
        },
        {
            "title": "Retail",
            "headline": "Fraud and Compliance Defense Without Expanding PCI Scope",
            "body": "PCI-DSS-scoped payment data plus high-volume e-commerce fraud, constant workforce churn, and growing vendor exposure make identity, fraud, and compliance a moving target, one that most AI vendors can't touch without expanding compliance scope.",
            "itemsLabel": "How Vyuha Helps",
            "items": [
                "POS/payment-fraud agent: detects fraudulent transaction patterns",
                "Inventory-shrinkage agent: flags shrinkage and loss patterns across locations",
                "Omnichannel account-takeover agent: defends customer accounts across channels",
                "Identity & vendor-compliance agent: performs instant access and identity reviews as staff change, runs automated third-party risk and compliance audits, and enforces consistent policies across distributed franchise locations",
            ],
            "outcome": "Tighter PCI scope, fraud caught in real time, instant identity reviews for high-turnover workforces, automated vendor audits with no manual effort, and no third-party data exposure.",
        },
        {
            "title": "Insurance",
            "headline": "Coordinated Claims, Underwriting & Firewall Intelligence Under Full Sovereignty",
            "body": "Claims fraud and underwriting risk hinge on policyholder and medical data that IRDAI-regulated insurers can't freely expose to cloud AI, and the same regulated networks generate constant firewall change requests where manual review is slow and mistakes are costly.",
            "itemsLabel": "How Vyuha Helps",
            "items": [
                "Claims-fraud agent: identifies fraudulent or suspicious claims patterns",
                "Underwriting-risk agent: assesses risk factors during policy issuance",
                "Subrogation agent: surfaces recovery opportunities across claims",
                "Firewall-intelligence agent: ingests change requests from ServiceNow, analyzes them against assets, applications, data sensitivity, and dependencies, generates precise firewall rules, and applies low- and medium-risk changes autonomously, routing only high-risk rules to security teams for approval",
            ],
            "outcome": "Faster claims processing, fewer fraudulent payouts, faster firewall change turnaround without increasing risk, and compliant by default.",
        },
        {
            "title": "Hi-Tech",
            "comingSoon": True,
            "headline": "An Internal Agentic SOC + DevSecOps Layer",
            "body": "SaaS and product companies run at cloud scale, shipping code continuously, generating massive alert volumes, and facing nonstop threat activity, where proprietary source code and customer data can't be routed through an external AI vendor. Traditional SOC models depend on human triage and static automation, creating bottlenecks at L1, L2, and L3 just as velocity accelerates. Vyuha runs internally as a truly autonomous SOC and DevSecOps orchestration layer, purpose-built for AI-native, high-growth environments.",
            "itemsLabel": "How Vyuha Helps",
            "items": [
                "Runs SOC operations autonomously, resolving the majority of alerts without human involvement",
                "Applies DSLMs trained on the company's own environment, threat patterns, and historical SOC decisions",
                "Generates dynamic, context-aware workflows that adapt per incident, not static playbooks",
                "Escalates only high-risk or novel threats to L2/L3 teams, preserving expert focus",
                "All of it secures the company's own CI/CD pipelines and customer data end-to-end, with no code or data leaving the company's perimeter.",
            ],
            "outcome": "Significant reduction in L1/L2/L3 analyst workload, faster alert triage and lower MTTR, and zero exposure of source code or customer data.",
        },
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: Why Vyuha"))
    story.append(
        p(
            "Every capability above runs on the same sovereign foundation: The Airrived Engine, deployed either on Vyuha One or fully air-gapped on Vyuha In a BOX. That means enterprises get absolute ownership of their data, models, agents, and execution logs, with no vendor lock-in.",
            "body",
        )
    )
    story.append(
        p(
            "Vyuha does not sit alongside an organization's existing tools, it absorbs their function, replacing brittle SOAR and legacy RPA, narrow point solutions, and ungoverned AI toolkits with a single, reasoning-driven orchestration layer that is built, governed, and owned entirely on the enterprise's own terms.",
            "body",
        )
    )
    story.extend(ctas([{"label": "Request Architecture Demo", "href": "/contact"}]))
    story.append(PageBreak())

    # =====================================================================
    # 4. COMPANY
    # =====================================================================
    story.extend(
        page_header(
            "/company",
            "The Idea Behind Vyuha",
            eyebrow="COMPANY",
        )
    )
    story.append(
        p(
            "The name Vyuha comes from the idea of a strategic formation: multiple elements working together toward a common objective. We built Vyuha.ai on that exact principle: bring isolated data, software tools, and human expertise together into a single, synchronized workflow.",
            "body",
        )
    )
    story.extend(ctas([{"label": "Request an Architecture Sprint", "href": "/contact"}]))

    story.append(section_title("Section: Intelligence Built for the Enterprise"))
    for card in [
        {"title": "Turn Teams into Builders", "body": "Transform frontline staff into active AI creators, zero specialist hiring needed."},
        {"title": "Lock Down Full Sovereignty", "body": "Run natively inside your cloud or air-gapped on-prem; your models, logic, and data never leave your perimeter."},
        {"title": "Orchestrate Multi-Agent Power", "body": "Drive complex autonomous workflows with real-time context, adaptive reasoning, and built-in human governance."},
        {"title": "Multiply Execution Speed", "body": "Wipe out tool sprawl and automate routine operations."},
    ]:
        story.extend(add_card(card))

    story.append(section_title("Section: WHY VYUHA.AI"))
    for para in [
        "AI belongs in the hands of your workforce, not outside it.",
        "It will be defined by how effectively intelligence can understand context, collaborate across systems, and act within the boundaries of the organization.",
        "That is why Vyuha is being built as an intelligent operating layer, one that brings together people, data, models, agents, applications, and workflows.",
        "Success with AI isn't about isolated tools; it is about how seamless intelligence partners with people across everyday systems. Vyuha serves as the intelligent foundation that brings your talent, data, autonomous agents, and critical workflows together, putting trusted AI directly into the hands of your team.",
    ]:
        story.append(p(para, "body"))
    story.append(
        p(
            "IT'S AI THAT Works your way, with YOUR data, aligned with your industry-specific guardrails.",
            "quote",
        )
    )

    story.append(section_title("Section: Leadership"))

    leaders = [
        {
            "name": "PRARTHANA GUPTA",
            "role": "FOUNDER",
            "quote": "“AI for everyone, not just AI experts.”",
            "paragraphs": [
                "We built Vyuha with a simple belief: every organization should be able to harness the power of AI.",
                "The people closest to a business understand its challenges best. They should be able to use intelligence, build it, and put it to work, without waiting for a specialized AI team.",
                "Vyuha is our effort to make that possible: bringing powerful, enterprise-grade intelligence closer to the people to solve problems that matter.",
            ],
            "signoff": "Prarthana Gupta, Founder, Vyuha.ai",
            "ctaHref": "https://www.linkedin.com/in/prarthana-gupta-112510a5/",
        },
        {
            "name": "SHRADDHA GUPTA",
            "role": "CO-FOUNDER",
            "quote": "“The future of AI is not about working alone. It is about working together.”",
            "paragraphs": [
                "Enterprise problems rarely belong to one system, one team, or one function. They require context from across the organization and the ability to connect that context into meaningful action.",
                "That is what we are building with Vyuha, a way for AI, agents, people, data, and enterprise systems to work together.",
                "Our focus is not simply on creating smarter AI, but on creating intelligence that can work within the complexity of the real enterprise.",
            ],
            "signoff": "Shraddha Gupta, Co-Founder, Vyuha.ai",
            "ctaHref": "https://www.linkedin.com/in/shraddha--gupta/",
        },
        {
            "name": "LATA SINGH",
            "role": "STRATEGIC ADVISOR",
            "quote": "“Enterprise AI must create capability, not dependency.”",
            "paragraphs": [
                "The opportunity with AI is much bigger than automation. It is about giving organizations the ability to continuously understand, adapt, and improve how they operate.",
                "At Vyuha.ai we are building with the perspective, bringing intelligence into the enterprise while keeping governance, ownership, and control at its core.",
                "The real measure of success is not how many AI agents an organization deploys, it is how efficiently the organization scales.",
            ],
            "signoff": "Lata Singh, Strategic Advisor, Vyuha.ai",
            "ctaHref": "https://www.linkedin.com/in/latasingh/",
        },
        {
            "name": "DEEKSHA SHARMA",
            "role": "SENIOR SOLUTION SPECIALIST",
            "quote": "“The best AI solutions start with understanding the problem.”",
            "paragraphs": [
                "Every enterprise is unique. Different systems, processes, and challenges require niche solutions that are designed around business outcomes rather than technology alone.",
                "At Vyuha, our focus is on helping organizations identify where intelligence can create the greatest impact and translating that into practical, measurable results. The goal is simple: make AI accessible, relevant, and valuable for every team.",
            ],
            "signoff": "Deeksha Sharma, Senior Solution Specialist, Vyuha.ai",
            "ctaHref": "https://www.linkedin.com/in/deeksha-sharma-450a33105/",
        },
        {
            "name": "NAVIN NAIR",
            "role": "VP, PRODUCT ENGINEERING",
            "quote": "“Great AI is only valuable when it works in the real world.”",
            "paragraphs": [
                "Building enterprise AI is not just about intelligence, it is about reliability, scalability, and execution. Organizations need systems that can integrate seamlessly with their existing environments while remaining secure, governed, and adaptable.",
                "At Vyuha, we focus on transforming complex AI capabilities into practical engineering solutions that enterprises can seamlessly deploy, trust, and scale with confidence.",
            ],
            "signoff": "Navin Nair, VP, Product Engineering, Vyuha.ai",
            "ctaHref": "https://www.linkedin.com/in/navin-nair01/",
        },
        {
            "name": "ADHYUTH",
            "role": "CHIEF BUSINESS OFFICER",
            "quote": "“AI creates the most value when it moves from possibility to production.”",
            "paragraphs": [
                "Enterprises don't need more AI experiments. They need solutions that work with their existing systems, solve real operational problems, and deliver measurable outcomes.",
                "That is where Vyuha comes in.",
                "We are focused on helping organizations move from identifying an AI opportunity to put intelligent systems to work, securely, practically, and at enterprise scale.",
                "More importantly, we put the power of AI directly into the hands of your frontline talent. Instead of relying on scarce specialists, Vyuha empowers your domain experts and everyday operators to design, build, and govern production-ready agents tailored to their own workflows.",
                "Our goal is simple: make AI useful, make it accessible, and make it work.",
            ],
            "signoff": "Adhyuth, Chief Business Officer, Vyuha.ai",
            "ctaHref": "https://www.linkedin.com/in/adhyuth-ramadyani/",
        },
    ]
    for leader in leaders:
        story.append(p(f"{leader['name']} — {leader['role']}", "card_title"))
        story.append(p(leader["quote"], "quote"))
        for para in leader["paragraphs"]:
            story.append(p(para, "body"))
        story.append(p(leader["signoff"], "label"))
        story.extend(ctas([{"label": "Connect", "href": leader["ctaHref"]}]))

    story.extend(ctas([{"label": "Request an Architecture Sprint", "href": "/contact"}]))
    story.append(PageBreak())

    # =====================================================================
    # 5. PARTNERS
    # =====================================================================
    story.extend(
        page_header(
            "/partners",
            "Building the Enterprise AI Ecosystem Together",
            eyebrow="Partnership",
        )
    )
    story.append(p("Constant innovation needs a strong ecosystem.", "body"))
    story.append(p("At Vyuha.AI, collaboration with tech innovators is our DNA.", "body"))
    story.extend(ctas([{"label": "Become a Partner", "href": "/contact"}]))

    story.append(section_title("Section: Intelligence, Augmented."))
    story.append(
        p(
            "The future of AI isn't about replacing human intelligence. It's about amplifying it.",
            "quote",
        )
    )
    story.append(
        p(
            "Vyuha.AI combines human expertise with intelligent AI to accelerate innovation, decision-making and execution.",
            "body",
        )
    )
    story.append(
        p(
            "We partner with technology leaders and solution providers to help enterprises move from AI experimentation to real-world business impact. By bringing together enterprise-grade technology, intelligent orchestration, and domain expertise, we help organizations connect, reason, and execute at scale.",
            "body",
        )
    )

    story.append(section_title("Section: Our Partners"))
    story.append(
        p(
            "Technology leaders and solution providers who help enterprises move from AI experimentation to real-world business impact.",
            "body",
        )
    )
    for partner in [
        {
            "title": "Airrived",
            "role": "Exclusive Partner for India",
            "lead": "Driving AI-powered innovation and intelligent enterprise solutions, with an intelligence engine that powers the capabilities of Vyuha.AI agents.",
            "paragraphs": [
                "Airrived is Vyuha.AI’s exclusive partner for India, anchoring our regional go-to-market with deep technology collaboration.",
                "At the center of that collaboration is the Airrived Engine: The intelligence layer that powers how Vyuha.AI agents reason, orchestrate, and execute across enterprise workflows.",
                "Together we help organizations in India adopt sovereign, production-ready AI: combining human expertise with intelligent systems so teams can innovate faster, decide with more context, and execute at scale.",
            ],
            "focus": [
                "Exclusive partnership coverage for India",
                "Intelligence engine behind Vyuha.AI agents",
                "AI-powered enterprise innovation and solutions",
            ],
        },
        {
            "title": "Dell Technologies",
            "role": "OEM Solutions Partner",
            "lead": "Our Dell Technologies partnership is a key lever for Vyuha Box, bringing enterprise-grade infrastructure and technology to Vyuha.AI deployments.",
            "paragraphs": [
                "Dell Technologies is an OEM Solutions Partner for Vyuha.ai | a critical enabler of how we deliver sovereign AI where enterprises need it most.",
                "This partnership is a key lever for Vyuha Box: pairing Vyuha’s intelligent orchestration with Dell’s enterprise-grade infrastructure so deployments can run with the reliability, performance, and operational standards large organizations expect.",
                "From on-premise and air-gapped environments to production-scale appliance deployments, Dell helps ensure Vyuha.AI reaches the enterprise on infrastructure built for mission-critical workloads.",
            ],
            "focus": [
                "OEM Solutions Partner for Vyuha.AI",
                "Infrastructure foundation for Vyuha Box",
                "Enterprise-grade technology for production deployments",
            ],
        },
        {
            "title": "Slash Curate",
            "role": "Ecosystem & Innovation Partner",
            "lead": "The data platform powering connected intelligence, bringing together technology, expertise and innovation to accelerate enterprise AI adoption.",
            "paragraphs": [
                "Slash Curate is Vyuha.AI’s Ecosystem & Innovation Partner, focused on the data foundation that connected intelligence requires.",
                "As a data platform, Slash Curate helps bring together technology, expertise, and innovation so enterprises can move beyond isolated AI pilots into systems that connect, reason, and act with shared context.",
                "Through this partnership we accelerate enterprise AI adoption: linking data readiness with intelligent orchestration so organizations can scale real-world business impact, not just experiments.",
            ],
            "focus": [
                "Ecosystem and innovation collaboration",
                "Data platform for connected intelligence",
                "Accelerating enterprise AI adoption",
            ],
        },
    ]:
        story.extend(add_card(partner))

    story.append(section_title("Section: Partner With Vyuha.AI"))
    story.append(p("Together, let's build and scale the future of Enterprise Intelligence.", "body"))
    story.extend(ctas([{"label": "Become a Partner", "href": "/contact"}]))
    story.append(PageBreak())

    # =====================================================================
    # 6. RESOURCES HUB
    # =====================================================================
    story.extend(page_header("/resources", "Resources", eyebrow="RESOURCES"))
    story.append(p("Hub page — links to child resource sections (structure only; no additional marketing body copy).", "body"))
    story.append(p("Child pages", "label"))
    story.extend(
        bullets(
            [
                "News & Events — /resources/news-events",
                "Blog / Insights — /resources/blog",
            ]
        )
    )
    story.append(PageBreak())

    # =====================================================================
    # 6.1 NEWS & EVENTS
    # =====================================================================
    story.extend(page_header("/resources/news-events", "News & Events", eyebrow="RESOURCES"))
    story.append(p("News, announcements, events, and company updates from Vyuha.ai.", "body"))
    story.append(
        p(
            "Content pending: No verified News & Events articles or event listings were supplied in the provided source material. This page is ready for CMS/news entries.",
            "notice",
        )
    )
    story.append(PageBreak())

    # =====================================================================
    # 6.2 BLOG
    # =====================================================================
    story.extend(page_header("/resources/blog", "Blog / Insights", eyebrow="RESOURCES"))
    story.append(
        p(
            "Strategies, insights, and engineering perspectives for building secure, autonomous enterprise operations.",
            "body",
        )
    )
    story.append(
        p(
            "Content pending: No verified blog/insight articles were supplied in the provided source material. This page is ready for article listing and detail content.",
            "notice",
        )
    )
    story.append(PageBreak())

    # =====================================================================
    # 7. CONTACT
    # =====================================================================
    story.extend(page_header("/contact", "Get in touch", eyebrow="CONTACT"))
    story.append(p("Email: hello@vyuha.ai", "body_left"))
    story.append(p("Phone: +91 11 4108 2200", "body_left"))
    story.append(p("Phone link: tel:+911141082200", "cta"))
    story.append(p("Form intro: Send a message and we will follow up.", "body"))
    story.append(PageBreak())

    # =====================================================================
    # 8. SITEMAP
    # =====================================================================
    story.extend(page_header("/sitemap", "Sitemap — Index of every public page on Vyuha.ai", eyebrow="SITEMAP"))
    story.append(p("Canonical public site map (routes and titles).", "body"))
    for label, path in [
        ("Home", "/"),
        ("Platform", "/platform"),
        ("  Vyuha.ONE", "/platform/command"),
        ("  Vyuha In a BOX", "/platform/in-a-box"),
        ("  Integrations", "/platform/integrations"),
        ("Solutions", "/solutions"),
        ("  Security & Compliance", "/solutions/security-compliance"),
        ("  IT Operations", "/solutions/it-operations"),
        ("  Business Operations & FinOps", "/solutions/business-operations"),
        ("  Industry-Wise Use Cases", "/solutions/industry-use-cases"),
        ("Company", "/company"),
        ("Partners", "/partners"),
        ("Resources", "/resources"),
        ("  News & Events", "/resources/news-events"),
        ("  Blog / Insights", "/resources/blog"),
        ("Contact", "/contact"),
    ]:
        story.append(p(f"{label} — {path}", "toc_item" if not label.startswith("  ") else "toc_sub"))

    story.append(Spacer(1, 10 * mm))
    story.append(
        p(
            "End of document. All marketing page copy from src/content/ is included above. Pending-content notices are preserved as they appear on the live site.",
            "cover_meta",
        )
    )

    return story


def add_page_number(canvas, doc):
    canvas.saveState()
    page_num = canvas.getPageNumber()
    text = f"Vyuha.ai Website Content · RAG Document · Page {page_num}"
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(colors.HexColor("#8A9AA2"))
    canvas.drawCentredString(A4[0] / 2, 12 * mm, text)
    # top rule on content pages
    if page_num > 1:
        canvas.setStrokeColor(colors.HexColor("#D0DCE0"))
        canvas.setLineWidth(0.5)
        canvas.line(18 * mm, A4[1] - 14 * mm, A4[0] - 18 * mm, A4[1] - 14 * mm)
    canvas.restoreState()


def main():
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="Vyuha.ai Website Content — RAG Document",
        author="Vyuha.ai",
        subject="Complete page-wise website content for RAG ingestion",
    )
    story = build_story()
    doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
    print(f"Wrote: {OUT}")
    print(f"Size: {OUT.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
