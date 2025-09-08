#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

# Dependencias mínimas para instalar y validar HTTPS
apt-get update
apt-get install -y curl ca-certificates bash coreutils jq
rm -rf /var/lib/apt/lists/*

# Instalar Ollama usando el instalador oficial
# Si seteás OLLAMA_VERSION en build args o env, el script la respeta (p.ej. 0.3.13)
echo ">>> Instalando Ollama (version: ${OLLAMA_VERSION:-latest})"
curl -fsSL https://ollama.com/install.sh | sh

# Mostrar versión instalada
echo ">>> Ollama instalado en:"
command -v ollama || true
ollama --version || true
