import { BaseExercise } from "@/shared/db/schema";
import { IRepsType, ISetType } from "@/shared/types/workout";
import {
  ActiveWorkoutBlock,
  ActiveWorkoutExercise,
  ActiveWorkoutSet,
} from "../hooks/use-active-workout-store";

export const generateTempId = () => `temp_${Date.now()}_${Math.random()}`;

const createDefaultSets = (
  exerciseInBlockId: string,
  exerciseId: string
): ActiveWorkoutSet[] => [
  {
    tempId: generateTempId(),
    user_id: "default-user",
    exercise_id: exerciseId,
    id: "",
    order_index: 0,
    planned_weight: null,
    planned_reps: null,
    set_type: "normal",
    reps_type: "reps",
    workout_exercise_id: exerciseInBlockId,
    reps_range: null,
    planned_rpe: null,
    actual_reps: null,
    actual_weight: null,
    actual_rpe: null,
    completed: false,
    completed_at: null,
    original_set_id: null,
    planned_tempo: null,
  },
  {
    tempId: generateTempId(),
    user_id: "default-user",
    exercise_id: exerciseId,
    id: "",
    order_index: 1,
    planned_weight: null,
    planned_reps: null,
    set_type: "normal",
    reps_type: "reps",
    workout_exercise_id: exerciseInBlockId,
    reps_range: null,
    planned_rpe: null,
    actual_reps: null,
    actual_weight: null,
    actual_rpe: null,
    completed: false,
    completed_at: null,
    original_set_id: null,
    planned_tempo: null,
  },
  {
    tempId: generateTempId(),
    user_id: "default-user",
    exercise_id: exerciseId,
    id: "",
    order_index: 2,
    planned_weight: null,
    planned_reps: null,
    set_type: "normal",
    reps_type: "reps",
    workout_exercise_id: exerciseInBlockId,
    reps_range: null,
    planned_rpe: null,
    actual_reps: null,
    actual_weight: null,
    actual_rpe: null,
    completed: false,
    completed_at: null,
    original_set_id: null,
    planned_tempo: null,
  },
];

export const createNewSetForExercise = (
  currentSetsCount: number,
  lastSetWeight: number | null,
  lastSetReps: number | null,
  lastSetRepsRange: {
    min: number | null;
    max: number | null;
  } | null,
  repsType: IRepsType,
  exerciseInBlockId: string,
  exerciseId: string
) => {
  const newSet: ActiveWorkoutSet = {
    tempId: generateTempId(),
    user_id: "default-user",
    exercise_id: exerciseId,
    id: "",
    order_index: currentSetsCount,
    planned_reps: lastSetReps || null,
    planned_weight: lastSetWeight || null,
    planned_rpe: null,
    reps_range: lastSetRepsRange || null,
    reps_type: repsType,
    set_type: "normal" as ISetType,
    actual_reps: null,
    actual_weight: null,
    actual_rpe: null,
    completed: false,
    completed_at: null,
    original_set_id: null,
    workout_exercise_id: exerciseInBlockId,
    planned_tempo: null,
  };

  return newSet;
};

export const shouldShowRestTimer = (
  block: ActiveWorkoutBlock,
  nextSet: ActiveWorkoutSet | null,
  isLastExercise: boolean
) => {
  if (block.type === "individual") {
    // Don't show rest timer for drop sets or rest-pause sets (should be done immediately)
    if (
      nextSet &&
      (nextSet.set_type === "drop" || nextSet.set_type === "rest-pause")
    ) {
      return false;
    }

    return block.rest_time_seconds > 0;
  } else if (block.type === "superset") {
    if (!isLastExercise) return false;

    return block.rest_time_seconds > 0;
  } else {
    // Don't show for the last set of the last exercise in a block
    if (isLastExercise && !nextSet) return false;

    // Show rest timer for the last set of the last exercise in a block
    if (isLastExercise) return block.rest_time_seconds > 0;

    return block.rest_between_exercises_seconds > 0;
  }
};

type CreateIndividualBlocksResponse = {
  newBlocks: ActiveWorkoutBlock[];
  newExercisesInBlock: ActiveWorkoutExercise[];
  newSets: ActiveWorkoutSet[];

  exercisesByBlock: Record<string, string[]>;
  setsByExercise: Record<string, string[]>;
};

