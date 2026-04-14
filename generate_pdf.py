from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, Image, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus.flowables import BalancedColumns
import os

# ── Colours ───────────────────────────────────────────────────────────────────
ZINGY_PURPLE = colors.HexColor("#9333EA")   # primary accent
ZINGY_VIOLET = colors.HexColor("#7C3AED")   # deeper purple
ZINGY_DARK   = colors.HexColor("#0D0F1A")   # cover bg (very dark navy)
ZINGY_NAVY   = colors.HexColor("#1A1035")   # sidebar/table-header bg
ZINGY_MID    = colors.HexColor("#334155")   # body text
ZINGY_LIGHT  = colors.HexColor("#F5F3FF")   # subtle purple tint for alt rows
ZINGY_GRAY   = colors.HexColor("#64748B")   # muted text / captions
WHITE        = colors.white
# Keep legacy aliases so table/section code still works unchanged
ZINGY_RED    = ZINGY_PURPLE
ZINGY_ACCENT = ZINGY_VIOLET

BASE = r"c:\Users\Chikwe Azinge\ChikwexProjectsNDocs\ZingyBankingApp"
SCREENSHOTS = os.path.join(BASE, "frontend", "Screenshots")
OUT = os.path.join(BASE, "ZingyBank_Project_Overview.pdf")

# ── Styles ────────────────────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def S(name, **kw):
    return ParagraphStyle(name, **kw)

cover_title   = S("CoverTitle",   fontName="Helvetica-Bold",   fontSize=38, textColor=WHITE,                            alignment=TA_CENTER, spaceAfter=6)
cover_sub     = S("CoverSub",     fontName="Helvetica",        fontSize=16, textColor=colors.HexColor("#C4B5FD"),      alignment=TA_CENTER, spaceAfter=4)
cover_tag     = S("CoverTag",     fontName="Helvetica-Oblique",fontSize=11, textColor=colors.HexColor("#94A3B8"),      alignment=TA_CENTER)
h1            = S("H1",           fontName="Helvetica-Bold",   fontSize=18, textColor=colors.HexColor("#1E1B4B"),     spaceBefore=14, spaceAfter=6)
h2            = S("H2",           fontName="Helvetica-Bold",   fontSize=13, textColor=ZINGY_PURPLE,                   spaceBefore=10, spaceAfter=4)
h3            = S("H3",           fontName="Helvetica-Bold",   fontSize=11, textColor=ZINGY_MID,                      spaceBefore=6,  spaceAfter=3)
body          = S("Body",         fontName="Helvetica",        fontSize=10, textColor=ZINGY_MID,                      leading=15, alignment=TA_JUSTIFY, spaceAfter=4)
bullet        = S("Bullet",       fontName="Helvetica",        fontSize=10, textColor=ZINGY_MID,                      leading=14, leftIndent=14, spaceAfter=2)
code_s        = S("Code",         fontName="Courier",          fontSize=8,  textColor=colors.HexColor("#1E1B4B"),     backColor=colors.HexColor("#EDE9FE"), leftIndent=10, rightIndent=10, leading=12, spaceAfter=4)
caption       = S("Caption",      fontName="Helvetica-Oblique",fontSize=8,  textColor=ZINGY_GRAY,                     alignment=TA_CENTER, spaceAfter=6)
toc_entry     = S("TOC",          fontName="Helvetica",        fontSize=11, textColor=ZINGY_MID,                      leading=18, leftIndent=10)

PAGE_W, PAGE_H = A4
MARGIN = 2*cm

def hr(): return HRFlowable(width="100%", thickness=1, color=colors.HexColor("#DDD6FE"), spaceAfter=8, spaceBefore=4)
def red_hr(): return HRFlowable(width="100%", thickness=2.5, color=ZINGY_PURPLE, spaceAfter=10, spaceBefore=4)
def sp(n=6): return Spacer(1, n)

def section_header(text):
    return [
        red_hr(),
        Paragraph(text, h1),
        sp(4),
    ]

def sub_header(text):
    return [Paragraph(text, h2)]

def body_para(text):
    return Paragraph(text, body)

def bullet_item(text):
    return Paragraph(f"• &nbsp; {text}", bullet)

def img(filename, width=14*cm, caption_text=None):
    path = os.path.join(SCREENSHOTS, filename)
    if not os.path.exists(path):
        return []
    items = [
        sp(4),
        Image(path, width=width, height=width*0.55),
    ]
    if caption_text:
        items.append(Paragraph(caption_text, caption))
    items.append(sp(4))
    return items

cell_header = ParagraphStyle("CH", fontName="Helvetica-Bold", fontSize=9,  textColor=WHITE,     leading=12)
cell_body   = ParagraphStyle("CB", fontName="Helvetica",      fontSize=8.5,textColor=ZINGY_MID, leading=12)

def _p(text, style):
    return Paragraph(str(text), style)

def table(headers, rows, col_widths=None):
    hrow = [_p(h, cell_header) for h in headers]
    drows = [[_p(c, cell_body) for c in row] for row in rows]
    data = [hrow] + drows
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0),  ZINGY_NAVY),
        ("ROWBACKGROUNDS",(0,1), (-1,-1), [WHITE, colors.HexColor("#F5F3FF")]),
        ("GRID",          (0,0), (-1,-1), 0.4, colors.HexColor("#DDD6FE")),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ]))
    return t

