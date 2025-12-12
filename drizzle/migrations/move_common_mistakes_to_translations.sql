-- =============================================
-- MIGRATION: Move common_mistakes from exercises to exercise_translations
-- =============================================
-- 
-- Razón: common_mistakes debe estar traducido por idioma, no ser un campo
-- único en la tabla exercises.
--
-- Este script:
-- 1. Agrega la columna common_mistakes a exercise_translations
-- 2. Copia los datos existentes de exercises a ambos idiomas (como fallback)
-- 3. Elimina la columna de exercises
--
-- =============================================

-- PASO 1: Agregar columna common_mistakes a exercise_translations
-- =============================================
ALTER TABLE exercise_translations 
ADD COLUMN IF NOT EXISTS common_mistakes JSONB NULL DEFAULT '[]'::jsonb;

-- PASO 2: Migrar datos existentes de exercises a exercise_translations
-- =============================================
-- Copia los common_mistakes actuales a las traducciones existentes
-- (esto es un fallback, después se pueden traducir manualmente)
UPDATE exercise_translations et
SET common_mistakes = e.common_mistakes
FROM exercises e
WHERE et.exercise_id = e.id
  AND e.common_mistakes IS NOT NULL
  AND e.common_mistakes != '[]'::jsonb;

-- PASO 3: Eliminar columna de exercises (OPCIONAL - ejecutar cuando esté seguro)
-- =============================================
-- Descomentar cuando estés listo para eliminar la columna:
-- ALTER TABLE exercises DROP COLUMN IF EXISTS common_mistakes;

-- =============================================
-- VERIFICACIÓN
-- =============================================
-- Después de ejecutar, verificar con:
-- SELECT et.exercise_id, et.language_code, et.name, et.common_mistakes 
-- FROM exercise_translations et 
-- WHERE et.common_mistakes != '[]'::jsonb 
-- LIMIT 10;
