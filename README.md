
# IA Pardo Final Setup 🚀

Este proyecto contiene:
✅ **Backend** (Node.js) → API que comunica con Ollama
✅ **Ollama** (IA) → Modelos de lenguaje con datos personalizados
✅ **Frontend** (HTML estático) → Servido por NGINX
✅ **Portainer** → Administración web de Docker
✅ **Configuración completa** en un solo `docker-compose.yml`

---

## 🏢 **Arquitectura del Sistema**

```
🌐 Internet
    │
    ↓ Puerto 80
📦 NGINX (Frontend)
    │
    ├── Sirve: index.html, chat/index.html
    └── Proxy: /api/ → Backend
    │
    ↓ Red interna: pardos-network
📦 Backend (Node.js)
    │
    └── Conecta: http://ollama:11434
    │
    ↓ Red interna: pardos-network
🤖 Ollama (IA)
    │
    ├── llama3:8b (modelo base)
    └── pardos-assistant:latest (personalizado)

📊 Portainer (Puerto 9000)
    └── Administra todos los contenedores
```

### 📋 **Componentes:**

| Servicio | Contenedor | Puerto | Función |
|----------|------------|--------|----------|
| **Frontend** | `pardos-frontend` | 80 | Interfaz web + Proxy NGINX |
| **Backend** | `pardos-backend` | 3000 (interno) | API REST para chat |
| **Ollama** | `pardos-ollama` | 11434 | Modelos de IA |
| **Portainer** | `pardos-portainer` | 9000 | Administración Docker |

### 🌐 **Red y Volúmenes:**

- **Red:** `pardos-network` (bridge) - Comunicación interna entre servicios
- **Volúmenes:**
  - `ollama_data` - Modelos y configuración de Ollama
  - `portainer_data` - Configuración de Portainer

---

### 📦 Pasos para desplegar

1️⃣ **Subí el proyecto a tu instancia EC2**
```
scp -i tu-llave.pem IA-pardo-updated-complete.zip ec2-user@<EC2_PUBLIC_IP>:~/
```

2️⃣ **Conectate a la instancia**
```
ssh -i tu-llave.pem ec2-user@<EC2_PUBLIC_IP>
```

3️⃣ **Instalá Docker y Docker Compose (si no lo hiciste aún)**
```
sudo dnf install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
exit
ssh -i tu-llave.pem ec2-user@<EC2_PUBLIC_IP>

sudo curl -SL https://github.com/docker/compose/releases/download/v2.27.1/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose version
```

4️⃣ **Descomprimí el proyecto**
```
unzip IA-pardo-updated-complete.zip -d IA-pardo
cd IA-pardo
```

5️⃣ **(Opcional) Si tenés Docker Compose muy antiguo**
El archivo ya incluye `version: '3.8'` para compatibilidad

6️⃣ **Build de las imágenes**
```
docker-compose build
```

7️⃣ **Levantá todos los servicios**
```
docker-compose up -d
```

---

### 🔍 Cómo monitorear el estado de los contenedores

✅ **Opción 1: Portainer (Recomendado)**
```
http://<EC2_PUBLIC_IP>:9000
```
- Interfaz web fácil de usar
- Monitoreo en tiempo real
- Administración completa de contenedores

✅ **Opción 2: Línea de comandos**

Ver los contenedores corriendo:
```
docker-compose ps
```

Monitorear logs en tiempo real:
```
docker-compose logs -f
```
Presioná `Ctrl + C` para salir del seguimiento.

Ver todos los contenedores (incluyendo parados):
```
docker ps -a
```

Inspeccionar uno específico:
```
docker logs pardos-backend
docker logs pardos-ollama
docker logs pardos-frontend
docker logs pardos-portainer
```

Ver el uso de recursos (CPU, memoria):
```
docker stats
```

---

### 🌐 Accesos finales

- **Frontend presentación:**
  ```
  http://<EC2_PUBLIC_IP>
  ```

- **Chat con Matías Pardo:**
  ```
  http://<EC2_PUBLIC_IP>/chat/index.html
  ```

- **Portainer (Administración Docker):**
  ```
  http://<EC2_PUBLIC_IP>:9000
  ```
  - Ver y administrar contenedores
  - Monitorear recursos (CPU, memoria)
  - Gestionar imágenes y volúmenes
  - Terminal web para contenedores

---

### 🔧 **Comandos útiles**

**Apagar todos los servicios:**
```bash
docker-compose down
```

**Forzar rebuild completo:**
```bash
docker-compose build --no-cache
docker-compose up -d --force-recreate
```

**Actualizar imágenes:**
```bash
docker-compose pull
docker-compose up -d --force-recreate
```

**Reiniciar un servicio específico:**
```bash
docker-compose restart frontend
docker-compose restart pardos-backend
docker-compose restart ollama
docker-compose restart portainer
```

**Ver estado de la red:**
```bash
docker network ls
docker network inspect ia-pardos_pardos-network
```

---

⚠ **NOTAS IMPORTANTES:**
- **Ollama expuesto en puerto 11434** para testing directo de modelos
- El sistema funciona completamente sin SSL (solo HTTP)
- Todos los servicios están integrados en un solo docker-compose.yml
- Portainer requiere puerto 9000 abierto para administración web
- El **backend usa automáticamente el modelo personalizado** `pardos-assistant:latest`

### 🤖 **Modelos de IA disponibles**

El sistema incluye **2 modelos de Ollama:**

1. **`llama3:8b`** - Modelo base de Meta
2. **`pardos-assistant:latest`** - Modelo personalizado con datos de Matías Pardo
   - Entrenado con información personal y profesional
   - Responde como Matías en primera persona
   - Incluye experiencia laboral, proyectos y estudios

**Ver modelos instalados:**
```bash
# Desde línea de comandos
docker exec -it pardos-ollama ollama list

# Desde navegador (si Ollama está expuesto)
http://<EC2_PUBLIC_IP>:11434/api/tags
```

### 🧪 **Testing directo (CURLs)**

**Probar backend (usa pardos-assistant):**
```bash
curl -X POST http://<EC2_PUBLIC_IP>:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hola Matías, contame sobre tu experiencia"}'
```

**Probar Ollama directo:**
```bash
# Modelo personalizado
curl -X POST http://<EC2_PUBLIC_IP>:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model": "pardos-assistant:latest", "prompt": "Hola Matías", "stream": false}'

# Modelo base
curl -X POST http://<EC2_PUBLIC_IP>:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model": "llama3:8b", "prompt": "Hello", "stream": false}'
```
