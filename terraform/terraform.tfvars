# ==============================================================================
# ShipFlowX DevOps Infrastructure - Variables Configuration (Active)
# Custom-tailored to maximize compatibility with Azure for Students subscriptions.
# ==============================================================================

# Env context tag
environment  = "prod"
project_name = "shipflowx"

# Default region optimized for student accounts capacity
location     = "centralindia"

# ==============================================================================
# Feature Flags (True = Deploy, False = Skip)
# Disable resources causing HTTP 403 RequestDisallowedByAzure errors.
# ==============================================================================
enable_storage    = false
enable_network    = false
enable_acr        = false
enable_monitoring = false
enable_identity   = false
enable_aks        = false

# ==============================================================================
# Sizing parameters (Used if corresponding flag above is enabled)
# ==============================================================================
storage_account_name = "sfxstateprod9988"
acr_name             = "sfxacrprod9988"
aks_node_count       = 2
aks_vm_size          = "Standard_D2s_v5"
kubernetes_version   = "1.28"
