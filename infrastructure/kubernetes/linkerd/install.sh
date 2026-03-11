#!/bin/bash
# Linkerd Service Mesh Installation for ZingyBank
# Provides: automatic mTLS, traffic metrics, retries, circuit breaking at the network level
# Prerequisites: kubectl configured, Linkerd CLI installed
#   curl -fsL https://run.linkerd.io/install | sh
#   export PATH=$PATH:$HOME/.linkerd2/bin

set -euo pipefail

echo "=== Installing Linkerd Service Mesh for ZingyBank ==="

# Pre-flight checks
echo "Running pre-flight checks..."
linkerd check --pre

# Install Linkerd CRDs
echo "Installing Linkerd CRDs..."
linkerd install --crds | kubectl apply -f -

# Install Linkerd control plane
echo "Installing Linkerd control plane..."
linkerd install \
  --set proxyInit.runAsRoot=true \
  | kubectl apply -f -

# Wait for control plane to be ready
echo "Waiting for Linkerd control plane..."
linkerd check

# Install Linkerd Viz (dashboard + metrics)
echo "Installing Linkerd Viz dashboard..."
linkerd viz install | kubectl apply -f -

# Apply ZingyBank mesh config (namespace annotation + ServiceProfiles)
echo "Applying ZingyBank mesh configuration..."
kubectl apply -f "$(dirname "$0")/mesh-config.yml"

echo ""
echo "=== Linkerd installed successfully ==="
echo "Access dashboard: linkerd viz dashboard"
echo "Check mTLS:       linkerd viz edges deployment -n zingybank"
echo "Check traffic:    linkerd viz stat deployment -n zingybank"
