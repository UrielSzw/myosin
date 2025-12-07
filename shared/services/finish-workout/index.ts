import { getSyncAdapter } from "../../data/core/sync-adapter";
import { saveFinishWorkoutLocal } from "./finish-workout-repository";
import type { FinishWorkoutPayload, FinishWorkoutResult } from "./types";

/**
 * Main service for finishing a workout.
 *
 * Orchestrates the complete flow:
 * 1. Save locally (blocking, must succeed)
 * 2. Sync to Supabase via SyncAdapter (background, can retry)
 *
 * The local save is atomic - if it fails, nothing is persisted.
 * The Supabase sync happens after local save succeeds.
 */
export async function finishWorkout(
  payload: FinishWorkoutPayload
): Promise<FinishWorkoutResult> {
  // Step 1: Save locally (must succeed)
  const localResult = await saveFinishWorkoutLocal(payload);

  if (!localResult.success) {
    return {
      success: false,
      sessionId: null,
      error: localResult.error || "Failed to save workout locally",
    };
  }

  // Step 2: Sync to Supabase via SyncAdapter (background, non-blocking for user)
  // SyncAdapter handles online/offline, queueing, and marking entities as synced
  const syncAdapter = getSyncAdapter();
  syncAdapter.sync("FINISH_WORKOUT", payload);

  return {
    success: true,
    sessionId: payload.workoutSession.session.id!,
  };
}

// Re-export types and utilities
export { prepareFinishData } from "./prepare-finish-data";
export type {
  FinishWorkoutPayload,
  FinishWorkoutResult,
  PrepareFinishDataOptions,
} from "./types";
