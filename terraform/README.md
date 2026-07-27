# ShipFlowX Cloud Infrastructure (Terraform)

This directory contains modular Terraform configuration templates to provision a production-ready, enterprise-grade Infrastructure on Microsoft Azure.

---

## 🎓 Azure for Students & Trial Subscriptions compatibility

Limited subscriptions (such as **Azure for Students** or trial accounts) enforce restrictive administrative policies. If you attempt to deploy the full enterprise architecture, Azure APIs may return an **`HTTP 403 RequestDisallowedByAzure`** error for resources like VNets, Container Registries (ACR), Log Analytics Workspaces, or AKS clusters.

To maximize compatibility and bypass these restrictions, we implemented **Feature Flags** that allow you to selectively enable/disable specific modules.

### How to Bypass Subscription Blockages

1. **Deploy Resource Group Only (Default safe state)**:
   By default, all flags in `terraform.tfvars` are set to `false`. Running `terraform apply` will only provision the Resource Group, which is guaranteed to succeed on any subscription.
2. **Enable Supported Services One-by-One**:
   Change flags to `true` in your `terraform.tfvars` to test what Azure allows on your account. For example, to test networking:
   ```hcl
   enable_network = true
   ```
3. **Region Constraints**:
   Student accounts are restricted to specific geographies (often **Central India**, **East US**, or **West Europe**). We set the default location variable to `centralindia`. Ensure you do not configure restricted regions.
4. **Deploying on a Pay-As-You-Go Account**:
   When migrating to a standard subscription with no quota limits, simply set all flags to `true` to provision the full enterprise environment:
   ```hcl
   enable_storage    = true
   enable_network    = true
   enable_acr        = true
   enable_monitoring = true
   enable_identity   = true
   enable_aks        = true
   ```

---

## Module Architecture

Our resources are divided into dedicated modules to ensure reusability and isolation:

```text
terraform/
├── modules/
│   ├── resource-group/   # Logical Resource boundaries
│   ├── network/          # Virtual Network (VNet), Subnets, NSG rules [Optional]
│   ├── acr/              # Azure Container Registry (Standard SKU) [Optional]
│   ├── aks/              # Azure Kubernetes Service cluster [Optional]
│   ├── identity/         # User Assigned Managed Identity [Optional]
│   ├── monitoring/       # Log Analytics Workspace integrations [Optional]
│   └── storage/          # Azure Storage Account (Remote State) [Optional]
```

---

## Prerequisites

1. **Terraform CLI**: Install Terraform CLI (version `>= 1.5.0` is required).
2. **Azure CLI**: Install Azure CLI (`az`) and login to your subscription:
   ```bash
   az login
   az account set --subscription "your-subscription-id"
   ```

---

## Deployment & Verification Workflow

### 1. Initialize Inputs
Create your local variables file:
```bash
cp terraform.tfvars.example terraform.tfvars
```
Edit `terraform.tfvars` to customize settings.

### 2. Format Verification
Check style formatting:
```bash
terraform fmt -check
```
Auto-format files if needed:
```bash
terraform fmt -recursive
```

### 3. Initialize Modules
Initialize local modules and download provider plugins:
```bash
terraform init
```

### 4. Validate Structural Syntax
Verify variable references and resource schemas are correct:
```bash
terraform validate
```

### 5. Generate Dry Run Plan
Compute changes and generate plan output:
```bash
terraform plan -out=tfplan
```
Review the list of resources to be provisioned (with all flags set to `false`, it will plan only 1 resource to add: the resource group).
