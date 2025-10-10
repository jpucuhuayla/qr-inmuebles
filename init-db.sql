-- Crear todas las tablas desde cero con los nuevos campos

CREATE TABLE IF NOT EXISTS "Property" (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT,
  area_m2 DECIMAL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking_spaces INTEGER,
  price_usd DECIMAL,
  price_sol DECIMAL,
  description TEXT,
  common_areas TEXT,
  main_image_key TEXT,
  status TEXT DEFAULT 'disponible',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "PropertyFile" (
  id TEXT PRIMARY KEY,
  property_id TEXT NOT NULL,
  file_type TEXT NOT NULL,
  object_key TEXT NOT NULL,
  original_name TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES "Property"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_property_slug ON "Property"(slug);
CREATE INDEX IF NOT EXISTS idx_property_type ON "Property"(type);
CREATE INDEX IF NOT EXISTS idx_property_district ON "Property"(district);
CREATE INDEX IF NOT EXISTS idx_property_status ON "Property"(status);
CREATE INDEX IF NOT EXISTS idx_propertyfile_property_id ON "PropertyFile"(property_id);
CREATE INDEX IF NOT EXISTS idx_user_username ON "User"(username);
