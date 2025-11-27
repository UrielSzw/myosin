import type { ActiveWorkoutSet } from "@/features/active-workout/hooks/use-active-workout-store";
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
import { generateUUID } from "@/shared/db/utils/uuid";
import type {
  FinishWorkoutPayload,
  IdMappings,
  PRCurrentData,
  PrepareFinishDataOptions,
  PRHistoryData,
  PRsData,
  RoutineUpdateData,
  WorkoutSessionData,
} from "./types";

// ============================================
// TYPES FOR ACTIVE WORKOUT STATE
// ============================================

type ActiveWorkoutState = {
  session: {
    tempId: string;
    user_id: string;
    routine_id: string;
    routine: {
      id: string;
      name: string;
      folder_id: string | null;
      created_by_user_id: string;
      show_rpe: boolean;
      show_tempo: boolean;
      training_days: string[] | null;
    };
    started_at: string;
    original_sets_count: number;
  };
  blocks: Record<
    string,
    {
      tempId: string;
      // NOTA: Eliminamos original_block_id - ya no existe en schema
      type: "individual" | "superset" | "circuit";
      order_index: number;
      name: string;
      rest_time_seconds: number;
      rest_between_exercises_seconds: number;
      was_added_during_workout: boolean;
    }
  >;
  exercises: Record<
    string,
    {
      tempId: string;
      exercise_id: string;
      // NOTA: Eliminamos original_exercise_in_block_id - ya no existe en schema
      order_index: number;
      notes: string | null;
      was_added_during_workout: boolean;
    }
  >;
  sets: Record<string, ActiveWorkoutSet>;
  blocksBySession: string[];
  exercisesByBlock: Record<string, string[]>;
  setsByExercise: Record<string, string[]>;
  sessionBestPRs: Record<
    string,
    {
      tempSetId: string;
      exercise_id: string;
      weight: number;
      reps: number;
      estimated_1rm: number;
      created_at: string;
    }
  >;
};

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Transforms the active workout state into a complete payload
 * with all real UUIDs generated upfront.
 *
 * This is a pure function with no side effects.
 */
export function prepareFinishData(
  activeWorkout: ActiveWorkoutState,
  options: PrepareFinishDataOptions
): FinishWorkoutPayload {
  const { shouldUpdateRoutine, userId } = options;
  const finishedAt = new Date().toISOString();

  // Step 1: Generate all IDs upfront
  const idMappings = generateAllIds(activeWorkout);

  // Step 2: Prepare routine update data (if needed)
  const routineUpdate = shouldUpdateRoutine
    ? prepareRoutineUpdateData(activeWorkout, userId, idMappings)
    : null;

  // Step 3: Prepare workout session data
  // IMPORTANT: If routine is being updated, use the NEW routine block/exercise/set IDs
  // as the original_*_id references
  const workoutSession = prepareWorkoutSessionData(
    activeWorkout,
    userId,
    finishedAt,
    idMappings,
    shouldUpdateRoutine
  );

  // Step 4: Prepare PRs data
  const prs = preparePRsData(
    activeWorkout,
    userId,
    workoutSession.session.id!,
    idMappings
  );

  return {
    userId,
    finishedAt,
    routineUpdate,
    workoutSession,
    prs,
  };
}

// ============================================
// STEP 1: GENERATE ALL IDS
// ============================================

function generateAllIds(activeWorkout: ActiveWorkoutState): IdMappings {
  const blocks: Record<string, string> = {};
  const exercises: Record<string, string> = {};
  const sets: Record<string, string> = {};

  // Generate block IDs
  activeWorkout.blocksBySession.forEach((tempBlockId) => {
    blocks[tempBlockId] = generateUUID();
  });

  // Generate exercise IDs
  Object.keys(activeWorkout.exercises).forEach((tempExerciseId) => {
    exercises[tempExerciseId] = generateUUID();
  });

  // Generate set IDs
  Object.keys(activeWorkout.sets).forEach((tempSetId) => {
    sets[tempSetId] = generateUUID();
  });

  return { blocks, exercises, sets };
}

