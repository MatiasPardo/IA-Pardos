FROM ubuntu:24.04
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# Insecure APT setup (trusted repos, http mirrors) - for closed environments only
RUN set -eux;     sed -i       -e 's|http://archive.ubuntu.com|http://mirrors.edge.kernel.org|g'       -e 's|http://security.ubuntu.com|http://mirrors.edge.kernel.org|g'       /etc/apt/sources.list;     sed -i 's|^deb |deb [trusted=yes] |g' /etc/apt/sources.list;     printf 'APT::Get::AllowUnauthenticated "true";\nAcquire::AllowInsecureRepositories "true";\nAcquire::AllowDowngradeToInsecureRepositories "true";\n' > /etc/apt/apt.conf.d/99insecure;     apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy startup script and Modelfile (in this repo, assistant/diag is a single Modelfile file)
COPY install.sh /app/install.sh
RUN sed -i 's/\r$//' /app/install.sh && chmod +x /app/install.sh

COPY diag /app/diag

EXPOSE 11434
VOLUME ["/root/.ollama"]

# All runtime commands live in install.sh
CMD ["/bin/bash","-lc","/app/install.sh"]
