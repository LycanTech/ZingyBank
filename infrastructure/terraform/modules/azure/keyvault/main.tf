# Azure Key Vault Module
# Banking: Centralized secrets management, HSM-backed keys

variable "resource_group_name" {
  type = string
}

variable "location" {
  type    = string
  default = "eastus2"
}

variable "environment" {
  type = string
}

variable "aks_identity_principal_id" {
  type = string
}

data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "main" {
  name                        = "zingybank-kv-${var.environment}"
  location                    = var.location
  resource_group_name         = var.resource_group_name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = "premium" # HSM-backed keys for banking
  purge_protection_enabled    = true      # Banking: prevent accidental deletion
  soft_delete_retention_days  = 90

  # Allow AKS to read secrets
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = var.aks_identity_principal_id

    secret_permissions = [
      "Get",
      "List",
    ]

    key_permissions = [
      "Get",
      "List",
      "Encrypt",
      "Decrypt",
    ]
  }

  # Allow current user/pipeline to manage secrets
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get",
      "List",
      "Set",
      "Delete",
      "Purge",
    ]

    key_permissions = [
      "Get",
      "List",
      "Create",
      "Delete",
      "Encrypt",
      "Decrypt",
    ]
  }

  tags = {
    Environment = var.environment
    Project     = "ZingyBank"
    ManagedBy   = "Terraform"
  }
}

output "key_vault_id" {
  value = azurerm_key_vault.main.id
}

output "key_vault_uri" {
  value = azurerm_key_vault.main.vault_uri
}
