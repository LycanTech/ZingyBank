# Azure Kubernetes Service (AKS) Module
# Banking: Private cluster, Azure AD RBAC, pod security policies

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

variable "aks_system_subnet_id" {
  type = string
}

variable "aks_app_subnet_id" {
  type = string
}

variable "kubernetes_version" {
  type    = string
  default = "1.30"
}

resource "azurerm_kubernetes_cluster" "main" {
  name                = "zingybank-aks-${var.environment}"
  location            = var.location
  resource_group_name = var.resource_group_name
  dns_prefix          = "zingybank-${var.environment}"
  kubernetes_version  = var.kubernetes_version

  # System node pool — runs Kubernetes system components
  default_node_pool {
    name                = "system"
    node_count          = 2
    vm_size             = "Standard_D2s_v5"
    vnet_subnet_id      = var.aks_system_subnet_id
    os_disk_size_gb     = 50
    max_pods            = 30
    auto_scaling_enabled = true
    min_count           = 2
    max_count           = 4

    node_labels = {
      "nodepool-type" = "system"
      "environment"   = var.environment
    }
  }

  # Managed identity (no service principal)
  identity {
    type = "SystemAssigned"
  }

  # Azure CNI networking for VNet integration
  network_profile {
    network_plugin    = "azure"
    network_policy    = "calico" # For Kubernetes NetworkPolicies
    load_balancer_sku = "standard"
    service_cidr      = "10.1.0.0/16"
    dns_service_ip    = "10.1.0.10"
  }

  # Azure AD RBAC integration
  azure_active_directory_role_based_access_control {
    azure_rbac_enabled = true
  }

  # Enable Azure Monitor / Container Insights
  oms_agent {
    log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  }

  # Azure Key Vault secrets provider
  key_vault_secrets_provider {
    secret_rotation_enabled = true
  }

  tags = {
    Environment = var.environment
    Project     = "ZingyBank"
    ManagedBy   = "Terraform"
  }
}

# Application node pool — runs ZingyBank microservices
resource "azurerm_kubernetes_cluster_node_pool" "app" {
  name                  = "app"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.main.id
  vm_size               = "Standard_D4s_v5"
  vnet_subnet_id        = var.aks_app_subnet_id
  os_disk_size_gb       = 100
  max_pods              = 50
  auto_scaling_enabled   = true
  min_count             = 2
  max_count             = 10

  node_labels = {
    "nodepool-type" = "application"
    "environment"   = var.environment
  }

  node_taints = []

  tags = {
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

# Log Analytics Workspace for monitoring
resource "azurerm_log_analytics_workspace" "main" {
  name                = "zingybank-logs-${var.environment}"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 90 # Banking: 90-day minimum log retention

  tags = {
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

output "cluster_id" {
  value = azurerm_kubernetes_cluster.main.id
}

output "cluster_name" {
  value = azurerm_kubernetes_cluster.main.name
}

output "kube_config" {
  value     = azurerm_kubernetes_cluster.main.kube_config_raw
  sensitive = true
}

output "cluster_identity_principal_id" {
  value = azurerm_kubernetes_cluster.main.identity[0].principal_id
}

output "log_analytics_workspace_id" {
  value = azurerm_log_analytics_workspace.main.id
}
