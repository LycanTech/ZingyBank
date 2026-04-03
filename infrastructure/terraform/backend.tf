# Terraform State Backend - Azure Storage
# State is stored remotely for team collaboration and locking

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

  # Uncomment after creating the storage account:
   backend "azurerm" {
      resource_group_name  = "zingybank-terraform-state"
      storage_account_name = "zingybankstate"
      container_name       = "tfstate"
      key                  = "zingybank.terraform.tfstate"
   }
}
