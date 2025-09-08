#!/usr/bin/env bash
set -euo pipefail

export OLLAMA_HOST=0.0.0.0

# Arrancar el servidor en background
ollama serve &

# Esperar a que la API responda
for i in $(seq 1 60); do
  sleep 1
  if curl -sf http://localhost:11434/api/tags >/dev/null; then
    break
  fi
done

# Pull del modelo base sólo si no existe
if ! ollama list | awk '{print $1}' | grep -qx "llama3:8b"; then
  echo ">>> Descargando modelo base llama3:8b"
  ollama pull llama3:8b
fi

# Crear el modelo custom sólo si no existe
if ! ollama list | awk '{print $1}' | grep -qx "pardos-assistant"; then
  echo ">>> Creando modelo custom pardos-assistant con Modelfile /app/diag"
  ollama create pardos-assistant -f /app/diag
fi

# Mantener el proceso vivo
wait
