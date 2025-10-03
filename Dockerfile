# Etapa 1: Instalar dependencias y construir el proyecto
FROM node:18-alpine AS builder

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar solo los archivos de manifiesto para aprovechar la caché de Docker
COPY package.json pnpm-lock.yaml ./
COPY packages/api/package.json ./packages/api/
COPY packages/web/package.json ./packages/web/

# Instalar dependencias del monorepo
RUN pnpm install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Construir todos los paquetes del workspace
RUN pnpm run build

# Etapa 2: Crear la imagen de producción final
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/packages/web /app

EXPOSE 3000
CMD ["node", "server.js"]