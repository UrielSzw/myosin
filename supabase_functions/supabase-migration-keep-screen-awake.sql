-- Migration: Add keep_screen_awake column to user_preferences
-- Purpose: Control whether screen stays on during active workouts
-- Default is true (screen stays on)

-- Add the column with a default value
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS keep_screen_awake BOOLEAN DEFAULT true NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN user_preferences.keep_screen_awake IS 
'User preference to keep screen awake during active workouts. Default is true.';
