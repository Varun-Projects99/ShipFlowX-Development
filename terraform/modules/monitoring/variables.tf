variable "resource_group_name" {
  type        = string
  description = "The name of the resource group."
}

variable "location" {
  type        = string
  description = "The Azure region for monitoring resources."
}

variable "workspace_name" {
  type        = string
  description = "The name of the Log Analytics Workspace."
}

variable "retention_in_days" {
  type        = number
  description = "The workspace data retention in days."
  default     = 30
}

variable "tags" {
  type        = map(string)
  description = "Tags map."
  default     = {}
}
