-- Migration: Add haptic_feedback_enabled column
-- Adds haptic feedback preference to user_preferences

ALTER TABLE user_preferences ADD COLUMN haptic_feedback_enabled INTEGER DEFAULT 1 NOT NULL;
