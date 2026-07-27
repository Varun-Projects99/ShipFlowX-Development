# 1. Resource Group Module (Always enabled as a logical boundary)
module "resource_group" {
  source   = "./modules/resource-group"
  name     = local.resource_group_name
  location = var.location
  tags     = local.common_tags
}

# 2. Network Module (Conditional VNet, Subnets, NSGs)
module "network" {
  source              = "./modules/network"
  count               = var.enable_network ? 1 : 0
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  vnet_name           = local.vnet_name
  tags                = local.common_tags
}

# 3. Container Registry Module (Conditional ACR)
module "acr" {
  source              = "./modules/acr"
  count               = var.enable_acr ? 1 : 0
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  acr_name            = var.acr_name
  tags                = local.common_tags
}

# 4. Identity Module (Conditional Managed Identity)
module "identity" {
  source              = "./modules/identity"
  count               = var.enable_identity ? 1 : 0
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  identity_name       = local.identity_name
  tags                = local.common_tags
}

# 5. Monitoring Module (Conditional Log Analytics Workspace)
module "monitoring" {
  source              = "./modules/monitoring"
  count               = var.enable_monitoring ? 1 : 0
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  workspace_name      = local.workspace_name
  tags                = local.common_tags
}

# 6. Storage Module (Conditional State Backend Account)
module "storage" {
  source               = "./modules/storage"
  count                = var.enable_storage ? 1 : 0
  resource_group_name  = module.resource_group.name
  location             = module.resource_group.location
  storage_account_name = var.storage_account_name
  tags                 = local.common_tags
}

# 7. Kubernetes Service Module (Conditional AKS Cluster)
module "aks" {
  source                     = "./modules/aks"
  count                      = var.enable_aks ? 1 : 0
  resource_group_name        = module.resource_group.name
  location                   = module.resource_group.location
  cluster_name               = local.cluster_name
  dns_prefix                 = "${var.project_name}-dns"
  subnet_id                  = var.enable_network ? module.network[0].aks_subnet_id : null
  kubernetes_version         = var.kubernetes_version
  node_count                 = var.aks_node_count
  vm_size                    = var.aks_vm_size
  log_analytics_workspace_id = var.enable_monitoring ? module.monitoring[0].id : null
  tags                       = local.common_tags
}

# ==============================================================================
# Conditional Role Assignments (IAM security integrations)
# ==============================================================================

# Link AKS Kubelet Managed Identity to pull container images from ACR
# Executed only when both AKS and ACR are enabled
resource "azurerm_role_assignment" "aks_acr_pull" {
  count                            = var.enable_aks && var.enable_acr ? 1 : 0
  principal_id                     = module.aks[0].kubelet_identity_object_id
  role_definition_name             = "AcrPull"
  scope                            = module.acr[0].id
  skip_service_principal_aad_check = true
}

# Assign Reader permissions to the User-Assigned Managed Identity at RG scope
# Executed only when Managed Identity is enabled
resource "azurerm_role_assignment" "identity_rg_reader" {
  count                = var.enable_identity ? 1 : 0
  principal_id         = module.identity[0].principal_id
  role_definition_name = "Reader"
  scope                = module.resource_group.id
}
