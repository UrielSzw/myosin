-- Drop function if it exists
DROP FUNCTION IF EXISTS create_tracker_entry_with_aggregate(jsonb, jsonb);

-- Create atomic function for tracker entry + daily aggregate
CREATE OR REPLACE FUNCTION create_tracker_entry_with_aggregate(
  entry_data jsonb,
  aggregate_data jsonb DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inserted_entry jsonb;
  user_uuid uuid;
BEGIN
  -- Handle user_id: should always use authenticated user
  user_uuid := auth.uid();
  
  -- If no authenticated user, reject the operation
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create tracker entries';
  END IF;
  
  -- Log warning if client sent "default-user" (shouldn't happen in production)
  IF entry_data->>'user_id' = 'default-user' OR entry_data->>'user_id' = '' THEN
    RAISE WARNING 'Client sent invalid user_id: %, using authenticated user: %', 
      entry_data->>'user_id', user_uuid;
  END IF;
  -- Insert the tracker entry with client-provided UUID
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
    meta,
    created_at,
    updated_at
  ) VALUES (
    (entry_data->>'id')::uuid,
    user_uuid,
    (entry_data->>'metric_id')::uuid,
    (entry_data->>'value')::real,
    (entry_data->>'value_normalized')::real,
    entry_data->>'unit',
    entry_data->>'notes',
    entry_data->>'source',
    (entry_data->>'day_key')::date,
    (entry_data->>'recorded_at')::timestamptz,
    entry_data->>'display_value',
    entry_data->'raw_input',
    entry_data->'meta',
    COALESCE((entry_data->>'created_at')::timestamptz, NOW()),
    COALESCE((entry_data->>'updated_at')::timestamptz, NOW())
  )
  RETURNING to_jsonb(tracker_entries.*) INTO inserted_entry;

  -- If aggregate data is provided, upsert the daily aggregate
  IF aggregate_data IS NOT NULL THEN
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
      previous_day_sum,
      created_at,
      updated_at
    ) VALUES (
      (aggregate_data->>'id')::uuid,
      user_uuid,
      (aggregate_data->>'metric_id')::uuid,
      (aggregate_data->>'day_key')::date,
      (aggregate_data->>'sum_normalized')::real,
      (aggregate_data->>'count')::integer,
      (aggregate_data->>'min_normalized')::real,
      (aggregate_data->>'max_normalized')::real,
      (aggregate_data->>'avg_normalized')::real,
      (aggregate_data->>'previous_day_sum')::real,
      COALESCE((aggregate_data->>'created_at')::timestamptz, NOW()),
      COALESCE((aggregate_data->>'updated_at')::timestamptz, NOW())
    )
    ON CONFLICT (user_id, metric_id, day_key) 
    DO UPDATE SET
      sum_normalized = EXCLUDED.sum_normalized,
      count = EXCLUDED.count,
      min_normalized = EXCLUDED.min_normalized,
      max_normalized = EXCLUDED.max_normalized,
      avg_normalized = EXCLUDED.avg_normalized,
      previous_day_sum = EXCLUDED.previous_day_sum,
      updated_at = EXCLUDED.updated_at;
  END IF;

  -- Return the inserted entry
  RETURN inserted_entry;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_tracker_entry_with_aggregate(jsonb, jsonb) TO authenticated;