// ============================================
// STEP 2: PREPARE ROUTINE UPDATE DATA
// ============================================

function prepareRoutineUpdateData(
  activeWorkout: ActiveWorkoutState,
  userId: string,
  idMappings: IdMappings
): RoutineUpdateData {
  const routine = activeWorkout.session.routine;
  const routineId = routine.id;

  // Prepare blocks with REAL IDs
  const blocks: BlockInsert[] = activeWorkout.blocksBySession.map(
    (tempBlockId, index) => {
      const block = activeWorkout.blocks[tempBlockId];
      return {
        id: idMappings.blocks[tempBlockId],
        user_id: userId,
        routine_id: routineId,
        type: block.type,
        order_index: index,
        rest_time_seconds: block.rest_time_seconds,
        rest_between_exercises_seconds: block.rest_between_exercises_seconds,
        name: block.name,
      };
    }
  );

  // Prepare exercises with REAL IDs
  const exercisesData: ExerciseInBlockInsert[] = [];
  activeWorkout.blocksBySession.forEach((tempBlockId) => {
    const exerciseIds = activeWorkout.exercisesByBlock[tempBlockId] || [];
    exerciseIds.forEach((tempExerciseId) => {
      const exercise = activeWorkout.exercises[tempExerciseId];
      exercisesData.push({
        id: idMappings.exercises[tempExerciseId],
        user_id: userId,
        block_id: idMappings.blocks[tempBlockId],
        exercise_id: exercise.exercise_id,
        order_index: exercise.order_index,
        notes: exercise.notes,
      });
    });
  });

  // Prepare sets with REAL IDs
  const setsData: SetInsert[] = [];
  Object.entries(activeWorkout.setsByExercise).forEach(
    ([tempExerciseId, setIds]) => {
      setIds.forEach((tempSetId) => {
        const set = activeWorkout.sets[tempSetId];
        setsData.push({
          id: idMappings.sets[tempSetId],
          user_id: userId,
          exercise_in_block_id: idMappings.exercises[tempExerciseId],
          measurement_template: set.measurement_template,
          // Use planned values for routine (these are the "template" values)
          primary_value: set.planned_primary_value,
          secondary_value: set.planned_secondary_value,
          primary_range: set.planned_primary_range,
          secondary_range: set.planned_secondary_range,
          rpe: set.planned_rpe,
          tempo: set.planned_tempo,
          order_index: set.order_index,
          set_type: set.set_type,
        });
      });
    }
  );

  return {
    routineId,
    blocks,
    exercises: exercisesData,
    sets: setsData,
  };
}

// ============================================
// STEP 3: PREPARE WORKOUT SESSION DATA
// ============================================

