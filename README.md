# ZingyBank - Full Retail Banking Platform

A production-grade retail banking platform built with **Java 21 + Spring Boot 3.4** microservices and a **React/TypeScript** frontend. Designed to be cloud-agnostic — deploys to **Azure**, **AWS**, **GCP**, or any Kubernetes cluster out of the box.

---

## Architecture

```
                                    ┌─────────────────────┐
                                    │   Load Balancer /    │
                                    │   Ingress (NGINX)    │
                                    └──────────┬──────────┘
                                               │
                              ┌────────────────▼────────────────┐
                              │   React Frontend (Port 3000)     │
                              │   Vite + TypeScript + TailwindCSS│
                              └────────────────┬────────────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │    API Gateway       │
                                    │    (Port 8080)       │
                                    └──────────┬──────────┘
                                               │
                 ┌──────────┬──────────┬───────┴────────┬──────────┬──────────┐
                 │          │          │                │          │          │
          ┌──────▼──┐ ┌────▼────┐ ┌───▼─────┐  ┌──────▼──┐ ┌────▼────┐ ┌───▼────┐
          │  Auth   │ │ Account │ │ Transac │  │ Payment │ │  Loan   │ │  Card  │
          │ Service │ │ Service │ │  tion   │  │ Service │ │ Service │ │Service │
          │  8081   │ │  8082   │ │ Service │  │  8084   │ │  8085   │ │ 8086   │
          └─────────┘ └─────────┘ │  8083   │  └─────────┘ └─────────┘ └────────┘
                                  └─────────┘
                 ┌──────────┬──────────┬──────────┐
                 │          │          │          │
          ┌──────▼──┐ ┌────▼─────┐ ┌──▼───────┐ ┌▼────────┐
          │   KYC   │ │ Notific  │ │Statement │ │  Audit  │
          │ Service │ │  ation   │ │ Service  │ │ Service │
          │  8087   │ │ Service  │ │  8089    │ │  8090   │
          └─────────┘ │  8088    │ └──────────┘ └─────────┘
                      └──────────┘
                 ┌──────────┬──────────┬──────────┐
                 │          │          │          │
          ┌──────▼──┐ ┌────▼────┐ ┌───▼─────┐ ┌──▼──────┐
          │PostgreSQL│ │  Redis  │ │  Kafka  │ │PgBouncer│
          │ (per-svc)│ │ Cache   │ │ Events  │ │  5433   │
          └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

### Microservices

| Service | Port | Responsibility |
|---------|------|----------------|
| **api-gateway** | 8080 | Routing, rate limiting, auth forwarding (Spring Cloud Gateway) |
| **auth-service** | 8081 | OAuth2/JWT authentication, RBAC, MFA, account lockout |
| **account-service** | 8082 | Account CRUD, balance management, account types |
| **transaction-service** | 8083 | Transfers, deposits, withdrawals, event sourcing |
| **payment-service** | 8084 | Bill payments, scheduled/recurring payments |
| **loan-service** | 8085 | Loan applications, approvals, amortization schedules |
| **card-service** | 8086 | Card issuance, activation, limits, block/report |
| **kyc-service** | 8087 | KYC/AML verification, document upload, compliance checks |
| **notification-service** | 8088 | Email, SMS, push notifications via Kafka events |
| **statement-service** | 8089 | Account statements, PDF generation |
| **audit-service** | 8090 | Immutable audit log with SHA-256 hash chain (tamper detection) |

### Data Layer

- **PostgreSQL 16** — per-service databases (database-per-service pattern)
- **PgBouncer** — connection pooler (transaction mode, 1000 max connections, port 5433)
- **Redis 7** — caching, session store, rate limiting
- **Apache Kafka** — event streaming between services
- **MinIO/S3** — document storage (KYC docs, statements)

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Language** | Java 21 (LTS) |
| **Framework** | Spring Boot 3.4, Spring Cloud 2024.0 |
| **Build** | Maven 3.9 |
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS |
| **Database** | PostgreSQL 16, Flyway migrations |
| **Connection Pool** | PgBouncer (transaction mode) |
| **Cache** | Redis 7 |
| **Messaging** | Apache Kafka |
| **Auth** | Spring Security, JWT (jjwt), BCrypt |
| **Resilience** | Resilience4j (circuit breaker, retry, rate limiter, time limiter) |
| **API Docs** | SpringDoc OpenAPI (Swagger UI) |
| **Tracing** | OpenTelemetry → Jaeger (OTLP) |
| **Monitoring** | Prometheus, Grafana (5 dashboards), Micrometer |
| **Logging** | Loki, Promtail, SLF4J/Logback |
| **Secrets** | HashiCorp Vault + External Secrets Operator |
| **Service Mesh** | Linkerd (mTLS, traffic metrics, per-route policies) |

---

## DevOps Toolchain

| Tool | Purpose | Status |
|------|---------|--------|
| **Git / GitHub** | Source control, branch protection, PR reviews | ✅ Implemented |
| **Docker** | Containerize all services — multi-stage Maven builds | ✅ Implemented |
| **Kubernetes** | Orchestration — AKS, EKS, or any conformant cluster | ✅ Implemented |
| **Terraform** | Infrastructure as Code — Azure + AWS modules | ✅ Implemented |
| **Helm** | K8s package management — base chart + per-env overrides | ✅ Implemented |
| **GitHub Actions** | Cloud-agnostic CI/CD — GHCR primary, ACR/ECR/GCP optional | ✅ Implemented |
| **ArgoCD** | GitOps delivery — auto-sync with ordered sync-waves | ✅ Implemented |
| **Prometheus + Grafana** | Monitoring, alerting, 5 pre-built dashboards | ✅ Implemented |
| **Jaeger** | Distributed tracing (OpenTelemetry OTLP) | ✅ Implemented |
| **Loki + Promtail** | Log aggregation and querying | ✅ Implemented |
| **HashiCorp Vault** | Secrets management — dev mode locally, ESO in K8s | ✅ Implemented |
| **PgBouncer** | PostgreSQL connection pooling — 1000 max connections | ✅ Implemented |
| **Linkerd** | Service mesh — automatic mTLS, retries, timeouts | ✅ Implemented |
| **Resilience4j** | Circuit breaker, retry, rate limiter, time limiter | ✅ Implemented |
| **Trivy** | Container image vulnerability scanning | ✅ Implemented |
| **SonarQube** | Code quality & security analysis (optional) | ✅ Implemented |
| **External Secrets Operator** | Syncs Vault secrets into Kubernetes Secrets | ✅ Implemented |
| **Velero** | Kubernetes backup & disaster recovery | Planned |
| **Cert-Manager** | Automated TLS certificates | Planned |

---

## Production-Readiness Features

### Resilience (Resilience4j)
Every service has circuit breaker, retry, rate limiter, and time limiter configured:

```yaml
resilience4j:
  circuitbreaker:
    instances:
      default:
        slidingWindowSize: 10
        failureRateThreshold: 50       # Open after 50% failure rate
        waitDurationInOpenState: 30s   # Wait 30s before half-open
  retry:
    instances:
      default:
        maxAttempts: 3
        waitDuration: 500ms
        enableExponentialBackoff: true
  ratelimiter:
    instances:
      default:
        limitForPeriod: 100            # 100 req/s per instance
        limitRefreshPeriod: 1s
  timelimiter:
    instances:
      default:
        timeoutDuration: 5s
