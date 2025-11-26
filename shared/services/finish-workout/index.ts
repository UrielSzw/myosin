import { saveFinishWorkoutLocal } from "./finish-workout-repository";
import { syncFinishWorkoutToSupabase } from "./supabase-finish-workout-repository";
import type { FinishWorkoutPayload, FinishWorkoutResult } from "./types";

/**
 * Main service for finishing a workout.
 *
 * Orchestrates the complete flow:
 * 1. Save locally (blocking, must succeed)
 * 2. Sync to Supabase (background, can retry)
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

  // Step 2: Sync to Supabase (background, non-blocking for user)
  // We fire-and-forget the sync, but log any errors
  syncToSupabaseInBackground(payload);

  return {
    success: true,
    sessionId: payload.workoutSession.session.id!,
  };
}

/**
 * Fire-and-forget sync to Supabase.
 * Logs errors but doesn't block the user.
 *
 * TODO: In the future, we could add:
 * - Retry logic with exponential backoff
 * - Queue for offline support
 * - Error reporting to analytics
 */
async function syncToSupabaseInBackground(
  payload: FinishWorkoutPayload
): Promise<void> {
  try {
    const result = await syncFinishWorkoutToSupabase(payload);

    if (result.success) {
      console.log(
        "✅ Workout synced to Supabase successfully:",
        result.sessionId
      );
    } else {
      console.warn("⚠️ Failed to sync workout to Supabase:", result.error);
      // TODO: Add to retry queue
    }
  } catch (error) {
    console.error("❌ Error syncing workout to Supabase:", error);
    // TODO: Add to retry queue
  }
}

// Re-export types and utilities
export { prepareFinishData } from "./prepare-finish-data";
export type {
  FinishWorkoutPayload,
  FinishWorkoutResult,
  PrepareFinishDataOptions,
} from "./types";
