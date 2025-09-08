# Imagen base
FROM ubuntu:24.04

RUN apt-get update || true && \
    apt-get install -y --no-install-recommends ca-certificates gnupg && \
    rm -rf /var/lib/apt/lists/*
    
# Evitar prompts interactivos
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# Instalar Ollama con script oficial (y deps básicas)
COPY install.sh /app/install.sh
RUN sed -i 's/\r$//' /app/install.sh && chmod +x /app/install.sh && /app/install.sh

# Copiar scripts y Modelfile (en tu repo, 'diag' es un archivo Modelfile)
COPY run-ollama.sh /app/run-ollama.sh
RUN sed -i 's/\r$//' /app/run-ollama.sh && chmod +x /app/run-ollama.sh

# Copiamos el Modelfile (archivo) tal como está en el repo
COPY diag /app/diag

# Exponer puerto de la API de Ollama
EXPOSE 11434

# Directorio donde Ollama guarda modelos (volumen en compose)
VOLUME ["/root/.ollama"]

# Comando por defecto: levantar Ollama y preparar modelos
CMD ["/bin/bash","-lc","/app/run-ollama.sh"]
