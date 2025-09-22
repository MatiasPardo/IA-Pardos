# IA Pardo Complete Platform 🚀

Este proyecto contiene:
✅ **Backend** (Node.js) → API modular con autenticación JWT
✅ **Ollama** (IA) → 4 modelos de lenguaje especializados
✅ **Frontend** (HTML estático) → 4 aplicaciones web protegidas
✅ **Sistema de Login** → Autenticación con sesiones persistentes
✅ **Portainer** → Administración web de Docker
✅ **Arquitectura modular** → Código limpio y escalable

---

## 🏢 **Arquitectura del Sistema**

```
🌐 Internet
    │
    ↓ Puerto 80
📦 NGINX (Frontend)
    │
    ├── Sirve: login.html, index.html
    ├── Apps: chat/, code/, analyzer/
    └── Proxy: /api/ → Backend
    │
    ↓ Red interna: pardos-network
📦 Backend (Node.js) - Puerto 3000
    │
    ├── Autenticación JWT
    ├── Sesiones con contexto
    ├── Arquitectura modular
    └── Conecta: http://ollama:11434
    │
    ↓ Red interna: pardos-network
🤖 Ollama (IA)
    │
    ├── llama3:8b (modelo base)
    ├── pardos-assistant:latest (chat personal)
    ├── pardos-code:latest (generador Java)
    └── pardos-analyzer:latest (análisis apps)

📊 Portainer (Puerto 9000)
    └── Administra todos los contenedores
```

### 📋 **Componentes:**

| Servicio | Contenedor | Puerto | Función |
|----------|------------|--------|----------|
| **Frontend** | `pardos-frontend` | 80 | 4 Apps web + Proxy NGINX |
| **Backend** | `pardos-backend` | 3000 | API REST con JWT + Sesiones |
| **Ollama** | `pardos-ollama` | 11434 (interno) | 4 Modelos de IA |
| **Portainer** | `pardos-portainer` | 9000 | Administración Docker |

### 🌐 **Red y Volúmenes:**

- **Red:** `pardos-network` (bridge) - Comunicación interna entre servicios
- **Volúmenes:**
  - `ollama_data` - Modelos y configuración de Ollama
  - `portainer_data` - Configuración de Portainer
  - `backend_data` - Usuarios y datos persistentes

---

## 🚀 **NUEVAS FUNCIONALIDADES AGREGADAS**

### ✨ **Sistema de Autenticación Completo**
- 🔐 Login/Registro con JWT
- 💾 Persistencia de usuarios en JSON
- 🔄 Sesiones con contexto de conversación
- 🛡️ Protección de todas las aplicaciones
- 🚪 Logout funcional

### 🤖 **Nuevo Modelo: InterAnalyzer**
- 📊 Análisis de aplicaciones completas
- 🏗️ Identificación de arquitecturas
- 🔍 Detección de patrones y tecnologías
- 📝 Generación de documentación
- 💡 Sugerencias de mejoras

### 🏗️ **Refactorización del Backend**
- 📁 Arquitectura modular y escalable
- 🔧 Separación de responsabilidades
- 🧪 Código más testeable
- 📚 Mejor mantenibilidad
- 🚀 Preparado para crecimiento

### 🌐 **Nueva Aplicación Web**
- 📱 InterAnalyzer - Interfaz para análisis
- 📤 Upload de archivos ZIP (simulado)
- 💬 Chat especializado en análisis
- 🎨 Diseño único y atractivo

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

- **Sistema de Login:**
  ```
  http://<EC2_PUBLIC_IP>/login.html
  ```

- **Frontend presentación:**
  ```
  http://<EC2_PUBLIC_IP>
  ```

- **Chat con Matías Pardo (🔒 Requiere Login):**
  ```
  http://<EC2_PUBLIC_IP>/chat/index.html
  ```

- **InterCode - Generador Java (🔒 Requiere Login):**
  ```
  http://<EC2_PUBLIC_IP>/code/index.html
  ```

- **InterAnalyzer - Análisis de Apps (🔒 Requiere Login):**
  ```
  http://<EC2_PUBLIC_IP>/analyzer/index.html
  ```

