-- Migration: Add distance_unit column to user_preferences (local SQLite)
-- This column stores user's preference for distance display: metric (m/km) or imperial (ft/mi)
-- Data is always stored in metric units (meters/km)

ALTER TABLE user_preferences ADD COLUMN distance_unit TEXT DEFAULT 'metric' NOT NULL;
