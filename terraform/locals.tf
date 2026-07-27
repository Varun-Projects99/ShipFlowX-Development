locals {
  resource_group_name = "${var.project_name}-${var.environment}-rg"
  vnet_name           = "${var.project_name}-${var.environment}-vnet"
  cluster_name        = "${var.project_name}-${var.environment}-aks"
  workspace_name      = "${var.project_name}-${var.environment}-workspace"
  identity_name       = "${var.project_name}-${var.environment}-identity"

  # Standard tags injected globally across all resources
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Owner       = "DevOps-Team"
  }
}