```

### Distributed Tracing (OpenTelemetry → Jaeger)
All 11 services export traces via OTLP to Jaeger. 100% sampling rate in non-production:

```yaml
management:
  tracing:
    sampling:
      probability: 1.0
  otlp:
    tracing:
      endpoint: http://jaeger:4318/v1/traces
```

Access the Jaeger UI at **http://localhost:16686** to trace requests across services.

### Observability (Grafana + Loki)
Grafana at **http://localhost:3001** includes:

| Dashboard | Source |
|-----------|--------|
| ZingyBank Overview (TPS, latency p99, error rate, circuit breakers) | Custom |
| JVM / Micrometer metrics | Grafana gnetId 4701 |
| Spring Boot Statistics | Grafana gnetId 12685 |
| Kafka Cluster Overview | Grafana gnetId 7589 |
| PostgreSQL Database | Grafana gnetId 9628 |
| Kubernetes Cluster | Grafana gnetId 7249 |

Alertmanager rules fire on: `ServiceDown`, `HighErrorRate` (>5%), `HighLatency` (p99 > 2s), `KafkaConsumerLag` (>1000), `CircuitBreakerOpen`, `HighJvmMemoryUsage` (>85% heap).

### Secrets Management (HashiCorp Vault)
- **Locally**: Vault runs in dev mode (port 8200, token `zingybank-vault-token`)
- **Kubernetes**: External Secrets Operator syncs Vault KV v2 → K8s Secrets
- Secrets covered: DB credentials, JWT secret, Redis password

```bash
# Seed secrets locally
bash infrastructure/kubernetes/secrets/vault-init.sh
```

### Connection Pooling (PgBouncer)
PgBouncer sits between all microservices and PostgreSQL:
- Transaction pool mode — lowest latency, highest throughput
- 1000 max client connections → 100 server connections to PostgreSQL
- Services connect to `pgbouncer:5432` (K8s) or `localhost:5433` (local)

### Service Mesh (Linkerd)
Linkerd is installed in the `zingybank` namespace providing:
- Automatic mTLS between all services (zero config)
- Per-route retry and timeout policies via ServiceProfiles
- Traffic metrics (success rate, RPS, latency) in the Linkerd dashboard

```bash
# Install Linkerd
bash infrastructure/kubernetes/linkerd/install.sh
```

---

## Banking Regulatory Compliance

| Requirement | Implementation |
|-------------|----------------|
| **PCI DSS** | Network segmentation (K8s NetworkPolicies), encryption at rest (AES-256) and in transit (TLS 1.3), access controls, audit trails |
| **KYC/AML** | Identity verification workflows, sanctions screening, PEP checks, suspicious activity reporting |
| **Audit Trail** | Immutable append-only log with SHA-256 hash chain — every financial operation is recorded with tamper detection |
| **Data Encryption** | Field-level encryption for PII, database encryption, card numbers stored encrypted (never plaintext) |
| **RBAC** | Role-based access control — CUSTOMER, TELLER, MANAGER, COMPLIANCE_OFFICER, ADMIN |
| **Pod Security** | Restricted Pod Security Standards, non-root containers, read-only root filesystem |
| **Backup** | Geo-redundant database backups (35-day retention), Velero cluster backups |

---

## Prerequisites

- **Java 21** — `winget install Microsoft.OpenJDK.21`
- **Maven 3.9+** — [Download](https://maven.apache.org/download.cgi)
- **Docker Desktop** — [Download](https://www.docker.com/products/docker-desktop/)
- **Node.js 20+** — [Download](https://nodejs.org/) (for frontend)
- **kubectl** — included with Docker Desktop
- **Helm** — `winget install Helm.Helm`
- **Terraform** — `winget install Hashicorp.Terraform` (for cloud deployments)

---

## Quick Start

### 1. Clone and build
```bash
git clone https://github.com/LycanTech/ZingyBank.git
cd ZingyBank
mvn clean compile -T 4
```

### 2. Start core infrastructure
```bash
docker-compose up -d postgres redis zookeeper kafka pgbouncer mailhog kafka-ui
```

### 3. Start observability stack
```bash
docker-compose up -d prometheus jaeger loki promtail grafana vault
```

### 4. Seed Vault secrets (first time only)
```bash
bash infrastructure/kubernetes/secrets/vault-init.sh
```

### 5. Start all microservices
```bash
docker-compose up -d
```

### 6. Start the frontend (development mode)
```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

