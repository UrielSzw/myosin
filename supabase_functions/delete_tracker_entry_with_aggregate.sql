-- Drop function if it exists
DROP FUNCTION IF EXISTS delete_tracker_entry_with_aggregate(uuid, jsonb);

-- Create atomic function for deleting tracker entry + updating daily aggregate
CREATE OR REPLACE FUNCTION delete_tracker_entry_with_aggregate(
  entry_id uuid,
  aggregate_data jsonb DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_uuid uuid;
BEGIN
  -- Always use authenticated user for security
  user_uuid := auth.uid();
  
  -- If no authenticated user, reject the operation
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to delete tracker entries';
  END IF;

  -- Delete the tracker entry
  DELETE FROM tracker_entries 
  WHERE id = entry_id AND user_id = user_uuid;

  -- If aggregate data is provided, upsert the daily aggregate
  IF aggregate_data IS NOT NULL THEN
    -- If aggregate is null/empty, it means no entries left for that day
    -- In that case, delete the daily aggregate row
    IF (aggregate_data->>'count')::integer = 0 OR aggregate_data->>'count' IS NULL THEN
      DELETE FROM tracker_daily_aggregates 
      WHERE user_id = user_uuid 
        AND metric_id = (aggregate_data->>'metric_id')::uuid
        AND day_key = (aggregate_data->>'day_key')::date;
    ELSE
      -- Update the daily aggregate with new values
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
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_tracker_entry_with_aggregate(uuid, jsonb) TO authenticated;