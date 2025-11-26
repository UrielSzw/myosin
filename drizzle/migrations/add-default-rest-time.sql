-- Migration: Add default_rest_time_seconds to user_preferences
-- Date: 2025-11-25

ALTER TABLE user_preferences ADD COLUMN default_rest_time_seconds INTEGER NOT NULL DEFAULT 60;