### 7. Verify services
```bash
curl http://localhost:8080/actuator/health   # API Gateway
curl http://localhost:8081/api/v1/auth/health
curl http://localhost:8082/api/v1/accounts/health
```

### Local Dev URLs & Login Credentials

> All credentials below are for **local development only**. In Kubernetes environments all secrets are managed via HashiCorp Vault + External Secrets Operator.

#### Frontend & API Gateway

| Service | URL | Notes |
|---------|-----|-------|
| **Frontend (React)** | http://localhost:3002 | Register an account to log in |
| **Observability Page** | http://localhost:3002/observability | Requires ADMIN / MANAGER / COMPLIANCE_OFFICER role |
| **API Gateway** | http://localhost:8080 | Routes to all microservices |

#### Observability & Tooling

| Service | URL | Username | Password / Token |
|---------|-----|----------|-----------------|
| **Grafana** | http://localhost:3001 | `admin` | `Grafana@Admin2024!` |
| **Grafana — ZingyBank Overview** | http://localhost:3001/d/zingybank-overview/zingybank-e28094-service-overview | `admin` | `Grafana@Admin2024!` |
| **Prometheus** | http://localhost:9090 | *(no auth)* | — |
| **Prometheus — Targets** | http://localhost:9090/targets | *(no auth)* | — |
| **Jaeger UI** | http://localhost:16686 | *(no auth)* | — |
| **Kafka UI** | http://localhost:9091 | *(no auth)* | — |
| **MailHog** | http://localhost:8025 | *(no auth)* | — |
| **Vault UI** | http://localhost:8200/ui | *(token auth)* | `zingybank-local-vault-token` |

