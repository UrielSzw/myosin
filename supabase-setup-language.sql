-- ============================================================================
-- SUPABASE SETUP SCRIPT: Language Support
-- ============================================================================
-- This script sets up language support in the user_preferences table
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- STEP 1: Add language column to existing table
-- ============================================================================
ALTER TABLE user_preferences
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'es' NOT NULL;

COMMENT ON COLUMN user_preferences.language IS 'User preferred language: "en" (English) or "es" (Spanish)';

-- STEP 2: Update existing records to have default language
-- ============================================================================
-- Set Spanish as default for existing users (optional, only if you have existing data)
UPDATE user_preferences
SET language = 'es'
WHERE language IS NULL;

-- STEP 3: Update the trigger function to include language
-- ============================================================================
CREATE OR REPLACE FUNCTION create_user_preferences_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_preferences (
        user_id,
        theme,
        weight_unit,
        language,
        show_rpe,
        show_tempo
    ) VALUES (
        NEW.id,              -- user_id from auth.users
        'dark',              -- default theme
        'kg',                -- default weight unit
        'es',                -- default language (Spanish)
        false,               -- default show_rpe
        false                -- default show_tempo
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 4: Verify the setup
-- ============================================================================
-- Run this query to confirm the column exists:
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_preferences' 
  AND column_name = 'language';

-- Expected result:
-- column_name | data_type | column_default | is_nullable
-- language    | text      | 'es'::text     | NO

-- ============================================================================
-- ROLLBACK (if needed)
-- ============================================================================
-- If you need to undo these changes, run:
-- ALTER TABLE user_preferences DROP COLUMN IF EXISTS language;
-- ============================================================================

-- ============================================================================
-- NOTES:
-- ============================================================================
-- - Default language is 'es' (Spanish)
-- - Supported languages: 'en' (English), 'es' (Spanish)
-- - The trigger automatically creates preferences for new users
-- - Existing users need to update via the app or manual SQL update
-- ============================================================================
