# Azure Container Registry Module
# Stores Docker images for ZingyBank microservices

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

resource "azurerm_container_registry" "main" {
  name                = "zingybank${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = "Premium" # Required for geo-replication and private endpoints
  admin_enabled       = false     # Use managed identity instead

  # Geo-replication for DR
  georeplications {
    location                = "westus2"
    zone_redundancy_enabled = true
  }

  tags = {
    Environment = var.environment
    Project     = "ZingyBank"
    ManagedBy   = "Terraform"
  }
}

output "acr_id" {
  value = azurerm_container_registry.main.id
}

output "acr_login_server" {
  value = azurerm_container_registry.main.login_server
}