#### Microservices — Swagger UI & Health Checks

| Service | Port | Swagger UI | Health |
|---------|------|------------|--------|
| **api-gateway** | 8080 | http://localhost:8080/swagger-ui.html | http://localhost:8080/actuator/health |
| **auth-service** | 8081 | http://localhost:8081/swagger-ui.html | http://localhost:8081/actuator/health |
| **account-service** | 8082 | http://localhost:8082/swagger-ui.html | http://localhost:8082/actuator/health |
| **transaction-service** | 8083 | http://localhost:8083/swagger-ui.html | http://localhost:8083/actuator/health |
| **payment-service** | 8084 | http://localhost:8084/swagger-ui.html | http://localhost:8084/actuator/health |
| **loan-service** | 8085 | http://localhost:8085/swagger-ui.html | http://localhost:8085/actuator/health |
| **card-service** | 8086 | http://localhost:8086/swagger-ui.html | http://localhost:8086/actuator/health |
| **kyc-service** | 8087 | http://localhost:8087/swagger-ui.html | http://localhost:8087/actuator/health |
| **notification-service** | 8088 | http://localhost:8088/swagger-ui.html | http://localhost:8088/actuator/health |
| **statement-service** | 8089 | http://localhost:8089/swagger-ui.html | http://localhost:8089/actuator/health |
| **audit-service** | 8090 | http://localhost:8090/swagger-ui.html | http://localhost:8090/actuator/health |

#### Databases & Infrastructure

| Service | Host | Port | Username | Password |
|---------|------|------|----------|----------|
| **PostgreSQL** | `localhost` | `5432` | `zingybank` | `ZingyDev2024` |
| **PgBouncer** | `localhost` | `5433` | `zingybank` | `ZingyDev2024` |
| **Redis** | `localhost` | `6379` | — | `Chikwex@ZingyDev!` |

#### Application User Roles

| Role | Description | Access |
|------|-------------|--------|
| `CUSTOMER` | Default role on registration | Accounts, transactions, cards, loans, KYC, statements |
| `TELLER` | Bank teller | All customer data + manual transaction overrides |
| `MANAGER` | Branch manager | Teller access + loan approvals + Observability page |
| `COMPLIANCE_OFFICER` | AML/KYC reviewer | KYC workflows, suspicious activity + Observability page |
| `ADMIN` | System administrator | Full access including Observability page |

```sql
-- Grant ADMIN role to a user (run in zingybank_auth DB)
UPDATE user_roles SET role='ADMIN'
WHERE user_id = (SELECT id FROM users WHERE email = 'your@email.com');
```

#### Get an API Token

