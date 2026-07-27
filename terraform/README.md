# ShipFlowX Cloud Infrastructure (Terraform)

This directory contains modular Terraform configuration templates to provision a production-ready, enterprise-grade Infrastructure on Microsoft Azure.

## Module Architecture

Our resources are divided into dedicated modules to ensure reusability and isolation:

```text
terraform/
├── modules/
│   ├── resource-group/   # Logical Resource boundaries
│   ├── network/          # Virtual Network (VNet), Subnets (AKS & Database), NSG rules
│   ├── acr/              # Azure Container Registry (Standard SKU)
│   ├── aks/              # Azure Kubernetes Service cluster (Azure CNI network plugin)
│   ├── identity/         # User Assigned Managed Identity
│   ├── monitoring/       # Log Analytics Workspace integrations
│   └── storage/          # Azure Storage Account (Remote State Backend provisioner)
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
Edit `terraform.tfvars` and specify globally unique values for `storage_account_name` and `acr_name`.

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
Review the list of resources to be provisioned (should output 16 resources to add).

---

## Remote State Activation

Once the storage account is provisioned:
1. Copy the Storage Account name from the `storage_account_name` output.
2. Edit `backend.tf`, uncomment the backend block, and insert the account name.
3. Run `terraform init -migrate-state` to migrate local state files securely to Azure.
