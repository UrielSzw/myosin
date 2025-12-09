-- ============================================
-- MIGRATION: Soft Delete Routines + Remove original_*_id columns
-- Date: 2024-11-26
-- ============================================
-- This migration:
-- 1. Adds deleted_at column to routines for soft delete
-- 2. Removes original_block_id from workout_blocks
-- 3. Removes original_exercise_in_block_id from workout_exercises  
-- 4. Removes original_set_id from workout_sets
-- 5. Changes workout_sessions.routine_id FK from CASCADE to RESTRICT
-- 6. Updates RPC functions to not use these columns
-- ============================================

-- ============================================
-- STEP 1: Add deleted_at to routines
-- ============================================
ALTER TABLE routines ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Index for filtering active routines efficiently
CREATE INDEX IF NOT EXISTS idx_routines_deleted_at ON routines(deleted_at);

-- ============================================
-- STEP 2: Remove original_block_id from workout_blocks
-- ============================================
-- Drop index first (if exists)
DROP INDEX IF EXISTS idx_workout_blocks_original_block_id;

-- Remove column
ALTER TABLE workout_blocks DROP COLUMN IF EXISTS original_block_id;

-- ============================================
-- STEP 3: Remove original_exercise_in_block_id from workout_exercises
-- ============================================
ALTER TABLE workout_exercises DROP COLUMN IF EXISTS original_exercise_in_block_id;

-- ============================================
-- STEP 4: Remove original_set_id from workout_sets
-- ============================================
-- Drop index first (if exists)
DROP INDEX IF EXISTS idx_workout_sets_original_set_id;

-- Remove column
ALTER TABLE workout_sets DROP COLUMN IF EXISTS original_set_id;

-- ============================================
-- STEP 5: Change workout_sessions FK to RESTRICT
-- ============================================
-- Drop existing constraint and recreate with RESTRICT
ALTER TABLE workout_sessions 
  DROP CONSTRAINT IF EXISTS workout_sessions_routine_id_fkey;

ALTER TABLE workout_sessions 
  ADD CONSTRAINT workout_sessions_routine_id_fkey 
  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE RESTRICT;