export const createIndividualBlocks = (
  selectedExercises: BaseExercise[],
  currentBlockCount: number
): CreateIndividualBlocksResponse => {
  const newBlocks: ActiveWorkoutBlock[] = [];
  const newExercisesInBlock: ActiveWorkoutExercise[] = [];
  const newSets: ActiveWorkoutSet[] = [];

  const exercisesByBlock: Record<string, string[]> = {};
  const setsByExercise: Record<string, string[]> = {};

  selectedExercises.forEach((exercise, index) => {
    const blockId = generateTempId();
    const exerciseInBlockId = generateTempId();

    const newBlock: ActiveWorkoutBlock = {
      tempId: blockId,
      user_id: "default-user",
      workout_session_id: "",
      id: "",
      type: "individual",
      order_index: currentBlockCount + index,
      rest_time_seconds: 60,
      rest_between_exercises_seconds: 0,
      original_block_id: null,
      name: "",
      was_added_during_workout: true,
    };

    const newExerciseInBlock: ActiveWorkoutExercise = {
      workout_block_id: blockId,
      user_id: "default-user",
      tempId: exerciseInBlockId,
      exercise,
      execution_order: null,
      id: "",
      exercise_id: exercise.id,
      notes: "",
      order_index: 0,
      original_exercise_in_block_id: null,
      was_added_during_workout: true,
    };

    const defaultSets = createDefaultSets(exerciseInBlockId, exercise.id);

    newBlocks.push(newBlock);
    newExercisesInBlock.push(newExerciseInBlock);
    newSets.push(...defaultSets);

    exercisesByBlock[blockId] = [exerciseInBlockId];
    setsByExercise[exerciseInBlockId] = defaultSets.map((set) => set.tempId);
  });

  return {
    newBlocks,
    newExercisesInBlock,
    newSets,
    exercisesByBlock,
    setsByExercise,
  };
};

type CreateMultiBlockResponse = {
  newBlock: ActiveWorkoutBlock;
  newExercisesInBlock: ActiveWorkoutExercise[];
  newSets: ActiveWorkoutSet[];

  exercisesByBlock: Record<string, string[]>;
  setsByExercise: Record<string, string[]>;
};

export const createMultiBlock = (
  selectedExercises: BaseExercise[],
  currentBlockCount: number
): CreateMultiBlockResponse => {
  const blockId = generateTempId();

  const newBlock: ActiveWorkoutBlock = {
    tempId: blockId,
    user_id: "default-user",
    workout_session_id: "",
    id: "",
    type: "superset",
    order_index: currentBlockCount,
    rest_time_seconds: 60,
    rest_between_exercises_seconds: 0,
    original_block_id: null,
    name: "",
    was_added_during_workout: true,
  };

  const newExercisesInBlock: ActiveWorkoutExercise[] = [];
  const newSets: ActiveWorkoutSet[] = [];

  // ✅ CORREGIDO: Crear array acumulador para los ejercicios
  const exerciseInBlockTempIds: string[] = [];
  const setsByExercise: Record<string, string[]> = {};

  selectedExercises.forEach((exercise, index) => {
    const exerciseInBlockId = generateTempId();
    // ✅ CORREGIDO: Agregar al array acumulador
    exerciseInBlockTempIds.push(exerciseInBlockId);

    const newExerciseInBlock: ActiveWorkoutExercise = {
      workout_block_id: blockId,
      user_id: "default-user",
      tempId: exerciseInBlockId,
      exercise,
      execution_order: null,
      id: "",
      exercise_id: exercise.id,
      notes: "",
      order_index: index,
      original_exercise_in_block_id: null,
      was_added_during_workout: true,
    };

    const defaultSets = createDefaultSets(exerciseInBlockId, exercise.id);

    newExercisesInBlock.push(newExerciseInBlock);
    newSets.push(...defaultSets);

    setsByExercise[exerciseInBlockId] = defaultSets.map((set) => set.tempId);
  });

  // ✅ CORREGIDO: Asignar el array completo con TODOS los ejercicios
  const exercisesByBlock: Record<string, string[]> = {
    [blockId]: exerciseInBlockTempIds,
  };

  return {
    newBlock,
    newExercisesInBlock,
    newSets,
    exercisesByBlock,
    setsByExercise,
  };
};

type CreateExercisesReturn = {
  newExercisesInBlock: ActiveWorkoutExercise[];
  newSets: ActiveWorkoutSet[];

  setsByExercise: Record<string, string[]>;
};

