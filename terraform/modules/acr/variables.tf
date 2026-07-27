variable "resource_group_name" {
  type        = string
  description = "The name of the resource group."
}

variable "location" {
  type        = string
  description = "The Azure region for the container registry."
}

variable "acr_name" {
  type        = string
  description = "The name of the Azure Container Registry (must be globally unique, alphanumeric only)."
}

variable "sku" {
  type        = string
  description = "The SKU pricing tier of the registry."
  default     = "Standard" # Standard enables container layer sharing and secure pull locks
}

variable "admin_enabled" {
  type        = bool
  description = "Indicates whether the admin user credentials are enabled."
  default     = false
}

variable "tags" {
  type        = map(string)
  description = "Tags map."
  default     = {}
}
