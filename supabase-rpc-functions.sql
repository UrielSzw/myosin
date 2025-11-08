-- =============================================
-- SUPABASE RPC FUNCTIONS FOR TRANSACTIONAL OPERATIONS
-- =============================================
-- Corre este archivo en Supabase Dashboard > SQL Editor
-- Esquemas basados en: shared/db/schema/routine.ts y workout-session.ts
-- =============================================

-- =============================================
-- 1. CREATE ROUTINE WITH DATA (TRANSACTIONAL)
-- =============================================
CREATE OR REPLACE FUNCTION create_routine_with_data(
  routine_data jsonb,
  blocks_data jsonb,
  exercises_data jsonb,
  sets_data jsonb
) RETURNS jsonb AS $$
DECLARE
  created_routine_id uuid;
  routine_result jsonb;
  block_item jsonb;
  exercise_item jsonb;
  set_item jsonb;
BEGIN
  -- 1. Insertar rutina principal
  -- Schema: id, name, folder_id, created_by_user_id, training_days, show_rpe, show_tempo, created_at, updated_at
  INSERT INTO routines (
    id,
    name, 
    folder_id, 
    created_by_user_id,
    training_days, 
    show_rpe, 
    show_tempo
  )
  VALUES (
    COALESCE((routine_data->>'id')::uuid, gen_random_uuid()),
    routine_data->>'name',
    CASE 
      WHEN routine_data->>'folder_id' IS NOT NULL 
      THEN (routine_data->>'folder_id')::uuid 
      ELSE NULL 
    END,
    (routine_data->>'created_by_user_id')::uuid,
    routine_data->'training_days',
    COALESCE((routine_data->>'show_rpe')::boolean, true),
    COALESCE((routine_data->>'show_tempo')::boolean, true)
  )
  RETURNING id INTO created_routine_id;

  -- 2. Insertar bloques
  -- Schema: id, user_id, routine_id, type, order_index, rest_time_seconds, rest_between_exercises_seconds, name, created_at, updated_at
  IF jsonb_array_length(blocks_data) > 0 THEN
    FOR block_item IN SELECT * FROM jsonb_array_elements(blocks_data)
    LOOP
      INSERT INTO routine_blocks (
        id,
        user_id,
        routine_id,
        type,
        order_index,
        rest_time_seconds,
        rest_between_exercises_seconds,
        name
      )
      VALUES (
        (block_item->>'id')::uuid,
        (block_item->>'user_id')::uuid,
        created_routine_id,
        block_item->>'type',
        (block_item->>'order_index')::integer,
        (block_item->>'rest_time_seconds')::integer,
        (block_item->>'rest_between_exercises_seconds')::integer,
        block_item->>'name'
      );
    END LOOP;
  END IF;

  -- 3. Insertar ejercicios en bloques
  -- Schema: id, user_id, block_id, exercise_id, order_index, notes, created_at, updated_at
  IF jsonb_array_length(exercises_data) > 0 THEN
    FOR exercise_item IN SELECT * FROM jsonb_array_elements(exercises_data)
    LOOP
      INSERT INTO exercise_in_block (
        id,
        user_id,
        block_id,
        exercise_id,
        order_index,
        notes
      )
      VALUES (
        (exercise_item->>'id')::uuid,
        (exercise_item->>'user_id')::uuid,
        (exercise_item->>'block_id')::uuid,
        (exercise_item->>'exercise_id')::uuid,
        (exercise_item->>'order_index')::integer,
        exercise_item->>'notes'
      );
    END LOOP;
  END IF;

  -- 4. Insertar sets
  -- Schema: id, user_id, exercise_in_block_id, measurement_template, primary_value, secondary_value, 
  --         primary_range, secondary_range, rpe, tempo, order_index, set_type, created_at, updated_at
  IF jsonb_array_length(sets_data) > 0 THEN
    FOR set_item IN SELECT * FROM jsonb_array_elements(sets_data)
    LOOP
      INSERT INTO routine_sets (
        id,
        user_id,
        exercise_in_block_id,
        measurement_template,
        primary_value,
        secondary_value,
        primary_range,
        secondary_range,
        rpe,
        tempo,
        order_index,
        set_type
      )
      VALUES (
        (set_item->>'id')::uuid,
        (set_item->>'user_id')::uuid,
        (set_item->>'exercise_in_block_id')::uuid,
        set_item->>'measurement_template',
        CASE 
          WHEN set_item->>'primary_value' IS NOT NULL 
          THEN (set_item->>'primary_value')::numeric 
          ELSE NULL 
        END,
        CASE 
          WHEN set_item->>'secondary_value' IS NOT NULL 
          THEN (set_item->>'secondary_value')::numeric 
          ELSE NULL 
        END,
        CASE 
          WHEN set_item->'primary_range' IS NOT NULL 
          THEN set_item->'primary_range'
          ELSE NULL 
        END,
        CASE 
          WHEN set_item->'secondary_range' IS NOT NULL 
          THEN set_item->'secondary_range'
          ELSE NULL 
        END,
        CASE 
          WHEN set_item->>'rpe' IS NOT NULL 
          THEN (set_item->>'rpe')::numeric 
          ELSE NULL 
        END,
        set_item->>'tempo',
        (set_item->>'order_index')::integer,
        set_item->>'set_type'
      );
    END LOOP;
  END IF;

  -- Retornar rutina creada
  SELECT to_jsonb(r.*) INTO routine_result
  FROM routines r 
  WHERE r.id = created_routine_id;

  RETURN routine_result;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to create routine: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- =============================================
