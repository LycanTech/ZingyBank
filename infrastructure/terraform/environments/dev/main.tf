# ZingyBank Dev Environment - Azure (Primary)
# This orchestrates all Azure modules for the dev environment

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
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

variable "azure_subscription_id" {
  type        = string
  description = "Azure subscription ID"
}

variable "location" {
  type    = string
  default = "eastus2"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "db_admin_login" {
  type      = string
  sensitive = true
}

variable "db_admin_password" {
  type      = string
  sensitive = true
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "zingybank-${var.environment}-rg"
  location = var.location

  tags = {
    Environment = var.environment
    Project     = "ZingyBank"
    ManagedBy   = "Terraform"
  }
}

# Networking
module "networking" {
  source              = "../../modules/azure/networking"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  environment         = var.environment
}

# AKS Cluster
module "aks" {
  source               = "../../modules/azure/aks"
  resource_group_name  = azurerm_resource_group.main.name
  location             = var.location
  environment          = var.environment
  aks_system_subnet_id = module.networking.aks_system_subnet_id
  aks_app_subnet_id    = module.networking.aks_app_subnet_id
}

# PostgreSQL
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

# Container Registry
module "acr" {
  source              = "../../modules/azure/acr"
  resource_group_name = azurerm_resource_group.main.name
  location            = var.location
  environment         = var.environment
}

# Key Vault
module "keyvault" {
  source                    = "../../modules/azure/keyvault"
  resource_group_name       = azurerm_resource_group.main.name
  location                  = var.location
  environment               = var.environment
  aks_identity_principal_id = module.aks.cluster_identity_principal_id
}

# Outputs
output "aks_cluster_name" {
  value = module.aks.cluster_name
}

output "acr_login_server" {
  value = module.acr.acr_login_server
}

output "postgres_fqdn" {
  value = module.database.server_fqdn
}

output "key_vault_uri" {
  value = module.keyvault.key_vault_uri
}
