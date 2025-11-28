-- Migration: Add keep_screen_awake column to user_preferences (local SQLite)
-- This column controls whether the screen stays on during active workouts
-- Default is true (screen stays on)

ALTER TABLE user_preferences ADD COLUMN keep_screen_awake INTEGER DEFAULT 1 NOT NULL;