-- 2. UPDATE ROUTINE WITH DATA (TRANSACTIONAL)
-- =============================================
CREATE OR REPLACE FUNCTION update_routine_with_data(
  routine_id_param uuid,
  routine_data jsonb,
  blocks_data jsonb,
  exercises_data jsonb,
  sets_data jsonb
) RETURNS jsonb AS $$
DECLARE
  routine_result jsonb;
  block_item jsonb;
  exercise_item jsonb;
  set_item jsonb;
BEGIN
  -- 1. Actualizar rutina principal
  UPDATE routines SET
    name = routine_data->>'name',
    folder_id = CASE 
      WHEN routine_data->>'folder_id' IS NOT NULL 
      THEN (routine_data->>'folder_id')::uuid 
      ELSE NULL 
    END,
    training_days = routine_data->'training_days',
    show_rpe = COALESCE((routine_data->>'show_rpe')::boolean, true),
    show_tempo = COALESCE((routine_data->>'show_tempo')::boolean, true),
    updated_at = NOW()
  WHERE id = routine_id_param;

  -- 2. Eliminar contenido existente (en orden: sets -> exercises -> blocks)
  
  -- Eliminar sets
  DELETE FROM routine_sets 
  WHERE exercise_in_block_id IN (
    SELECT eib.id 
    FROM exercise_in_block eib
    JOIN routine_blocks rb ON eib.block_id = rb.id
    WHERE rb.routine_id = routine_id_param
  );

  -- Eliminar ejercicios en bloques
  DELETE FROM exercise_in_block 
  WHERE block_id IN (
    SELECT id FROM routine_blocks WHERE routine_id = routine_id_param
  );

  -- Eliminar bloques
  DELETE FROM routine_blocks WHERE routine_id = routine_id_param;

  -- 3. Insertar nuevo contenido (igual que create)
  
  -- Insertar bloques
  IF jsonb_array_length(blocks_data) > 0 THEN
    FOR block_item IN SELECT * FROM jsonb_array_elements(blocks_data)
    LOOP
      INSERT INTO routine_blocks (
        id,
        user_id,
        routine_id,
        type,
        order_index,
        rest_time_seconds,
        rest_between_exercises_seconds,
        name
      )
      VALUES (
        (block_item->>'id')::uuid,
        (block_item->>'user_id')::uuid,
        routine_id_param,
        block_item->>'type',
        (block_item->>'order_index')::integer,
        (block_item->>'rest_time_seconds')::integer,
        (block_item->>'rest_between_exercises_seconds')::integer,
        block_item->>'name'
      );
    END LOOP;
  END IF;

  -- Insertar ejercicios en bloques
  IF jsonb_array_length(exercises_data) > 0 THEN
    FOR exercise_item IN SELECT * FROM jsonb_array_elements(exercises_data)
    LOOP
      INSERT INTO exercise_in_block (
        id,
        user_id,
        block_id,
        exercise_id,
        order_index,
        notes
      )
      VALUES (
        (exercise_item->>'id')::uuid,
        (exercise_item->>'user_id')::uuid,
        (exercise_item->>'block_id')::uuid,
        (exercise_item->>'exercise_id')::uuid,
        (exercise_item->>'order_index')::integer,
        exercise_item->>'notes'
      );
    END LOOP;
  END IF;

  -- Insertar sets
  IF jsonb_array_length(sets_data) > 0 THEN
    FOR set_item IN SELECT * FROM jsonb_array_elements(sets_data)
    LOOP
      INSERT INTO routine_sets (
        id,
        user_id,
        exercise_in_block_id,
        measurement_template,
        primary_value,
        secondary_value,
        primary_range,
        secondary_range,
        rpe,
        tempo,
        order_index,
        set_type
      )
      VALUES (
        (set_item->>'id')::uuid,
        (set_item->>'user_id')::uuid,
        (set_item->>'exercise_in_block_id')::uuid,
        set_item->>'measurement_template',
        CASE 
          WHEN set_item->>'primary_value' IS NOT NULL 
          THEN (set_item->>'primary_value')::numeric 
          ELSE NULL 
        END,
        CASE 
          WHEN set_item->>'secondary_value' IS NOT NULL 
          THEN (set_item->>'secondary_value')::numeric 
          ELSE NULL 
        END,
        CASE 
          WHEN set_item->'primary_range' IS NOT NULL 
          THEN set_item->'primary_range'
          ELSE NULL 
        END,
        CASE 
          WHEN set_item->'secondary_range' IS NOT NULL 
          THEN set_item->'secondary_range'
          ELSE NULL 
        END,
        CASE 
          WHEN set_item->>'rpe' IS NOT NULL 
          THEN (set_item->>'rpe')::numeric 
          ELSE NULL 
        END,
        set_item->>'tempo',
        (set_item->>'order_index')::integer,
        set_item->>'set_type'
      );
    END LOOP;
  END IF;

  -- Retornar rutina actualizada
  SELECT to_jsonb(r.*) INTO routine_result
  FROM routines r WHERE r.id = routine_id_param;

  RETURN routine_result;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to update routine: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- =============================================