```bash
# 1. Register (password must be ≥ 12 characters)
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  --data-raw '{"email":"you@example.com","password":"SecurePass123!","firstName":"First","lastName":"Last","phoneNumber":"+13474711544"}'

# 2. Login — returns accessToken (15 min) and refreshToken (7 days)
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  --data-raw '{"email":"you@example.com","password":"SecurePass123!"}'

# 3. Use the token on any service
curl http://localhost:8082/api/v1/accounts \
  -H "Authorization: Bearer <accessToken>"
```

---

## Project Structure

```
ZingyBank/
├── frontend/                          # React / TypeScript / Vite web app
│   ├── src/
│   │   ├── api/                       # API client modules (per service)
│   │   ├── components/                # Reusable UI components
│   │   ├── pages/                     # Route-level page components
│   │   ├── stores/                    # Zustand state stores
│   │   ├── hooks/                     # Custom React hooks
│   │   └── types/                     # TypeScript type definitions
│   ├── Dockerfile                     # Nginx multi-stage build
│   └── vite.config.ts
│
├── services/                          # Java microservices
│   ├── api-gateway/
│   ├── auth-service/
│   ├── account-service/
│   ├── transaction-service/
│   ├── payment-service/
│   ├── loan-service/
│   ├── card-service/
│   ├── kyc-service/
│   ├── notification-service/
│   ├── statement-service/
│   └── audit-service/
│
├── infrastructure/
│   ├── terraform/                     # Infrastructure as Code
│   │   ├── modules/
│   │   │   ├── azure/                 # AKS, PostgreSQL, ACR, Key Vault
│   │   │   └── aws/                   # EKS, RDS, ECR (DR / multi-cloud)
│   │   └── environments/
│   │       ├── dev/
│   │       ├── staging/
│   │       └── prod/
│   ├── helm/
│   │   ├── charts/base-service/       # Shared Helm chart (HPA, PDB, deploy)
│   │   └── values/
│   │       ├── {service}.yaml         # Per-service base overrides
│   │       ├── staging/               # Staging env overrides (2 replicas)
│   │       └── prod/                  # Prod env overrides (3+ replicas, HPA)
│   ├── kubernetes/
│   │   ├── namespaces/
│   │   ├── network-policies/          # PCI DSS microsegmentation
│   │   ├── rbac/
│   │   ├── monitoring/                # Prometheus + Grafana + alert rules
│   │   ├── argocd/                    # AppProject + 11 Application manifests
│   │   ├── secrets/                   # ClusterSecretStore + ExternalSecrets
│   │   ├── pgbouncer/                 # Deployment, Service, PDB
│   │   └── linkerd/                   # Service mesh install + ServiceProfiles
│   └── docker/
│       └── postgres/                  # Multi-database init script
│
├── .github/workflows/
│   ├── ci.yml                         # Build → Test → Scan → Push (multi-cloud)
│   └── cd.yml                         # Staging (auto) → Production (manual gate)
│
├── docker-compose.yml                 # Full local dev stack (all services)
├── pom.xml                            # Parent Maven POM
└── README.md
```

---

## CI/CD Pipeline

```
┌─────────┐    ┌────────────────┐    ┌──────────────┐    ┌──────────────────────────┐
│  Push /  │───▶│  Build & Test  │───▶│   Security   │───▶│   Build & Push Images    │
│   PR     │    │  (Java + React)│    │   Scan       │    │                          │
└─────────┘    └────────────────┘    └──────────────┘    │  ┌─────────────────────┐ │
                 Maven + JUnit         Trivy + SonarQube  │  │ GHCR  (always)      │ │
                 npm build/type-check                     │  │ Azure ACR (optional)│ │
                                                          │  │ AWS ECR   (optional)│ │
                                                          │  │ GCP AR    (optional)│ │
                                                          │  └─────────────────────┘ │
                                                          └──────────────────────────┘
                                                                        │
                                                          ┌─────────────▼────────────┐
                                                          │  ArgoCD GitOps Deploy    │
                                                          │  staging (auto-sync)     │
                                                          │  prod (manual approval)  │
                                                          └──────────────────────────┘
```

### Multi-Cloud Image Registry Strategy

