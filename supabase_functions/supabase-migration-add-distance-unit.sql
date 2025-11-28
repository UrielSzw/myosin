-- Migration: Add distance_unit column to user_preferences
-- Purpose: Support imperial/metric distance units (feet/miles vs meters/km)
-- Distance is stored canonically in meters (short) and kilometers (long)
-- This preference controls UI display conversion only

-- Add the column with a default value
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS distance_unit TEXT DEFAULT 'metric' NOT NULL;

-- Add check constraint to ensure valid values
ALTER TABLE user_preferences 
ADD CONSTRAINT user_preferences_distance_unit_check 
CHECK (distance_unit IN ('metric', 'imperial'));

-- Comment for documentation
COMMENT ON COLUMN user_preferences.distance_unit IS 
'User preference for distance display: metric (m/km) or imperial (ft/mi). Data is stored in metric units.';