- **Portainer (Administración Docker):**
  ```
  http://<EC2_PUBLIC_IP>:9000
  ```

### 🔌 **API Endpoints del Backend**

| Endpoint | Método | Descripción | Auth | Puerto |
|----------|--------|-------------|------|--------|
| `/api/register` | POST | Registro de usuarios | ❌ | 3000 |
| `/api/login` | POST | Inicio de sesión | ❌ | 3000 |
| `/api/verify` | GET | Verificar token JWT | ✅ | 3000 |
| `/api/session` | POST | Crear sesión de chat | ✅ | 3000 |
| `/api/chat` | POST | Chat con modelos de IA | ✅ | 3000 |
| `/api/models` | GET | Listar modelos disponibles | ✅ | 3000 |

#### **1. Registro - `/api/register`**
**Descripción:** Registra un nuevo usuario.

**Body (JSON):**
```json
{
  "username": "tu_usuario",
  "password": "tu_contraseña"
}
```

#### **2. Login - `/api/login`**
**Descripción:** Inicia sesión y obtiene token JWT.

**Body (JSON):**
```json
{
  "username": "tu_usuario",
  "password": "tu_contraseña"
}
```

**Respuesta:**
```json
{
  "token": "jwt_token_aqui",
  "username": "tu_usuario"
}
```

#### **3. Crear Sesión - `/api/session`**
**Descripción:** Crea una sesión de chat con contexto.

**Headers:** `Authorization: Bearer <token>`

**Body (JSON):**
```json
{
  "model": "pardos-assistant:latest" // Opcional
}
```

#### **4. Chat con IA - `/api/chat`**
**Descripción:** Envía mensajes a los modelos de IA con contexto de sesión.

**Headers:** `Authorization: Bearer <token>`

**Body (JSON):**
```json
{
  "prompt": "Tu mensaje aquí",
  "model": "nombre-del-modelo", // Opcional
  "sessionId": "id_de_sesion" // Para mantener contexto
}
```

**Ejemplos:**
```bash
# 1. Registrarse
curl -X POST http://<EC2_PUBLIC_IP>:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username": "usuario", "password": "contraseña"}'

# 2. Hacer login
curl -X POST http://<EC2_PUBLIC_IP>:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "usuario", "password": "contraseña"}'

# 3. Crear sesión (con token)
curl -X POST http://<EC2_PUBLIC_IP>:3000/api/session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{"model": "pardos-assistant:latest"}'

# 4. Chat con contexto
curl -X POST http://<EC2_PUBLIC_IP>:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{"prompt": "Hola Matías", "sessionId": "<session_id>"}'

# 5. Generador de código Java
curl -X POST http://<EC2_PUBLIC_IP>:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{"prompt": "Crea clase Usuario con Builder", "model": "pardos-code:latest"}'

# 6. Análisis de aplicaciones
curl -X POST http://<EC2_PUBLIC_IP>:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{"prompt": "Analiza esta arquitectura", "model": "pardos-analyzer:latest"}'
```

**Respuesta:**
```json
{
  "reply": "Respuesta del modelo de IA..."
}
```

#### **5. Listar Modelos - `/api/models`**
**Descripción:** Obtiene todos los modelos instalados en Ollama.

**Headers:** `Authorization: Bearer <token>`

