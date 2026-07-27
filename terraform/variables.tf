variable "environment" {
  type        = string
  description = "Deployment environment name (e.g., dev, staging, prod)."
  default     = "prod"
}

variable "project_name" {
  type        = string
  description = "Global project prefix name applied to resources."
  default     = "shipflowx"
}

variable "location" {
  type        = string
  description = "The target Azure region for provisioned resources."
  default     = "eastus2"
}

variable "kubernetes_version" {
  type        = string
  description = "The targeted Kubernetes release for the AKS node pools."
  default     = "1.28"
}

variable "aks_node_count" {
  type        = number
  description = "The number of virtual machines inside the AKS cluster default pool."
  default     = 2
}

variable "aks_vm_size" {
  type        = string
  description = "The instance sizing code for virtual machine nodes in AKS."
  default     = "Standard_D2s_v5"
}

variable "storage_account_name" {
  type        = string
  description = "Unique global storage account name. Override in terraform.tfvars."
  default     = "sfxprodstate99"
}

variable "acr_name" {
  type        = string
  description = "Unique global container registry name. Override in terraform.tfvars."
  default     = "sfxprodacr99"
}
