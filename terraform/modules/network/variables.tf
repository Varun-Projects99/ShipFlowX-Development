variable "resource_group_name" {
  type        = string
  description = "The name of the resource group."
}

variable "location" {
  type        = string
  description = "The Azure region for network resources."
}

variable "vnet_name" {
  type        = string
  description = "The name of the Virtual Network."
}

variable "vnet_address_space" {
  type        = list(string)
  description = "The address space address blocks for the VNet."
  default     = ["10.240.0.0/16"]
}

variable "aks_subnet_name" {
  type        = string
  description = "The name of the subnet allocated to AKS cluster pods."
  default     = "aks-subnet"
}

variable "aks_subnet_prefixes" {
  type        = list(string)
  description = "The subnet IP address prefixes for the AKS subnet."
  default     = ["10.240.0.0/20"]
}

variable "db_subnet_name" {
  type        = string
  description = "The name of the database private subnet."
  default     = "db-subnet"
}

variable "db_subnet_prefixes" {
  type        = list(string)
  description = "The subnet IP address prefixes for the Database subnet."
  default     = ["10.240.16.0/24"]
}

variable "tags" {
  type        = map(string)
  description = "Tags map."
  default     = {}
}
