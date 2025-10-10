@echo off
set DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/qrdb
set PORT=3001
set JWT_SECRET=supersecreto
set S3_ENDPOINT=http://localhost:9000
set S3_REGION=us-east-1
set S3_ACCESS_KEY=minio
set S3_SECRET_KEY=minio12345
set S3_BUCKET=inmuebles
set S3_USE_SSL=false
set CORS_ORIGIN=http://localhost:3000

echo Iniciando API con variables de entorno configuradas...
echo DATABASE_URL: %DATABASE_URL%

npm run dev
