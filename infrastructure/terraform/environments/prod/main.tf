# ZingyBank Production Environment — Azure (Primary) + AWS (DR)
# Production: higher-spec nodes, zone redundancy, deletion protection, AWS DR

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "zingybank-terraform-state"
    storage_account_name = "zingybankstate"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy = false
    }
  }
  subscription_id = var.azure_subscription_id
}

provider "aws" {
  region = var.aws_region
}

# ─── Variables ───────────────────────────────────────────────────────────────

variable "azure_subscription_id" {
  type        = string
  description = "Azure subscription ID"
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "location" {
  type    = string
  default = "eastus2"
}

variable "environment" {
  type    = string
  default = "prod"
}

variable "db_admin_login" {
  type      = string
  sensitive = true
}

variable "db_admin_password" {
  type      = string
  sensitive = true
}

# ─── Azure — Primary Region ───────────────────────────────────────────────────

resource "azurerm_resource_group" "main" {
  name     = "zingybank-${var.environment}-rg"
  location = var.location

  tags = {
    Environment = var.environment
    Project     = "ZingyBank"
    ManagedBy   = "Terraform"
    CostCenter  = "Engineering"
  }
}

module "networking" {
  source              = "../../modules/azure/networking"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  environment         = var.environment
  vnet_address_space  = ["10.2.0.0/16"] # Prod: 10.2.x.x, staging: 10.1.x.x, dev: 10.0.x.x
}

module "aks" {
  source               = "../../modules/azure/aks"
  resource_group_name  = azurerm_resource_group.main.name
  location             = var.location
  environment          = var.environment
  aks_system_subnet_id = module.networking.aks_system_subnet_id
  aks_app_subnet_id    = module.networking.aks_app_subnet_id
  kubernetes_version   = "1.30"
}

module "database" {
  source                 = "../../modules/azure/database"
  resource_group_name    = azurerm_resource_group.main.name
  location               = var.location
  environment            = var.environment
  database_subnet_id     = module.networking.database_subnet_id
  postgres_dns_zone_id   = module.networking.postgres_dns_zone_id
  administrator_login    = var.db_admin_login
  administrator_password = var.db_admin_password
}

module "acr" {
  source              = "../../modules/azure/acr"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  environment         = var.environment
}

module "keyvault" {
  source                    = "../../modules/azure/keyvault"
  resource_group_name       = azurerm_resource_group.main.name
  location                  = var.location
  environment               = var.environment
  aks_identity_principal_id = module.aks.cluster_identity_principal_id
}

# ─── AWS — Disaster Recovery Region ─────────────────────────────────────────

module "aws_networking" {
  source      = "../../modules/aws/networking"
  environment = "${var.environment}-dr"
  vpc_cidr    = "10.20.0.0/16"
}

module "aws_ecr" {
  source               = "../../modules/aws/ecr"
  environment          = var.environment
  image_tag_mutability = "IMMUTABLE" # Prod: immutable tags prevent overwriting releases
}

module "aws_eks" {
  source             = "../../modules/aws/eks"
  environment        = "${var.environment}-dr"
  vpc_id             = module.aws_networking.vpc_id
  private_subnet_ids = module.aws_networking.private_eks_subnet_ids
  eks_node_sg_id     = module.aws_networking.eks_node_sg_id
  kubernetes_version = "1.30"
}

module "aws_rds" {
  source                 = "../../modules/aws/rds"
  environment            = "${var.environment}-dr"
  private_rds_subnet_ids = module.aws_networking.private_rds_subnet_ids
  rds_sg_id              = module.aws_networking.rds_sg_id
  administrator_username = var.db_admin_login
  administrator_password = var.db_admin_password
  instance_class         = "db.r6g.xlarge" # Prod: memory-optimized
}

# ─── Outputs ──────────────────────────────────────────────────────────────────

output "azure_aks_cluster_name" {
  value = module.aks.cluster_name
}

output "azure_acr_login_server" {
  value = module.acr.acr_login_server
}

output "azure_postgres_fqdn" {
  value     = module.database.server_fqdn
  sensitive = true
}

output "azure_key_vault_uri" {
  value = module.keyvault.key_vault_uri
}

output "aws_eks_cluster_name" {
  value = module.aws_eks.cluster_name
}

output "aws_ecr_repository_urls" {
  value = module.aws_ecr.repository_urls
}

output "aws_rds_endpoint" {
  value     = module.aws_rds.db_endpoint
  sensitive = true
}
