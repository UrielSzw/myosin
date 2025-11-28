-- Migration: Add haptic_feedback_enabled column to user_preferences
-- Purpose: Allow users to enable/disable vibration feedback throughout the app
-- Default is true (haptics enabled)

-- Add the column with a default value
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS haptic_feedback_enabled BOOLEAN DEFAULT true NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN user_preferences.haptic_feedback_enabled IS 
'User preference to enable/disable haptic (vibration) feedback. Default is true.';