-- ============================================
-- STEP 6: Update finish_workout RPC function
-- ============================================
CREATE OR REPLACE FUNCTION finish_workout(
  p_workout_session JSONB,
  p_routine_update JSONB DEFAULT NULL,
  p_prs JSONB DEFAULT '{"current": [], "history": []}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_routine_id UUID;
  v_session_id UUID;
  v_block_item JSONB;
  v_exercise_item JSONB;
  v_set_item JSONB;
  v_pr_item JSONB;
  v_existing_pr_id UUID;
BEGIN
  -- STEP 1: UPDATE ROUTINE (if provided)
  IF p_routine_update IS NOT NULL AND p_routine_update->>'routineId' IS NOT NULL THEN
    v_routine_id := (p_routine_update->>'routineId')::uuid;
    
    DELETE FROM routine_sets
    WHERE exercise_in_block_id IN (
      SELECT eib.id FROM exercise_in_block eib
      JOIN routine_blocks rb ON eib.block_id = rb.id
      WHERE rb.routine_id = v_routine_id
    );
    
    DELETE FROM exercise_in_block
    WHERE block_id IN (
      SELECT id FROM routine_blocks WHERE routine_id = v_routine_id
    );
    
    DELETE FROM routine_blocks WHERE routine_id = v_routine_id;
    
    FOR v_block_item IN SELECT * FROM jsonb_array_elements(p_routine_update->'blocks')
    LOOP
      INSERT INTO routine_blocks (
        id, user_id, routine_id, type, order_index, 
        rest_time_seconds, rest_between_exercises_seconds, name
      ) VALUES (
        (v_block_item->>'id')::uuid,
        (v_block_item->>'user_id')::uuid,
        v_routine_id,
        v_block_item->>'type',
        (v_block_item->>'order_index')::integer,
        (v_block_item->>'rest_time_seconds')::integer,
        (v_block_item->>'rest_between_exercises_seconds')::integer,
        v_block_item->>'name'
      );
    END LOOP;
    
    FOR v_exercise_item IN SELECT * FROM jsonb_array_elements(p_routine_update->'exercises')
    LOOP
      INSERT INTO exercise_in_block (
        id, user_id, block_id, exercise_id, order_index, notes
      ) VALUES (
        (v_exercise_item->>'id')::uuid,
        (v_exercise_item->>'user_id')::uuid,
        (v_exercise_item->>'block_id')::uuid,
        (v_exercise_item->>'exercise_id')::uuid,
        (v_exercise_item->>'order_index')::integer,
        v_exercise_item->>'notes'
      );
    END LOOP;
    
    FOR v_set_item IN SELECT * FROM jsonb_array_elements(p_routine_update->'sets')
    LOOP
      INSERT INTO routine_sets (
        id, user_id, exercise_in_block_id, measurement_template,
        primary_value, secondary_value, primary_range, secondary_range,
        rpe, tempo, order_index, set_type
      ) VALUES (
        (v_set_item->>'id')::uuid,
        (v_set_item->>'user_id')::uuid,
        (v_set_item->>'exercise_in_block_id')::uuid,
        v_set_item->>'measurement_template',
        CASE WHEN v_set_item->>'primary_value' IS NOT NULL 
          THEN (v_set_item->>'primary_value')::numeric ELSE NULL END,
        CASE WHEN v_set_item->>'secondary_value' IS NOT NULL 
          THEN (v_set_item->>'secondary_value')::numeric ELSE NULL END,
        CASE WHEN v_set_item->'primary_range' IS NOT NULL AND v_set_item->>'primary_range' != 'null'
          THEN v_set_item->'primary_range' ELSE NULL END,
        CASE WHEN v_set_item->'secondary_range' IS NOT NULL AND v_set_item->>'secondary_range' != 'null'
          THEN v_set_item->'secondary_range' ELSE NULL END,
        CASE WHEN v_set_item->>'rpe' IS NOT NULL 
          THEN (v_set_item->>'rpe')::numeric ELSE NULL END,
        v_set_item->>'tempo',
        (v_set_item->>'order_index')::integer,
        v_set_item->>'set_type'
      );
    END LOOP;
  END IF;

  -- STEP 2: INSERT WORKOUT SESSION
  v_session_id := (p_workout_session->'session'->>'id')::uuid;
  
  INSERT INTO workout_sessions (
    id, user_id, routine_id, started_at, finished_at,
    total_duration_seconds, total_sets_planned, total_sets_completed,
    total_volume_kg, average_rpe
  ) VALUES (
    v_session_id,
    (p_workout_session->'session'->>'user_id')::uuid,
    (p_workout_session->'session'->>'routine_id')::uuid,
    (p_workout_session->'session'->>'started_at')::timestamptz,
    (p_workout_session->'session'->>'finished_at')::timestamptz,
    (p_workout_session->'session'->>'total_duration_seconds')::integer,
    (p_workout_session->'session'->>'total_sets_planned')::integer,
    (p_workout_session->'session'->>'total_sets_completed')::integer,
    CASE WHEN p_workout_session->'session'->>'total_volume_kg' IS NOT NULL 
      THEN (p_workout_session->'session'->>'total_volume_kg')::numeric ELSE NULL END,
    CASE WHEN p_workout_session->'session'->>'average_rpe' IS NOT NULL 
      THEN (p_workout_session->'session'->>'average_rpe')::numeric ELSE NULL END
  );
  
  -- Insert blocks (sin original_block_id)
  FOR v_block_item IN SELECT * FROM jsonb_array_elements(p_workout_session->'blocks')
  LOOP
    INSERT INTO workout_blocks (
      id, user_id, workout_session_id,
      type, order_index, name, rest_time_seconds,
      rest_between_exercises_seconds, was_added_during_workout
    ) VALUES (
      (v_block_item->>'id')::uuid,
      (v_block_item->>'user_id')::uuid,
      v_session_id,
      v_block_item->>'type',
      (v_block_item->>'order_index')::integer,
      v_block_item->>'name',
      (v_block_item->>'rest_time_seconds')::integer,
      (v_block_item->>'rest_between_exercises_seconds')::integer,
      COALESCE((v_block_item->>'was_added_during_workout')::boolean, false)
    );
  END LOOP;
  
  -- Insert exercises (sin original_exercise_in_block_id)
  FOR v_exercise_item IN SELECT * FROM jsonb_array_elements(p_workout_session->'exercises')
  LOOP
    INSERT INTO workout_exercises (
      id, user_id, workout_block_id, exercise_id,
      order_index, execution_order,
      notes, was_added_during_workout
    ) VALUES (
      (v_exercise_item->>'id')::uuid,
      (v_exercise_item->>'user_id')::uuid,
      (v_exercise_item->>'workout_block_id')::uuid,
      (v_exercise_item->>'exercise_id')::uuid,
      (v_exercise_item->>'order_index')::integer,
      CASE WHEN v_exercise_item->>'execution_order' IS NOT NULL 
        THEN (v_exercise_item->>'execution_order')::integer ELSE NULL END,
      v_exercise_item->>'notes',
      COALESCE((v_exercise_item->>'was_added_during_workout')::boolean, false)
    );
  END LOOP;
  
  -- Insert sets (sin original_set_id)
  FOR v_set_item IN SELECT * FROM jsonb_array_elements(p_workout_session->'sets')
  LOOP
    INSERT INTO workout_sets (
      id, user_id, workout_exercise_id, exercise_id,
      order_index, measurement_template,
      planned_primary_value, planned_secondary_value,
      planned_primary_range, planned_secondary_range,
      planned_rpe, planned_tempo,
      actual_primary_value, actual_secondary_value, actual_rpe,
      set_type, completed
    ) VALUES (
      (v_set_item->>'id')::uuid,
      (v_set_item->>'user_id')::uuid,
      (v_set_item->>'workout_exercise_id')::uuid,
      (v_set_item->>'exercise_id')::uuid,
      (v_set_item->>'order_index')::integer,
      v_set_item->>'measurement_template',
      CASE WHEN v_set_item->>'planned_primary_value' IS NOT NULL 
        THEN (v_set_item->>'planned_primary_value')::numeric ELSE NULL END,
      CASE WHEN v_set_item->>'planned_secondary_value' IS NOT NULL 
        THEN (v_set_item->>'planned_secondary_value')::numeric ELSE NULL END,
      CASE WHEN v_set_item->'planned_primary_range' IS NOT NULL AND v_set_item->>'planned_primary_range' != 'null'
        THEN v_set_item->'planned_primary_range' ELSE NULL END,
      CASE WHEN v_set_item->'planned_secondary_range' IS NOT NULL AND v_set_item->>'planned_secondary_range' != 'null'
        THEN v_set_item->'planned_secondary_range' ELSE NULL END,
      CASE WHEN v_set_item->>'planned_rpe' IS NOT NULL 
        THEN (v_set_item->>'planned_rpe')::numeric ELSE NULL END,
      v_set_item->>'planned_tempo',
      CASE WHEN v_set_item->>'actual_primary_value' IS NOT NULL 
        THEN (v_set_item->>'actual_primary_value')::numeric ELSE NULL END,
      CASE WHEN v_set_item->>'actual_secondary_value' IS NOT NULL 
        THEN (v_set_item->>'actual_secondary_value')::numeric ELSE NULL END,
      CASE WHEN v_set_item->>'actual_rpe' IS NOT NULL 
        THEN (v_set_item->>'actual_rpe')::numeric ELSE NULL END,
      v_set_item->>'set_type',
      COALESCE((v_set_item->>'completed')::boolean, false)
    );
  END LOOP;

  -- STEP 3: UPSERT PRS (Generic fields for all measurement templates)
  FOR v_pr_item IN SELECT * FROM jsonb_array_elements(p_prs->'current')
  LOOP
    SELECT id INTO v_existing_pr_id
    FROM pr_current
    WHERE user_id = (v_pr_item->>'user_id')::uuid
      AND exercise_id = (v_pr_item->>'exercise_id')::uuid;
    
    IF v_existing_pr_id IS NOT NULL THEN
      UPDATE pr_current SET
        measurement_template = v_pr_item->>'measurement_template',
        best_primary_value = (v_pr_item->>'best_primary_value')::numeric,
        best_secondary_value = CASE 
          WHEN v_pr_item->>'best_secondary_value' IS NOT NULL 
          THEN (v_pr_item->>'best_secondary_value')::numeric 
          ELSE NULL END,
        pr_score = (v_pr_item->>'pr_score')::numeric,
        achieved_at = (v_pr_item->>'achieved_at')::timestamptz,
        source = v_pr_item->>'source',
        updated_at = NOW()
      WHERE id = v_existing_pr_id;
    ELSE
      INSERT INTO pr_current (
        id, user_id, exercise_id, measurement_template,
        best_primary_value, best_secondary_value, pr_score,
        achieved_at, source
      ) VALUES (
        (v_pr_item->>'id')::uuid,
        (v_pr_item->>'user_id')::uuid,
        (v_pr_item->>'exercise_id')::uuid,
        v_pr_item->>'measurement_template',
        (v_pr_item->>'best_primary_value')::numeric,
        CASE 
          WHEN v_pr_item->>'best_secondary_value' IS NOT NULL 
          THEN (v_pr_item->>'best_secondary_value')::numeric 
          ELSE NULL END,
        (v_pr_item->>'pr_score')::numeric,
        (v_pr_item->>'achieved_at')::timestamptz,
        v_pr_item->>'source'
      );
    END IF;
  END LOOP;
  
  FOR v_pr_item IN SELECT * FROM jsonb_array_elements(p_prs->'history')
  LOOP
    INSERT INTO pr_history (
      id, user_id, exercise_id, measurement_template,
      primary_value, secondary_value, pr_score,
      workout_session_id, workout_set_id, source
    ) VALUES (
      (v_pr_item->>'id')::uuid,
      (v_pr_item->>'user_id')::uuid,
      (v_pr_item->>'exercise_id')::uuid,
      v_pr_item->>'measurement_template',
      (v_pr_item->>'primary_value')::numeric,
      CASE 
        WHEN v_pr_item->>'secondary_value' IS NOT NULL 
        THEN (v_pr_item->>'secondary_value')::numeric 
        ELSE NULL END,
      (v_pr_item->>'pr_score')::numeric,
      CASE WHEN v_pr_item->>'workout_session_id' IS NOT NULL AND v_pr_item->>'workout_session_id' != ''
        THEN (v_pr_item->>'workout_session_id')::uuid ELSE NULL END,
      CASE WHEN v_pr_item->>'workout_set_id' IS NOT NULL AND v_pr_item->>'workout_set_id' != ''
        THEN (v_pr_item->>'workout_set_id')::uuid ELSE NULL END,
      v_pr_item->>'source'
    );
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'session_id', v_session_id
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

-- ============================================
-- STEP 7: Update create_workout_session_with_data RPC
-- ============================================
CREATE OR REPLACE FUNCTION create_workout_session_with_data(
  session_data jsonb,
  blocks_data jsonb,
  exercises_data jsonb,
  sets_data jsonb
) RETURNS jsonb AS $$
DECLARE
  created_session_id uuid;
  session_result jsonb;
  block_item jsonb;
  exercise_item jsonb;
  set_item jsonb;
BEGIN
  INSERT INTO workout_sessions (
    id, user_id, routine_id, started_at, finished_at,
    total_duration_seconds, total_sets_planned, total_sets_completed,
    total_volume_kg, average_rpe
  )
  VALUES (
    COALESCE((session_data->>'id')::uuid, gen_random_uuid()),
    (session_data->>'user_id')::uuid,
    (session_data->>'routine_id')::uuid,
    (session_data->>'started_at')::TIMESTAMPTZ,
    (session_data->>'finished_at')::TIMESTAMPTZ,
    (session_data->>'total_duration_seconds')::integer,
    (session_data->>'total_sets_planned')::integer,
    (session_data->>'total_sets_completed')::integer,
    CASE WHEN session_data->>'total_volume_kg' IS NOT NULL 
      THEN (session_data->>'total_volume_kg')::numeric ELSE NULL END,
    CASE WHEN session_data->>'average_rpe' IS NOT NULL 
      THEN (session_data->>'average_rpe')::numeric ELSE NULL END
  )
  RETURNING id INTO created_session_id;

  IF jsonb_array_length(blocks_data) > 0 THEN
    FOR block_item IN SELECT * FROM jsonb_array_elements(blocks_data)
    LOOP
      INSERT INTO workout_blocks (
        id, user_id, workout_session_id, type, order_index, name,
        rest_time_seconds, rest_between_exercises_seconds, was_added_during_workout
      )
      VALUES (
        (block_item->>'id')::uuid,
        (block_item->>'user_id')::uuid,
        created_session_id,
        block_item->>'type',
        (block_item->>'order_index')::integer,
        block_item->>'name',
        (block_item->>'rest_time_seconds')::integer,
        (block_item->>'rest_between_exercises_seconds')::integer,
        COALESCE((block_item->>'was_added_during_workout')::boolean, false)
      );
    END LOOP;
  END IF;

  IF jsonb_array_length(exercises_data) > 0 THEN
    FOR exercise_item IN SELECT * FROM jsonb_array_elements(exercises_data)
    LOOP
      INSERT INTO workout_exercises (
        id, user_id, workout_block_id, exercise_id,
        order_index, execution_order, notes, was_added_during_workout
      )
      VALUES (
        (exercise_item->>'id')::uuid,
        (exercise_item->>'user_id')::uuid,
        (exercise_item->>'workout_block_id')::uuid,
        (exercise_item->>'exercise_id')::uuid,
        (exercise_item->>'order_index')::integer,
        CASE WHEN exercise_item->>'execution_order' IS NOT NULL 
          THEN (exercise_item->>'execution_order')::integer ELSE NULL END,
        exercise_item->>'notes',
        COALESCE((exercise_item->>'was_added_during_workout')::boolean, false)
      );
    END LOOP;
  END IF;

  IF jsonb_array_length(sets_data) > 0 THEN
    FOR set_item IN SELECT * FROM jsonb_array_elements(sets_data)
    LOOP
      INSERT INTO workout_sets (
        id, user_id, workout_exercise_id, exercise_id, order_index,
        measurement_template, planned_primary_value, planned_secondary_value,
        planned_primary_range, planned_secondary_range, planned_rpe, planned_tempo,
        actual_primary_value, actual_secondary_value, actual_rpe, set_type, completed
      )
      VALUES (
        (set_item->>'id')::uuid,
        (set_item->>'user_id')::uuid,
        (set_item->>'workout_exercise_id')::uuid,
        (set_item->>'exercise_id')::uuid,
        (set_item->>'order_index')::integer,
        set_item->>'measurement_template',
        CASE WHEN set_item->>'planned_primary_value' IS NOT NULL 
          THEN (set_item->>'planned_primary_value')::numeric ELSE NULL END,
        CASE WHEN set_item->>'planned_secondary_value' IS NOT NULL 
          THEN (set_item->>'planned_secondary_value')::numeric ELSE NULL END,
        CASE WHEN set_item->'planned_primary_range' IS NOT NULL 
          THEN set_item->'planned_primary_range' ELSE NULL END,
        CASE WHEN set_item->'planned_secondary_range' IS NOT NULL 
          THEN set_item->'planned_secondary_range' ELSE NULL END,
        CASE WHEN set_item->>'planned_rpe' IS NOT NULL 
          THEN (set_item->>'planned_rpe')::numeric ELSE NULL END,
        set_item->>'planned_tempo',
        CASE WHEN set_item->>'actual_primary_value' IS NOT NULL 
          THEN (set_item->>'actual_primary_value')::numeric ELSE NULL END,
        CASE WHEN set_item->>'actual_secondary_value' IS NOT NULL 
          THEN (set_item->>'actual_secondary_value')::numeric ELSE NULL END,
        CASE WHEN set_item->>'actual_rpe' IS NOT NULL 
          THEN (set_item->>'actual_rpe')::numeric ELSE NULL END,
        set_item->>'set_type',
        COALESCE((set_item->>'completed')::boolean, false)
      );
    END LOOP;
  END IF;

  SELECT to_jsonb(ws.*) INTO session_result
  FROM workout_sessions ws WHERE ws.id = created_session_id;

  RETURN session_result;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to create workout session: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- ============================================
-- DONE! 
-- ============================================
-- Summary of changes:
-- ✅ routines.deleted_at added (soft delete)
-- ✅ workout_blocks.original_block_id removed
-- ✅ workout_exercises.original_exercise_in_block_id removed  
-- ✅ workout_sets.original_set_id removed
-- ✅ workout_sessions.routine_id FK changed to RESTRICT
-- ✅ finish_workout() updated
-- ✅ create_workout_session_with_data() updated
-- ============================================
