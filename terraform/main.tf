# 1. Resource Group Module
module "resource_group" {
  source   = "./modules/resource-group"
  name     = local.resource_group_name
  location = var.location
  tags     = local.common_tags
}

# 2. Network Module (VNet, Subnets, NSGs)
module "network" {
  source              = "./modules/network"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  vnet_name           = local.vnet_name
  tags                = local.common_tags
}

# 3. Container Registry Module
module "acr" {
  source              = "./modules/acr"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  acr_name            = var.acr_name
  tags                = local.common_tags
}

# 4. Identity Module (Managed Identity)
module "identity" {
  source              = "./modules/identity"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  identity_name       = local.identity_name
  tags                = local.common_tags
}

# 5. Monitoring Module (Log Analytics Workspace)
module "monitoring" {
  source              = "./modules/monitoring"
  resource_group_name = module.resource_group.name
  location            = module.resource_group.location
  workspace_name      = local.workspace_name
  tags                = local.common_tags
}

# 6. Storage Module (Terraform Remote State Account)
module "storage" {
  source               = "./modules/storage"
  resource_group_name  = module.resource_group.name
  location             = module.resource_group.location
  storage_account_name = var.storage_account_name
  tags                 = local.common_tags
}

# 7. Kubernetes Service Module (AKS Cluster)
module "aks" {
  source                     = "./modules/aks"
  resource_group_name        = module.resource_group.name
  location                   = module.resource_group.location
  cluster_name               = local.cluster_name
  dns_prefix                 = "${var.project_name}-dns"
  subnet_id                  = module.network.aks_subnet_id
  kubernetes_version         = var.kubernetes_version
  node_count                 = var.aks_node_count
  vm_size                    = var.aks_vm_size
  log_analytics_workspace_id = module.monitoring.id
  tags                       = local.common_tags
}

# ==============================================================================
# Role Assignments (IAM security integrations)
# ==============================================================================

# Link AKS Kubelet Managed Identity to pull container images from ACR
resource "azurerm_role_assignment" "aks_acr_pull" {
  principal_id                     = module.aks.kubelet_identity_object_id
  role_definition_name             = "AcrPull"
  scope                            = module.acr.id
  skip_service_principal_aad_check = true
}

# Assign Reader permissions to the User-Assigned Managed Identity at RG scope
resource "azurerm_role_assignment" "identity_rg_reader" {
  principal_id         = module.identity.principal_id
  role_definition_name = "Reader"
  scope                = module.resource_group.id
}
