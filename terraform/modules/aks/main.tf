resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.cluster_name
  location            = var.location
  resource_group_name = var.resource_group_name
  dns_prefix          = var.dns_prefix
  kubernetes_version  = var.kubernetes_version
  tags                = var.tags

  # Default System Node Pool
  default_node_pool {
    name           = "systempool"
    node_count     = var.node_count
    vm_size        = var.vm_size
    vnet_subnet_id = var.subnet_id

    # Scale Settings
    enable_auto_scaling = false
  }

  # Cluster Managed Identity
  identity {
    type = "SystemAssigned"
  }

  # Azure CNI Networking Configuration
  network_profile {
    network_plugin = "azure"
    dns_service_ip = "10.0.0.10"
    service_cidr   = "10.0.0.0/16"
  }

  # Log Analytics / Monitor Cluster Integration
  oms_agent {
    log_analytics_workspace_id = var.log_analytics_workspace_id
  }
}
