# Guía de Despliegue - Sistema de Inmuebles QR

## Resumen del Sistema

- **Frontend**: Next.js 14 (puerto 3002)
- **Backend API**: NestJS (puerto 3001)
- **Base de datos**: PostgreSQL (puerto 5433)
- **Almacenamiento**: MinIO S3 (puerto 9000, consola 9001)

## Opción 1: Despliegue en Servidor VPS (Recomendado)

### Requisitos previos
- Servidor Linux (Ubuntu 22.04 o superior)
- Dominio configurado (ej: tudominio.com)
- Acceso SSH al servidor
- Docker y Docker Compose instalados

### Pasos de Despliegue

#### 1. Preparar el Servidor

```bash
# Conectarse al servidor
ssh usuario@tu-servidor.com

# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt install docker-compose -y

# Instalar Node.js y pnpm (para builds)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g pnpm
```

#### 2. Clonar/Subir el Proyecto

```bash
# Opción A: Si usas Git
git clone tu-repositorio.git qr-inmuebles
cd qr-inmuebles

# Opción B: Subir archivos con SCP desde tu máquina local
# En tu máquina local, ejecuta:
scp -r D:\SOFTWARE\QR_INMUEBLES usuario@tu-servidor.com:~/qr-inmuebles
```

#### 3. Configurar Variables de Entorno para Producción

Crear archivo `.env.production` en la raíz:

```env
# Base de datos
DATABASE_URL=postgresql://postgres:TU_PASSWORD_SEGURO@postgres:5432/qrdb

# Backend API
PORT=3001
JWT_SECRET=TU_JWT_SECRET_MUY_SEGURO_AQUI
CORS_ORIGIN=https://tudominio.com

# S3/MinIO
S3_ENDPOINT=http://minio:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=TU_MINIO_ACCESS_KEY
S3_SECRET_KEY=TU_MINIO_SECRET_KEY_SEGURO
S3_BUCKET=inmuebles
S3_USE_SSL=false

# Admin
ADMIN_USER=admin
ADMIN_PASS=TU_PASSWORD_ADMIN_SEGURO
```

Crear `.env` para el frontend en `packages/web/`:

```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com
NEXT_PUBLIC_BASE_URL=https://tudominio.com
```

#### 4. Construir la Aplicación

```bash
# Instalar dependencias
pnpm install

# Construir backend
cd packages/api
pnpm build

# Construir frontend
cd ../web
pnpm build
```

#### 5. Configurar Docker Compose para Producción

El archivo `docker-compose.yml` ya está configurado. Solo necesitas actualizarlo con passwords seguros.

#### 6. Iniciar los Servicios

```bash
# Iniciar PostgreSQL y MinIO
docker-compose up -d

# Esperar a que PostgreSQL esté listo
sleep 10

# Ejecutar migraciones
cd packages/api
npx prisma db push
npx ts-node seed.ts

# Crear bucket en MinIO
docker exec qr_inmuebles-minio-1 mc alias set localminio http://localhost:9000 minio minio12345
docker exec qr_inmuebles-minio-1 mc mb localminio/inmuebles
docker exec qr_inmuebles-minio-1 mc anonymous set download localminio/inmuebles
```

#### 7. Configurar Nginx como Reverse Proxy

```bash
# Instalar Nginx
sudo apt install nginx -y

# Crear configuración
sudo nano /etc/nginx/sites-available/qr-inmuebles
```

Contenido del archivo:

```nginx
# Frontend
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar configuración
sudo ln -s /etc/nginx/sites-available/qr-inmuebles /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 8. Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificados SSL
sudo certbot --nginx -d tudominio.com -d www.tudominio.com -d api.tudominio.com
```

#### 9. Crear Servicios Systemd para Auto-inicio

**Servicio para Backend:**

```bash
sudo nano /etc/systemd/system/qr-api.service
```

```ini
[Unit]
Description=QR Inmuebles API
After=network.target postgresql.service

[Service]
Type=simple
User=tu-usuario
WorkingDirectory=/home/tu-usuario/qr-inmuebles/packages/api
ExecStart=/usr/bin/node dist/main.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

**Servicio para Frontend:**

```bash
sudo nano /etc/systemd/system/qr-web.service
```

```ini
[Unit]
Description=QR Inmuebles Web
After=network.target

