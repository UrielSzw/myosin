-- ============================================
-- FINISH WORKOUT RPC
-- ============================================
-- This RPC handles the complete finish workout flow in a single transaction:
-- 1. Update routine (if provided) - DELETE old + INSERT new
-- 2. Insert workout session with all related data
-- 3. Upsert PR current + Insert PR history
--
-- If any step fails, the entire transaction is rolled back.
-- ============================================

CREATE OR REPLACE FUNCTION finish_workout(
  p_workout_session JSONB,               -- Required (first, no default)
  p_routine_update JSONB DEFAULT NULL,   -- Can be null if not updating routine
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
  -- ==========================================
  -- STEP 1: UPDATE ROUTINE (if provided)
  -- ==========================================
  IF p_routine_update IS NOT NULL AND p_routine_update->>'routineId' IS NOT NULL THEN
    v_routine_id := (p_routine_update->>'routineId')::uuid;
    
    -- 1a. Delete existing sets (via exercises via blocks)
    DELETE FROM routine_sets
    WHERE exercise_in_block_id IN (
      SELECT eib.id FROM exercise_in_block eib
      JOIN routine_blocks rb ON eib.block_id = rb.id
      WHERE rb.routine_id = v_routine_id
    );
    
    -- 1b. Delete existing exercises
    DELETE FROM exercise_in_block
    WHERE block_id IN (
      SELECT id FROM routine_blocks WHERE routine_id = v_routine_id
    );
    
    -- 1c. Delete existing blocks
    DELETE FROM routine_blocks WHERE routine_id = v_routine_id;
    
    -- 1d. Insert new blocks
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
    
    -- 1e. Insert new exercises
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
    
    -- 1f. Insert new sets
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

  -- ==========================================
  -- STEP 2: INSERT WORKOUT SESSION
  -- ==========================================
  v_session_id := (p_workout_session->'session'->>'id')::uuid;
  
  -- 2a. Insert session
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
  
  -- 2b. Insert blocks
  -- NOTE: Removed original_block_id - we no longer track FK references to mutable routine data
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
  
  -- 2c. Insert exercises
  -- NOTE: Removed original_exercise_in_block_id - we no longer track FK references to mutable routine data
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
  
  -- 2d. Insert sets
  -- NOTE: Removed original_set_id - we no longer track FK references to mutable routine data
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

  -- ==========================================
  -- STEP 3: UPSERT PRS
  -- ==========================================
  
  -- 3a. Upsert current PRs
  FOR v_pr_item IN SELECT * FROM jsonb_array_elements(p_prs->'current')
  LOOP
    -- Check if exists
    SELECT id INTO v_existing_pr_id
    FROM pr_current
    WHERE user_id = (v_pr_item->>'user_id')::uuid
      AND exercise_id = (v_pr_item->>'exercise_id')::uuid;
    
    IF v_existing_pr_id IS NOT NULL THEN
      -- Update existing
      UPDATE pr_current SET
        best_weight = (v_pr_item->>'best_weight')::numeric,
        best_reps = (v_pr_item->>'best_reps')::integer,
        estimated_1rm = (v_pr_item->>'estimated_1rm')::numeric,
        achieved_at = (v_pr_item->>'achieved_at')::timestamptz,
        source = v_pr_item->>'source',
        updated_at = NOW()
      WHERE id = v_existing_pr_id;
    ELSE
      -- Insert new
      INSERT INTO pr_current (
        id, user_id, exercise_id, best_weight, best_reps,
        estimated_1rm, achieved_at, source
      ) VALUES (
        (v_pr_item->>'id')::uuid,
        (v_pr_item->>'user_id')::uuid,
        (v_pr_item->>'exercise_id')::uuid,
        (v_pr_item->>'best_weight')::numeric,
        (v_pr_item->>'best_reps')::integer,
        (v_pr_item->>'estimated_1rm')::numeric,
        (v_pr_item->>'achieved_at')::timestamptz,
        v_pr_item->>'source'
      );
    END IF;
  END LOOP;
  
  -- 3b. Insert PR history
  FOR v_pr_item IN SELECT * FROM jsonb_array_elements(p_prs->'history')
  LOOP
    INSERT INTO pr_history (
      id, user_id, exercise_id, weight, reps, estimated_1rm,
      workout_session_id, workout_set_id, source
    ) VALUES (
      (v_pr_item->>'id')::uuid,
      (v_pr_item->>'user_id')::uuid,
      (v_pr_item->>'exercise_id')::uuid,
      (v_pr_item->>'weight')::numeric,
      (v_pr_item->>'reps')::integer,
      (v_pr_item->>'estimated_1rm')::numeric,
      CASE WHEN v_pr_item->>'workout_session_id' IS NOT NULL AND v_pr_item->>'workout_session_id' != ''
        THEN (v_pr_item->>'workout_session_id')::uuid ELSE NULL END,
      CASE WHEN v_pr_item->>'workout_set_id' IS NOT NULL AND v_pr_item->>'workout_set_id' != ''
        THEN (v_pr_item->>'workout_set_id')::uuid ELSE NULL END,
      v_pr_item->>'source'
    );
  END LOOP;

  -- Return success with session ID
  RETURN jsonb_build_object(
    'success', true,
    'session_id', v_session_id
  );

EXCEPTION WHEN OTHERS THEN
  -- Return error details
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION finish_workout TO authenticated;
