# Azure PostgreSQL Flexible Server Module
# Banking: Encryption at rest, VNet integration, automated backups

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

variable "database_subnet_id" {
  type = string
}

variable "postgres_dns_zone_id" {
  type = string
}

variable "administrator_login" {
  type      = string
  sensitive = true
}

variable "administrator_password" {
  type      = string
  sensitive = true
}

resource "azurerm_postgresql_flexible_server" "main" {
  name                          = "zingybank-postgres-${var.environment}"
  resource_group_name           = var.resource_group_name
  location                      = var.location
  version                       = "16"
  delegated_subnet_id           = var.database_subnet_id
  private_dns_zone_id           = var.postgres_dns_zone_id
  public_network_access_enabled = false # Required when using VNet delegation
  administrator_login           = var.administrator_login
  administrator_password        = var.administrator_password
  zone                          = "1"
  storage_mb                    = 65536
  sku_name                      = "GP_Standard_D2s_v3"
  backup_retention_days         = 35  # Banking: Extended backup retention
  geo_redundant_backup_enabled  = false # Dev: disable geo-redundant backups (enable in prod)

  tags = {
    Environment = var.environment
    Project     = "ZingyBank"
    ManagedBy   = "Terraform"
  }
}

# Create individual databases for each microservice
locals {
  databases = [
    "zingybank_auth",
    "zingybank_account",
    "zingybank_transaction",
    "zingybank_payment",
    "zingybank_loan",
    "zingybank_card",
    "zingybank_kyc",
    "zingybank_notification",
    "zingybank_statement",
    "zingybank_audit",
  ]
}

resource "azurerm_postgresql_flexible_server_database" "services" {
  for_each  = toset(local.databases)
  name      = each.value
  server_id = azurerm_postgresql_flexible_server.main.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

# Server configuration for security
resource "azurerm_postgresql_flexible_server_configuration" "ssl" {
  name      = "require_secure_transport"
  server_id = azurerm_postgresql_flexible_server.main.id
  value     = "on"
}

resource "azurerm_postgresql_flexible_server_configuration" "log_connections" {
  name      = "log_connections"
  server_id = azurerm_postgresql_flexible_server.main.id
  value     = "on"
}

resource "azurerm_postgresql_flexible_server_configuration" "log_disconnections" {
  name      = "log_disconnections"
  server_id = azurerm_postgresql_flexible_server.main.id
  value     = "on"
}

output "server_fqdn" {
  value = azurerm_postgresql_flexible_server.main.fqdn
}

output "server_id" {
  value = azurerm_postgresql_flexible_server.main.id
}
