import { getSyncAdapter } from "../../data/core/sync-adapter";
import { userExerciseUnlocksRepository } from "../../db/repository/progressions";
import { progressionService } from "../progression-service";
import { saveFinishWorkoutLocal } from "./finish-workout-repository";
import type {
  FinishWorkoutPayload,
  FinishWorkoutResult,
  UnlockedExerciseInfo,
} from "./types";

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

  // Step 2: Process progression unlocks based on new PRs
  // This runs after PRs are saved locally, so progressionService can read them
  const unlockedExercises: UnlockedExerciseInfo[] = [];

  if (payload.prs.current.length > 0) {
    try {
      // Get unique exercise IDs that got new PRs
      const exerciseIdsWithPRs = [
        ...new Set(payload.prs.current.map((pr) => pr.exercise_id)),
      ];

      // Check for unlocks for each exercise with a new PR
      for (const exerciseId of exerciseIdsWithPRs) {
        const prData = payload.prs.current.find(
          (pr) => pr.exercise_id === exerciseId
        );

        const newUnlocks = await progressionService.processUnlocksAfterPR(
          payload.userId,
          exerciseId,
          prData?.id
        );

        // Add to unlocked exercises list
        for (const unlock of newUnlocks) {
          unlockedExercises.push({
            exerciseId: unlock.unlockedExerciseId,
            unlockedByExerciseId: unlock.unlockedByExerciseId,
            unlockedByPrId: unlock.unlockedByPrId,
          });
        }
      }
    } catch (error) {
      // Don't fail the workout save if progression check fails
      console.warn("Failed to process progression unlocks:", error);
    }
  }

  // Step 3: Sync to Supabase via SyncAdapter (background, non-blocking for user)
  // SyncAdapter handles online/offline, queueing, and marking entities as synced
  const syncAdapter = getSyncAdapter();
  syncAdapter.sync("FINISH_WORKOUT", payload);

  // Step 4: Sync any modified unlocks (separate from workout sync)
  // This is fire-and-forget, unlocks don't have FK constraint on PRs
  try {
    const unsyncedUnlocks = await userExerciseUnlocksRepository.getUnsynced(
      payload.userId
    );

    if (unsyncedUnlocks.length > 0) {
      console.log("[FinishWorkout] Syncing", unsyncedUnlocks.length, "unlocks");

      syncAdapter.sync("USER_EXERCISE_UNLOCKS_BULK", {
        userId: payload.userId,
        unlocks: unsyncedUnlocks.map((u) => ({
          id: u.id,
          user_id: u.user_id,
          exercise_id: u.exercise_id,
          status: u.status,
          unlocked_at: u.unlocked_at,
          unlocked_by_exercise_id: u.unlocked_by_exercise_id,
          unlocked_by_pr_id: u.unlocked_by_pr_id,
          current_progress: u.current_progress,
          manually_unlocked: u.manually_unlocked,
          manually_unlocked_at: u.manually_unlocked_at,
          created_at: u.created_at,
          updated_at: u.updated_at,
        })),
      });
    }
  } catch (error) {
    // Don't fail if unlock sync fails - will be retried later
    console.warn("[FinishWorkout] Failed to sync unlocks:", error);
  }

  return {
    success: true,
    sessionId: payload.workoutSession.session.id!,
    unlockedExercises:
      unlockedExercises.length > 0 ? unlockedExercises : undefined,
  };
}

// Re-export types and utilities
export { prepareFinishData } from "./prepare-finish-data";
export type {
  FinishWorkoutPayload,
  FinishWorkoutResult,
  PrepareFinishDataOptions,
  UnlockedExerciseInfo,
} from "./types";
