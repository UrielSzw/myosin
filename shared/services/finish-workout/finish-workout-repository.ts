import { db } from "@/shared/db/client";
import { pr_current, pr_history } from "@/shared/db/schema/pr";
import {
  exercise_in_block,
  routine_blocks,
  routine_sets,
} from "@/shared/db/schema/routine";
import {
  workout_blocks,
  workout_exercises,
  workout_sessions,
  workout_sets,
} from "@/shared/db/schema/workout-session";
import { and, eq, inArray } from "drizzle-orm";
import type { FinishWorkoutPayload } from "./types";

/**
 * Saves the entire finish workout payload in a single SQLite transaction.
 *
 * Order of operations:
 * 1. Update routine (if shouldUpdateRoutine) - DELETE old + INSERT new
 * 2. Insert workout session with all related data
 * 3. Upsert PR current + Insert PR history
 *
 * If any step fails, the entire transaction is rolled back.
 */
export async function saveFinishWorkoutLocal(
  payload: FinishWorkoutPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.transaction(async (tx) => {
      // ==========================================
      // STEP 1: UPDATE ROUTINE (if needed)
      // ==========================================
      if (payload.routineUpdate) {
        const { routineId, blocks, exercises, sets } = payload.routineUpdate;

        // 1a. Get existing blocks to cascade delete
        const existingBlocks = await tx
          .select({ id: routine_blocks.id })
          .from(routine_blocks)
          .where(eq(routine_blocks.routine_id, routineId));

        if (existingBlocks.length > 0) {
          const blockIds = existingBlocks.map((b) => b.id);

          // 1b. Get existing exercises to cascade delete sets
          const existingExercises = await tx
            .select({ id: exercise_in_block.id })
            .from(exercise_in_block)
            .where(inArray(exercise_in_block.block_id, blockIds));

          if (existingExercises.length > 0) {
            const exerciseIds = existingExercises.map((e) => e.id);

            // 1c. Delete sets
            await tx
              .delete(routine_sets)
              .where(inArray(routine_sets.exercise_in_block_id, exerciseIds));
          }

          // 1d. Delete exercises
          await tx
            .delete(exercise_in_block)
            .where(inArray(exercise_in_block.block_id, blockIds));

          // 1e. Delete blocks
          await tx
            .delete(routine_blocks)
            .where(inArray(routine_blocks.id, blockIds));
        }

        // 1f. Insert new blocks
        if (blocks.length > 0) {
          await tx.insert(routine_blocks).values(blocks);
        }

        // 1g. Insert new exercises
        if (exercises.length > 0) {
          await tx.insert(exercise_in_block).values(exercises);
        }

        // 1h. Insert new sets
        if (sets.length > 0) {
          await tx.insert(routine_sets).values(sets);
        }
      }

      // ==========================================
      // STEP 2: INSERT WORKOUT SESSION
      // ==========================================
      const { session, blocks, exercises, sets } = payload.workoutSession;

      // 2a. Insert session
      await tx.insert(workout_sessions).values(session);

      // 2b. Insert blocks
      if (blocks.length > 0) {
        await tx.insert(workout_blocks).values(blocks);
      }

      // 2c. Insert exercises
      if (exercises.length > 0) {
        await tx.insert(workout_exercises).values(exercises);
      }

      // 2d. Insert sets
      if (sets.length > 0) {
        await tx.insert(workout_sets).values(sets);
      }

      // ==========================================
      // STEP 3: UPSERT PRS
      // ==========================================
      const { current: prCurrentData, history: prHistoryData } = payload.prs;

      // 3a. Upsert current PRs
      for (const prData of prCurrentData) {
        // Check if exists
        const [existing] = await tx
          .select()
          .from(pr_current)
          .where(
            and(
              eq(pr_current.user_id, prData.user_id),
              eq(pr_current.exercise_id, prData.exercise_id)
            )
          );

        if (existing) {
          // Update existing PR
          await tx
            .update(pr_current)
            .set({
              best_weight: prData.best_weight,
              best_reps: prData.best_reps,
              estimated_1rm: prData.estimated_1rm,
              achieved_at: prData.achieved_at,
              source: prData.source,
              updated_at: new Date().toISOString(),
            })
            .where(eq(pr_current.id, existing.id));
        } else {
          // Insert new PR
          await tx.insert(pr_current).values({
            id: prData.id,
            user_id: prData.user_id,
            exercise_id: prData.exercise_id,
            best_weight: prData.best_weight,
            best_reps: prData.best_reps,
            estimated_1rm: prData.estimated_1rm,
            achieved_at: prData.achieved_at,
            source: prData.source,
          });
        }
      }

      // 3b. Insert PR history
      for (const historyData of prHistoryData) {
        await tx.insert(pr_history).values({
          id: historyData.id,
          user_id: historyData.user_id,
          exercise_id: historyData.exercise_id,
          weight: historyData.weight,
          reps: historyData.reps,
          estimated_1rm: historyData.estimated_1rm,
          workout_session_id: historyData.workout_session_id,
          workout_set_id: historyData.workout_set_id || null,
          source: historyData.source,
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to save finish workout locally:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
