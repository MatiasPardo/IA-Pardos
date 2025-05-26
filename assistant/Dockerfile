# Use Ubuntu as the base image
FROM ubuntu:20.04

# Set working directory
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    lshw \
    build-essential \
    pciutils \
    sed \
    && rm -rf /var/lib/apt/lists/*

# Ensure Ollama binary path is included
ENV OLLAMA_HOST=0.0.0.0
ENV PATH="/usr/local/bin:/usr/bin:/bin:$PATH"

COPY install.sh ./install.sh
COPY run-ollama.sh ./run-ollama.sh
COPY diag ./diag

# Install Ollama
RUN sed -i 's/\r$//' install.sh \
    && chmod +x install.sh \
    && ./install.sh \
    && ln -sf /usr/local/bin/ollama /bin/ollama

# Prepare the run script
RUN sed -i 's/\r$//' run-ollama.sh \
    && chmod +x run-ollama.sh

# Expose Ollama API port
EXPOSE 11434

# Run Ollama and preload models when the container starts
CMD ["bash", "-c", "./run-ollama.sh && tail -f /dev/null"]
