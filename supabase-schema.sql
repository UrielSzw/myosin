-- Supabase Schema Migration Script
-- This script creates all tables from the local SQLite schema in PostgreSQL format
-- Compatible with Supabase PostgreSQL with proper data types and constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- EXERCISES SCHEMA
-- ============================================================================

-- Main exercises table
CREATE TABLE exercises (
    id UUID PRIMARY KEY,  -- UUID provided by app, no default
    name TEXT NOT NULL,
    source TEXT NOT NULL,  -- 'built_in' | 'user_created' | 'imported'
    created_by_user_id UUID,
    main_muscle_group TEXT NOT NULL,
    primary_equipment TEXT NOT NULL,
    exercise_type TEXT NOT NULL,
    secondary_muscle_groups JSONB NOT NULL,
    instructions JSONB NOT NULL,
    equipment JSONB NOT NULL,
    similar_exercises JSONB,
    default_measurement_template TEXT NOT NULL DEFAULT 'weight_reps',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercise images table
CREATE TABLE exercise_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FOLDERS SCHEMA
-- ============================================================================

-- Folders table
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_by_user_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROUTINES SCHEMA
-- ============================================================================

-- Routines table
CREATE TABLE routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    created_by_user_id UUID NOT NULL,
    training_days JSONB,  -- array of days
    show_rpe BOOLEAN DEFAULT true NOT NULL,
    show_tempo BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routine blocks table
CREATE TABLE routine_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
    type TEXT NOT NULL,  -- 'individual' | 'superset' | 'circuit'
    order_index INTEGER NOT NULL,
    rest_time_seconds INTEGER NOT NULL,
    rest_between_exercises_seconds INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercise in block table
CREATE TABLE exercise_in_block (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    block_id UUID NOT NULL REFERENCES routine_blocks(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routine sets table
CREATE TABLE routine_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    exercise_in_block_id UUID NOT NULL REFERENCES exercise_in_block(id) ON DELETE CASCADE,
    measurement_template TEXT NOT NULL,
    primary_value DECIMAL(10,2),
    secondary_value DECIMAL(10,2),
    primary_range JSONB,  -- {min: number, max: number}
    secondary_range JSONB,  -- {min: number, max: number}
    rpe DECIMAL(3,1),
    tempo TEXT,  -- "3-1-2-1" format
    order_index INTEGER NOT NULL,
    set_type TEXT NOT NULL,  -- 'working' | 'warm_up' | 'drop' | 'rest_pause'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- WORKOUT SESSIONS SCHEMA
-- ============================================================================

-- Workout sessions table
CREATE TABLE workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL,
    finished_at TIMESTAMPTZ NOT NULL,
    total_duration_seconds INTEGER NOT NULL,
    total_sets_planned INTEGER NOT NULL,
    total_sets_completed INTEGER NOT NULL,
    total_volume_kg DECIMAL(10,2),
    average_rpe DECIMAL(3,1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout blocks table
CREATE TABLE workout_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    workout_session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    original_block_id UUID REFERENCES routine_blocks(id) ON DELETE SET NULL,
    type TEXT NOT NULL,  -- 'individual' | 'superset' | 'circuit'
    order_index INTEGER NOT NULL,
    name TEXT NOT NULL,
    rest_time_seconds INTEGER NOT NULL,
    rest_between_exercises_seconds INTEGER NOT NULL,
    was_added_during_workout BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout exercises table
CREATE TABLE workout_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    workout_block_id UUID NOT NULL REFERENCES workout_blocks(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    original_exercise_in_block_id UUID REFERENCES exercise_in_block(id) ON DELETE SET NULL,
    order_index INTEGER NOT NULL,
    execution_order INTEGER,
    notes TEXT,
    was_added_during_workout BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout sets table
CREATE TABLE workout_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    workout_exercise_id UUID NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    original_set_id UUID REFERENCES routine_sets(id) ON DELETE SET NULL,
    order_index INTEGER NOT NULL,
    measurement_template TEXT NOT NULL,
    planned_primary_value DECIMAL(10,2),
    planned_secondary_value DECIMAL(10,2),
    planned_primary_range JSONB,
    planned_secondary_range JSONB,
    planned_rpe DECIMAL(3,1),
    planned_tempo TEXT,
    actual_primary_value DECIMAL(10,2),
    actual_secondary_value DECIMAL(10,2),
    actual_rpe DECIMAL(3,1),
    set_type TEXT NOT NULL,
    completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TRACKER SCHEMA
-- ============================================================================

-- Tracker metrics table
CREATE TABLE tracker_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    input_type TEXT NOT NULL DEFAULT 'numeric_single',
    behavior TEXT NOT NULL DEFAULT 'replace',
    unit TEXT NOT NULL,
    canonical_unit TEXT,
    conversion_factor DECIMAL(10,6) DEFAULT 1,
    default_target DECIMAL(10,2),
    color TEXT NOT NULL,
    icon TEXT NOT NULL,
    deleted_at TIMESTAMPTZ,
    order_index INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracker quick actions table
CREATE TABLE tracker_quick_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_id UUID NOT NULL REFERENCES tracker_metrics(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    value_normalized DECIMAL(10,2),
    icon TEXT,
    position INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracker entries table
CREATE TABLE tracker_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    metric_id UUID NOT NULL REFERENCES tracker_metrics(id) ON DELETE CASCADE,
    value DECIMAL(10,2) NOT NULL,
    value_normalized DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    notes TEXT,
    source TEXT DEFAULT 'manual' NOT NULL,
    day_key DATE NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    display_value TEXT,
    raw_input JSONB,
    meta JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tracker daily aggregates table
CREATE TABLE tracker_daily_aggregates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    metric_id UUID NOT NULL REFERENCES tracker_metrics(id) ON DELETE CASCADE,
    day_key DATE NOT NULL,
    sum_normalized DECIMAL(10,2) NOT NULL,
    count INTEGER NOT NULL,
    min_normalized DECIMAL(10,2),
    max_normalized DECIMAL(10,2),
    avg_normalized DECIMAL(10,2),
    previous_day_sum DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, metric_id, day_key)
);

-- ============================================================================
-- PR SCHEMA
-- ============================================================================

-- PR current table
CREATE TABLE pr_current (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    best_weight DECIMAL(10,2) NOT NULL,
    best_reps INTEGER NOT NULL,
    estimated_1rm DECIMAL(10,2) NOT NULL,
    achieved_at TIMESTAMPTZ NOT NULL,
    source TEXT DEFAULT 'auto' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PR history table
CREATE TABLE pr_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    weight DECIMAL(10,2) NOT NULL,
    reps INTEGER NOT NULL,
    estimated_1rm DECIMAL(10,2) NOT NULL,
    workout_session_id UUID REFERENCES workout_sessions(id) ON DELETE SET NULL,
    workout_set_id UUID REFERENCES workout_sets(id) ON DELETE SET NULL,
    source TEXT DEFAULT 'auto' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER SCHEMA
-- ============================================================================

-- User preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    theme TEXT DEFAULT 'system' NOT NULL,
    weight_unit TEXT DEFAULT 'kg' NOT NULL,
    show_rpe BOOLEAN DEFAULT true NOT NULL,
    show_tempo BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Exercises indexes
CREATE INDEX idx_exercises_name ON exercises(name);
CREATE INDEX idx_exercises_main_muscle ON exercises(main_muscle_group);
CREATE INDEX idx_exercises_primary_equipment ON exercises(primary_equipment);
CREATE INDEX idx_exercise_images_exercise_id ON exercise_images(exercise_id);

-- Folders indexes
CREATE INDEX idx_folders_created_by_user_id ON folders(created_by_user_id);

-- Routines indexes
CREATE INDEX idx_routines_created_by_user_id ON routines(created_by_user_id);
CREATE INDEX idx_routines_folder_id ON routines(folder_id);

-- Routine blocks indexes
CREATE INDEX idx_routine_blocks_user_id ON routine_blocks(user_id);
CREATE INDEX idx_routine_blocks_routine_id ON routine_blocks(routine_id);

-- Exercise in block indexes
CREATE INDEX idx_exercise_in_block_user_id ON exercise_in_block(user_id);
CREATE INDEX idx_exercise_in_block_block_id ON exercise_in_block(block_id);
CREATE INDEX idx_exercise_in_block_exercise_id ON exercise_in_block(exercise_id);

-- Routine sets indexes
CREATE INDEX idx_routine_sets_user_id ON routine_sets(user_id);
CREATE INDEX idx_routine_sets_exercise_in_block_id ON routine_sets(exercise_in_block_id);

-- Workout sessions indexes
CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_routine_id ON workout_sessions(routine_id);
CREATE INDEX idx_workout_sessions_started_at ON workout_sessions(started_at);

-- Workout blocks indexes
CREATE INDEX idx_workout_blocks_user_id ON workout_blocks(user_id);
CREATE INDEX idx_workout_blocks_workout_session_id ON workout_blocks(workout_session_id);
CREATE INDEX idx_workout_blocks_original_block_id ON workout_blocks(original_block_id);

-- Workout exercises indexes
CREATE INDEX idx_workout_exercises_user_id ON workout_exercises(user_id);
CREATE INDEX idx_workout_exercises_workout_block_id ON workout_exercises(workout_block_id);
CREATE INDEX idx_workout_exercises_exercise_id ON workout_exercises(exercise_id);
CREATE INDEX idx_workout_exercises_execution_order ON workout_exercises(execution_order);

-- Workout sets indexes
CREATE INDEX idx_workout_sets_user_id ON workout_sets(user_id);
CREATE INDEX idx_workout_sets_workout_exercise_id ON workout_sets(workout_exercise_id);
CREATE INDEX idx_workout_sets_exercise_id ON workout_sets(exercise_id);
CREATE INDEX idx_workout_sets_original_set_id ON workout_sets(original_set_id);
CREATE INDEX idx_workout_sets_completed ON workout_sets(completed);

-- Tracker metrics indexes
CREATE INDEX idx_tracker_metrics_user_id ON tracker_metrics(user_id);
CREATE INDEX idx_tracker_metrics_slug ON tracker_metrics(slug);
CREATE INDEX idx_tracker_metrics_input_type ON tracker_metrics(input_type);
CREATE INDEX idx_tracker_metrics_deleted_at ON tracker_metrics(deleted_at);

-- Tracker quick actions indexes
CREATE INDEX idx_tracker_quick_actions_metric_id ON tracker_quick_actions(metric_id);
CREATE INDEX idx_tracker_quick_actions_position ON tracker_quick_actions(position);

-- Tracker entries indexes
CREATE INDEX idx_tracker_entries_user_id ON tracker_entries(user_id);
CREATE INDEX idx_tracker_entries_metric_id ON tracker_entries(metric_id);
CREATE INDEX idx_tracker_entries_user_metric ON tracker_entries(user_id, metric_id);
CREATE INDEX idx_tracker_entries_day_key ON tracker_entries(day_key);
CREATE INDEX idx_tracker_entries_recorded_at ON tracker_entries(recorded_at);
CREATE INDEX idx_tracker_entries_source ON tracker_entries(source);

-- Tracker daily aggregates indexes
CREATE INDEX idx_tracker_aggregates_user_id ON tracker_daily_aggregates(user_id);
CREATE INDEX idx_tracker_aggregates_metric_id ON tracker_daily_aggregates(metric_id);
CREATE INDEX idx_tracker_aggregates_day_key ON tracker_daily_aggregates(day_key);
CREATE INDEX idx_tracker_aggregates_user_metric_day ON tracker_daily_aggregates(user_id, metric_id, day_key);

-- PR indexes
CREATE INDEX idx_pr_current_user_id ON pr_current(user_id);
CREATE INDEX idx_pr_current_exercise_id ON pr_current(exercise_id);
CREATE INDEX idx_pr_current_user_exercise ON pr_current(user_id, exercise_id);

CREATE INDEX idx_pr_history_user_id ON pr_history(user_id);
CREATE INDEX idx_pr_history_exercise_id ON pr_history(exercise_id);
CREATE INDEX idx_pr_history_user_exercise ON pr_history(user_id, exercise_id);
CREATE INDEX idx_pr_history_workout_session_id ON pr_history(workout_session_id);

-- User preferences indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================================================

-- Create the update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exercise_images_updated_at BEFORE UPDATE ON exercise_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_routines_updated_at BEFORE UPDATE ON routines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_routine_blocks_updated_at BEFORE UPDATE ON routine_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exercise_in_block_updated_at BEFORE UPDATE ON exercise_in_block FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_routine_sets_updated_at BEFORE UPDATE ON routine_sets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workout_sessions_updated_at BEFORE UPDATE ON workout_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workout_blocks_updated_at BEFORE UPDATE ON workout_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workout_exercises_updated_at BEFORE UPDATE ON workout_exercises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workout_sets_updated_at BEFORE UPDATE ON workout_sets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tracker_metrics_updated_at BEFORE UPDATE ON tracker_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tracker_quick_actions_updated_at BEFORE UPDATE ON tracker_quick_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tracker_entries_updated_at BEFORE UPDATE ON tracker_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tracker_daily_aggregates_updated_at BEFORE UPDATE ON tracker_daily_aggregates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pr_current_updated_at BEFORE UPDATE ON pr_current FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pr_history_updated_at BEFORE UPDATE ON pr_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();