-- ============================================
-- MIGRATION: Quick Workout Feature
-- Date: 2024-11-26
-- ============================================
-- This migration adds support for Quick Workout feature:
-- 1. Adds is_quick_workout column to routines table
-- 2. Creates index for filtering quick workouts
-- ============================================

-- ============================================
-- STEP 1: Add is_quick_workout column to routines
-- ============================================
ALTER TABLE routines 
ADD COLUMN IF NOT EXISTS is_quick_workout BOOLEAN NOT NULL DEFAULT false;

-- ============================================
-- STEP 2: Create index for efficient filtering
-- ============================================
-- Index para filtrar rutinas normales (no quick workouts) eficientemente
CREATE INDEX IF NOT EXISTS idx_routines_is_quick_workout 
ON routines(is_quick_workout);

-- Índice parcial para queries que solo buscan rutinas normales
-- (más eficiente que un índice completo)
CREATE INDEX IF NOT EXISTS idx_routines_active_normal 
ON routines(created_by_user_id, folder_id) 
WHERE deleted_at IS NULL AND is_quick_workout = false;

-- ============================================
-- DONE!
-- ============================================
-- Summary of changes:
-- ✅ routines.is_quick_workout added (BOOLEAN, default false)
-- ✅ Index for filtering quick workouts
-- ✅ Partial index for active normal routines
-- ============================================
