output "id" {
  value       = azurerm_kubernetes_cluster.aks.id
  description = "The resource ID of the AKS cluster."
}

output "name" {
  value       = azurerm_kubernetes_cluster.aks.name
  description = "The name of the AKS cluster."
}

output "kubelet_identity_object_id" {
  value       = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  description = "The Object ID of the AKS Kubelet Managed Identity (used for ACR pull role bindings)."
}

output "kube_config_raw" {
  value       = azurerm_kubernetes_cluster.aks.kube_config_raw
  description = "Raw Kubernetes configuration credentials for kubectl connection."
  sensitive   = true
}

output "oidc_issuer_url" {
  value       = azurerm_kubernetes_cluster.aks.oidc_issuer_url
  description = "The OIDC issuer URL for Workload Identity integration."
}
