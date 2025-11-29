-- =====================================================
-- ONBOARDING FIELDS FOR USER_PREFERENCES
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Add onboarding columns to user_preferences
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS biological_sex TEXT,
ADD COLUMN IF NOT EXISTS birth_date TEXT,
ADD COLUMN IF NOT EXISTS height_cm REAL,
ADD COLUMN IF NOT EXISTS initial_weight_kg REAL,
ADD COLUMN IF NOT EXISTS fitness_goal TEXT,
ADD COLUMN IF NOT EXISTS activity_level TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Add check constraints for valid values
ALTER TABLE user_preferences 
ADD CONSTRAINT check_biological_sex 
CHECK (biological_sex IS NULL OR biological_sex IN ('male', 'female'));

ALTER TABLE user_preferences 
ADD CONSTRAINT check_fitness_goal 
CHECK (fitness_goal IS NULL OR fitness_goal IN ('lose_fat', 'maintain', 'gain_muscle'));

ALTER TABLE user_preferences 
ADD CONSTRAINT check_activity_level 
CHECK (activity_level IS NULL OR activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active'));

-- Create index for onboarding status queries
CREATE INDEX IF NOT EXISTS idx_user_preferences_onboarding 
ON user_preferences(user_id, onboarding_completed);

COMMENT ON COLUMN user_preferences.biological_sex IS 'Sex assigned at birth for metabolic calculations';
COMMENT ON COLUMN user_preferences.birth_date IS 'Date of birth in YYYY-MM-DD format';
COMMENT ON COLUMN user_preferences.height_cm IS 'Height in centimeters';
COMMENT ON COLUMN user_preferences.initial_weight_kg IS 'Initial weight in kilograms from onboarding';
COMMENT ON COLUMN user_preferences.fitness_goal IS 'Primary fitness goal: lose_fat, maintain, or gain_muscle';
COMMENT ON COLUMN user_preferences.activity_level IS 'Daily activity level for TDEE calculations';
COMMENT ON COLUMN user_preferences.onboarding_completed IS 'Whether user has completed the onboarding flow';
COMMENT ON COLUMN user_preferences.onboarding_completed_at IS 'Timestamp when onboarding was completed';
