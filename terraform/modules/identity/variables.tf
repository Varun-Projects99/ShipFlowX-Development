variable "resource_group_name" {
  type        = string
  description = "The name of the resource group."
}

variable "location" {
  type        = string
  description = "The Azure region for the managed identity."
}

variable "identity_name" {
  type        = string
  description = "The name of the User Assigned Managed Identity."
}

variable "tags" {
  type        = map(string)
  description = "Tags map."
  default     = {}
}
