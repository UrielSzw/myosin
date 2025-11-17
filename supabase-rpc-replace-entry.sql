
-- RPC function para reemplazar entries atomicamente
-- Usado cuando una métrica tiene behavior="replace"

-- Drop existing function to avoid conflicts
DROP FUNCTION IF EXISTS replace_tracker_entry_with_aggregate(JSONB, JSONB);

CREATE OR REPLACE FUNCTION replace_tracker_entry_with_aggregate(
  entry_data JSONB,
  aggregate_data JSONB
) RETURNS VOID AS $$
DECLARE
  existing_entry_id UUID;
  metric_behavior TEXT;
BEGIN
  -- Obtener behavior de la métrica
  SELECT behavior INTO metric_behavior
  FROM tracker_metrics 
  WHERE id = (entry_data->>'metric_id')::UUID;
  
  -- Si no es "replace", usar la función normal de create
  IF metric_behavior != 'replace' THEN
    PERFORM create_tracker_entry_with_aggregate(entry_data, aggregate_data);
    RETURN;
  END IF;
  
  -- Buscar entry existente del mismo día para métricas "replace"
  SELECT id INTO existing_entry_id
  FROM tracker_entries
  WHERE user_id = (entry_data->>'user_id')::UUID
    AND metric_id = (entry_data->>'metric_id')::UUID  
    AND day_key = (entry_data->>'day_key')::DATE
  LIMIT 1;
  
  IF existing_entry_id IS NOT NULL THEN
    -- ACTUALIZAR entry existente (UPSERT)
    UPDATE tracker_entries SET
      value = (entry_data->>'value')::REAL,
      value_normalized = (entry_data->>'value_normalized')::REAL,
      unit = entry_data->>'unit',
      notes = entry_data->>'notes',
      source = entry_data->>'source',
      recorded_at = (entry_data->>'recorded_at')::TIMESTAMPTZ,
      display_value = entry_data->>'display_value',
      raw_input = entry_data->'raw_input',
      meta = entry_data->'meta',
      updated_at = NOW()
    WHERE id = existing_entry_id;
  ELSE
    -- INSERTAR nueva entry
    INSERT INTO tracker_entries (
      id, user_id, metric_id, value, value_normalized, unit,
      notes, source, day_key, recorded_at, display_value, 
      raw_input, meta, created_at, updated_at
    ) VALUES (
      (entry_data->>'id')::UUID,
      (entry_data->>'user_id')::UUID, 
      (entry_data->>'metric_id')::UUID,
      (entry_data->>'value')::REAL,
      (entry_data->>'value_normalized')::REAL,
      entry_data->>'unit',
      entry_data->>'notes',
      entry_data->>'source', 
      (entry_data->>'day_key')::DATE,
      (entry_data->>'recorded_at')::TIMESTAMPTZ,
      entry_data->>'display_value',
      entry_data->'raw_input',
      entry_data->'meta',
      (entry_data->>'created_at')::TIMESTAMPTZ,
      NOW()
    );
  END IF;
  
  -- Actualizar o insertar daily aggregate
  IF aggregate_data IS NOT NULL THEN
    INSERT INTO tracker_daily_aggregates (
      id, user_id, metric_id, day_key, sum_normalized, count,
      min_normalized, max_normalized, avg_normalized, 
      previous_day_sum, created_at, updated_at
    ) VALUES (
      (aggregate_data->>'id')::UUID,
      (aggregate_data->>'user_id')::UUID,
      (aggregate_data->>'metric_id')::UUID, 
      (aggregate_data->>'day_key')::DATE,
      (aggregate_data->>'sum_normalized')::REAL,
      (aggregate_data->>'count')::INTEGER,
      (aggregate_data->>'min_normalized')::REAL,
      (aggregate_data->>'max_normalized')::REAL,
      (aggregate_data->>'avg_normalized')::REAL,
      (aggregate_data->>'previous_day_sum')::REAL,
      (aggregate_data->>'created_at')::TIMESTAMPTZ,
      NOW()
    )
    ON CONFLICT (user_id, metric_id, day_key) 
    DO UPDATE SET
      sum_normalized = (aggregate_data->>'sum_normalized')::REAL,
      count = (aggregate_data->>'count')::INTEGER,
      min_normalized = (aggregate_data->>'min_normalized')::REAL,
      max_normalized = (aggregate_data->>'max_normalized')::REAL,
      avg_normalized = (aggregate_data->>'avg_normalized')::REAL,
      previous_day_sum = (aggregate_data->>'previous_day_sum')::REAL,
      updated_at = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;