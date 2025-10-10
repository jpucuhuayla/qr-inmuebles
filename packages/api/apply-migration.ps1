# Script PowerShell para aplicar la migración
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/qrdb"

Write-Host "Aplicando cambios al esquema de la base de datos..." -ForegroundColor Green
npx prisma db push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nMigración completada exitosamente!" -ForegroundColor Green
} else {
    Write-Host "`nError al aplicar la migración" -ForegroundColor Red
}

Read-Host "`nPresiona Enter para continuar"
