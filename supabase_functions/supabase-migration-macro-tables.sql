-- =====================================================
-- MACRO TRACKING TABLES FOR SUPABASE
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Macro targets table - user's daily goals
CREATE TABLE IF NOT EXISTS macro_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  protein_target REAL NOT NULL,
  carbs_target REAL NOT NULL,
  fats_target REAL NOT NULL,
  name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_macro_targets_user ON macro_targets(user_id);
CREATE INDEX IF NOT EXISTS idx_macro_targets_active ON macro_targets(user_id, is_active);

-- Enable RLS
ALTER TABLE macro_targets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for macro_targets
CREATE POLICY "Users can view their own macro targets"
  ON macro_targets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own macro targets"
  ON macro_targets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own macro targets"
  ON macro_targets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own macro targets"
  ON macro_targets FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================

-- Macro entries table - individual food/meal entries
CREATE TABLE IF NOT EXISTS macro_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  protein REAL NOT NULL,
  carbs REAL NOT NULL,
  fats REAL NOT NULL,
  label TEXT,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  day_key TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_macro_entries_user ON macro_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_macro_entries_day ON macro_entries(user_id, day_key);
CREATE INDEX IF NOT EXISTS idx_macro_entries_recorded ON macro_entries(recorded_at);

-- Enable RLS
ALTER TABLE macro_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for macro_entries
CREATE POLICY "Users can view their own macro entries"
  ON macro_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own macro entries"
  ON macro_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own macro entries"
  ON macro_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own macro entries"
  ON macro_entries FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================

-- Macro daily aggregates table - pre-calculated daily totals
CREATE TABLE IF NOT EXISTS macro_daily_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_key TEXT NOT NULL,
  total_protein REAL NOT NULL,
  total_carbs REAL NOT NULL,
  total_fats REAL NOT NULL,
  entry_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day_key)
);

CREATE INDEX IF NOT EXISTS idx_macro_aggregates_day ON macro_daily_aggregates(day_key);

-- Enable RLS
ALTER TABLE macro_daily_aggregates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for macro_daily_aggregates
CREATE POLICY "Users can view their own macro aggregates"
  ON macro_daily_aggregates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own macro aggregates"
  ON macro_daily_aggregates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own macro aggregates"
  ON macro_daily_aggregates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own macro aggregates"
  ON macro_daily_aggregates FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================

-- Macro quick actions table - predefined food shortcuts
CREATE TABLE IF NOT EXISTS macro_quick_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  protein REAL NOT NULL,
  carbs REAL NOT NULL,
  fats REAL NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  is_predefined BOOLEAN NOT NULL DEFAULT false,
  slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_macro_quick_actions_user ON macro_quick_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_macro_quick_actions_position ON macro_quick_actions(user_id, position);

-- Enable RLS
ALTER TABLE macro_quick_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for macro_quick_actions
CREATE POLICY "Users can view their own macro quick actions"
  ON macro_quick_actions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own macro quick actions"
  ON macro_quick_actions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own macro quick actions"
  ON macro_quick_actions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own macro quick actions"
  ON macro_quick_actions FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- HELPER FUNCTION: Calculate calories from macros
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_macro_calories(p_protein REAL, p_carbs REAL, p_fats REAL)
RETURNS INTEGER AS $$
BEGIN
  RETURN ROUND(p_protein * 4 + p_carbs * 4 + p_fats * 9);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
