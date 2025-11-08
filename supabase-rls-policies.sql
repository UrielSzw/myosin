-- Supabase Row Level Security (RLS) Policies
-- This script sets up RLS policies to ensure users can only access their own data
-- Updated to match the corrected schema with all tables

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_in_block ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_quick_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracker_daily_aggregates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pr_current ENABLE ROW LEVEL SECURITY;
ALTER TABLE pr_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- EXERCISES POLICIES
-- ============================================================================

-- Exercises: Public read for system exercises, user-specific for user-created
CREATE POLICY "Public can view system exercises" ON exercises FOR SELECT USING (
    source = 'system'
);

CREATE POLICY "Users can view own exercises" ON exercises FOR SELECT USING (
    source = 'user_created' AND created_by_user_id = auth.uid()
);

CREATE POLICY "Users can insert own exercises" ON exercises FOR INSERT WITH CHECK (
    source = 'user_created' AND created_by_user_id = auth.uid()
);

CREATE POLICY "Users can update own exercises" ON exercises FOR UPDATE USING (
    source = 'user_created' AND created_by_user_id = auth.uid()
);

CREATE POLICY "Users can delete own exercises" ON exercises FOR DELETE USING (
    source = 'user_created' AND created_by_user_id = auth.uid()
);

-- Exercise images: Follow exercise permissions
CREATE POLICY "Users can view exercise images" ON exercise_images FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM exercises e 
        WHERE e.id = exercise_id 
        AND (e.source = 'system' OR e.created_by_user_id = auth.uid())
    )
);

CREATE POLICY "Users can insert exercise images" ON exercise_images FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM exercises e 
        WHERE e.id = exercise_id 
        AND e.source = 'user_created' 
        AND e.created_by_user_id = auth.uid()
    )
);

CREATE POLICY "Users can update exercise images" ON exercise_images FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM exercises e 
        WHERE e.id = exercise_id 
        AND e.source = 'user_created' 
        AND e.created_by_user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete exercise images" ON exercise_images FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM exercises e 
        WHERE e.id = exercise_id 
        AND e.source = 'user_created' 
        AND e.created_by_user_id = auth.uid()
    )
);

-- ============================================================================
-- FOLDERS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own folders" ON folders FOR SELECT USING (
    auth.uid() = created_by_user_id
);

CREATE POLICY "Users can insert own folders" ON folders FOR INSERT WITH CHECK (
    auth.uid() = created_by_user_id
);

CREATE POLICY "Users can update own folders" ON folders FOR UPDATE USING (
    auth.uid() = created_by_user_id
);

CREATE POLICY "Users can delete own folders" ON folders FOR DELETE USING (
    auth.uid() = created_by_user_id
);

-- ============================================================================
-- ROUTINES POLICIES
-- ============================================================================

CREATE POLICY "Users can view own routines" ON routines FOR SELECT USING (
    auth.uid() = created_by_user_id
);

CREATE POLICY "Users can insert own routines" ON routines FOR INSERT WITH CHECK (
    auth.uid() = created_by_user_id
);

CREATE POLICY "Users can update own routines" ON routines FOR UPDATE USING (
    auth.uid() = created_by_user_id
);

CREATE POLICY "Users can delete own routines" ON routines FOR DELETE USING (
    auth.uid() = created_by_user_id
);

-- ============================================================================
-- ROUTINE BLOCKS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own routine blocks" ON routine_blocks FOR SELECT USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can insert own routine blocks" ON routine_blocks FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own routine blocks" ON routine_blocks FOR UPDATE USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own routine blocks" ON routine_blocks FOR DELETE USING (
    auth.uid() = user_id
);

-- ============================================================================
-- EXERCISE IN BLOCK POLICIES
-- ============================================================================

CREATE POLICY "Users can view own exercise in block" ON exercise_in_block FOR SELECT USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can insert own exercise in block" ON exercise_in_block FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own exercise in block" ON exercise_in_block FOR UPDATE USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own exercise in block" ON exercise_in_block FOR DELETE USING (
    auth.uid() = user_id
);

-- ============================================================================
-- ROUTINE SETS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own routine sets" ON routine_sets FOR SELECT USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can insert own routine sets" ON routine_sets FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own routine sets" ON routine_sets FOR UPDATE USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own routine sets" ON routine_sets FOR DELETE USING (
    auth.uid() = user_id
);

