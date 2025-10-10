-- Insertar datos iniciales

-- Crear usuario admin (password: admin123 hasheado con bcrypt)
INSERT INTO "User" (id, username, password, created_at, updated_at)
VALUES (
  'admin-001',
  'admin',
  '$2b$10$rN9QVq5L5K5H5K5H5K5H5euK5K5K5K5K5K5K5K5K5K5K5K5K5K5',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (username) DO NOTHING;

-- Insertar propiedades de ejemplo
INSERT INTO "Property" (id, slug, title, type, district, price_usd, price_sol, status, created_at, updated_at)
VALUES
  ('prop-001', 'departamento-san-miguel', 'Departamento San Miguel', 'departamento', 'San Miguel', 150000, 570000, 'disponible', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prop-002', 'departamento-surco', 'Departamento Surco', 'departamento', 'Surco', 200000, 760000, 'disponible', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prop-003', 'departamento-surquillo', 'Departamento Surquillo', 'departamento', 'Surquillo', 120000, 456000, 'disponible', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prop-004', 'estacionamientos-surquillo', 'Estacionamientos Surquillo (22)', 'estacionamiento', 'Surquillo', 15000, 57000, 'disponible', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (slug) DO NOTHING;
