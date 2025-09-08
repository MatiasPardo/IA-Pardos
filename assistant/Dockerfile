# Usa Ollama oficial como base (ya trae el binario)
FROM ollama/ollama:0.3.13

WORKDIR /app

# Copiamos tu script de arranque (todos los comandos viven acá)
COPY install.sh /app/install.sh
RUN sed -i 's/\r$//' /app/install.sh && chmod +x /app/install.sh

# Copiamos el Modelfile (en tu repo 'assistant/diag' es un archivo)
COPY diag /app/diag

# Expone el API de Ollama y preserva modelos
EXPOSE 11434
VOLUME ["/root/.ollama"]

# Arranque: ejecutar tu script
CMD ["/bin/sh","-lc","/app/install.sh"]
