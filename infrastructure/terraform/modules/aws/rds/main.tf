# AWS RDS Module
# Banking: Multi-AZ PostgreSQL, encryption at rest, automated backups, no public access

variable "environment" {
  type = string
}

variable "private_rds_subnet_ids" {
  type = list(string)
}

variable "rds_sg_id" {
  type = string
}

variable "administrator_username" {
  type      = string
  sensitive = true
}

variable "administrator_password" {
  type      = string
  sensitive = true
}

variable "instance_class" {
  type    = string
  default = "db.t3.medium"
}

# KMS key for RDS encryption at rest
resource "aws_kms_key" "rds" {
  description             = "ZingyBank RDS encryption key - ${var.environment}"
  deletion_window_in_days = 30
  enable_key_rotation     = true # Banking: annual key rotation

  tags = {
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

resource "aws_kms_alias" "rds" {
  name          = "alias/zingybank-rds-${var.environment}"
  target_key_id = aws_kms_key.rds.key_id
}

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "zingybank-rds-subnet-group-${var.environment}"
  subnet_ids = var.private_rds_subnet_ids

  tags = {
    Name        = "zingybank-rds-subnet-group-${var.environment}"
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

# DB Parameter Group (security hardening)
resource "aws_db_parameter_group" "main" {
  name   = "zingybank-postgres16-${var.environment}"
  family = "postgres16"

  # Banking: Force SSL connections
  parameter {
    name  = "rds.force_ssl"
    value = "1"
  }

  # Banking: Log all connections and disconnections
  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  # Banking: Log slow queries (> 1s)
  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }

  parameter {
    name  = "log_statement"
    value = "ddl"
  }

  tags = {
    Environment = var.environment
    Project     = "ZingyBank"
  }
}

# RDS PostgreSQL — Multi-AZ for HA
resource "aws_db_instance" "main" {
  identifier     = "zingybank-postgres-${var.environment}"
  engine         = "postgres"
  engine_version = "16"
  instance_class = var.instance_class

  db_name  = "zingybank"
  username = var.administrator_username
  password = var.administrator_password

  # Storage
  allocated_storage     = 100
  max_allocated_storage = 1000 # Auto-scaling storage up to 1TB
  storage_type          = "gp3"
  storage_encrypted     = true
  kms_key_id            = aws_kms_key.rds.arn

  # High Availability
  multi_az = true # Banking: always multi-AZ

  # Networking — private, no public access
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.rds_sg_id]
  publicly_accessible    = false

  # Parameter group with security settings
  parameter_group_name = aws_db_parameter_group.main.name

  # Backups — Banking: 35-day retention, daily window
  backup_retention_period   = 35
  backup_window             = "03:00-04:00"
  maintenance_window        = "sun:04:00-sun:05:00"
  copy_tags_to_snapshot     = true
  delete_automated_backups  = false

  # Banking: Prevent accidental deletion
  deletion_protection = true
  skip_final_snapshot = false
  final_snapshot_identifier = "zingybank-${var.environment}-final-snapshot"

  # Monitoring
  monitoring_interval          = 60
  monitoring_role_arn          = aws_iam_role.rds_monitoring.arn
  performance_insights_enabled = true
  performance_insights_kms_key_id = aws_kms_key.rds.arn
  performance_insights_retention_period = 93 # 93 days (max for free tier)

  # Auto minor version upgrades during maintenance window
  auto_minor_version_upgrade = true

  tags = {
    Environment = var.environment
    Project     = "ZingyBank"
    ManagedBy   = "Terraform"
  }
}

# IAM Role for Enhanced Monitoring
resource "aws_iam_role" "rds_monitoring" {
  name = "zingybank-rds-monitoring-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "monitoring.rds.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
  role       = aws_iam_role.rds_monitoring.name
}

# Outputs
output "db_endpoint" {
  value     = aws_db_instance.main.endpoint
  sensitive = true
}

output "db_port" {
  value = aws_db_instance.main.port
}

output "db_instance_id" {
  value = aws_db_instance.main.id
}
