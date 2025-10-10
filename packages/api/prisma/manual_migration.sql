-- Migración manual para agregar campos de visualización
-- Ejecutar este script si Prisma migrate no funciona

-- Agregar nuevos campos a la tabla Property
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS price_sol DECIMAL;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS common_areas TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS main_image_key TEXT;
