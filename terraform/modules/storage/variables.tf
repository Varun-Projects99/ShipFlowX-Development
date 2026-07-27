variable "resource_group_name" {
  type        = string
  description = "The name of the resource group."
}

variable "location" {
  type        = string
  description = "The Azure region for the storage resources."
}

variable "storage_account_name" {
  type        = string
  description = "The name of the Storage Account (must be globally unique, 3-24 characters, lowercase alphanumeric only)."
}

variable "container_name" {
  type        = string
  description = "The name of the Blob Container for Terraform state."
  default     = "tfstate"
}

variable "account_tier" {
  type        = string
  description = "Defines the Tier to use for this storage account."
  default     = "Standard"
}

variable "account_replication_type" {
  type        = string
  description = "Defines the type of replication to use for this storage account."
  default     = "LRS" # Local Redundant Storage is standard for state backends
}

variable "tags" {
  type        = map(string)
  description = "Tags map."
  default     = {}
}
