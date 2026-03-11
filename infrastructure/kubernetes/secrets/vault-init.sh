#!/bin/bash
# Vault secret seeding script for ZingyBank
# Run once after Vault is initialized and unsealed in production
# Usage: VAULT_TOKEN=<token> DB_PASSWORD=<pass> JWT_SECRET=<secret> REDIS_PASSWORD=<pass> ./vault-init.sh

set -euo pipefail

VAULT_ADDR=${VAULT_ADDR:-http://localhost:8200}
VAULT_TOKEN=${VAULT_TOKEN:?VAULT_TOKEN must be set}
DB_PASSWORD=${DB_PASSWORD:?DB_PASSWORD must be set}
JWT_SECRET=${JWT_SECRET:?JWT_SECRET must be at least 256 bits}
REDIS_PASSWORD=${REDIS_PASSWORD:?REDIS_PASSWORD must be set}

echo "Seeding ZingyBank secrets into Vault at $VAULT_ADDR"

export VAULT_ADDR
vault login "$VAULT_TOKEN"

# Enable KV v2 secrets engine (idempotent)
vault secrets enable -path=secret kv-v2 2>/dev/null || echo "KV engine already enabled"

# Database credentials
vault kv put secret/zingybank/database \
  username="zingybank" \
  password="$DB_PASSWORD"
echo "Database credentials seeded"

# JWT secret (must be 256+ bits / 32+ characters)
vault kv put secret/zingybank/jwt \
  secret="$JWT_SECRET"
echo "JWT secret seeded"

# Redis password
vault kv put secret/zingybank/redis \
  password="$REDIS_PASSWORD"
echo "Redis credentials seeded"

echo ""
echo "All ZingyBank secrets seeded successfully."
echo "Run 'kubectl apply -f zingybank-secrets.yml' to sync secrets into Kubernetes."
