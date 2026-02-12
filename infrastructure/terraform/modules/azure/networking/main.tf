# Azure Networking Module
# Creates VNet with subnets for AKS, databases, and private endpoints
# Banking: Network segmentation is a PCI DSS requirement

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

variable "vnet_address_space" {
  type    = list(string)
  default = ["10.0.0.0/16"]
}

resource "azurerm_virtual_network" "main" {
  name                = "zingybank-vnet-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.location
  address_space       = var.vnet_address_space

  tags = {
    Environment = var.environment
    Project     = "ZingyBank"
    ManagedBy   = "Terraform"
  }
}

# AKS System Node Pool Subnet
resource "azurerm_subnet" "aks_system" {
  name                 = "aks-system-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
}

# AKS Application Node Pool Subnet
resource "azurerm_subnet" "aks_app" {
  name                 = "aks-app-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/23"]
}

# Database Subnet (PostgreSQL Flexible Server)
resource "azurerm_subnet" "database" {
  name                 = "database-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.4.0/24"]

  delegation {
    name = "postgresql-delegation"
    service_delegation {
      name    = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }
}

# Private Endpoints Subnet (Redis, Key Vault, ACR)
resource "azurerm_subnet" "private_endpoints" {
  name                 = "private-endpoints-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.5.0/24"]
}

# Network Security Group - AKS
resource "azurerm_network_security_group" "aks" {
  name                = "zingybank-aks-nsg-${var.environment}"
  location            = var.location
  resource_group_name = var.resource_group_name

  # Allow HTTPS inbound
  security_rule {
    name                       = "AllowHTTPS"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  # Deny all other inbound
  security_rule {
    name                       = "DenyAllInbound"
    priority                   = 4096
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = {
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

resource "azurerm_subnet_network_security_group_association" "aks_system" {
  subnet_id                 = azurerm_subnet.aks_system.id
  network_security_group_id = azurerm_network_security_group.aks.id
}

resource "azurerm_subnet_network_security_group_association" "aks_app" {
  subnet_id                 = azurerm_subnet.aks_app.id
  network_security_group_id = azurerm_network_security_group.aks.id
}

# Private DNS Zone for PostgreSQL
resource "azurerm_private_dns_zone" "postgres" {
  name                = "zingybank-${var.environment}.postgres.database.azure.com"
  resource_group_name = var.resource_group_name
}

resource "azurerm_private_dns_zone_virtual_network_link" "postgres" {
  name                  = "postgres-dns-link"
  private_dns_zone_name = azurerm_private_dns_zone.postgres.name
  virtual_network_id    = azurerm_virtual_network.main.id
  resource_group_name   = var.resource_group_name
}

output "vnet_id" {
  value = azurerm_virtual_network.main.id
}

output "aks_system_subnet_id" {
  value = azurerm_subnet.aks_system.id
}

output "aks_app_subnet_id" {
  value = azurerm_subnet.aks_app.id
}

output "database_subnet_id" {
  value = azurerm_subnet.database.id
}

output "private_endpoints_subnet_id" {
  value = azurerm_subnet.private_endpoints.id
}

output "postgres_dns_zone_id" {
  value = azurerm_private_dns_zone.postgres.id
}