# ── Document ──────────────────────────────────────────────────────────────────
doc = SimpleDocTemplate(
    OUT, pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN,
    topMargin=MARGIN,  bottomMargin=MARGIN,
    title="ZingyBank Project Overview",
    author="LycanTech",
)

def cover_page(canvas, doc):
    canvas.saveState()
    cx = PAGE_W / 2

    # ── Background ──────────────────────────────────────────────────────────
    canvas.setFillColor(ZINGY_DARK)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Subtle gradient panel — darker lower half (no overlap with text zone)
    canvas.setFillColor(colors.HexColor("#0A0818"))
    canvas.rect(0, 0, PAGE_W, PAGE_H * 0.28, fill=1, stroke=0)

    # Left violet stripe
    canvas.setFillColor(ZINGY_VIOLET)
    canvas.rect(0, 0, 0.45*cm, PAGE_H, fill=1, stroke=0)

    # ── Top accent bar ───────────────────────────────────────────────────────
    canvas.setFillColor(ZINGY_PURPLE)
    canvas.rect(0, PAGE_H - 0.7*cm, PAGE_W, 0.7*cm, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(MARGIN + 0.6*cm, PAGE_H - 0.45*cm, "ZingyBank  |  Full Retail Banking Platform")
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(colors.HexColor("#C4B5FD"))
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 0.45*cm, "April 2025")

    # ── Logo circle ──────────────────────────────────────────────────────────
    logo_y = PAGE_H * 0.62
    canvas.setFillColor(ZINGY_VIOLET)
    canvas.circle(cx, logo_y, 1.6*cm, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 32)
    canvas.drawCentredString(cx, logo_y - 0.4*cm, "Z")

    # ── Title ────────────────────────────────────────────────────────────────
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 46)
    canvas.drawCentredString(cx, PAGE_H * 0.47, "ZingyBank")

    # Purple underline below title
    canvas.setFillColor(ZINGY_PURPLE)
    canvas.rect(cx - 5*cm, PAGE_H * 0.455, 10*cm, 0.12*cm, fill=1, stroke=0)

    # ── Subtitle ─────────────────────────────────────────────────────────────
    canvas.setFillColor(colors.HexColor("#C4B5FD"))
    canvas.setFont("Helvetica", 16)
    canvas.drawCentredString(cx, PAGE_H * 0.405, "Full Retail Banking Platform")

    # ── Tech stack line ───────────────────────────────────────────────────────
    canvas.setFillColor(colors.HexColor("#94A3B8"))
    canvas.setFont("Helvetica-Oblique", 11)
    canvas.drawCentredString(cx, PAGE_H * 0.365,
        "Java 21  ·  Spring Boot 3.4  ·  React 18  ·  Kubernetes  ·  Terraform")

    # ── Feature pills ────────────────────────────────────────────────────────
    pills = ["11 Microservices", "10 Databases", "Azure · AWS · GCP", "CI/CD · GitOps"]
    pill_w, pill_h, gap = 3.8*cm, 0.7*cm, 0.5*cm
    total = len(pills) * pill_w + (len(pills) - 1) * gap
    pill_x = cx - total / 2
    pill_y = PAGE_H * 0.29
    for pill in pills:
        canvas.setFillColor(ZINGY_NAVY)
        canvas.roundRect(pill_x, pill_y, pill_w, pill_h, 0.2*cm, fill=1, stroke=0)
        canvas.setStrokeColor(ZINGY_VIOLET)
        canvas.setLineWidth(0.5)
        canvas.roundRect(pill_x, pill_y, pill_w, pill_h, 0.2*cm, fill=0, stroke=1)
        canvas.setFillColor(colors.HexColor("#C4B5FD"))
        canvas.setFont("Helvetica", 8.5)
        canvas.drawCentredString(pill_x + pill_w / 2, pill_y + 0.2*cm, pill)
        pill_x += pill_w + gap

    # ── Bottom strip ─────────────────────────────────────────────────────────
    canvas.setFillColor(ZINGY_NAVY)
    canvas.rect(0, 0, PAGE_W, 1.2*cm, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor("#C4B5FD"))
    canvas.setFont("Helvetica", 8)
    canvas.drawCentredString(cx, 0.45*cm, "CONFIDENTIAL — FOR INTERNAL USE ONLY")

    canvas.restoreState()

