output "id" {
  value       = azurerm_storage_account.storage.id
  description = "The storage account resource ID."
}

output "name" {
  value       = azurerm_storage_account.storage.name
  description = "The storage account name."
}

output "container_name" {
  value       = azurerm_storage_container.container.name
  description = "The blob container name."
}

output "primary_blob_endpoint" {
  value       = azurerm_storage_account.storage.primary_blob_endpoint
  description = "The primary blob service endpoint."
}
