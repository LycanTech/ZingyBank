# AWS ECR Module
# Creates private ECR repositories for all ZingyBank microservices
# Banking: Image scanning enabled, immutable tags in production

variable "environment" {
  type = string
}

variable "image_tag_mutability" {
  type    = string
  default = "MUTABLE" # Set to IMMUTABLE in prod via environment override
}

locals {
  services = [
    "api-gateway",
    "auth-service",
    "account-service",
    "transaction-service",
    "payment-service",
    "loan-service",
    "card-service",
    "kyc-service",
    "notification-service",
    "statement-service",
    "audit-service",
  ]
}

# ECR Repository per microservice
resource "aws_ecr_repository" "services" {
  for_each             = toset(local.services)
  name                 = "zingybank/${each.value}"
  image_tag_mutability = var.image_tag_mutability

  # Banking: Scan on push for vulnerability detection
  image_scanning_configuration {
    scan_on_push = true
  }

  # Encryption at rest
  encryption_configuration {
    encryption_type = "KMS"
    kms_key         = aws_kms_key.ecr.arn
  }

  tags = {
    Service     = each.value
    Environment = var.environment
    Project     = "ZingyBank"
    ManagedBy   = "Terraform"
  }
}

# KMS key for ECR encryption
resource "aws_kms_key" "ecr" {
  description             = "ZingyBank ECR encryption key - ${var.environment}"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = {
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

resource "aws_kms_alias" "ecr" {
  name          = "alias/zingybank-ecr-${var.environment}"
  target_key_id = aws_kms_key.ecr.key_id
}

# Lifecycle policy — keep last 10 untagged images, delete older ones
resource "aws_ecr_lifecycle_policy" "services" {
  for_each   = toset(local.services)
  repository = aws_ecr_repository.services[each.value].name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Remove untagged images older than 7 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 7
        }
        action = { type = "expire" }
      },
      {
        rulePriority = 2
        description  = "Keep last 20 tagged images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["main-", "release-", "v"]
          countType     = "imageCountMoreThan"
          countNumber   = 20
        }
        action = { type = "expire" }
      }
    ]
  })
}

# Repository policy — restrict to account only
resource "aws_ecr_repository_policy" "services" {
  for_each   = toset(local.services)
  repository = aws_ecr_repository.services[each.value].name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowAccountAccess"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:DescribeRepositories",
          "ecr:GetRepositoryPolicy",
          "ecr:ListImages",
          "ecr:DeleteRepository",
          "ecr:BatchDeleteImage",
          "ecr:SetRepositoryPolicy",
          "ecr:DeleteRepositoryPolicy"
        ]
      }
    ]
  })
}

data "aws_caller_identity" "current" {}

# Outputs
output "repository_urls" {
  value = { for name, repo in aws_ecr_repository.services : name => repo.repository_url }
}

output "registry_id" {
  value = values(aws_ecr_repository.services)[0].registry_id
}
