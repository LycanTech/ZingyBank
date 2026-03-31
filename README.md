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
│   │   │   ├── azure/                 # networking, aks, database, acr, keyvault
│   │   │   └── aws/                   # networking, eks, rds, ecr
│   │   └── environments/
│   │       ├── dev/                   # Azure only, lowest cost
│   │       ├── staging/               # Azure, mirrors prod (10.1.0.0/16)
│   │       └── prod/                  # Azure primary + AWS DR (10.2 + 10.20)
│   ├── helm/
│   │   ├── charts/base-service/       # Shared Helm chart (HPA, PDB, deploy)
│   │   └── values/
│   │       ├── {service}.yaml         # Per-service base overrides
│   │       ├── staging/               # Staging env overrides (2 replicas)
│   │       └── prod/                  # Prod env overrides (3+ replicas, HPA)
│   ├── kubernetes/
│   │   ├── namespaces/                # zingybank, zingybank-monitoring, zingybank-ingress
│   │   ├── network-policies/          # PCI DSS default-deny + microsegmentation
│   │   ├── rbac/                      # Roles (viewer/developer/operator/cicd) + bindings
│   │   ├── ingress/                   # NGINX ingress + cert-manager ClusterIssuers
│   │   ├── monitoring/                # Prometheus Helm values
│   │   ├── argocd/                    # AppProject + 11 Application manifests (sync waves)
│   │   ├── secrets/                   # ClusterSecretStore + ExternalSecrets + vault-init.sh
│   │   ├── pgbouncer/                 # Deployment, Service, PDB
│   │   └── linkerd/                   # Service mesh install + ServiceProfiles
│   └── docker/
│       └── postgres/                  # Multi-database init script (10 databases)
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

## Infrastructure

### Terraform Environments

| Environment | Cloud | Purpose | State Key |
|-------------|-------|---------|-----------|
| `environments/dev` | Azure | Local testing, lowest cost nodes | `zingybank.terraform.tfstate` |
| `environments/staging` | Azure | Pre-release testing, mirrors prod topology | `staging.terraform.tfstate` |
| `environments/prod` | Azure (primary) + AWS (DR) | Production + disaster recovery | `prod.terraform.tfstate` |

### Terraform Modules

| Module | Path | What it provisions |
|--------|------|--------------------|
| `azure/networking` | `modules/azure/networking` | VNet, 4 subnets (system/app/DB/private-endpoints), NSGs, PostgreSQL private DNS zone |
| `azure/aks` | `modules/azure/aks` | Private AKS cluster, system+app node pools, Azure AD RBAC, Log Analytics, Key Vault CSI |
| `azure/database` | `modules/azure/database` | PostgreSQL Flexible Server 16, 10 databases, geo-redundant backups (35-day retention) |
| `azure/acr` | `modules/azure/acr` | Premium ACR with geo-replication to westus2 |
| `azure/keyvault` | `modules/azure/keyvault` | HSM-backed Key Vault, AKS managed identity access policy |
| `aws/networking` | `modules/aws/networking` | VPC, 3-AZ public/private subnets, NAT gateways per-AZ, EKS+RDS security groups |
| `aws/eks` | `modules/aws/eks` | Private EKS cluster, system+app node groups, IRSA OIDC provider, KMS secrets encryption |
| `aws/rds` | `modules/aws/rds` | Multi-AZ RDS PostgreSQL 16, KMS encryption, 35-day backups, enhanced monitoring |
| `aws/ecr` | `modules/aws/ecr` | 11 ECR repos (one per service), scan-on-push, lifecycle policies, immutable tags in prod |

### Deploy to Azure (AKS)

