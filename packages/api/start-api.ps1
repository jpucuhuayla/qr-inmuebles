# Script PowerShell para iniciar el API con las variables de entorno correctas
$env:DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:5432/qrdb"
$env:PORT = "3001"
$env:JWT_SECRET = "supersecreto"
$env:S3_ENDPOINT = "http://localhost:9000"
$env:S3_REGION = "us-east-1"
$env:S3_ACCESS_KEY = "minio"
$env:S3_SECRET_KEY = "minio12345"
$env:S3_BUCKET = "inmuebles"
$env:S3_USE_SSL = "false"
$env:CORS_ORIGIN = "http://localhost:3000"

Write-Host "Iniciando API con variables de entorno configuradas..." -ForegroundColor Green
Write-Host "DATABASE_URL: $env:DATABASE_URL" -ForegroundColor Yellow

npm run dev
