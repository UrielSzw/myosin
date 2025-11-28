-- ============================================================================
-- MIGRATION: Add language column to user_preferences
-- ============================================================================
-- This migration adds support for multi-language preferences
-- Date: 2025-11-24
-- ============================================================================

-- Add language column to user_preferences table
ALTER TABLE user_preferences
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'es' NOT NULL;

-- Add comment to document the column
COMMENT ON COLUMN user_preferences.language IS 'User preferred language: "en" (English) or "es" (Spanish)';

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this to verify the column was added successfully:
-- SELECT column_name, data_type, column_default, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'user_preferences' AND column_name = 'language';
-- ============================================================================
