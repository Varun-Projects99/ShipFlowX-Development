output "id" {
  value       = azurerm_container_registry.acr.id
  description = "The resource ID of the container registry."
}

output "login_server" {
  value       = azurerm_container_registry.acr.login_server
  description = "The URL login server address for Docker pushes."
}

output "name" {
  value       = azurerm_container_registry.acr.name
  description = "The container registry name."
}
