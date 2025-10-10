#!/bin/bash

echo "========================================="
echo "  Despliegue - Sistema QR Inmuebles"
echo "========================================="

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Ejecuta este script desde la raíz del proyecto${NC}"
    exit 1
fi

echo -e "${YELLOW}1. Instalando dependencias...${NC}"
pnpm install

echo -e "${YELLOW}2. Construyendo backend...${NC}"
cd packages/api
pnpm build
if [ $? -ne 0 ]; then
    echo -e "${RED}Error al construir el backend${NC}"
    exit 1
fi
cd ../..

echo -e "${YELLOW}3. Construyendo frontend...${NC}"
cd packages/web
pnpm build
if [ $? -ne 0 ]; then
    echo -e "${RED}Error al construir el frontend${NC}"
    exit 1
fi
cd ../..

echo -e "${YELLOW}4. Iniciando servicios Docker...${NC}"
docker-compose up -d
sleep 5

echo -e "${YELLOW}5. Aplicando migraciones de base de datos...${NC}"
cd packages/api
npx prisma db push --accept-data-loss
if [ $? -ne 0 ]; then
    echo -e "${RED}Error en migraciones${NC}"
    exit 1
fi

echo -e "${YELLOW}6. Ejecutando seed de datos...${NC}"
npx ts-node seed.ts

echo -e "${YELLOW}7. Configurando MinIO...${NC}"
docker exec qr_inmuebles-minio-1 mc alias set localminio http://localhost:9000 minio minio12345
docker exec qr_inmuebles-minio-1 mc mb localminio/inmuebles --ignore-existing
docker exec qr_inmuebles-minio-1 mc anonymous set download localminio/inmuebles

cd ../..

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  Despliegue completado exitosamente!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Servicios disponibles:"
echo "  - Frontend: http://localhost:3002"
echo "  - Backend API: http://localhost:3001"
echo "  - PostgreSQL: localhost:5433"
echo "  - MinIO: http://localhost:9000"
echo "  - MinIO Console: http://localhost:9001"
echo ""
echo -e "${YELLOW}Para iniciar los servicios de aplicación:${NC}"
echo "  - Backend: cd packages/api && node dist/main.js"
echo "  - Frontend: cd packages/web && node .next/standalone/server.js"
