# ==============================================================================
# Terraform Remote Backend Configuration Template
# ==============================================================================
# In enterprise deployments, the state file should be stored in an Azure Blob 
# Container with locks enabled, rather than locally.
#
# To enable remote state:
# 1. Run terraform apply once with local backend to provision storage resources.
# 2. Uncomment the block below, fill in the values, and run 'terraform init -migrate-state'.
# ==============================================================================

# terraform {
#   backend "azurerm" {
#     resource_group_name  = "shipflowx-devops-rg"
#     storage_account_name = "sfxbackendstate2026"  # Must match storage module outputs
#     container_name       = "tfstate"
#     key                  = "production.terraform.tfstate"
#   }
# }