function prepareWorkoutSessionData(
  activeWorkout: ActiveWorkoutState,
  userId: string,
  finishedAt: string,
  idMappings: IdMappings,
  shouldUpdateRoutine: boolean
): WorkoutSessionData {
  const session = activeWorkout.session;
  const sessionId = generateUUID();

  // Calculate analytics
  const completedSets = Object.values(activeWorkout.sets).filter(
    (set) => set.completed
  );
  const totalSetsPlanned = Object.keys(activeWorkout.sets).length;
  const totalSetsCompleted = completedSets.length;

  // Calculate total volume (weight * reps for weight_reps templates)
  const totalVolumeKg = completedSets.reduce((total, set) => {
    if (
      (set.measurement_template === "weight_reps" ||
        set.measurement_template === "weight_reps_range") &&
      set.actual_primary_value &&
      set.actual_secondary_value
    ) {
      return total + set.actual_primary_value * set.actual_secondary_value;
    }
    return total;
  }, 0);

  // Calculate average RPE
  const setsWithRpe = completedSets.filter((set) => set.actual_rpe);
  const averageRpe =
    setsWithRpe.length > 0
      ? setsWithRpe.reduce((sum, set) => sum + (set.actual_rpe || 0), 0) /
        setsWithRpe.length
      : null;

  // Calculate duration
  const startTime = new Date(session.started_at).getTime();
  const endTime = new Date(finishedAt).getTime();
  const durationSeconds = Math.floor((endTime - startTime) / 1000);

  // Session data
  const sessionData: WorkoutSessionInsert = {
    id: sessionId,
    user_id: userId,
    routine_id: session.routine_id,
    started_at: session.started_at,
    finished_at: finishedAt,
    total_duration_seconds: durationSeconds,
    total_sets_planned: totalSetsPlanned,
    total_sets_completed: totalSetsCompleted,
    total_volume_kg: totalVolumeKg > 0 ? totalVolumeKg : null,
    average_rpe: averageRpe,
  };

  // Generate workout block IDs (separate from routine block IDs)
  const workoutBlockIdMapping: Record<string, string> = {};
  activeWorkout.blocksBySession.forEach((tempBlockId) => {
    workoutBlockIdMapping[tempBlockId] = generateUUID();
  });

  // Generate workout exercise IDs (separate from routine exercise IDs)
  const workoutExerciseIdMapping: Record<string, string> = {};
  Object.keys(activeWorkout.exercises).forEach((tempExerciseId) => {
    workoutExerciseIdMapping[tempExerciseId] = generateUUID();
  });

  // Blocks data
  // NOTA: Eliminamos original_block_id - ya no existe en schema
  const blocksData: WorkoutBlockInsert[] = activeWorkout.blocksBySession.map(
    (tempBlockId, index) => {
      const block = activeWorkout.blocks[tempBlockId];

      return {
        id: workoutBlockIdMapping[tempBlockId],
        user_id: userId,
        workout_session_id: sessionId,
        type: block.type,
        order_index: index,
        name: block.name,
        rest_time_seconds: block.rest_time_seconds,
        rest_between_exercises_seconds: block.rest_between_exercises_seconds,
        was_added_during_workout: block.was_added_during_workout,
      };
    }
  );

  // Calculate execution order for exercises
  const exerciseExecutionData = calculateExerciseExecutionOrder(activeWorkout);

  // Exercises data
  // NOTA: Eliminamos original_exercise_in_block_id - ya no existe en schema
  const exercisesData: WorkoutExerciseInsert[] = exerciseExecutionData.map(
    (execData, globalIndex) => {
      const exercise = activeWorkout.exercises[execData.tempId];

      return {
        id: workoutExerciseIdMapping[execData.tempId],
        user_id: userId,
        workout_block_id: workoutBlockIdMapping[execData.blockId],
        exercise_id: exercise.exercise_id,
        order_index: exercise.order_index,
        execution_order: execData.executionTime ? globalIndex : null,
        notes: exercise.notes,
        was_added_during_workout: exercise.was_added_during_workout,
      };
    }
  );

  // Generate workout set IDs
  const workoutSetIdMapping: Record<string, string> = {};
  Object.keys(activeWorkout.sets).forEach((tempSetId) => {
    workoutSetIdMapping[tempSetId] = generateUUID();
  });

  // Sets data (only completed sets)
  // NOTA: Eliminamos original_set_id - ya no existe en schema
  const setsData: WorkoutSetInsert[] = [];
  Object.entries(activeWorkout.setsByExercise).forEach(
    ([tempExerciseId, setIds]) => {
      const exercise = activeWorkout.exercises[tempExerciseId];

      setIds.forEach((tempSetId) => {
        const set = activeWorkout.sets[tempSetId];

        // Only save completed sets
        if (set.completed) {
          setsData.push({
            id: workoutSetIdMapping[tempSetId],
            user_id: userId,
            workout_exercise_id: workoutExerciseIdMapping[tempExerciseId],
            exercise_id: exercise.exercise_id,
            order_index: set.order_index,
            measurement_template: set.measurement_template,
            planned_primary_value: set.planned_primary_value,
            planned_secondary_value: set.planned_secondary_value,
            planned_primary_range: set.planned_primary_range,
            planned_secondary_range: set.planned_secondary_range,
            planned_rpe: set.planned_rpe,
            planned_tempo: set.planned_tempo,
            actual_primary_value: set.actual_primary_value,
            actual_secondary_value: set.actual_secondary_value,
            actual_rpe: set.actual_rpe,
            set_type: set.set_type,
            completed: true,
          });
        }
      });
    }
  );

  return {
    session: sessionData,
    blocks: blocksData,
    exercises: exercisesData,
    sets: setsData,
  };
}

