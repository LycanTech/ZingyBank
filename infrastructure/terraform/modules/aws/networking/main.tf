# AWS Networking Module
# Creates VPC with subnets for EKS, RDS, and private endpoints
# Banking: Multi-AZ deployment, network segmentation (PCI DSS requirement)

variable "environment" {
  type = string
}

variable "vpc_cidr" {
  type    = string
  default = "10.10.0.0/16"
}

variable "availability_zones" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "zingybank-vpc-${var.environment}"
    Environment = var.environment
    Project     = "ZingyBank"
    ManagedBy   = "Terraform"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "zingybank-igw-${var.environment}"
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

# Public Subnets (for Load Balancers only)
resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = false # Banking: no auto-assign public IPs

  tags = {
    Name                                          = "zingybank-public-${var.availability_zones[count.index]}-${var.environment}"
    Environment                                   = var.environment
    Project                                       = "ZingyBank"
    "kubernetes.io/role/elb"                      = "1"
    "kubernetes.io/cluster/zingybank-eks-${var.environment}" = "shared"
  }
}

# Private Subnets (EKS nodes)
resource "aws_subnet" "private_eks" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name                                          = "zingybank-eks-${var.availability_zones[count.index]}-${var.environment}"
    Environment                                   = var.environment
    Project                                       = "ZingyBank"
    "kubernetes.io/role/internal-elb"             = "1"
    "kubernetes.io/cluster/zingybank-eks-${var.environment}" = "owned"
  }
}

# Private Subnets (RDS — isolated, no internet access)
resource "aws_subnet" "private_rds" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 20)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name        = "zingybank-rds-${var.availability_zones[count.index]}-${var.environment}"
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

# Elastic IPs for NAT Gateways (one per AZ for HA)
resource "aws_eip" "nat" {
  count  = length(var.availability_zones)
  domain = "vpc"

  tags = {
    Name        = "zingybank-nat-eip-${count.index}-${var.environment}"
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

# NAT Gateways — allows EKS nodes to reach internet without being exposed
resource "aws_nat_gateway" "main" {
  count         = length(var.availability_zones)
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = {
    Name        = "zingybank-nat-${var.availability_zones[count.index]}-${var.environment}"
    Environment = var.environment
    Project     = "ZingyBank"
  }

  depends_on = [aws_internet_gateway.main]
}

# Route Table — Public
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name        = "zingybank-public-rt-${var.environment}"
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(var.availability_zones)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Route Tables — Private EKS (one per AZ, each routes through its own NAT)
resource "aws_route_table" "private_eks" {
  count  = length(var.availability_zones)
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }

  tags = {
    Name        = "zingybank-eks-rt-${var.availability_zones[count.index]}-${var.environment}"
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

resource "aws_route_table_association" "private_eks" {
  count          = length(var.availability_zones)
  subnet_id      = aws_subnet.private_eks[count.index].id
  route_table_id = aws_route_table.private_eks[count.index].id
}

# Route Table — RDS (no internet route — isolated)
resource "aws_route_table" "private_rds" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "zingybank-rds-rt-${var.environment}"
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

resource "aws_route_table_association" "private_rds" {
  count          = length(var.availability_zones)
  subnet_id      = aws_subnet.private_rds[count.index].id
  route_table_id = aws_route_table.private_rds.id
}

# Security Group — EKS Nodes
resource "aws_security_group" "eks_nodes" {
  name        = "zingybank-eks-nodes-${var.environment}"
  description = "Security group for EKS worker nodes"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Node to node communication"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    self        = true
  }

  ingress {
    description = "Allow pods to communicate with control plane"
    from_port   = 1025
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "zingybank-eks-nodes-sg-${var.environment}"
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

# Security Group — RDS (only accessible from EKS nodes)
resource "aws_security_group" "rds" {
  name        = "zingybank-rds-${var.environment}"
  description = "Security group for RDS PostgreSQL — EKS nodes only"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from EKS nodes"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.eks_nodes.id]
  }

  tags = {
    Name        = "zingybank-rds-sg-${var.environment}"
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

# Outputs
output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}

output "private_eks_subnet_ids" {
  value = aws_subnet.private_eks[*].id
}

output "private_rds_subnet_ids" {
  value = aws_subnet.private_rds[*].id
}

output "eks_node_sg_id" {
  value = aws_security_group.eks_nodes.id
}

output "rds_sg_id" {
  value = aws_security_group.rds.id
}
