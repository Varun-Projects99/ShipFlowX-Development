# ==============================================================================
# ShipFlowX Cloud Infrastructure - Global Input Variables
# ==============================================================================

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
  description = "The target Azure region where resources will be provisioned. Defaults to Central India for student subscriptions."
  default     = "centralindia"

  validation {
    condition     = contains(["centralindia", "eastus", "eastus2", "westus", "westus2", "westeurope", "northeurope", "southeastasia"], var.location)
    error_message = "The location must be one of the allowed Azure regions: centralindia, eastus, eastus2, westus, westus2, westeurope, northeurope, southeastasia."
  }
}

# ==============================================================================
# Feature Flags (Maximizes compatibility for limited subscriptions like Student accounts)
# ==============================================================================

variable "enable_resource_group_module" {
  type        = bool
  description = "Whether to provision the Resource Group via module. Set to false to fallback to the demo resource group."
  default     = false
}

variable "enable_storage" {
  type        = bool
  description = "Whether to provision the Storage Account and Blob Container. Set to false if storage resources are blocked."
  default     = false
}

variable "enable_network" {
  type        = bool
  description = "Whether to provision the Virtual Network (VNet), Subnets, and Network Security Groups (NSGs)."
  default     = false
}

variable "enable_acr" {
  type        = bool
  description = "Whether to provision the Azure Container Registry (ACR). Set to false on limited student accounts."
  default     = false
}

variable "enable_monitoring" {
  type        = bool
  description = "Whether to provision the Log Analytics Workspace. Disabled by default to fit student quota bounds."
  default     = false
}

variable "enable_identity" {
  type        = bool
  description = "Whether to provision the User-Assigned Managed Identity. Disabled by default."
  default     = false
}

variable "enable_aks" {
  type        = bool
  description = "Whether to provision the Azure Kubernetes Service (AKS) cluster. Disabled by default to avoid core limits."
  default     = false
}

# ==============================================================================
# Module Sizing Sizing Parameters
# ==============================================================================

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
