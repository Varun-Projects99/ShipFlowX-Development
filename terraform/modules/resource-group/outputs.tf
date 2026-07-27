output "name" {
  value       = azurerm_resource_group.rg.name
  description = "The name of the provisioned resource group."
}

output "location" {
  value       = azurerm_resource_group.rg.location
  description = "The location of the provisioned resource group."
}

output "id" {
  value       = azurerm_resource_group.rg.id
  description = "The Resource Manager ID of the resource group."
}