export const createExercises = (
  exercises: BaseExercise[],
  blockId: string,
  startOrderIndex: number = 0
): CreateExercisesReturn => {
  const newExercisesInBlock: ActiveWorkoutExercise[] = [];
  const newSets: ActiveWorkoutSet[] = [];
  const setsByExercise: Record<string, string[]> = {};

  exercises.forEach((exercise, index) => {
    const exerciseInBlockId = generateTempId();

    const newExerciseInBlock: ActiveWorkoutExercise = {
      workout_block_id: blockId,
      user_id: "default-user",
      tempId: exerciseInBlockId,
      exercise,
      execution_order: null,
      id: "",
      exercise_id: exercise.id,
      notes: "",
      order_index: startOrderIndex + index,
      original_exercise_in_block_id: null,
      was_added_during_workout: true,
    };

    const defaultSets = createDefaultSets(exerciseInBlockId, exercise.id);

    newExercisesInBlock.push(newExerciseInBlock);
    newSets.push(...defaultSets);
    setsByExercise[exerciseInBlockId] = defaultSets.map((set) => set.tempId);
  });

  return {
    newExercisesInBlock,
    newSets,
    setsByExercise,
  };
};

export const convertBlockToIndividualBlocks = (
  originalBlock: ActiveWorkoutBlock,
  exercisesInBlock: ActiveWorkoutExercise[],
  sets: Record<string, ActiveWorkoutSet>,
  setsByExercise: Record<string, string[]>
) => {
  const newBlocks: ActiveWorkoutBlock[] = [];
  const newExercisesInBlock: ActiveWorkoutExercise[] = [];
  const newSets: ActiveWorkoutSet[] = [];
  const newExercisesByBlock: Record<string, string[]> = {};
  const newSetsByExercise: Record<string, string[]> = {};

  exercisesInBlock.forEach((exerciseInBlock, index) => {
    const newBlockTempId = generateTempId();
    const newExerciseInBlockTempId = generateTempId();

    // Crear nuevo bloque individual
    const newBlock: ActiveWorkoutBlock = {
      tempId: newBlockTempId,
      user_id: "default-user",
      id: "",
      workout_session_id: originalBlock.workout_session_id,
      type: "individual",
      name: exerciseInBlock.exercise.name,
      order_index: originalBlock.order_index + index,
      rest_between_exercises_seconds: 0,
      rest_time_seconds: originalBlock.rest_time_seconds,
      original_block_id: null, // Nuevo bloque, no es original
      was_added_during_workout: true,
    };

    // Crear nuevo exerciseInBlock
    const newExerciseInBlock: ActiveWorkoutExercise = {
      tempId: newExerciseInBlockTempId,
      user_id: "default-user",
      id: "",
      workout_block_id: newBlockTempId,
      exercise_id: exerciseInBlock.exercise_id,
      exercise: exerciseInBlock.exercise,
      order_index: 0, // Único ejercicio en el bloque
      execution_order: exerciseInBlock.execution_order, // Mantener si ya se ejecutó
      notes: exerciseInBlock.notes,
      original_exercise_in_block_id: null, // Nuevo ejercicio, no es original
      was_added_during_workout: true,
    };

    // Copiar sets del ejercicio original
    const originalSetIds = setsByExercise[exerciseInBlock.tempId] || [];
    const copiedSets: ActiveWorkoutSet[] = [];
    const copiedSetIds: string[] = [];

    originalSetIds.forEach((setId) => {
      const originalSet = sets[setId];
      if (originalSet) {
        const newSetTempId = generateTempId();
        const copiedSet: ActiveWorkoutSet = {
          ...originalSet,
          tempId: newSetTempId,
          id: "",
          workout_exercise_id: newExerciseInBlockTempId,
          original_set_id: null, // Nuevo set, no es original
        };

        copiedSets.push(copiedSet);
        copiedSetIds.push(newSetTempId);
      }
    });

    newBlocks.push(newBlock);
    newExercisesInBlock.push(newExerciseInBlock);
    newSets.push(...copiedSets);
    newExercisesByBlock[newBlockTempId] = [newExerciseInBlockTempId];
    newSetsByExercise[newExerciseInBlockTempId] = copiedSetIds;
  });

  return {
    newBlocks,
    newExercisesInBlock,
    newSets,
    newExercisesByBlock,
    newSetsByExercise,
  };
};