-- 3. CREATE WORKOUT SESSION WITH DATA (TRANSACTIONAL)
-- =============================================
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
  -- 1. Insertar sesión principal
  -- Schema: id, user_id, routine_id, started_at, finished_at, total_duration_seconds,
  --         total_sets_planned, total_sets_completed, total_volume_kg, average_rpe, created_at, updated_at
  INSERT INTO workout_sessions (
    id,
    user_id,
    routine_id,
    started_at,
    finished_at,
    total_duration_seconds,
    total_sets_planned,
    total_sets_completed,
    total_volume_kg,
    average_rpe
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
    CASE 
      WHEN session_data->>'total_volume_kg' IS NOT NULL 
      THEN (session_data->>'total_volume_kg')::numeric 
      ELSE NULL 
    END,
    CASE 
      WHEN session_data->>'average_rpe' IS NOT NULL 
      THEN (session_data->>'average_rpe')::numeric 
      ELSE NULL 
    END
  )
  RETURNING id INTO created_session_id;

  -- 2. Insertar bloques
  -- Schema: id, user_id, workout_session_id, original_block_id, type, order_index, name,
  --         rest_time_seconds, rest_between_exercises_seconds, was_added_during_workout, created_at, updated_at
  IF jsonb_array_length(blocks_data) > 0 THEN
    FOR block_item IN SELECT * FROM jsonb_array_elements(blocks_data)
    LOOP
      INSERT INTO workout_blocks (
        id,
        user_id,
        workout_session_id,
        original_block_id,
        type,
        order_index,
        name,
        rest_time_seconds,
        rest_between_exercises_seconds,
        was_added_during_workout
      )
      VALUES (
        (block_item->>'id')::uuid,
        (block_item->>'user_id')::uuid,
        created_session_id,
        CASE 
          WHEN block_item->>'original_block_id' IS NOT NULL 
          THEN (block_item->>'original_block_id')::uuid 
          ELSE NULL 
        END,
        block_item->>'type',
        (block_item->>'order_index')::integer,
        block_item->>'name',
        (block_item->>'rest_time_seconds')::integer,
        (block_item->>'rest_between_exercises_seconds')::integer,
        COALESCE((block_item->>'was_added_during_workout')::boolean, false)
      );
    END LOOP;
  END IF;

  -- 3. Insertar ejercicios
  -- Schema: id, user_id, workout_block_id, exercise_id, original_exercise_in_block_id,
  --         order_index, execution_order, notes, was_added_during_workout, created_at, updated_at
  IF jsonb_array_length(exercises_data) > 0 THEN
    FOR exercise_item IN SELECT * FROM jsonb_array_elements(exercises_data)
    LOOP
      INSERT INTO workout_exercises (
        id,
        user_id,
        workout_block_id,
        exercise_id,
        original_exercise_in_block_id,
        order_index,
        execution_order,
        notes,
        was_added_during_workout
      )
      VALUES (
        (exercise_item->>'id')::uuid,
        (exercise_item->>'user_id')::uuid,
        (exercise_item->>'workout_block_id')::uuid,
        (exercise_item->>'exercise_id')::uuid,
        CASE 
          WHEN exercise_item->>'original_exercise_in_block_id' IS NOT NULL 
          THEN (exercise_item->>'original_exercise_in_block_id')::uuid 
          ELSE NULL 
        END,
        (exercise_item->>'order_index')::integer,
        CASE 
          WHEN exercise_item->>'execution_order' IS NOT NULL 
          THEN (exercise_item->>'execution_order')::integer 
          ELSE NULL 
        END,
        exercise_item->>'notes',
        COALESCE((exercise_item->>'was_added_during_workout')::boolean, false)
      );
    END LOOP;
  END IF;

  -- 4. Insertar sets
  -- Schema: id, user_id, workout_exercise_id, exercise_id, original_set_id, order_index,
  --         measurement_template, planned_primary_value, planned_secondary_value, planned_primary_range,
  --         planned_secondary_range, planned_rpe, planned_tempo, actual_primary_value, actual_secondary_value,
  --         actual_rpe, set_type, completed, created_at, updated_at
  IF jsonb_array_length(sets_data) > 0 THEN
    FOR set_item IN SELECT * FROM jsonb_array_elements(sets_data)
    LOOP
      INSERT INTO workout_sets (
        id,
        user_id,
        workout_exercise_id,
        exercise_id,
        original_set_id,
        order_index,
        measurement_template,
        planned_primary_value,
        planned_secondary_value,
        planned_primary_range,
        planned_secondary_range,
        planned_rpe,
        planned_tempo,
        actual_primary_value,
        actual_secondary_value,
        actual_rpe,
        set_type,
        completed
      )
      VALUES (
        (set_item->>'id')::uuid,
        (set_item->>'user_id')::uuid,
        (set_item->>'workout_exercise_id')::uuid,
        (set_item->>'exercise_id')::uuid,
        CASE 
          WHEN set_item->>'original_set_id' IS NOT NULL 
          THEN (set_item->>'original_set_id')::uuid 
          ELSE NULL 
        END,
        (set_item->>'order_index')::integer,
        set_item->>'measurement_template',
        CASE 
          WHEN set_item->>'planned_primary_value' IS NOT NULL 
          THEN (set_item->>'planned_primary_value')::numeric 
          ELSE NULL 
        END,
        CASE 
          WHEN set_item->>'planned_secondary_value' IS NOT NULL 
          THEN (set_item->>'planned_secondary_value')::numeric 
          ELSE NULL 
        END,
        CASE 
          WHEN set_item->'planned_primary_range' IS NOT NULL 
          THEN set_item->'planned_primary_range'
          ELSE NULL 
        END,
        CASE 
          WHEN set_item->'planned_secondary_range' IS NOT NULL 
          THEN set_item->'planned_secondary_range'
          ELSE NULL 
        END,
        CASE 
          WHEN set_item->>'planned_rpe' IS NOT NULL 
          THEN (set_item->>'planned_rpe')::numeric 
          ELSE NULL 
        END,
        set_item->>'planned_tempo',
        CASE 
          WHEN set_item->>'actual_primary_value' IS NOT NULL 
          THEN (set_item->>'actual_primary_value')::numeric 
          ELSE NULL 
        END,
        CASE 
          WHEN set_item->>'actual_secondary_value' IS NOT NULL 
          THEN (set_item->>'actual_secondary_value')::numeric 
          ELSE NULL 
        END,
        CASE 
          WHEN set_item->>'actual_rpe' IS NOT NULL 
          THEN (set_item->>'actual_rpe')::numeric 
          ELSE NULL 
        END,
        set_item->>'set_type',
        COALESCE((set_item->>'completed')::boolean, false)
      );
    END LOOP;
  END IF;

  -- Retornar sesión creada
  SELECT to_jsonb(ws.*) INTO session_result
  FROM workout_sessions ws WHERE ws.id = created_session_id;

  RETURN session_result;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to create workout session: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- =============================================
