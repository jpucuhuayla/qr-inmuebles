@echo off
cd packages\api
echo Aplicando migracion de base de datos...
npx prisma db push
echo.
echo Migracion completada!
pause