| Registry | When Active | How to Enable |
|----------|-------------|---------------|
| **GitHub Container Registry (GHCR)** | Always | Built-in `GITHUB_TOKEN` — no secrets needed |
| **Azure Container Registry** | Optional | Set `ACR_USERNAME` + `ACR_PASSWORD` secrets |
| **AWS Elastic Container Registry** | Optional | Set `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` + `AWS_ACCOUNT_ID` secrets |
| **GCP Artifact Registry** | Optional | Set `GCP_SA_KEY` + `GCP_PROJECT_ID` secrets |

### Deployment Promotion

```
main push ──▶ CI (build / test / scan / push to GHCR)
                 │
                 ▼
          staging (automatic)
          ArgoCD detects image tag update in helm/values/staging/
                 │
                 ▼ (manual approval in GitHub Environments)
          production
          ArgoCD detects image tag update in helm/values/prod/
          GitHub Release created automatically
```

### ArgoCD Sync Waves (ordered startup)

| Wave | Services |
|------|---------|
| 1 | api-gateway |
| 2 | auth-service |
| 3 | account-service, transaction-service, payment-service, loan-service, card-service, kyc-service |
| 4 | notification-service, statement-service, audit-service |

---

## Cloud Deployment

### Deploy to Azure (AKS)
```bash
cd infrastructure/terraform/environments/prod
terraform init
terraform apply -var-file="azure.tfvars"
```

### Deploy to AWS (EKS)
```bash
cd infrastructure/terraform/environments/prod
terraform init
terraform apply -var-file="aws.tfvars"
```

### Install to any Kubernetes cluster
```bash
# Install Linkerd service mesh
bash infrastructure/kubernetes/linkerd/install.sh

# Install monitoring stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack \
  -n zingybank-monitoring --create-namespace \
  -f infrastructure/kubernetes/monitoring/prometheus-values.yml

# Install External Secrets Operator + Vault
kubectl apply -f infrastructure/kubernetes/secrets/secret-store.yml
kubectl apply -f infrastructure/kubernetes/secrets/zingybank-secrets.yml

# Install PgBouncer
kubectl apply -f infrastructure/kubernetes/pgbouncer/deployment.yml

# Deploy all services via ArgoCD
kubectl apply -f infrastructure/kubernetes/argocd/zingybank-app.yml
```

### Cloud Architecture

| Cloud | Kubernetes | Registry | Database | Secrets |
|-------|-----------|----------|----------|---------|
| **Azure** | AKS | ACR | PostgreSQL Flexible Server | Azure Key Vault |
| **AWS** | EKS | ECR | RDS PostgreSQL | AWS Secrets Manager |
| **GCP** | GKE | Artifact Registry | Cloud SQL | Secret Manager |
| **Any** | Any K8s | GHCR (default) | Self-managed PostgreSQL | HashiCorp Vault |

---

## API Examples

### Register a new customer
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecureP@ssw0rd123",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890"
  }'
```

### Create an account
```bash
curl -X POST http://localhost:8080/api/v1/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "userId": "<user-id>",
    "accountType": "CHECKING",
    "currency": "USD",
    "initialDeposit": 1000.00
  }'
```

### Initiate a transfer
```bash
curl -X POST http://localhost:8080/api/v1/transactions/transfer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "sourceAccountNumber": "ZB1234567890",
    "destinationAccountNumber": "ZB0987654321",
    "amount": 250.00,
    "currency": "USD",
    "description": "Rent payment",
    "initiatedBy": "<user-id>"
  }'
```

### Apply for a loan
```bash
curl -X POST http://localhost:8080/api/v1/loans/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "userId": "<user-id>",
    "disbursementAccountNumber": "ZB1234567890",
    "loanType": "PERSONAL",
    "principalAmount": 25000.00,
    "termMonths": 36
  }'
```

---

## Contributing

1. Create a feature branch from `develop`: `git checkout -b feature/your-feature`
2. Write code with tests
3. Ensure `mvn clean verify` passes and `npm run build` succeeds in `frontend/`
4. Open a PR to `develop`
5. Requires: code review + all CI checks passing
6. Merges to `main` trigger automatic staging deployment via ArgoCD

---

## License

Proprietary - ZingyBank. All rights reserved.
