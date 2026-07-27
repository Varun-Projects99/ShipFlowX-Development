output "id" {
  value       = azurerm_user_assigned_identity.identity.id
  description = "The resource ID of the user-assigned identity."
}

output "principal_id" {
  value       = azurerm_user_assigned_identity.identity.principal_id
  description = "The principal ID of the user-assigned identity."
}

output "client_id" {
  value       = azurerm_user_assigned_identity.identity.client_id
  description = "The client ID of the user-assigned identity."
}