-- 4. DELETE ROUTINE (CASCADE)
-- =============================================
CREATE OR REPLACE FUNCTION delete_routine_by_id(
  routine_id_param uuid
) RETURNS jsonb AS $$
BEGIN
  -- PostgreSQL manejará el cascade delete automáticamente
  -- si las FK constraints están configuradas correctamente
  DELETE FROM routines WHERE id = routine_id_param;
  
  RETURN jsonb_build_object('success', true);

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to delete routine: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- =============================================
-- 5. DELETE WORKOUT SESSION (CASCADE)
-- =============================================
CREATE OR REPLACE FUNCTION delete_workout_session(
  session_id_param uuid
) RETURNS jsonb AS $$
BEGIN
  -- PostgreSQL manejará el cascade delete automáticamente
  -- si las FK constraints están configuradas correctamente
  DELETE FROM workout_sessions WHERE id = session_id_param;
  
  RETURN jsonb_build_object('success', true);

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to delete workout session: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- =============================================
-- GRANT PERMISSIONS 
-- =============================================
-- Permitir que usuarios autenticados ejecuten las funciones
GRANT EXECUTE ON FUNCTION create_routine_with_data TO authenticated;
GRANT EXECUTE ON FUNCTION update_routine_with_data TO authenticated;
GRANT EXECUTE ON FUNCTION create_workout_session_with_data TO authenticated;
GRANT EXECUTE ON FUNCTION delete_routine_by_id TO authenticated;
GRANT EXECUTE ON FUNCTION delete_workout_session TO authenticated;

-- =============================================
-- COMENTARIOS PARA DEBUGGING
-- =============================================
COMMENT ON FUNCTION create_routine_with_data IS 'Creates a complete routine with blocks, exercises, and sets in a single transaction - Schema: routine.ts';
COMMENT ON FUNCTION update_routine_with_data IS 'Updates a routine by replacing all its content atomically - Schema: routine.ts';
COMMENT ON FUNCTION create_workout_session_with_data IS 'Creates a complete workout session with blocks, exercises, and sets in a single transaction - Schema: workout-session.ts';
COMMENT ON FUNCTION delete_routine_by_id IS 'Deletes a routine and all related data via cascade';
COMMENT ON FUNCTION delete_workout_session IS 'Deletes a workout session and all related data via cascade';
