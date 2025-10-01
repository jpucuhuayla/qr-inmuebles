# QR Inmuebles – Monorepo

Stack: Next.js 14 + NestJS + Prisma (PostgreSQL) + MinIO (S3) + Tailwind + JWT. Despliegue en Railway.

## Local
```bash
pnpm i
docker compose up -d
# API
cp packages/api/.env.example packages/api/.env
pnpm --filter api prisma:generate
pnpm --filter api db:push
pnpm --filter api db:seed
pnpm --filter api dev
# Web
cp packages/web/.env.example packages/web/.env
pnpm --filter web dev
```
