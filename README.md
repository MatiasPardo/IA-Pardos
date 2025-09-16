
# IA Pardo Final Setup 🚀

Este proyecto contiene:
✅ **Backend** (Node.js) → API que comunica con Ollama
✅ **Ollama** (IA) → 3 modelos de lenguaje disponibles
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
📦 Backend (Node.js) - Puerto 3000
    │
    └── Conecta: http://ollama:11434
    │
    ↓ Red interna: pardos-network
🤖 Ollama (IA)
    │
    ├── llama3:8b (modelo base)
    ├── pardos-assistant:latest (personalizado)
    └── llama3-base (base optimizado)

📊 Portainer (Puerto 9000)
    └── Administra todos los contenedores
```

### 📋 **Componentes:**

| Servicio | Contenedor | Puerto | Función |
|----------|------------|--------|----------|
| **Frontend** | `pardos-frontend` | 80 | Interfaz web + Proxy NGINX |
| **Backend** | `pardos-backend` | 3000 | API REST para chat |
| **Ollama** | `pardos-ollama` | 11434 (interno) | Modelos de IA |
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

5️⃣ **(Opcional) Quitá el warning del compose**
Editá `docker-compose.yml` y eliminá la línea:
```
version: '3.8'
```

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

✅ Ver los contenedores corriendo:
```
docker-compose ps
```

✅ Monitorear logs en tiempo real:
```
docker-compose logs -f
```
Presioná `Ctrl + C` para salir del seguimiento.

✅ Ver todos los contenedores (incluyendo parados):
```
docker ps -a
```

✅ Si querés inspeccionar uno específico:
```
docker logs <nombre_contenedor>
```
Por ejemplo:
```
docker logs pardos-backend
```

✅ Si necesitás ver el uso de recursos (CPU, memoria):
```
docker stats
```

---

### 🌐 **Accesos finales**

- **Frontend presentación:**
  ```
  http://<EC2_PUBLIC_IP>
  ```

- **Chat con Matías Pardo:**
  ```
  http://<EC2_PUBLIC_IP>/chat/index.html
  ```

- **InterCode (Generador de Código Java):**
  ```
  http://<EC2_PUBLIC_IP>/code/index.html
  ```

- **Portainer (Administración Docker):**
  ```
  http://<EC2_PUBLIC_IP>:9000
  ```

### 🔌 **API Endpoints del Backend**

| Endpoint | Método | Descripción | Puerto |
|----------|--------|-------------|--------|
| `/api/chat` | POST | Chat con modelos de IA | 3000 |
| `/api/models` | GET | Listar modelos disponibles | 3000 |

#### **1. Chat con IA - `/api/chat`**
**Descripción:** Envía mensajes a los modelos de IA y recibe respuestas.

**Body (JSON):**
```json
{
  "prompt": "Tu mensaje aquí",
  "model": "nombre-del-modelo" // Opcional, default: pardos-assistant:latest
}
```

**Ejemplos:**
```bash
# Modelo personalizado (default)
curl -X POST http://<EC2_PUBLIC_IP>:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hola Matías, contame sobre tu experiencia"}'

# Modelo de código Java
curl -X POST http://<EC2_PUBLIC_IP>:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Crea una clase Usuario con patrón Builder", "model": "pardos-code:latest"}'

# Modelo base específico
curl -X POST http://<EC2_PUBLIC_IP>:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?", "model": "llama3:8b"}'
```

**Respuesta:**
```json
{
  "reply": "Respuesta del modelo de IA..."
}
```

#### **2. Listar Modelos - `/api/models`**
**Descripción:** Obtiene todos los modelos instalados en Ollama.

**Ejemplo:**
```bash
curl http://<EC2_PUBLIC_IP>:3000/api/models
```

**Respuesta:**
```json
{
  "models": [
    {
      "name": "pardos-assistant:latest",
      "size": 4661224676,
      "digest": "sha256:..."
    },
    {
      "name": "llama3:8b",
      "size": 4661224676,
      "digest": "sha256:..."
    },
    {
      "name": "llama3-base",
      "size": 4661224676,
      "digest": "sha256:..."
    }
  ]
}
```

### 🧪 **Testing con Postman**

**URL Base:** `http://<EC2_PUBLIC_IP>:3000`

**Headers necesarios:**
- `Content-Type: application/json`

**Timeout configurado:** 10 minutos (para respuestas largas de IA)

### 🤖 **Modelos de IA disponibles**

El sistema incluye **3 modelos de Ollama:**

1. **`llama3:8b`** - Modelo base de Meta
2. **`pardos-assistant:latest`** - Modelo personalizado con datos de Matías Pardo
   - Entrenado con información personal y profesional
   - Responde como Matías en primera persona
   - Incluye experiencia laboral, proyectos y estudios
3. **`pardos-code:latest`** - Modelo especializado en código Java
   - Optimizado para generar código con buenas prácticas
   - Sigue principios SOLID y patrones de diseño
   - Respuestas directas sin explicaciones adicionales

### ⚙️ **Parámetros de configuración de modelos**

Cada modelo usa parámetros específicos en sus archivos `diag` para optimizar su comportamiento:

#### **PARAMETER temperature**
- **Rango:** 0.0 - 2.0
- **Función:** Controla la creatividad/aleatoriedad de las respuestas
- **Valores:**
  - `0.1` (pardos-code) - Respuestas muy precisas y determinísticas
  - `0.7` (llama3-base) - Balance entre creatividad y precisión
  - `1.0` (pardos-assistant) - Respuestas más creativas y naturales

#### **PARAMETER top_p**
- **Rango:** 0.0 - 1.0
- **Función:** Controla la diversidad de palabras consideradas
- **Valor:** `0.9` - Considera el 90% de las opciones más probables

#### **PARAMETER num_ctx**
- **Función:** Define el tamaño del contexto (memoria)
- **Valor:** `4096` tokens - Permite conversaciones largas

#### **PARAMETER stop**
- **Función:** Tokens que indican fin de respuesta
- **Valores:** `<|start_header_id|>`, `<|end_header_id|>`, `<|eot_id|>`

#### **TEMPLATE**
- **Función:** Define el formato de conversación
- **Estructura:** Sistema → Usuario → Asistente
- **Tokens especiales:** Marcan inicio/fin de cada rol

**Ver modelos instalados:**
```bash
# Desde línea de comandos
docker exec -it pardos-ollama ollama list

# Desde API del backend
curl http://<EC2_PUBLIC_IP>:3000/api/models
```

---

### ⚙ Comandos útiles

✅ Apagar todos los servicios:
```
docker-compose down
```

✅ Forzar rebuild y reinicio:
```
docker-compose build --no-cache
docker-compose up -d --force-recreate
```

✅ Actualizar imágenes desde Docker Hub (si usás imágenes remotas):
```
docker-compose pull
docker-compose up -d --force-recreate
```

---

⚠ **NOTAS IMPORTANTES:**
- **Backend expuesto en puerto 3000** para acceso directo con Postman/curl
- **Ollama interno** - Solo el backend puede comunicarse con él
- **Sistema sin SSL** - Funciona completamente con HTTP
- **Timeout de 10 minutos** - Configurado en backend y frontend
- **3 modelos disponibles** - Personalizado, base y optimizado
- **Portainer integrado** - Administración web en puerto 9000
