output "vnet_id" {
  value       = azurerm_virtual_network.vnet.id
  description = "The virtual network resource manager ID."
}

output "vnet_name" {
  value       = azurerm_virtual_network.vnet.name
  description = "The virtual network name."
}

output "aks_subnet_id" {
  value       = azurerm_subnet.aks_subnet.id
  description = "The resource ID of the AKS pods subnet."
}

output "db_subnet_id" {
  value       = azurerm_subnet.db_subnet.id
  description = "The resource ID of the database private subnet."
}
