import type {
  BlockInsert,
  ExerciseInBlockInsert,
  SetInsert,
} from "@/shared/db/schema/routine";
import type {
  WorkoutBlockInsert,
  WorkoutExerciseInsert,
  WorkoutSessionInsert,
  WorkoutSetInsert,
} from "@/shared/db/schema/workout-session";

// ============================================
// ROUTINE UPDATE TYPES
// ============================================

export type RoutineUpdateData = {
  routineId: string;
  blocks: BlockInsert[];
  exercises: ExerciseInBlockInsert[];
  sets: SetInsert[];
};

// ============================================
// WORKOUT SESSION TYPES
// ============================================

export type WorkoutSessionData = {
  session: WorkoutSessionInsert;
  blocks: WorkoutBlockInsert[];
  exercises: WorkoutExerciseInsert[];
  sets: WorkoutSetInsert[];
};

// ============================================
// PR TYPES
// ============================================

export type PRCurrentData = {
  id: string;
  user_id: string;
  exercise_id: string;
  best_weight: number;
  best_reps: number;
  estimated_1rm: number;
  achieved_at: string;
  source: "auto" | "manual";
};

export type PRHistoryData = {
  id: string;
  user_id: string;
  exercise_id: string;
  weight: number;
  reps: number;
  estimated_1rm: number;
  workout_session_id: string;
  workout_set_id: string;
  source: "auto" | "manual" | "import";
};

export type PRsData = {
  current: PRCurrentData[];
  history: PRHistoryData[];
};

// ============================================
// MAIN PAYLOAD TYPE
// ============================================

/**
 * Complete payload for finishing a workout.
 * All IDs are real UUIDs, generated upfront.
 * This payload is used for both local SQLite and Supabase sync.
 */
export type FinishWorkoutPayload = {
  // Metadata
  userId: string;
  finishedAt: string;

  // Routine update (null if no changes or user chose not to update)
  routineUpdate: RoutineUpdateData | null;

  // Workout session (always present)
  workoutSession: WorkoutSessionData;

  // PRs to create/update (can be empty)
  prs: PRsData;
};

// ============================================
// INPUT TYPES (from active workout state)
// ============================================

export type PrepareFinishDataOptions = {
  shouldUpdateRoutine: boolean;
  userId: string;
};

// ============================================
// RESULT TYPES
// ============================================

export type FinishWorkoutResult = {
  success: boolean;
  sessionId: string | null;
  error?: string;
};

// ============================================
// ID MAPPINGS (internal use)
// ============================================

/**
 * Mappings from tempId to real UUID.
 * Used internally during payload preparation.
 */
export type IdMappings = {
  blocks: Record<string, string>; // tempBlockId -> realBlockId
  exercises: Record<string, string>; // tempExerciseId -> realExerciseId
  sets: Record<string, string>; // tempSetId -> realSetId
};
