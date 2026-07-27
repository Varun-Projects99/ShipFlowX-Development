variable "resource_group_name" {
  type        = string
  description = "The name of the resource group."
}

variable "location" {
  type        = string
  description = "The Azure region for the AKS cluster."
}

variable "cluster_name" {
  type        = string
  description = "The name of the AKS cluster."
}

variable "dns_prefix" {
  type        = string
  description = "DNS prefix specified when creating the managed cluster."
}

variable "subnet_id" {
  type        = string
  description = "The resource ID of the subnet where nodes and pods will be allocated."
}

variable "kubernetes_version" {
  type        = string
  description = "The version of Kubernetes to install."
  default     = "1.28" # Stable release
}

variable "node_count" {
  type        = number
  description = "Initial number of nodes in the system node pool."
  default     = 2
}

variable "vm_size" {
  type        = string
  description = "The size of the Virtual Machines to use for nodes."
  default     = "Standard_D2s_v5" # Balanced Standard VMs
}

variable "log_analytics_workspace_id" {
  type        = string
  description = "Log Analytics Workspace Resource ID for diagnostics."
}

variable "tags" {
  type        = map(string)
  description = "Tags map."
  default     = {}
}
