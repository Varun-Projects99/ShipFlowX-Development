# ==============================================================================
# ShipFlowX DevOps Infrastructure - Variables Configuration Template
# Copy this file to 'terraform.tfvars' and customize values for target environments.
# ==============================================================================

# Env context tag
environment  = "prod"
project_name = "shipflowx"
location     = "eastus2"

# Registry and Storage configurations (Must be globally unique)
# Replace values with unique lowercase strings (numbers allowed, no special chars)
storage_account_name = "sfxstateprod9988"
acr_name             = "sfxacrprod9988"

# AKS Cluster instance parameters
aks_node_count     = 2
aks_vm_size        = "Standard_D2s_v5"
kubernetes_version = "1.28"
