output "resource_group_name" {
  value       = module.resource_group.name
  description = "The name of the main resource group."
}

output "vnet_id" {
  value       = module.network.vnet_id
  description = "The resource ID of the Virtual Network."
}

output "acr_login_server" {
  value       = module.acr.login_server
  description = "The login server URL for the container registry."
}

output "aks_cluster_name" {
  value       = module.aks.name
  description = "The name of the AKS cluster."
}

output "aks_kubelet_identity_object_id" {
  value       = module.aks.kubelet_identity_object_id
  description = "Kubelet Managed Identity Object ID for ACR access bindings."
}

output "storage_account_name" {
  value       = module.storage.name
  description = "The name of the storage account used for tfstate storage."
}

output "log_analytics_workspace_name" {
  value       = module.monitoring.name
  description = "The Log Analytics Workspace name."
}