// ============================================
// STEP 4: PREPARE PRS DATA
// ============================================

function preparePRsData(
  activeWorkout: ActiveWorkoutState,
  userId: string,
  sessionId: string,
  _idMappings: IdMappings
): PRsData {
  const sessionPRs = Object.values(activeWorkout.sessionBestPRs || {});

  if (sessionPRs.length === 0) {
    return { current: [], history: [] };
  }

  const current: PRCurrentData[] = sessionPRs.map((pr) => ({
    id: generateUUID(),
    user_id: userId,
    exercise_id: pr.exercise_id,
    best_weight: pr.weight,
    best_reps: pr.reps,
    estimated_1rm: pr.estimated_1rm,
    achieved_at: pr.created_at,
    source: "auto" as const,
  }));

  const history: PRHistoryData[] = sessionPRs.map((pr) => ({
    id: generateUUID(),
    user_id: userId,
    exercise_id: pr.exercise_id,
    weight: pr.weight,
    reps: pr.reps,
    estimated_1rm: pr.estimated_1rm,
    workout_session_id: sessionId,
    workout_set_id: "", // We don't have the workout set ID mapping here
    source: "auto" as const,
  }));

  return { current, history };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

type ExerciseExecutionData = {
  tempId: string;
  executionTime: number | null;
  blockId: string;
  orderIndex: number;
};

function calculateExerciseExecutionOrder(
  activeWorkout: ActiveWorkoutState
): ExerciseExecutionData[] {
  const exerciseExecutionData: ExerciseExecutionData[] = [];

  activeWorkout.blocksBySession.forEach((tempBlockId) => {
    const exerciseIds = activeWorkout.exercisesByBlock[tempBlockId] || [];
    exerciseIds.forEach((tempExerciseId) => {
      const exercise = activeWorkout.exercises[tempExerciseId];
      const executionTime = getExecutionTime(activeWorkout, tempExerciseId);

      exerciseExecutionData.push({
        tempId: tempExerciseId,
        executionTime,
        blockId: tempBlockId,
        orderIndex: exercise.order_index,
      });
    });
  });

  // Sort by execution time
  exerciseExecutionData.sort((a, b) => {
    if (a.executionTime === null && b.executionTime === null) return 0;
    if (a.executionTime === null) return 1;
    if (b.executionTime === null) return -1;
    return a.executionTime - b.executionTime;
  });

  return exerciseExecutionData;
}

function getExecutionTime(
  activeWorkout: ActiveWorkoutState,
  tempExerciseId: string
): number | null {
  const exerciseSets = activeWorkout.setsByExercise[tempExerciseId] || [];
  const completedSets = exerciseSets
    .map((setId) => activeWorkout.sets[setId])
    .filter((set) => set.completed && set.completed_at)
    .sort(
      (a, b) =>
        new Date(a.completed_at!).getTime() -
        new Date(b.completed_at!).getTime()
    );

  return completedSets.length > 0
    ? new Date(completedSets[0].completed_at!).getTime()
    : null;
}
