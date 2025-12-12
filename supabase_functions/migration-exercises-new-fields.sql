-- ============================================================================
-- MIGRATION: Add new fields to exercises table
-- Date: 2024-12-11
-- Description: Adds difficulty, unilateral, movement_pattern, adds_bodyweight, 
--              and common_mistakes fields to the exercises table
-- ============================================================================

-- Add new columns to exercises table
ALTER TABLE exercises
ADD COLUMN IF NOT EXISTS difficulty INTEGER,
ADD COLUMN IF NOT EXISTS unilateral BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS movement_pattern TEXT,
ADD COLUMN IF NOT EXISTS adds_bodyweight BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS common_mistakes JSONB DEFAULT '[]'::jsonb;

-- Add CHECK constraint for difficulty (1-5)
ALTER TABLE exercises
ADD CONSTRAINT exercises_difficulty_range 
CHECK (difficulty IS NULL OR (difficulty >= 1 AND difficulty <= 5));

-- Add CHECK constraint for movement_pattern valid values
ALTER TABLE exercises
ADD CONSTRAINT exercises_movement_pattern_valid 
CHECK (movement_pattern IS NULL OR movement_pattern IN (
  'push', 'pull', 'squat', 'hinge', 'lunge', 'carry', 'rotation', 'isometric'
));

-- Add comments for documentation
COMMENT ON COLUMN exercises.difficulty IS 'Technical difficulty level 1-5 (1=beginner, 5=advanced)';
COMMENT ON COLUMN exercises.unilateral IS 'Whether the exercise works one side at a time';
COMMENT ON COLUMN exercises.movement_pattern IS 'Movement pattern: push, pull, squat, hinge, lunge, carry, rotation, isometric';
COMMENT ON COLUMN exercises.adds_bodyweight IS 'Whether bodyweight is added to the load (e.g., weighted pull-ups, dips)';
COMMENT ON COLUMN exercises.common_mistakes IS 'JSON array of common mistakes strings';

-- ============================================================================
-- Optional: Update existing exercises with default values (run only if needed)
-- ============================================================================

-- UPDATE exercises SET 
--   difficulty = 3,
--   unilateral = false,
--   movement_pattern = NULL,
--   adds_bodyweight = false,
--   common_mistakes = '[]'::jsonb
-- WHERE difficulty IS NULL;

-- ============================================================================
-- Verify migration
-- ============================================================================

-- Check new columns exist:
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'exercises' 
-- AND column_name IN ('difficulty', 'unilateral', 'movement_pattern', 'adds_bodyweight', 'common_mistakes');