-- ============================================================================
-- WORKOUT SESSIONS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own workout sessions" ON workout_sessions FOR SELECT USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can insert own workout sessions" ON workout_sessions FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own workout sessions" ON workout_sessions FOR UPDATE USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own workout sessions" ON workout_sessions FOR DELETE USING (
    auth.uid() = user_id
);

-- ============================================================================
-- WORKOUT BLOCKS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own workout blocks" ON workout_blocks FOR SELECT USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can insert own workout blocks" ON workout_blocks FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own workout blocks" ON workout_blocks FOR UPDATE USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own workout blocks" ON workout_blocks FOR DELETE USING (
    auth.uid() = user_id
);

-- ============================================================================
-- WORKOUT EXERCISES POLICIES
-- ============================================================================

CREATE POLICY "Users can view own workout exercises" ON workout_exercises FOR SELECT USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can insert own workout exercises" ON workout_exercises FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own workout exercises" ON workout_exercises FOR UPDATE USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own workout exercises" ON workout_exercises FOR DELETE USING (
    auth.uid() = user_id
);

-- ============================================================================
-- WORKOUT SETS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own workout sets" ON workout_sets FOR SELECT USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can insert own workout sets" ON workout_sets FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own workout sets" ON workout_sets FOR UPDATE USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own workout sets" ON workout_sets FOR DELETE USING (
    auth.uid() = user_id
);

-- ============================================================================
-- TRACKER POLICIES
-- ============================================================================

-- Tracker metrics
CREATE POLICY "Users can view own tracker metrics" ON tracker_metrics FOR SELECT USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can insert own tracker metrics" ON tracker_metrics FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own tracker metrics" ON tracker_metrics FOR UPDATE USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own tracker metrics" ON tracker_metrics FOR DELETE USING (
    auth.uid() = user_id
);

-- Tracker quick actions
CREATE POLICY "Users can view own tracker quick actions" ON tracker_quick_actions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM tracker_metrics tm 
        WHERE tm.id = metric_id AND tm.user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert own tracker quick actions" ON tracker_quick_actions FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM tracker_metrics tm 
        WHERE tm.id = metric_id AND tm.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update own tracker quick actions" ON tracker_quick_actions FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM tracker_metrics tm 
        WHERE tm.id = metric_id AND tm.user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete own tracker quick actions" ON tracker_quick_actions FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM tracker_metrics tm 
        WHERE tm.id = metric_id AND tm.user_id = auth.uid()
    )
);

-- Tracker entries
CREATE POLICY "Users can view own tracker entries" ON tracker_entries FOR SELECT USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can insert own tracker entries" ON tracker_entries FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own tracker entries" ON tracker_entries FOR UPDATE USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own tracker entries" ON tracker_entries FOR DELETE USING (
    auth.uid() = user_id
);

-- Tracker daily aggregates
CREATE POLICY "Users can view own tracker aggregates" ON tracker_daily_aggregates FOR SELECT USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can insert own tracker aggregates" ON tracker_daily_aggregates FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own tracker aggregates" ON tracker_daily_aggregates FOR UPDATE USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own tracker aggregates" ON tracker_daily_aggregates FOR DELETE USING (
    auth.uid() = user_id
);

-- ============================================================================
-- PR POLICIES
-- ============================================================================

-- PR current
CREATE POLICY "Users can view own current PRs" ON pr_current FOR SELECT USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can insert own current PRs" ON pr_current FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own current PRs" ON pr_current FOR UPDATE USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own current PRs" ON pr_current FOR DELETE USING (
    auth.uid() = user_id
);

-- PR history
CREATE POLICY "Users can view own PR history" ON pr_history FOR SELECT USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can insert own PR history" ON pr_history FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own PR history" ON pr_history FOR UPDATE USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own PR history" ON pr_history FOR DELETE USING (
    auth.uid() = user_id
);

-- ============================================================================
-- USER PREFERENCES POLICIES
-- ============================================================================

CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (
    auth.uid() = user_id
);

CREATE POLICY "Users can delete own preferences" ON user_preferences FOR DELETE USING (
    auth.uid() = user_id
);