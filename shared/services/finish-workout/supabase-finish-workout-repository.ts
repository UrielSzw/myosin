import { supabase } from "@/shared/services/supabase";
import type { FinishWorkoutPayload } from "./types";

export type FinishWorkoutSupabaseResult = {
  success: boolean;
  sessionId?: string;
  error?: string;
  detail?: string;
};

/**
 * Syncs the finish workout payload to Supabase using the unified RPC.
 * This should be called after saveFinishWorkoutLocal succeeds.
 *
 * Can be called in the background - doesn't block the UI.
 */
export async function syncFinishWorkoutToSupabase(
  payload: FinishWorkoutPayload
): Promise<FinishWorkoutSupabaseResult> {
  try {
    // Transform payload to match RPC parameter format
    const routineUpdate = payload.routineUpdate
      ? {
          routineId: payload.routineUpdate.routineId,
          blocks: payload.routineUpdate.blocks,
          exercises: payload.routineUpdate.exercises,
          sets: payload.routineUpdate.sets,
        }
      : null;

    const workoutSession = {
      session: payload.workoutSession.session,
      blocks: payload.workoutSession.blocks,
      exercises: payload.workoutSession.exercises,
      sets: payload.workoutSession.sets,
    };

    const prs = {
      current: payload.prs.current,
      history: payload.prs.history,
    };

    // Call the unified RPC
    const { data, error } = await supabase.rpc("finish_workout", {
      p_workout_session: workoutSession,
      p_routine_update: routineUpdate,
      p_prs: prs,
    });

    if (error) {
      console.error("Supabase finish_workout RPC error:", error);
      return {
        success: false,
        error: error.message,
        detail: error.details || error.hint,
      };
    }

    // Parse RPC response
    const result = data as {
      success: boolean;
      session_id?: string;
      error?: string;
      detail?: string;
    };

    if (!result.success) {
      console.error("Supabase finish_workout RPC returned error:", result);
      return {
        success: false,
        error: result.error,
        detail: result.detail,
      };
    }

    return {
      success: true,
      sessionId: result.session_id,
    };
  } catch (error) {
    console.error("Failed to sync finish workout to Supabase:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
