-- ==================== TRACKER RPC FUNCTIONS ====================
-- RPC functions para operaciones complejas del tracker

-- ==================== REORDER METRICS ====================
CREATE OR REPLACE FUNCTION reorder_tracker_metrics(
  metric_orders JSON
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  metric_order JSON;
BEGIN
  -- Validar que el JSON sea un array
  IF JSON_TYPEOF(metric_orders) != 'array' THEN
    RAISE EXCEPTION 'metric_orders must be an array';
  END IF;

  -- Actualizar cada métrica con su nuevo order_index
  FOR metric_order IN SELECT * FROM JSON_ARRAY_ELEMENTS(metric_orders)
  LOOP
    UPDATE tracker_metrics 
    SET 
      order_index = (metric_order->>'order_index')::integer,
      updated_at = NOW()
    WHERE 
      id = metric_order->>'id'
      AND deleted_at IS NULL; -- Solo métricas activas
  END LOOP;
END;
$$;

-- ==================== CREATE ENTRY FROM QUICK ACTION ====================
CREATE OR REPLACE FUNCTION create_tracker_entry_from_quick_action(
  p_quick_action_id UUID,
  p_user_id TEXT,
  p_notes TEXT DEFAULT NULL,
  p_recorded_at TIMESTAMPTZ DEFAULT NOW(),
  p_day_key TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_quick_action tracker_quick_actions%ROWTYPE;
  v_metric tracker_metrics%ROWTYPE;
  v_entry_id UUID;
  v_day_key TEXT;
  v_display_value TEXT;
  v_result JSON;
BEGIN
  -- Generar UUID para la nueva entrada
  v_entry_id := gen_random_uuid();
  
  -- Calcular day_key si no se proporciona
  IF p_day_key IS NULL THEN
    v_day_key := TO_CHAR(p_recorded_at, 'YYYY-MM-DD');
  ELSE
    v_day_key := p_day_key;
  END IF;

  -- Obtener la quick action
  SELECT * INTO v_quick_action
  FROM tracker_quick_actions
  WHERE id = p_quick_action_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quick action not found: %', p_quick_action_id;
  END IF;

  -- Obtener la métrica asociada
  SELECT * INTO v_metric
  FROM tracker_metrics
  WHERE id = v_quick_action.metric_id
    AND deleted_at IS NULL;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Metric not found or deleted: %', v_quick_action.metric_id;
  END IF;

  -- Generar display_value basado en el tipo de input
  CASE v_metric.input_type
    WHEN 'numeric_accumulative', 'numeric_single' THEN
      v_display_value := v_quick_action.label;
    WHEN 'scale_discrete' THEN
      -- Para escalas, usar el valor como índice (implementar lógica específica si es necesario)
      v_display_value := v_quick_action.value::TEXT;
    WHEN 'boolean_toggle' THEN
      v_display_value := CASE 
        WHEN v_quick_action.value = 1 THEN '✅ Completado'
        ELSE '❌ No completado'
      END;
    ELSE
      v_display_value := v_quick_action.value::TEXT || ' ' || v_metric.unit;
  END CASE;

  -- Insertar la nueva entrada
  INSERT INTO tracker_entries (
    id,
    user_id,
    metric_id,
    value,
    value_normalized,
    unit,
    notes,
    source,
    day_key,
    recorded_at,
    display_value,
    raw_input,
    created_at,
    updated_at
  ) VALUES (
    v_entry_id,
    p_user_id,
    v_metric.id,
    v_quick_action.value,
    v_quick_action.value_normalized,
    v_metric.unit,
    p_notes,
    'quick_action',
    v_day_key,
    p_recorded_at,
    v_display_value,
    JSON_BUILD_OBJECT('quick_action_id', p_quick_action_id),
    NOW(),
    NOW()
  );

  -- Recalcular agregado diario (opcional - puede ser manejado por triggers)
  -- PERFORM recalculate_daily_aggregate(p_user_id, v_metric.id, v_day_key);

  -- Construir resultado
  SELECT JSON_BUILD_OBJECT(
    'id', id,
    'user_id', user_id,
    'metric_id', metric_id,
    'value', value,
    'value_normalized', value_normalized,
    'unit', unit,
    'notes', notes,
    'source', source,
    'day_key', day_key,
    'recorded_at', recorded_at,
    'display_value', display_value,
    'raw_input', raw_input,
    'created_at', created_at,
    'updated_at', updated_at
  ) INTO v_result
  FROM tracker_entries
  WHERE id = v_entry_id;

  RETURN v_result;
END;
$$;

-- ==================== HELPER FUNCTIONS ====================

-- Función para recalcular agregados diarios (opcional)
CREATE OR REPLACE FUNCTION recalculate_daily_aggregate(
  p_user_id TEXT,
  p_metric_id UUID,
  p_day_key TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_sum_normalized NUMERIC;
  v_count INTEGER;
  v_min_normalized NUMERIC;
  v_max_normalized NUMERIC;
  v_avg_normalized NUMERIC;
BEGIN
  -- Calcular estadísticas del día
  SELECT 
    COALESCE(SUM(value_normalized), 0),
    COUNT(*),
    MIN(value_normalized),
    MAX(value_normalized),
    AVG(value_normalized)
  INTO 
    v_sum_normalized,
    v_count,
    v_min_normalized,
    v_max_normalized,
    v_avg_normalized
  FROM tracker_entries
  WHERE user_id = p_user_id
    AND metric_id = p_metric_id
    AND day_key = p_day_key;

  -- Upsert del agregado diario
  INSERT INTO tracker_daily_aggregates (
    id,
    user_id,
    metric_id,
    day_key,
    sum_normalized,
    count,
    min_normalized,
    max_normalized,
    avg_normalized,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    p_user_id,
    p_metric_id,
    p_day_key,
    v_sum_normalized,
    v_count,
    v_min_normalized,
    v_max_normalized,
    v_avg_normalized,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id, metric_id, day_key)
  DO UPDATE SET
    sum_normalized = EXCLUDED.sum_normalized,
    count = EXCLUDED.count,
    min_normalized = EXCLUDED.min_normalized,
    max_normalized = EXCLUDED.max_normalized,
    avg_normalized = EXCLUDED.avg_normalized,
    updated_at = NOW();
END;
$$;

-- ==================== PERMISSIONS ====================

-- Otorgar permisos necesarios
GRANT EXECUTE ON FUNCTION reorder_tracker_metrics(JSON) TO authenticated;
GRANT EXECUTE ON FUNCTION create_tracker_entry_from_quick_action(UUID, TEXT, TEXT, TIMESTAMPTZ, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION recalculate_daily_aggregate(TEXT, UUID, TEXT) TO authenticated;