[Service]
Type=simple
User=tu-usuario
WorkingDirectory=/home/tu-usuario/qr-inmuebles/packages/web
ExecStart=/usr/bin/node .next/standalone/server.js
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3002

[Install]
WantedBy=multi-user.target
```

```bash
# Habilitar e iniciar servicios
sudo systemctl daemon-reload
sudo systemctl enable qr-api qr-web
sudo systemctl start qr-api qr-web

# Verificar estado
sudo systemctl status qr-api
sudo systemctl status qr-web
```

---

## Opción 2: Despliegue con Docker Completo

Crear `Dockerfile` para el backend en `packages/api/`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .
RUN npx prisma generate
RUN pnpm build

EXPOSE 3001

CMD ["node", "dist/main.js"]
```

Crear `Dockerfile` para el frontend en `packages/web/`:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3002

CMD ["node", "server.js"]
```

Actualizar `docker-compose.yml` completo:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: postgres
      POSTGRES_DB: qrdb
    ports:
      - "5433:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: always

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio:/data
    restart: always

  api:
    build:
      context: ./packages/api
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      S3_ENDPOINT: ${S3_ENDPOINT}
      S3_ACCESS_KEY: ${S3_ACCESS_KEY}
      S3_SECRET_KEY: ${S3_SECRET_KEY}
      S3_BUCKET: ${S3_BUCKET}
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - minio
    restart: always

  web:
    build:
      context: ./packages/web
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      NEXT_PUBLIC_BASE_URL: ${NEXT_PUBLIC_BASE_URL}
    ports:
      - "3002:3002"
    depends_on:
      - api
    restart: always

volumes:
  pgdata:
  minio:
```

---

## Opción 3: Despliegue en Vercel (Frontend) + Railway/Render (Backend)

### Frontend en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno:
   - `NEXT_PUBLIC_API_URL`: URL de tu backend
   - `NEXT_PUBLIC_BASE_URL`: URL de Vercel
3. Deploy automático

### Backend en Railway/Render

1. Conecta tu repositorio
2. Configura las variables de entorno
3. Agrega PostgreSQL y MinIO como servicios
4. Deploy automático

---

## Checklist de Pre-Despliegue

- [ ] Cambiar todas las contraseñas por valores seguros
- [ ] Configurar dominio y DNS
- [ ] Configurar SSL/HTTPS
- [ ] Configurar backups automáticos de PostgreSQL
- [ ] Configurar backups de MinIO
- [ ] Configurar monitoreo (PM2, UptimeRobot, etc.)
- [ ] Probar todas las funcionalidades en producción
- [ ] Configurar logs
- [ ] Documentar credenciales de forma segura

---

## Mantenimiento

### Backup de Base de Datos

```bash
# Crear backup
docker exec qr_inmuebles-postgres-1 pg_dump -U postgres qrdb > backup_$(date +%Y%m%d).sql

# Restaurar backup
cat backup_20251010.sql | docker exec -i qr_inmuebles-postgres-1 psql -U postgres qrdb
```

### Backup de Archivos MinIO

```bash
# Backup
docker exec qr_inmuebles-minio-1 mc mirror localminio/inmuebles /backup/inmuebles

# Restaurar
docker exec qr_inmuebles-minio-1 mc mirror /backup/inmuebles localminio/inmuebles
```

### Ver Logs

```bash
# Backend
sudo journalctl -u qr-api -f

# Frontend
sudo journalctl -u qr-web -f

# Docker
docker-compose logs -f
```

---

## Seguridad

1. **Firewall**: Configura UFW para permitir solo puertos necesarios
2. **Fail2ban**: Protección contra ataques de fuerza bruta
3. **Actualizaciones**: Mantén el sistema actualizado
4. **Backups**: Automatiza backups diarios
5. **Monitoreo**: Configura alertas de uptime

---

## Soporte

Para más información, consulta la documentación de:
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Docker Compose](https://docs.docker.com/compose/)
