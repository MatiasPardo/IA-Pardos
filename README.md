
# IA Pardo Final Setup 🚀

Este proyecto contiene:
✅ Backend (Node.js) → comunica con Ollama
✅ Ollama assistant (Python)
✅ Frontend (HTML estático) servido por NGINX
✅ Configuración completa en `docker-compose.yml`

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

### 🌐 Accesos finales

- Frontend presentación:
  ```
  http://<EC2_PUBLIC_IP>
  ```

- Chat con Matías Pardo:
  ```
  http://<EC2_PUBLIC_IP>/chat/index.html
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

⚠ **NOTA:** Ollama no queda expuesto al exterior. Solo el backend puede comunicarse con él.
