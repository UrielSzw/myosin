-- =============================================
-- SUPABASE RPC: USER EXERCISE UNLOCKS SYNC
-- =============================================
-- Función para sincronizar user_exercise_unlocks desde el cliente
-- Similar a otras funciones de upsert del sistema
-- =============================================

-- =============================================
-- 1. UPSERT USER EXERCISE UNLOCK
-- =============================================
-- Inserta o actualiza un unlock de usuario
-- Sin FK constraint en unlocked_by_pr_id para permitir sync en cualquier orden

CREATE OR REPLACE FUNCTION upsert_user_exercise_unlock(
  p_id UUID,
  p_user_id UUID,
  p_exercise_id UUID,
  p_status TEXT,
  p_unlocked_at TIMESTAMPTZ DEFAULT NULL,
  p_unlocked_by_exercise_id UUID DEFAULT NULL,
  p_unlocked_by_pr_id UUID DEFAULT NULL,
  p_current_progress JSONB DEFAULT NULL,
  p_manually_unlocked BOOLEAN DEFAULT false,
  p_manually_unlocked_at TIMESTAMPTZ DEFAULT NULL,
  p_created_at TIMESTAMPTZ DEFAULT NULL,
  p_updated_at TIMESTAMPTZ DEFAULT NULL
) RETURNS jsonb AS $$
DECLARE
  result_row user_exercise_unlocks%ROWTYPE;
BEGIN
  -- Verificar que el usuario actual es el dueño
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: Cannot modify unlocks for other users';
  END IF;

  -- Upsert: insertar o actualizar
  INSERT INTO user_exercise_unlocks (
    id,
    user_id,
    exercise_id,
    status,
    unlocked_at,
    unlocked_by_exercise_id,
    unlocked_by_pr_id,
    current_progress,
    manually_unlocked,
    manually_unlocked_at,
    created_at,
    updated_at
  )
  VALUES (
    p_id,
    p_user_id,
    p_exercise_id,
    p_status,
    p_unlocked_at,
    p_unlocked_by_exercise_id,
    p_unlocked_by_pr_id,
    p_current_progress,
    p_manually_unlocked,
    p_manually_unlocked_at,
    COALESCE(p_created_at, NOW()),
    COALESCE(p_updated_at, NOW())
  )
  ON CONFLICT (user_id, exercise_id) DO UPDATE SET
    status = EXCLUDED.status,
    unlocked_at = EXCLUDED.unlocked_at,
    unlocked_by_exercise_id = EXCLUDED.unlocked_by_exercise_id,
    unlocked_by_pr_id = EXCLUDED.unlocked_by_pr_id,
    current_progress = EXCLUDED.current_progress,
    manually_unlocked = EXCLUDED.manually_unlocked,
    manually_unlocked_at = EXCLUDED.manually_unlocked_at,
    updated_at = NOW()
  RETURNING * INTO result_row;

  RETURN jsonb_build_object(
    'success', true,
    'id', result_row.id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 2. BULK UPSERT USER EXERCISE UNLOCKS
-- =============================================
-- Para sincronizar múltiples unlocks de una vez (más eficiente)

CREATE OR REPLACE FUNCTION upsert_user_exercise_unlocks_bulk(
  p_user_id UUID,
  p_unlocks JSONB
) RETURNS jsonb AS $$
DECLARE
  unlock_item JSONB;
  processed_count INTEGER := 0;
BEGIN
  -- Verificar que el usuario actual es el dueño
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: Cannot modify unlocks for other users';
  END IF;

  -- Procesar cada unlock
  FOR unlock_item IN SELECT * FROM jsonb_array_elements(p_unlocks)
  LOOP
    INSERT INTO user_exercise_unlocks (
      id,
      user_id,
      exercise_id,
      status,
      unlocked_at,
      unlocked_by_exercise_id,
      unlocked_by_pr_id,
      current_progress,
      manually_unlocked,
      manually_unlocked_at,
      created_at,
      updated_at
    )
    VALUES (
      (unlock_item->>'id')::UUID,
      p_user_id,
      (unlock_item->>'exercise_id')::UUID,
      unlock_item->>'status',
      (unlock_item->>'unlocked_at')::TIMESTAMPTZ,
      (unlock_item->>'unlocked_by_exercise_id')::UUID,
      (unlock_item->>'unlocked_by_pr_id')::UUID,
      unlock_item->'current_progress',
      COALESCE((unlock_item->>'manually_unlocked')::BOOLEAN, false),
      (unlock_item->>'manually_unlocked_at')::TIMESTAMPTZ,
      COALESCE((unlock_item->>'created_at')::TIMESTAMPTZ, NOW()),
      COALESCE((unlock_item->>'updated_at')::TIMESTAMPTZ, NOW())
    )
    ON CONFLICT (user_id, exercise_id) DO UPDATE SET
      status = EXCLUDED.status,
      unlocked_at = EXCLUDED.unlocked_at,
      unlocked_by_exercise_id = EXCLUDED.unlocked_by_exercise_id,
      unlocked_by_pr_id = EXCLUDED.unlocked_by_pr_id,
      current_progress = EXCLUDED.current_progress,
      manually_unlocked = EXCLUDED.manually_unlocked,
      manually_unlocked_at = EXCLUDED.manually_unlocked_at,
      updated_at = NOW();

    processed_count := processed_count + 1;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'processed', processed_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 3. GET USER EXERCISE UNLOCKS FOR SYNC
-- =============================================
-- Obtener todos los unlocks de un usuario para sync inicial

CREATE OR REPLACE FUNCTION get_user_exercise_unlocks_for_sync(
  p_user_id UUID
) RETURNS TABLE (
  id UUID,
  user_id UUID,
  exercise_id UUID,
  status TEXT,
  unlocked_at TIMESTAMPTZ,
  unlocked_by_exercise_id UUID,
  unlocked_by_pr_id UUID,
  current_progress JSONB,
  manually_unlocked BOOLEAN,
  manually_unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Verificar que el usuario actual es el dueño
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: Cannot read unlocks for other users';
  END IF;

  RETURN QUERY
  SELECT 
    ueu.id,
    ueu.user_id,
    ueu.exercise_id,
    ueu.status,
    ueu.unlocked_at,
    ueu.unlocked_by_exercise_id,
    ueu.unlocked_by_pr_id,
    ueu.current_progress,
    ueu.manually_unlocked,
    ueu.manually_unlocked_at,
    ueu.created_at,
    ueu.updated_at
  FROM user_exercise_unlocks ueu
  WHERE ueu.user_id = p_user_id
  ORDER BY ueu.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
