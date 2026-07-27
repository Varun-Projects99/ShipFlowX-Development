output "id" {
  value       = azurerm_log_analytics_workspace.workspace.id
  description = "The Log Analytics Workspace Resource ID."
}

output "workspace_id" {
  value       = azurerm_log_analytics_workspace.workspace.workspace_id
  description = "The Log Analytics Workspace unique client ID."
}

output "name" {
  value       = azurerm_log_analytics_workspace.workspace.name
  description = "The Log Analytics Workspace name."
}
