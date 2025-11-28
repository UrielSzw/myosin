-- Migration: Create macro tracking tables (local SQLite)
-- These tables store macro nutrient tracking data separately from the generic tracker

-- Macro targets table - user's daily goals
CREATE TABLE IF NOT EXISTS macro_targets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  protein_target REAL NOT NULL,
  carbs_target REAL NOT NULL,
  fats_target REAL NOT NULL,
  name TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_macro_targets_user ON macro_targets(user_id);
CREATE INDEX IF NOT EXISTS idx_macro_targets_active ON macro_targets(user_id, is_active);

-- Macro entries table - individual food/meal entries
CREATE TABLE IF NOT EXISTS macro_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  protein REAL NOT NULL,
  carbs REAL NOT NULL,
  fats REAL NOT NULL,
  label TEXT,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  day_key TEXT NOT NULL,
  recorded_at TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_macro_entries_user ON macro_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_macro_entries_day ON macro_entries(user_id, day_key);
CREATE INDEX IF NOT EXISTS idx_macro_entries_recorded ON macro_entries(recorded_at);

-- Macro daily aggregates table - pre-calculated daily totals
CREATE TABLE IF NOT EXISTS macro_daily_aggregates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  day_key TEXT NOT NULL,
  total_protein REAL NOT NULL,
  total_carbs REAL NOT NULL,
  total_fats REAL NOT NULL,
  entry_count INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, day_key)
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_macro_aggregate_day ON macro_daily_aggregates(user_id, day_key);
CREATE INDEX IF NOT EXISTS idx_macro_aggregates_day ON macro_daily_aggregates(day_key);

-- Macro quick actions table - predefined food shortcuts
CREATE TABLE IF NOT EXISTS macro_quick_actions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  label TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  protein REAL NOT NULL,
  carbs REAL NOT NULL,
  fats REAL NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_predefined INTEGER NOT NULL DEFAULT 0,
  slug TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_macro_quick_actions_user ON macro_quick_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_macro_quick_actions_position ON macro_quick_actions(user_id, position);