def normal_page(canvas, doc):
    canvas.saveState()
    # Top bar — dark navy
    canvas.setFillColor(ZINGY_NAVY)
    canvas.rect(0, PAGE_H - 1.1*cm, PAGE_W, 1.1*cm, fill=1, stroke=0)
    # Purple left accent on top bar
    canvas.setFillColor(ZINGY_PURPLE)
    canvas.rect(0, PAGE_H - 1.1*cm, 0.3*cm, 1.1*cm, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 8)
    canvas.drawString(MARGIN, PAGE_H - 0.65*cm, "ZingyBank — Full Retail Banking Platform")
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#C4B5FD"))
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 0.65*cm, f"Page {doc.page}")
    # Bottom bar — purple
    canvas.setFillColor(ZINGY_PURPLE)
    canvas.rect(0, 0, PAGE_W, 0.6*cm, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica", 7)
    canvas.drawCentredString(PAGE_W/2, 0.2*cm, "© 2025 LycanTech / ZingyBank. All rights reserved.")
    canvas.restoreState()

story = []

# ══════════════════════════════════════════════════════════════════════════════
# COVER — drawn entirely on canvas; story just forces a page break
# ══════════════════════════════════════════════════════════════════════════════
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# TABLE OF CONTENTS
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("Table of Contents")
toc_items = [
    ("1", "Executive Summary"),
    ("2", "System Architecture"),
    ("3", "Microservices"),
    ("4", "Frontend Application"),
    ("5", "Data Layer"),
    ("6", "Security & Compliance"),
    ("7", "Observability Stack"),
    ("8", "DevOps & CI/CD Pipeline"),
    ("9", "Kubernetes & Helm"),
    ("10", "Infrastructure as Code (Terraform)"),
    ("11", "Local Development"),
    ("12", "Screenshots"),
    ("13", "Appendix — Credentials & URLs"),
]
for num, title in toc_items:
    story.append(Paragraph(f"<b>{num}.</b>   {title}", toc_entry))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 1. EXECUTIVE SUMMARY
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("1. Executive Summary")
story.append(body_para(
    "ZingyBank is a production-grade, cloud-agnostic retail banking platform built to "
    "demonstrate enterprise-level software engineering practices. The system implements a "
    "full suite of retail banking capabilities — customer onboarding, account management, "
    "fund transfers, bill payments, loan origination, card issuance, KYC/AML compliance, "
    "and immutable audit logging — across 11 independently deployable microservices."
))
story.append(sp(6))
story.append(body_para(
    "The platform is designed to run on any cloud (Azure, AWS, GCP) or on-premises Kubernetes "
    "cluster with no code changes. It ships with complete Infrastructure as Code (Terraform), "
    "GitOps delivery (ArgoCD), a multi-cloud CI/CD pipeline (GitHub Actions), and a full "
    "observability stack (Prometheus, Grafana, Jaeger, Loki)."
))
story.append(sp(8))

kpi_data = [
    ["Microservices", "Frontend", "Databases", "Cloud Targets", "K8s Namespaces"],
    ["11",            "React 18 + TypeScript", "10 (per-service)", "Azure · AWS · GCP · Any K8s", "3"],
]
story.append(table(kpi_data[0:1], kpi_data[1:], col_widths=[3.2*cm]*5))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 2. SYSTEM ARCHITECTURE
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("2. System Architecture")
story.append(body_para(
    "The platform follows a microservices architecture pattern with a single entry point "
    "(API Gateway), domain-isolated services, and asynchronous event-driven communication "
    "via Apache Kafka. Each service owns its own PostgreSQL database — enforcing domain "
    "isolation and independent deployability."
))
story.append(sp(6))

story += sub_header("2.1 Request Flow")
story.append(body_para(
    "External traffic enters through an NGINX Ingress Controller (Kubernetes) or directly "
    "to the API Gateway (local dev). Spring Cloud Gateway MVC routes requests to downstream "
    "services based on path prefixes. Each downstream service validates JWT tokens independently."
))
story.append(sp(4))
for line in [
    "Browser / Mobile → NGINX Ingress (TLS termination, rate limit, security headers)",
    "NGINX Ingress → React Frontend (static assets via nginx:alpine)",
    "Browser API calls → NGINX Ingress → API Gateway (port 8080)",
    "API Gateway → microservice (JWT forwarded, Resilience4j applied)",
    "Microservice → PostgreSQL (via PgBouncer connection pooler)",
    "Microservice → Kafka (async domain events to other services)",
    "Microservice → Redis (session cache, rate limiting, idempotency keys)",
    "Microservice → HashiCorp Vault (secrets at runtime via environment injection)",
]:
    story.append(bullet_item(line))

story.append(sp(8))
story += sub_header("2.2 Technology Stack")
stack_rows = [
    ["Language",          "Java 21 (LTS)"],
    ["Framework",         "Spring Boot 3.4, Spring Cloud 2024.0"],
    ["Build",             "Maven 3.9 (multi-module, parallel builds)"],
    ["Frontend",          "React 18, TypeScript, Vite, TailwindCSS v4, Zustand, React Query"],
    ["Database",          "PostgreSQL 16, Flyway migrations, database-per-service"],
    ["Connection Pool",   "PgBouncer (transaction mode, 1000 max connections)"],
    ["Cache",             "Redis 7 (session store, rate limiting, idempotency)"],
    ["Messaging",         "Apache Kafka (Confluent 7.7.1, event-driven async)"],
    ["Auth",              "Spring Security, JWT (jjwt), BCrypt-12, RBAC"],
    ["Resilience",        "Resilience4j (circuit breaker, retry, rate limiter, time limiter)"],
    ["API Docs",          "SpringDoc OpenAPI 2 (Swagger UI per service)"],
    ["Tracing",           "OpenTelemetry SDK → Jaeger (OTLP HTTP/gRPC)"],
    ["Monitoring",        "Prometheus, Grafana, Micrometer"],
    ["Logging",           "Loki, Promtail, SLF4J/Logback (structured JSON)"],
    ["Secrets",           "HashiCorp Vault + External Secrets Operator (K8s)"],
    ["Service Mesh",      "Linkerd (mTLS, retries, timeouts, per-route policies)"],
    ["Container",         "Docker (multi-stage builds), Docker Compose (local dev)"],
    ["Orchestration",     "Kubernetes 1.32, Helm 3, ArgoCD (GitOps)"],
    ["IaC",               "Terraform >= 1.5 (Azure AKS + AWS EKS modules)"],
]
story.append(table(["Category", "Technology"], stack_rows, col_widths=[5*cm, 11.5*cm]))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 3. MICROSERVICES
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("3. Microservices")
story.append(body_para(
    "Each microservice is a self-contained Spring Boot application with its own database, "
    "Flyway migration scripts, Resilience4j configuration, OpenTelemetry tracing, and "
    "Prometheus metrics endpoint. Services communicate synchronously via REST through the "
    "API Gateway, and asynchronously via Kafka domain events."
))
story.append(sp(6))

svc_rows = [
    ["api-gateway",          "8080", "Spring Cloud Gateway MVC — routing, rate limiting, JWT forwarding to all services"],
    ["auth-service",         "8081", "JWT authentication, BCrypt-12, RBAC (5 roles), MFA, account lockout, refresh tokens"],
    ["account-service",      "8082", "Account CRUD, balance management, CHECKING / SAVINGS / BUSINESS account types"],
    ["transaction-service",  "8083", "Fund transfers, deposits, withdrawals, event sourcing, idempotency"],
    ["payment-service",      "8084", "Bill payments, scheduled/recurring payments, payment history"],
    ["loan-service",         "8085", "Loan applications, approval workflows, amortization schedule generation"],
    ["card-service",         "8086", "Virtual/physical card issuance, activation, limit management, block/report stolen"],
    ["kyc-service",          "8087", "KYC/AML verification, document upload, sanctions screening, PEP checks"],
    ["notification-service", "8088", "Email/SMS/push notifications — event-driven via Kafka, SMTP via MailHog"],
    ["statement-service",    "8089", "Account statements, PDF generation, date-range filtering"],
    ["audit-service",        "8090", "Immutable append-only audit log with SHA-256 hash chain (tamper detection)"],
]
story.append(table(
    ["Service", "Port", "Responsibility"],
    svc_rows,
    col_widths=[4.2*cm, 1.4*cm, 10.9*cm]
))

story.append(sp(10))
story += sub_header("3.1 Resilience Configuration (per service)")
story.append(body_para(
    "Every service applies Resilience4j patterns to prevent cascading failures:"
))
for item in [
    "Circuit Breaker — opens after 50% failure rate over 10 requests; waits 30s before half-open",
    "Retry — max 3 attempts with 500ms exponential backoff",
    "Rate Limiter — 100 requests/second per instance",
    "Time Limiter — 5s timeout on all downstream calls",
]:
    story.append(bullet_item(item))

story.append(sp(10))
story += sub_header("3.2 RBAC — User Roles")
rbac_rows = [
    ["CUSTOMER",           "Default on registration", "Accounts, transactions, cards, loans, KYC, statements"],
    ["TELLER",             "Bank teller staff",       "All customer data + manual transaction overrides"],
    ["MANAGER",            "Branch manager",          "Teller access + loan approvals + Observability dashboard"],
    ["COMPLIANCE_OFFICER", "AML/KYC reviewer",        "KYC workflows, suspicious activity reports + Observability"],
    ["ADMIN",              "System administrator",    "Full system access including all observability tooling"],
]
story.append(table(["Role", "Assigned To", "Access"], rbac_rows, col_widths=[4.5*cm, 4*cm, 8*cm]))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 4. FRONTEND APPLICATION
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("4. Frontend Application")
story.append(body_para(
    "The frontend is a single-page React 18 application written in TypeScript, built with "
    "Vite, and styled with TailwindCSS v4. It communicates with the API Gateway via REST "
    "and ships OpenTelemetry browser tracing and Loki log shipping built in."
))
story.append(sp(6))

fe_rows = [
    ["Framework",       "React 18 + TypeScript + Vite"],
    ["Styling",         "TailwindCSS v4 (utility-first, custom ZingyBank design tokens)"],
    ["State",           "Zustand (global stores: auth, UI, notifications)"],
    ["Data Fetching",   "React Query (server-state, caching, optimistic updates)"],
    ["Forms",           "react-hook-form + Zod (schema validation)"],
    ["Routing",         "React Router v6 (code-split lazy routes)"],
    ["Tracing",         "OpenTelemetry browser SDK — traces to Jaeger via /otlp/ nginx proxy"],
    ["Log Shipping",    "Structured JSON logs to Loki via /loki/ nginx proxy"],
    ["Serving",         "nginx:alpine (non-root, read-only FS, gzip, security headers)"],
    ["Build",           "Multi-stage Dockerfile (node:20-alpine builder → nginx:alpine)"],
]
story.append(table(["Concern", "Implementation"], fe_rows, col_widths=[4.5*cm, 12*cm]))

story.append(sp(8))
story += sub_header("4.1 Pages & Features")
pages = [
    ("Dashboard",       "Balance overview, balance trend chart, recent transactions, quick-action cards"),
    ("Accounts",        "Account list, create account, account detail with transaction history"),
    ("Transfer",        "Fund transfer form with account selector, amount, description"),
    ("Payments",        "New payment form, payment history tab"),
    ("Loans",           "Loan application form, active loans list, amortization view"),
    ("Cards",           "Card management — issue, activate, set limits, block/report"),
    ("Statements",      "Statement download with date-range filter"),
    ("Profile",         "User profile, personal info, security settings"),
    ("Observability",   "Admin-only — embedded Grafana dashboards, links to Jaeger / Kafka UI / MailHog"),
]
story.append(table(["Page", "Features"], pages, col_widths=[3.5*cm, 13*cm]))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 5. DATA LAYER
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("5. Data Layer")
story += sub_header("5.1 Database per Service")
story.append(body_para(
    "Each microservice owns exactly one PostgreSQL 16 database. No cross-database joins "
    "are permitted. Cross-domain data needs are resolved through service APIs or Kafka "
    "events. Flyway migrations run at service startup."
))
story.append(sp(4))
db_rows = [
    ["zingybank_auth",         "auth-service",         "users, user_roles, refresh_tokens"],
    ["zingybank_account",      "account-service",      "accounts, account_balances"],
    ["zingybank_transaction",  "transaction-service",  "transactions, transaction_events"],
    ["zingybank_payment",      "payment-service",      "payments, payment_schedules"],
    ["zingybank_loan",         "loan-service",         "loan_applications, loans, amortization_schedules"],
    ["zingybank_card",         "card-service",         "cards, card_transactions, card_limits"],
    ["zingybank_kyc",          "kyc-service",          "kyc_records, documents, verification_results"],
    ["zingybank_notification", "notification-service", "notifications, notification_templates"],
    ["zingybank_statement",    "statement-service",    "statements, statement_items"],
    ["zingybank_audit",        "audit-service",        "audit_events (append-only, SHA-256 hash chain)"],
]
story.append(table(["Database", "Owner Service", "Key Tables"], db_rows, col_widths=[4.5*cm, 4.5*cm, 7.5*cm]))

story.append(sp(10))
story += sub_header("5.2 PgBouncer Connection Pooling")
for item in [
    "Transaction pool mode — lowest latency, highest throughput",
    "1000 max client connections mapped to 100 server connections",
    "Services connect to pgbouncer:5432 (K8s) or localhost:5433 (local)",
    "2 replicas in Kubernetes with PodDisruptionBudget (minAvailable: 1)",
]:
    story.append(bullet_item(item))

story.append(sp(8))
story += sub_header("5.3 Redis")
for item in [
    "Session store — JWT refresh token metadata",
    "Rate limiting — sliding window counters per IP and user",
    "Idempotency keys — prevent duplicate financial transactions",
    "256MB max memory with LRU eviction policy",
]:
    story.append(bullet_item(item))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 6. SECURITY & COMPLIANCE
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("6. Security & Compliance")
story += sub_header("6.1 Authentication & Authorisation")
for item in [
    "JWT tokens — 15-minute access tokens, 7-day refresh tokens",
    "BCrypt cost factor 12 for password hashing",
    "5 RBAC roles — CUSTOMER, TELLER, MANAGER, COMPLIANCE_OFFICER, ADMIN",
    "Account lockout after repeated failed login attempts",
    "MFA-ready (TOTP secret stored per user)",
]:
    story.append(bullet_item(item))

story.append(sp(8))
story += sub_header("6.2 PCI DSS Compliance Features")
pci_rows = [
    ["PCI DSS Req 1",  "Network segmentation",   "Kubernetes NetworkPolicies — default-deny-all, microsegmentation per service"],
    ["PCI DSS Req 3",  "Data protection",         "Encryption at rest (AES-256), card numbers stored encrypted, PII field-level encryption"],
    ["PCI DSS Req 4",  "Encryption in transit",   "TLS 1.3 enforced, HSTS headers, Linkerd mTLS between all services"],
    ["PCI DSS Req 7",  "Access control",          "RBAC, Pod Security Standards (restricted), non-root containers"],
    ["PCI DSS Req 10", "Audit trail",             "Immutable append-only audit log with SHA-256 hash chain (tamper detection)"],
    ["PCI DSS Req 11", "Vulnerability management","Trivy image scanning in CI, SonarQube SAST, OWASP dependency checks"],
    ["KYC/AML",        "Identity verification",   "Document upload, sanctions screening, PEP checks, suspicious activity reporting"],
]
story.append(table(["Requirement", "Category", "Implementation"], pci_rows, col_widths=[2.8*cm, 3.5*cm, 10.2*cm]))

story.append(sp(8))
story += sub_header("6.3 Secrets Management")
for item in [
    "HashiCorp Vault — KV v2 secrets engine, all credentials stored centrally",
    "Local dev — Vault in dev mode (token: zingybank-local-vault-token)",
    "Kubernetes — External Secrets Operator syncs Vault → K8s Secrets (1h refresh)",
    "Zero secrets in source code, Docker images, or environment files",
    "Azure Key Vault integration via AKS Workload Identity in cloud deployments",
]:
    story.append(bullet_item(item))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 7. OBSERVABILITY
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("7. Observability Stack")
story.append(body_para(
    "ZingyBank implements the three pillars of observability — metrics, traces, and logs — "
    "with full correlation between them. Frontend browser sessions also emit traces and "
    "structured logs to the same backend."
))
story.append(sp(6))

obs_rows = [
    ["Prometheus",  "9090", "Scrapes /actuator/prometheus from all 11 services every 15s"],
    ["Grafana",     "3001", "ZingyBank Service Overview dashboard + JVM, Kafka, PostgreSQL dashboards"],
    ["Jaeger",      "16686","Distributed tracing via OTLP. 100% sampling in dev. Trace-to-log correlation"],
    ["Loki",        "3100", "Log aggregation. Promtail ships container logs. Browser logs via nginx proxy"],
    ["Promtail",    "—",    "Tails Docker container logs and ships structured JSON to Loki"],
    ["OpenTelemetry","—",   "Browser SDK instruments all fetch/XHR calls. Traces proxied via /otlp/"],
]
story.append(table(["Tool", "Port", "Role"], obs_rows, col_widths=[3*cm, 2*cm, 11.5*cm]))

story.append(sp(8))
story += sub_header("7.1 Grafana — ZingyBank Service Overview Dashboard")
story.append(body_para("Auto-provisioned via config files at infrastructure/grafana/provisioning/:"))
panels = [
    "Services Up — count of healthy service instances",
    "Total HTTP Requests (5m) — request volume stat panel",
    "Error Rate (5m) — percentage of 5xx responses",
    "P99 Latency — 99th percentile response time",
    "Active JVM Threads — thread pool health",
    "HTTP Request Rate by Service — timeseries per service",
    "HTTP Error Rate by Service — timeseries per service",
    "JVM Heap Usage — timeseries per service",
    "P95 Latency — timeseries per service",
    "Frontend Error Logs — Loki log panel",
    "All Service Logs — Loki log panel with label filters",
]
for p in panels:
    story.append(bullet_item(p))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 8. CI/CD PIPELINE
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("8. DevOps & CI/CD Pipeline")
story.append(body_para(
    "The pipeline is implemented in GitHub Actions with two workflows: CI (ci.yml) and CD "
    "(cd.yml). Every push to main triggers CI; on success, CD automatically deploys to "
    "staging and waits for manual approval before promoting to production."
))
story.append(sp(6))

story += sub_header("8.1 CI Pipeline — ci.yml")
ci_rows = [
    ["Build & Test (Java)",   "mvn clean verify — compiles all 11 services in parallel (-T4), runs JUnit tests"],
    ["Build & Test (React)",  "npm ci + tsc --noEmit + npm run build — type check and production build"],
    ["Security Scan",         "Trivy image vulnerability scan, SonarQube SAST (optional)"],
    ["Build & Push Images",   "Multi-arch Docker build pushed to GHCR (always) + ACR/ECR/GCP AR (optional)"],
]
story.append(table(["Stage", "Details"], ci_rows, col_widths=[4.5*cm, 12*cm]))

story.append(sp(8))
story += sub_header("8.2 CD Pipeline — cd.yml")
cd_rows = [
    ["Trigger",       "workflow_run on CI success — only runs when CI passes"],
    ["Staging",       "Auto — updates helm/values/staging/<service>.yaml image tags, commits, pushes"],
    ["ArgoCD sync",   "ArgoCD detects the git push and auto-syncs the staging namespace"],
    ["Production",    "Requires manual approval in GitHub Environments (protected branch)"],
    ["Release",       "GitHub Release created automatically with image tag and commit SHA"],
]
story.append(table(["Step", "Details"], cd_rows, col_widths=[3*cm, 13.5*cm]))

story.append(sp(8))
story += sub_header("8.3 Multi-Cloud Image Registry Strategy")
reg_rows = [
    ["GHCR",         "Always active",  "Built-in GITHUB_TOKEN — no secrets needed"],
    ["Azure ACR",    "Optional",       "Set ACR_USERNAME + ACR_PASSWORD secrets"],
    ["AWS ECR",      "Optional",       "Set AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY + AWS_ACCOUNT_ID"],
    ["GCP AR",       "Optional",       "Set GCP_SA_KEY + GCP_PROJECT_ID secrets"],
]
story.append(table(["Registry", "Status", "Activation"], reg_rows, col_widths=[3*cm, 3*cm, 10.5*cm]))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 9. KUBERNETES & HELM
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("9. Kubernetes & Helm")
story += sub_header("9.1 Namespaces")
ns_rows = [
    ["zingybank",            "Restricted pod security standards. All 11 microservices + frontend + PgBouncer"],
    ["zingybank-monitoring", "Prometheus, Grafana, Alertmanager, Loki, Jaeger"],
    ["zingybank-ingress",    "NGINX Ingress Controller"],
    ["argocd",               "ArgoCD GitOps controller"],
]
story.append(table(["Namespace", "Contents"], ns_rows, col_widths=[5*cm, 11.5*cm]))

story.append(sp(8))
story += sub_header("9.2 Helm Base Chart — base-service")
story.append(body_para(
    "A single shared Helm chart (infrastructure/helm/charts/base-service) is used for all "
    "11 microservices. Per-service overrides are in helm/values/<service>.yaml."
))
helm_features = [
    "Deployment with configurable replicas, image, env vars, and secret injection",
    "ClusterIP Service",
    "HPA — 2–10 replicas, 70% CPU / 80% memory targets",
    "PodDisruptionBudget — minAvailable: 1",
    "Non-root user (UID 1000), read-only root filesystem, no privilege escalation",
    "Liveness probe — /actuator/health/liveness (45s initial delay)",
    "Readiness probe — /actuator/health/readiness (30s initial delay)",
    "Pod anti-affinity — prefer spreading across nodes",
    "Node selector — nodepool-type: application",
]
for f in helm_features:
    story.append(bullet_item(f))

story.append(sp(8))
story += sub_header("9.3 ArgoCD Sync Waves (startup order)")
wave_rows = [
    ["Wave 1", "api-gateway, frontend"],
    ["Wave 2", "auth-service"],
    ["Wave 3", "account-service, transaction-service, payment-service, loan-service, card-service, kyc-service"],
    ["Wave 4", "notification-service, statement-service, audit-service"],
]
story.append(table(["Wave", "Services"], wave_rows, col_widths=[2.5*cm, 14*cm]))

story.append(sp(8))
story += sub_header("9.4 Network Security (PCI DSS)")
for item in [
    "Default-deny-all NetworkPolicy — all ingress and egress blocked by default",
    "allow-dns — UDP/TCP port 53 egress for all pods",
    "allow-gateway-to-services — API Gateway → all microservices (ports 8080–8090)",
    "allow-services-to-kafka — all services → Kafka (port 9092)",
    "allow-prometheus-scrape — Prometheus → all pods (metrics ports)",
    "allow-ingress-to-gateway — NGINX Ingress → API Gateway + Frontend",
    "allow-jobs-to-services — seed/admin K8s Jobs → auth-service",
]:
    story.append(bullet_item(item))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 10. TERRAFORM
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("10. Infrastructure as Code (Terraform)")
story.append(body_para(
    "All cloud infrastructure is managed by Terraform >= 1.5. Azure is the primary cloud "
    "(AKS, PostgreSQL Flexible Server, ACR, Key Vault). AWS modules provide a disaster "
    "recovery option (EKS, RDS, ECR). Remote state is stored in Azure Blob Storage."
))
story.append(sp(6))

story += sub_header("10.1 Azure Modules")
az_rows = [
    ["azure/networking", "VNet, 4 subnets (system/app/DB/private-endpoints), NSGs, PostgreSQL private DNS zone"],
    ["azure/aks",        "Private AKS 1.32 cluster, system + app node pools, AAD RBAC, Log Analytics, Key Vault CSI"],
    ["azure/database",   "PostgreSQL 16 Flexible Server, 10 databases, private endpoint (no public access)"],
    ["azure/acr",        "Premium ACR with geo-replication, private endpoint"],
    ["azure/keyvault",   "HSM-backed Key Vault, AKS managed identity access policy, soft-delete disabled (dev)"],
]
story.append(table(["Module", "Provisions"], az_rows, col_widths=[4*cm, 12.5*cm]))

story.append(sp(8))
story += sub_header("10.2 AWS Modules (DR)")
aws_rows = [
    ["aws/networking", "VPC, 3-AZ public/private subnets, NAT gateways per-AZ, EKS + RDS security groups"],
    ["aws/eks",        "Private EKS cluster, system + app node groups, IRSA OIDC provider, KMS encryption"],
    ["aws/rds",        "Multi-AZ RDS PostgreSQL 16, KMS encryption, 35-day backups, enhanced monitoring"],
    ["aws/ecr",        "11 ECR repos (one per service), scan-on-push, lifecycle policies, immutable tags in prod"],
]
story.append(table(["Module", "Provisions"], aws_rows, col_widths=[4*cm, 12.5*cm]))

story.append(sp(8))
story += sub_header("10.3 Environments")
env_rows = [
    ["dev",      "Azure", "10.0.0.0/16", "1.32", "zingybank-dev-rg",      "dev.terraform.tfstate"],
    ["staging",  "Azure", "10.1.0.0/16", "1.32", "zingybank-staging-rg",  "staging.terraform.tfstate"],
    ["prod",     "Azure", "10.2.0.0/16", "1.32", "zingybank-prod-rg",     "prod.terraform.tfstate"],
    ["prod-dr",  "AWS",   "10.20.0.0/16","1.32", "us-east-1",             "prod-dr.terraform.tfstate"],
]
story.append(table(["Env","Cloud","VNet CIDR","K8s","Resource Group / Region","State Key"], env_rows,
    col_widths=[1.6*cm, 1.6*cm, 3*cm, 1.6*cm, 5.2*cm, 3.5*cm]))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 11. LOCAL DEVELOPMENT
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("11. Local Development")
story.append(body_para(
    "The full stack — all 11 microservices, PostgreSQL, Redis, Kafka, Vault, Grafana, "
    "Prometheus, Jaeger, Loki, Promtail, PgBouncer, MailHog, Kafka UI, and the React frontend "
    "— runs locally via Docker Compose with a single command."
))
story.append(sp(6))

story += sub_header("11.1 Quick Start")
for step in [
    "git clone https://github.com/LycanTech/ZingyBank.git && cd ZingyBank",
    "docker compose up -d postgres redis zookeeper kafka pgbouncer mailhog kafka-ui",
    "docker compose up -d prometheus jaeger loki promtail grafana vault",
    "docker compose up -d   # starts all 11 microservices + frontend",
]:
    story.append(Paragraph(step, code_s))
    story.append(sp(2))

story.append(sp(6))
story += sub_header("11.2 Local URLs")
url_rows = [
    ["Frontend",                  "http://localhost:3002",   "Register to get started"],
    ["API Gateway",               "http://localhost:8080",   "Entry point for all API calls"],
    ["Grafana",                   "http://localhost:3001",   "admin / Grafana@Admin2024!"],
    ["Prometheus",                "http://localhost:9090",   "No auth"],
    ["Jaeger",                    "http://localhost:16686",  "No auth"],
    ["Kafka UI",                  "http://localhost:9091",   "No auth"],
    ["MailHog",                   "http://localhost:8025",   "No auth"],
    ["Vault",                     "http://localhost:8200/ui","Token: zingybank-local-vault-token"],
    ["auth-service Swagger",      "http://localhost:8081/swagger-ui.html", "Direct service access"],
    ["account-service Swagger",   "http://localhost:8082/swagger-ui.html", "Direct service access"],
]
story.append(table(["Service", "URL", "Credentials / Notes"], url_rows, col_widths=[4.5*cm, 6*cm, 6*cm]))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 12. SCREENSHOTS
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("12. Screenshots")

screenshots = [
    ("ZingyBankLogin.png",       "Login Page — JWT authentication with email and password"),
    ("ZingyBankDashboard.png",   "Dashboard — Balance overview, balance trend, recent transactions"),
    ("ZingyBankPayments.png",    "Payments Page — New payment form and payment history"),
    ("ZingyBankGrafana.png",     "Grafana — ZingyBank Service Overview Dashboard"),
    ("ZingyBankPrometheus.png",  "Prometheus — All 11 service scrape targets active"),
    ("ZingyBankKafka.png",       "Kafka UI — Topic and message inspection"),
    ("ZingyBankVault.png",       "HashiCorp Vault — Secrets management UI"),
    ("ZingyBankCICDPipelineImage.png", "CI/CD Pipeline — End-to-end build, test, scan, deploy"),
]

for filename, cap in screenshots:
    path = os.path.join(SCREENSHOTS, filename)
    if os.path.exists(path):
        story.append(KeepTogether([
            Image(path, width=15*cm, height=15*cm*0.55),
            Paragraph(cap, caption),
            sp(8),
        ]))

story.append(PageBreak())

# ══════════════════════════════════════════════════════════════════════════════
# 13. APPENDIX
# ══════════════════════════════════════════════════════════════════════════════
story += section_header("13. Appendix — Credentials & URLs")
story.append(Paragraph("<b>⚠️ Local development credentials only. Never use in production.</b>",
    ParagraphStyle("warn", fontName="Helvetica-Bold", fontSize=9, textColor=ZINGY_RED, spaceAfter=8)))

cred_rows = [
    ["PostgreSQL",  "localhost:5432",  "zingybank",  "ZingyDev2024",           "Direct DB access"],
    ["PgBouncer",   "localhost:5433",  "zingybank",  "ZingyDev2024",           "Connection pooler"],
    ["Redis",       "localhost:6379",  "—",          "Chikwex@ZingyDev!",      "Cache/session store"],
    ["Grafana",     "localhost:3001",  "admin",      "Grafana@Admin2024!",      "Monitoring UI"],
    ["Vault",       "localhost:8200",  "—",          "zingybank-local-vault-token", "Secrets manager"],
]
story.append(table(
    ["Service", "Host:Port", "Username", "Password / Token", "Notes"],
    cred_rows,
    col_widths=[2.8*cm, 3.2*cm, 2.8*cm, 5*cm, 2.7*cm]
))

story.append(sp(10))
story += sub_header("Test Accounts (after running seed job)")
test_rows = [
    ["admin@zingybank.test",   "TestAdmin123!",  "ADMIN",    "Full system access"],
    ["teller@zingybank.test",  "TestTeller123!", "TELLER",   "Transaction operations"],
    ["alice@zingybank.test",   "TestAlice123!",  "CUSTOMER", "End-to-end account testing"],
    ["bob@zingybank.test",     "TestBob123!",    "CUSTOMER", "Transfer testing (Bob ↔ Alice)"],
]
story.append(table(["Email", "Password", "Role", "Use For"], test_rows,
    col_widths=[5*cm, 3.5*cm, 2.5*cm, 5.5*cm]))

story.append(sp(10))
story += sub_header("Git Repositories")
story.append(Paragraph("GitHub:     https://github.com/LycanTech/ZingyBank", code_s))
story.append(Paragraph("Azure Repos: https://dev.azure.com/chikweazinge/ZingyBank/_git/ZingyBank", code_s))

# ── Build ─────────────────────────────────────────────────────────────────────
def page_template(canvas, doc):
    if doc.page == 1:
        cover_page(canvas, doc)
    else:
        normal_page(canvas, doc)

doc.build(story, onFirstPage=page_template, onLaterPages=page_template)
print(f"PDF created: {OUT}")
