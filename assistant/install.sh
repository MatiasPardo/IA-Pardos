#!/usr/bin/env bash
# Todos los comandos viven acá para no usar 'command:' en docker-compose
set -euo pipefail

export OLLAMA_HOST=0.0.0.0

echo ">>> Iniciando Ollama (ollama serve)"
ollama serve &

echo ">>> Esperando a que la API de Ollama responda..."
for i in $(seq 1 60); do
  sleep 1
  if curl -sf http://localhost:11434/api/tags >/dev/null; then
    echo ">>> API de Ollama lista"
    break
  fi
done

# Pull del modelo base sólo si no existe
if ! ollama list | awk '{print $1}' | grep -qx "llama3:8b"; then
  echo ">>> Descargando modelo base llama3:8b"
  ollama pull llama3:8b
else
  echo ">>> Modelo base llama3:8b ya presente"
fi

# Crear el modelo custom sólo si no existe
if ! ollama list | awk '{print $1}' | grep -qx "pardos-assistant"; then
  echo ">>> Creando modelo custom 'pardos-assistant' usando /app/diag"
  ollama create pardos-assistant -f /app/diag
else
  echo ">>> Modelo 'pardos-assistant' ya existe"
fi

echo ">>> Listado de modelos:"
ollama list || true

echo ">>> Manteniendo proceso (wait)"
wait
