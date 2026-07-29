# ==============================================================================
# ShipFlowX DevOps Infrastructure - Variables Configuration (Active)
# Custom-tailored to deploy lightweight, student-eligible resources.
# ==============================================================================

# Env context tag
environment  = "prod"
project_name = "shipflowx"

# Allowed student region (Default Central India)
location     = "centralindia"

# ==============================================================================
# Feature Flags (True = Deploy, False = Skip)
# Enable Resource Group, Storage, and Networking.
# Keep AKS, ACR, and Monitoring disabled to avoid quota blocks.
# ==============================================================================
enable_resource_group_module = true
enable_storage               = true
enable_network               = true
enable_acr                   = false
enable_monitoring            = false
enable_identity              = false
enable_aks                   = false

# ==============================================================================
# Sizing parameters (Customized to avoid global name collisions)
# ==============================================================================
storage_account_name = "sfxstate1ep23cs167"  # Unique storage account name based on Student ID
acr_name             = "sfxacr1ep23cs167"    # Unique ACR namespace
aks_node_count       = 2
aks_vm_size          = "Standard_D2s_v5"
kubernetes_version   = "1.28"