```bash
# 1. Provision cloud infrastructure
cd infrastructure/terraform/environments/staging   # or prod
terraform init
terraform apply \
  -var="azure_subscription_id=<your-subscription-id>" \
  -var="db_admin_login=zingybank" \
  -var="db_admin_password=<strong-password>"

# 2. Get kubeconfig
az aks get-credentials \
  --resource-group zingybank-staging-rg \
  --name zingybank-aks-staging

# 3. Apply namespaces and security policies
kubectl apply -f infrastructure/kubernetes/namespaces/zingybank.yml
kubectl apply -f infrastructure/kubernetes/network-policies/default-deny.yml

# 4. Apply RBAC
kubectl apply -f infrastructure/kubernetes/rbac/roles.yml
kubectl apply -f infrastructure/kubernetes/rbac/role-bindings.yml

# 5. Install NGINX Ingress + cert-manager
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace zingybank-ingress --create-namespace

helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --set crds.enabled=true

kubectl apply -f infrastructure/kubernetes/ingress/cert-issuer.yml
kubectl apply -f infrastructure/kubernetes/ingress/ingress.yml   # Update domain first

# 6. Seed Vault secrets
bash infrastructure/kubernetes/secrets/vault-init.sh
kubectl apply -f infrastructure/kubernetes/secrets/secret-store.yml
kubectl apply -f infrastructure/kubernetes/secrets/zingybank-secrets.yml

# 7. Install PgBouncer
kubectl apply -f infrastructure/kubernetes/pgbouncer/deployment.yml

# 8. Install monitoring stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack \
  -n zingybank-monitoring --create-namespace \
  -f infrastructure/kubernetes/monitoring/prometheus-values.yml

# 9. Install Linkerd service mesh
bash infrastructure/kubernetes/linkerd/install.sh
kubectl apply -f infrastructure/kubernetes/linkerd/mesh-config.yml

# 10. Deploy all services via ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl apply -f infrastructure/kubernetes/argocd/zingybank-app.yml
```

### Deploy to AWS (EKS — DR Region)

```bash
cd infrastructure/terraform/environments/prod
terraform init
terraform apply \
  -var="azure_subscription_id=<id>" \
  -var="aws_region=us-east-1" \
  -var="db_admin_login=zingybank" \
  -var="db_admin_password=<strong-password>"

# Get kubeconfig for EKS
aws eks update-kubeconfig \
  --region us-east-1 \
  --name zingybank-eks-prod-dr

# Then apply the same kubectl steps 3–10 above
```

### Kubernetes Resource Map

| Resource | File | Purpose |
|----------|------|---------|
| Namespaces | `kubernetes/namespaces/zingybank.yml` | zingybank, zingybank-monitoring, zingybank-ingress |
| Network Policies | `kubernetes/network-policies/default-deny.yml` | Default deny-all + microsegmentation rules |
| RBAC Roles | `kubernetes/rbac/roles.yml` | viewer, developer, operator, cicd, monitoring |
| RBAC Bindings | `kubernetes/rbac/role-bindings.yml` | Service accounts + group bindings |
| Ingress | `kubernetes/ingress/ingress.yml` | NGINX ingress with TLS, security headers, rate limiting |
| TLS Issuers | `kubernetes/ingress/cert-issuer.yml` | cert-manager Let's Encrypt staging + prod issuers |
| Secrets | `kubernetes/secrets/zingybank-secrets.yml` | ExternalSecret syncs from Vault |
| PgBouncer | `kubernetes/pgbouncer/deployment.yml` | Connection pooler, 2 replicas, PDB |
| ArgoCD | `kubernetes/argocd/zingybank-app.yml` | 11 applications with ordered sync waves |
| Linkerd | `kubernetes/linkerd/mesh-config.yml` | Service mesh, mTLS, ServiceProfiles |

### Cloud Architecture

| Cloud | Kubernetes | Registry | Database | Secrets | Role |
|-------|-----------|----------|----------|---------|------|
| **Azure** | AKS (private) | ACR Premium | PostgreSQL Flexible Server | Azure Key Vault | Primary |
| **AWS** | EKS (private) | ECR | RDS PostgreSQL Multi-AZ | AWS Secrets Manager | DR |
| **Any** | Any K8s | GHCR (default) | Self-managed PostgreSQL | HashiCorp Vault | Local / Other |

### CIDR Allocation

| Environment | VNet/VPC CIDR | AKS/EKS Nodes | Database |
|-------------|--------------|---------------|---------|
| dev | `10.0.0.0/16` | `10.0.1-2.0/24` | `10.0.4.0/24` |
| staging | `10.1.0.0/16` | `10.1.1-2.0/24` | `10.1.4.0/24` |
| prod (Azure) | `10.2.0.0/16` | `10.2.1-2.0/24` | `10.2.4.0/24` |
| prod-dr (AWS) | `10.20.0.0/16` | `10.20.10-12.0/24` | `10.20.20-22.0/24` |

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