**Ejemplo:**
```bash
curl http://<EC2_PUBLIC_IP>:3000/api/models \
  -H "Authorization: Bearer <tu_token>"
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
      "name": "pardos-code:latest",
      "size": 4661224676,
      "digest": "sha256:..."
    },
    {
      "name": "pardos-analyzer:latest",
      "size": 4661224676,
      "digest": "sha256:..."
    },
    {
      "name": "llama3:8b",
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
- `Authorization: Bearer <token>` (para endpoints protegidos)

**Flujo de testing:**
1. POST `/api/register` - Crear usuario
2. POST `/api/login` - Obtener token
3. POST `/api/session` - Crear sesión
4. POST `/api/chat` - Chatear con contexto

**Timeout configurado:** 10 minutos (para respuestas largas de IA)

### 🤖 **Modelos de IA disponibles**

El sistema incluye **4 modelos de Ollama:**

1. **`llama3:8b`** - Modelo base de Meta
   - Modelo general sin personalización
   - Usado como base para otros modelos

2. **`pardos-assistant:latest`** - Chat personal con Matías Pardo
   - Entrenado con información personal y profesional
   - Responde como Matías en primera persona
   - Incluye experiencia laboral, proyectos y estudios
   - **Temperatura:** 1.0 (creativo y natural)

3. **`pardos-code:latest`** - Generador de código Java
   - Optimizado para generar código con buenas prácticas
   - Sigue principios SOLID y patrones de diseño
   - Respuestas directas sin explicaciones adicionales
   - **Temperatura:** 0.1 (preciso y determinístico)

4. **`pardos-analyzer:latest`** - Analizador de aplicaciones
   - Especializado en análisis de arquitectura de software
   - Identifica patrones, tecnologías y mejoras
   - Contexto extendido (8192 tokens)
   - **Temperatura:** 0.3 (balance entre precisión y creatividad)

### ⚙️ **Parámetros de configuración de modelos**

Cada modelo usa parámetros específicos en sus archivos `diag` para optimizar su comportamiento:

#### **PARAMETER temperature**
- **Rango:** 0.0 - 2.0
- **Función:** Controla la creatividad/aleatoriedad de las respuestas
- **Valores:**
  - `0.1` (pardos-code) - Respuestas muy precisas y determinísticas
  - `0.3` (pardos-analyzer) - Balance entre creatividad y precisión
  - `0.7` (llama3-base) - Balance entre creatividad y precisión
  - `1.0` (pardos-assistant) - Respuestas más creativas y naturales

#### **PARAMETER top_p**
- **Rango:** 0.0 - 1.0
- **Función:** Controla la diversidad de palabras consideradas
- **Valor:** `0.9` - Considera el 90% de las opciones más probables

#### **PARAMETER num_ctx**
- **Función:** Define el tamaño del contexto (memoria)
- **Valores:** 
  - `4096` tokens - Conversaciones normales
  - `8192` tokens - Análisis de aplicaciones (pardos-analyzer)

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

# Desde API del backend (requiere token)
curl http://<EC2_PUBLIC_IP>:3000/api/models \
  -H "Authorization: Bearer <tu_token>"
```

---

### 🔐 **Sistema de Autenticación**

**Características:**
- **JWT Tokens** - Autenticación sin librerías externas
- **Persistencia** - Los usuarios se guardan en archivo JSON
- **Sesiones con contexto** - Mantiene conversaciones largas
- **Protección completa** - Todas las apps requieren login
- **Logout funcional** - Limpia tokens del navegador

**Flujo de usuario:**
1. Acceder a cualquier app → Redirección a `/login.html`
2. Registrarse o iniciar sesión
3. Token se guarda en localStorage
4. Acceso a todas las aplicaciones
5. Token persiste al recargar página
6. Botón "Salir" limpia sesión

### 🏗️ **Arquitectura del Backend**

**Estructura modular:**
```
backend/
├── server.js              # Servidor principal
├── middleware/
│   └── auth.js            # Middleware JWT
├── routes/
│   ├── auth.js            # Login/registro
│   └── chat.js            # Chat/modelos
├── services/
│   ├── userService.js     # Gestión usuarios
│   ├── sessionService.js  # Sesiones con contexto
│   └── ollamaService.js   # Comunicación IA
└── utils/
    └── auth.js            # Utilidades JWT
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
- **Sistema completo con login** - 4 aplicaciones protegidas
- **Backend modular** - Código limpio y escalable
- **4 modelos especializados** - Chat, código, análisis y base
- **Sesiones persistentes** - Contexto mantenido entre mensajes
- **Datos persistentes** - Usuarios y sesiones sobreviven reinicios
- **Sin SSL** - Funciona completamente con HTTP
- **Timeout de 10 minutos** - Para respuestas largas de IA

