-- Agregar columna name_search para búsquedas rápidas (lowercase, sin acentos)
ALTER TABLE exercises ADD COLUMN name_search TEXT;

-- Crear índice para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_exercises_name_search ON exercises(name_search);
