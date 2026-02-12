# ZingyBank - Full Retail Banking Platform

A production-grade retail banking application built with **Java 21 + Spring Boot 3.4** microservices, deployed on **Azure (primary)** with **AWS (disaster recovery)**, implementing full DevOps toolchain and banking regulatory compliance.

---

## Architecture

```
                                    ┌─────────────────────┐
                                    │   Load Balancer /    │
                                    │   Ingress (NGINX)    │
                                    └──────────┬──────────┘
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
                 ┌──────────┬──────────┐
                 │          │          │
          ┌──────▼──┐ ┌────▼────┐ ┌───▼─────┐
          │PostgreSQL│ │  Redis  │ │  Kafka  │
          │ (per-svc)│ │ Cache   │ │ Events  │
          └─────────┘ └─────────┘ └─────────┘
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
| **Database** | PostgreSQL 16, Flyway migrations |
| **Cache** | Redis 7 |
| **Messaging** | Apache Kafka |
| **Auth** | Spring Security, JWT (jjwt), BCrypt |
| **API Docs** | SpringDoc OpenAPI (Swagger UI) |
| **Monitoring** | Prometheus, Grafana, Micrometer |
| **Tracing** | Jaeger |
| **Logging** | Loki, SLF4J/Logback |

---

## DevOps Toolchain

| Tool | Purpose |
|------|---------|
| **Git / GitHub** | Source control, branch protection, PR reviews |
| **Docker** | Containerize each microservice (multi-stage builds) |
| **Kubernetes** | Orchestration — AKS (primary), EKS (DR) |
| **Terraform** | Infrastructure as Code for Azure + AWS |
| **Helm** | Kubernetes package management |
| **GitHub Actions** | CI pipelines — build, test, scan, push images |
| **ArgoCD** | GitOps continuous delivery to Kubernetes |
| **Prometheus + Grafana** | Monitoring, alerting, dashboards |
| **HashiCorp Vault** | Secrets management |
| **Trivy** | Container image vulnerability scanning |
| **SonarQube** | Code quality & security analysis |
| **Velero** | Kubernetes backup & disaster recovery |
| **Cert-Manager** | Automated TLS certificates |

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
- **Terraform** — `winget install Hashicorp.Terraform`
- **kubectl** — included with Docker Desktop
- **Helm** — `winget install Helm.Helm`
- **Azure CLI** — `winget install Microsoft.AzureCLI`
- **AWS CLI** — `winget install Amazon.AWSCLI.v2`

---

## Quick Start

### 1. Clone and build
```bash
git clone https://github.com/YOUR_ORG/ZingyBankingApp.git
cd ZingyBankingApp
mvn clean compile -T 4
```

### 2. Start infrastructure
```bash
docker-compose up -d postgres redis zookeeper kafka mailhog kafka-ui
```

### 3. Verify infrastructure
```bash
docker-compose ps
docker exec zingybank-postgres psql -U zingybank -c "\l"
```

### 4. Start all microservices
```bash
docker-compose up -d
```

### 5. Verify services
```bash
# Health checks
curl http://localhost:8080/actuator/health   # API Gateway
curl http://localhost:8081/api/v1/auth/health # Auth Service
curl http://localhost:8082/api/v1/accounts/health
```

### Local Dev URLs

| Service | URL |
|---------|-----|
| API Gateway | http://localhost:8080 |
| Kafka UI | http://localhost:9091 |
| MailHog (email testing) | http://localhost:8025 |
| Swagger UI (per service) | http://localhost:{port}/swagger-ui.html |
| Prometheus Metrics | http://localhost:{port}/actuator/prometheus |

---

## Project Structure

```
ZingyBankingApp/
├── services/                          # Microservices
│   ├── api-gateway/                   # Spring Cloud Gateway
│   ├── auth-service/                  # Authentication & authorization
│   ├── account-service/               # Account management
│   ├── transaction-service/           # Transfers & transactions
│   ├── payment-service/               # Bill payments
│   ├── loan-service/                  # Loan management
│   ├── card-service/                  # Card issuance & management
│   ├── kyc-service/                   # KYC/AML compliance
│   ├── notification-service/          # Email/SMS notifications
│   ├── statement-service/             # Account statements
│   └── audit-service/                 # Immutable audit log
│
├── infrastructure/
│   ├── terraform/                     # Infrastructure as Code
│   │   ├── modules/
│   │   │   ├── azure/                 # Azure resources (AKS, PostgreSQL, ACR, etc.)
│   │   │   └── aws/                   # AWS resources (EKS, RDS, ECR) — DR
│   │   └── environments/
│   │       ├── dev/
│   │       ├── staging/
│   │       └── prod/
│   ├── helm/                          # Helm charts for K8s deployments
│   │   ├── charts/base-service/       # Shared chart template
│   │   └── values/                    # Per-service value overrides
│   ├── kubernetes/                    # Raw K8s manifests
│   │   ├── namespaces/
│   │   ├── network-policies/          # PCI DSS microsegmentation
│   │   ├── rbac/
│   │   └── monitoring/                # Prometheus + Grafana config
│   └── docker/
│       └── postgres/                  # Multi-database init script
│
├── .github/workflows/                 # CI/CD pipelines
│   └── ci.yml                         # Build → Test → Scan → Push
│
├── argocd/                            # GitOps deployment manifests
│   └── applications/
│
├── docker-compose.yml                 # Local development environment
├── pom.xml                            # Parent Maven POM
└── README.md
```

---

## Cloud Architecture

### Primary: Azure

| Resource | Purpose |
|----------|---------|
| **AKS** | Kubernetes cluster (system + app node pools) |
| **Azure PostgreSQL Flexible Server** | Managed database (geo-redundant backups) |
| **Azure Cache for Redis** | Managed Redis |
| **Azure Container Registry** | Docker image registry |
| **Azure Key Vault** | Secrets management (HSM-backed) |
| **Azure VNet** | Network isolation with NSGs |
| **Log Analytics** | Centralized logging (90-day retention) |

### Disaster Recovery: AWS

| Resource | Purpose |
|----------|---------|
| **EKS** | Kubernetes cluster (standby) |
| **RDS PostgreSQL** | Database replica |
| **ECR** | Docker image mirror |
| **VPC** | Network isolation |

### Failover Strategy

- **Velero** backs up AKS state to AWS S3
- **Database replication** from Azure PostgreSQL to AWS RDS
- **DNS failover** via Azure Traffic Manager / Route 53
- **RPO:** < 15 minutes | **RTO:** < 30 minutes

---

## CI/CD Pipeline

```
┌─────────┐    ┌──────────┐    ┌───────────┐    ┌─────────────┐    ┌─────────┐
│  Push /  │───▶│  Build & │───▶│  Security │───▶│ Build Docker│───▶│ ArgoCD  │
│   PR     │    │   Test   │    │   Scan    │    │ Push to ACR │    │ GitOps  │
└─────────┘    └──────────┘    └───────────┘    └─────────────┘    │ Deploy  │
                                                                    └─────────┘
                 Maven +          Trivy +          Multi-stage        Auto-sync
                 JUnit            SonarQube        Dockerfile         to AKS
```

### Promotion Strategy
```
dev  →  staging  →  production
 │        │            │
 │        │            └── Manual approval + compliance sign-off
 │        └── Automated integration tests
 └── Every push to develop branch
```

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
3. Ensure `mvn clean verify` passes
4. Open a PR to `develop`
5. Requires: code review + all CI checks passing
6. Merges to `main` trigger production deployment via ArgoCD

---

## License

Proprietary - ZingyBank. All rights reserved.
