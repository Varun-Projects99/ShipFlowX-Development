output "resource_group_name" {
  value       = module.resource_group.name
  description = "The name of the main resource group."
}

output "vnet_id" {
  value       = var.enable_network ? (length(module.network) > 0 ? module.network[0].vnet_id : null) : null
  description = "The resource ID of the Virtual Network."
}

output "acr_login_server" {
  value       = var.enable_acr ? (length(module.acr) > 0 ? module.acr[0].login_server : null) : null
  description = "The login server URL for the container registry."
}

output "aks_cluster_name" {
  value       = var.enable_aks ? (length(module.aks) > 0 ? module.aks[0].name : null) : null
  description = "The name of the AKS cluster."
}

output "aks_kubelet_identity_object_id" {
  value       = var.enable_aks ? (length(module.aks) > 0 ? module.aks[0].kubelet_identity_object_id : null) : null
  description = "Kubelet Managed Identity Object ID for ACR access bindings."
}

output "storage_account_name" {
  value       = var.enable_storage ? (length(module.storage) > 0 ? module.storage[0].name : null) : null
  description = "The name of the storage account used for tfstate storage."
}

output "log_analytics_workspace_name" {
  value       = var.enable_monitoring ? (length(module.monitoring) > 0 ? module.monitoring[0].name : null) : null
  description = "The Log Analytics Workspace name."
}
