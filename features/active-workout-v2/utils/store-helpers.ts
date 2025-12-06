import { BaseExercise } from "@/shared/db/schema";
import { MeasurementTemplateId } from "@/shared/types/measurement";
import { ISetType } from "@/shared/types/workout";
import {
  ActiveWorkoutBlock,
  ActiveWorkoutExercise,
  ActiveWorkoutSet,
} from "../hooks/use-active-workout-store";

export const generateTempId = () => `temp_${Date.now()}_${Math.random()}`;

const createDefaultSets = (
  exerciseInBlockId: string,
  exerciseId: string,
  measurementTemplate: MeasurementTemplateId = "weight_reps"
): ActiveWorkoutSet[] => [
  {
    tempId: generateTempId(),
    user_id: "default-user",
    exercise_id: exerciseId,
    id: "",
    order_index: 0,
    measurement_template: measurementTemplate,
    planned_primary_value: null,
    planned_secondary_value: null,
    planned_primary_range: null,
    planned_secondary_range: null,
    set_type: "normal",
    workout_exercise_id: exerciseInBlockId,
    planned_rpe: null,
    actual_primary_value: null,
    actual_secondary_value: null,
    actual_rpe: null,
    completed: false,
    completed_at: null,
    planned_tempo: null,
  },
  {
    tempId: generateTempId(),
    user_id: "default-user",
    exercise_id: exerciseId,
    id: "",
    order_index: 1,
    measurement_template: measurementTemplate,
    planned_primary_value: null,
    planned_secondary_value: null,
    planned_primary_range: null,
    planned_secondary_range: null,
    set_type: "normal",
    workout_exercise_id: exerciseInBlockId,
    planned_rpe: null,
    actual_primary_value: null,
    actual_secondary_value: null,
    actual_rpe: null,
    completed: false,
    completed_at: null,
    planned_tempo: null,
  },
  {
    tempId: generateTempId(),
    user_id: "default-user",
    exercise_id: exerciseId,
    id: "",
    order_index: 2,
    measurement_template: measurementTemplate,
    planned_primary_value: null,
    planned_secondary_value: null,
    planned_primary_range: null,
    planned_secondary_range: null,
    set_type: "normal",
    workout_exercise_id: exerciseInBlockId,
    planned_rpe: null,
    actual_primary_value: null,
    actual_secondary_value: null,
    actual_rpe: null,
    completed: false,
    completed_at: null,
    planned_tempo: null,
  },
];

export const createNewSetForExercise = (
  currentSetsCount: number,
  lastSetPrimaryValue: number | null,
  lastSetSecondaryValue: number | null,
  lastSetPrimaryRange: {
    min: number;
    max: number;
  } | null,
  lastSetSecondaryRange: {
    min: number;
    max: number;
  } | null,
  measurementTemplate: MeasurementTemplateId,
  exerciseInBlockId: string,
  exerciseId: string,
  lastPrevSet?: {
    actual_primary_value: number | null;
    actual_secondary_value: number | null;
    actual_rpe: number | null;
  } | null
) => {
  // Lógica de herencia con prioridades:
  // 1. Valores del último set del ejercicio (actuales)
  // 2. lastPrevSet como fallback (NUEVO)
  // 3. null

  // Para primary value
  let inheritedPrimaryValue = lastSetPrimaryValue;
  if (
    !inheritedPrimaryValue &&
    !lastSetPrimaryRange &&
    lastPrevSet?.actual_primary_value
  ) {
    inheritedPrimaryValue = lastPrevSet.actual_primary_value;
  }

  // Para secondary value
  let inheritedSecondaryValue = lastSetSecondaryValue;
  if (
    !inheritedSecondaryValue &&
    !lastSetSecondaryRange &&
    lastPrevSet?.actual_secondary_value
  ) {
    inheritedSecondaryValue = lastPrevSet.actual_secondary_value;
  }

  // Para RPE
  let inheritedRpe = null;
  if (lastPrevSet?.actual_rpe) {
    inheritedRpe = lastPrevSet.actual_rpe;
  }

  const newSet: ActiveWorkoutSet = {
    tempId: generateTempId(),
    user_id: "default-user",
    exercise_id: exerciseId,
    id: "",
    order_index: currentSetsCount,
    measurement_template: measurementTemplate,
    planned_primary_value: inheritedPrimaryValue || null,
    planned_secondary_value: inheritedSecondaryValue || null,
    planned_primary_range: lastSetPrimaryRange || null,
    planned_secondary_range: lastSetSecondaryRange || null,
    planned_rpe: inheritedRpe,
    set_type: "normal" as ISetType,
    actual_primary_value: null,
    actual_secondary_value: null,
    actual_rpe: null,
    completed: false,
    completed_at: null,
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

/**
 * Para circuitos: determina qué tipo de descanso mostrar basado en si completamos un round
 *
 * @param block - El bloque de workout
 * @param completedSetIndex - Índice del set que acabamos de completar (0-based)
 * @param exercisesInBlock - Array de ejercicios ordenados en el bloque
 * @param sets - Record de todos los sets
 * @param setsByExercise - Mapeo de ejercicios a sets
 * @returns "between-exercises" | "between-rounds" | null
 */
export const getCircuitRestType = (
  block: ActiveWorkoutBlock,
  completedSetIndex: number,
  exercisesInBlock: ActiveWorkoutExercise[],
  sets: Record<string, ActiveWorkoutSet>,
  setsByExercise: Record<string, string[]>
): "between-exercises" | "between-rounds" | null => {
  if (block.type !== "circuit") return null;

  // Verificar si TODOS los ejercicios tienen ese mismo set index completo
  const allHaveCurrentSetCompleted = exercisesInBlock.every((exercise) => {
    const exerciseSets = setsByExercise[exercise.tempId] || [];
    const setAtIndex = exerciseSets[completedSetIndex];
    if (!setAtIndex) return false; // No tiene set en ese índice

    const set = sets[setAtIndex];
    return set?.completed_at; // Está completo
  });

  if (allHaveCurrentSetCompleted) {
    // Completamos el round! Verificar si hay más rounds
    const hasMoreRounds = exercisesInBlock.some((exercise) => {
      const exerciseSets = setsByExercise[exercise.tempId] || [];
      return exerciseSets.length > completedSetIndex + 1; // Hay más sets después
    });

    return hasMoreRounds ? "between-rounds" : null; // No mostrar timer si fue el último round
  } else {
    // Aún no completamos el round, es descanso entre ejercicios
    return "between-exercises";
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
  currentBlockCount: number,
  defaultRestTime: number = 60
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
      rest_time_seconds: defaultRestTime,
      rest_between_exercises_seconds: 0,
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
      was_added_during_workout: true,
    };

    const defaultSets = createDefaultSets(
      exerciseInBlockId,
      exercise.id,
      exercise.default_measurement_template
    );

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
  currentBlockCount: number,
  defaultRestTime: number = 60
): CreateMultiBlockResponse => {
  const blockId = generateTempId();

  const newBlock: ActiveWorkoutBlock = {
    tempId: blockId,
    user_id: "default-user",
    workout_session_id: "",
    id: "",
    type: "superset",
    order_index: currentBlockCount,
    rest_time_seconds: defaultRestTime,
    rest_between_exercises_seconds: 0,
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
      was_added_during_workout: true,
    };

    const defaultSets = createDefaultSets(
      exerciseInBlockId,
      exercise.id,
      exercise.default_measurement_template
    );

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
      was_added_during_workout: true,
    };

    const defaultSets = createDefaultSets(
      exerciseInBlockId,
      exercise.id,
      exercise.default_measurement_template
    );

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

/**
 * Algoritmo para determinar el próximo set a completar en superseries/circuitos
 *
 * Lógica:
 * 1. Para circuitos: completar todos los ejercicios en orden antes de avanzar al siguiente round
 * 2. Para superseries: completar todos los ejercicios del mismo set index antes de avanzar
 * 3. Manejo de edge case: si faltan sets en algunos ejercicios, crear sets automáticamente
 *
 * @param block - El bloque de workout (superset o circuit)
 * @param exercisesInBlock - Array de ejercicios en el bloque
 * @param sets - Record de todos los sets por ID
 * @param setsByExercise - Record que mapea exerciseId a array de setIds
 * @returns Información del próximo set a completar o null si el bloque está completo
 */
export const getNextSetToComplete = (
  block: ActiveWorkoutBlock,
  exercisesInBlock: ActiveWorkoutExercise[],
  sets: Record<string, ActiveWorkoutSet>,
  setsByExercise: Record<string, string[]>
): {
  exerciseInBlock: ActiveWorkoutExercise;
  setIndex: number;
  setId: string | null; // null indica que el set necesita ser creado
  totalRoundsCompleted: number;
  isBlockComplete: boolean;
} | null => {
  if (block.type === "individual") {
    return null; // Individual blocks no necesitan indicador
  }

  // Ordenar ejercicios por order_index para asegurar orden correcto
  const sortedExercises = [...exercisesInBlock].sort(
    (a, b) => a.order_index - b.order_index
  );

  // Calcular el máximo número de sets entre todos los ejercicios
  const maxSets = Math.max(
    ...sortedExercises.map((ex) => setsByExercise[ex.tempId]?.length || 0)
  );

  if (maxSets === 0) {
    // No hay sets en ningún ejercicio - retornar el primero para crear
    return {
      exerciseInBlock: sortedExercises[0],
      setIndex: 0,
      setId: null,
      totalRoundsCompleted: 0,
      isBlockComplete: false,
    };
  }

  let totalRoundsCompleted = 0;

  // Diferentes estrategias según el tipo de bloque
  if (block.type === "circuit") {
    // CIRCUITOS: Completar ejercicios en secuencia por cada round
    for (let setIndex = 0; setIndex < maxSets; setIndex++) {
      for (const exercise of sortedExercises) {
        const exerciseSets = setsByExercise[exercise.tempId] || [];
        const setId = exerciseSets[setIndex];

        if (!setId) {
          // Set faltante - necesita ser creado
          return {
            exerciseInBlock: exercise,
            setIndex,
            setId: null,
            totalRoundsCompleted,
            isBlockComplete: false,
          };
        }

        const set = sets[setId];
        if (!set?.completed_at) {
          // Set existe pero no está completo - este es el próximo
          return {
            exerciseInBlock: exercise,
            setIndex,
            setId: setId,
            totalRoundsCompleted,
            isBlockComplete: false,
          };
        }
      }

      // Si llegamos aquí, el round está completo
      totalRoundsCompleted++;
    }
  } else if (block.type === "superset") {
    // SUPERSERIES: Completar TODOS los ejercicios del mismo set index antes de avanzar
    for (let setIndex = 0; setIndex < maxSets; setIndex++) {
      let incompleteInThisRound: {
        exercise: ActiveWorkoutExercise;
        setId: string | null;
      }[] = [];

      // Revisar todos los ejercicios de este round
      for (const exercise of sortedExercises) {
        const exerciseSets = setsByExercise[exercise.tempId] || [];
        const setId = exerciseSets[setIndex];

        if (!setId) {
          // Set faltante
          incompleteInThisRound.push({ exercise, setId: null });
        } else {
          const set = sets[setId];
          if (!set?.completed_at) {
            // Set existe pero no está completo
            incompleteInThisRound.push({ exercise, setId });
          }
        }
      }

      // Si hay sets incompletos en este round, retornar el primero
      if (incompleteInThisRound.length > 0) {
        const first = incompleteInThisRound[0];
        return {
          exerciseInBlock: first.exercise,
          setIndex,
          setId: first.setId,
          totalRoundsCompleted,
          isBlockComplete: false,
        };
      }

      // Si llegamos aquí, este round está completo
      totalRoundsCompleted++;
    }
  }

  // Si llegamos aquí, todos los sets están completos
  return {
    exerciseInBlock: sortedExercises[0], // No importa cuál, el bloque está completo
    setIndex: maxSets - 1,
    setId: null,
    totalRoundsCompleted,
    isBlockComplete: true,
  };
};

/**
 * Checks if a circuit block has balanced sets (same number of sets per exercise)
 * This is required for Circuit Timer Mode to work properly
 *
 * @param exercisesInBlock - Exercises in the block
 * @param setsByExercise - Mapping of exercise to set IDs
 * @returns true if all exercises have the same number of sets
 */
export const hasBalancedCircuitSets = (
  exercisesInBlock: { tempId: string }[],
  setsByExercise: Record<string, string[]>
): boolean => {
  if (exercisesInBlock.length === 0) return true;

  const setCounts = exercisesInBlock.map(
    (ex) => (setsByExercise[ex.tempId] || []).length
  );

  // All exercises must have the same number of sets
  return setCounts.every((count) => count === setCounts[0]);
};

/**
 * Determines if a circuit block can use the Circuit Timer Mode
 * Requirements:
 * 1. Block type must be "circuit"
 * 2. ALL sets in the block must have measurement_template === "time_only"
 *
 * @param block - The workout block to check
 * @param exercisesInBlock - Exercises in the block
 * @param sets - All sets by ID
 * @param setsByExercise - Mapping of exercise to set IDs
 * @returns true if the block is eligible for timer mode
 */
export const canUseCircuitTimerMode = (
  block: ActiveWorkoutBlock,
  exercisesInBlock: ActiveWorkoutExercise[],
  sets: Record<string, ActiveWorkoutSet>,
  setsByExercise: Record<string, string[]>
): boolean => {
  // Must be a circuit
  if (block.type !== "circuit") return false;

  // Must have exercises
  if (exercisesInBlock.length === 0) return false;

  // Check all sets in all exercises
  for (const exercise of exercisesInBlock) {
    const exerciseSetIds = setsByExercise[exercise.tempId] || [];

    // Must have at least one set
    if (exerciseSetIds.length === 0) return false;

    for (const setId of exerciseSetIds) {
      const set = sets[setId];
      if (!set) return false;

      // Every set must be time_only
      if (set.measurement_template !== "time_only") {
        return false;
      }
    }
  }

  return true;
};

/**
 * Gets the circuit timer state for a block
 * Returns all information needed to run the circuit timer
 *
 * @param block - The circuit block
 * @param exercisesInBlock - Exercises in the block (sorted by order_index)
 * @param sets - All sets by ID
 * @param setsByExercise - Mapping of exercise to set IDs
 * @returns Circuit timer state or null if not a valid circuit
 */
export const getCircuitTimerState = (
  block: ActiveWorkoutBlock,
  exercisesInBlock: ActiveWorkoutExercise[],
  sets: Record<string, ActiveWorkoutSet>,
  setsByExercise: Record<string, string[]>
): {
  blockId: string;
  totalRounds: number;
  totalExercises: number;
  restBetweenExercises: number;
  restBetweenRounds: number;
  exercises: {
    exerciseInBlockId: string;
    exerciseId: string;
    name: string;
    setIds: string[];
    targetDurations: number[];
  }[];
  completedSetIds: string[];
} | null => {
  if (block.type !== "circuit") return null;

  const sortedExercises = [...exercisesInBlock].sort(
    (a, b) => a.order_index - b.order_index
  );

  // Calculate total rounds (max sets among all exercises)
  const maxSets = Math.max(
    ...sortedExercises.map((ex) => setsByExercise[ex.tempId]?.length || 0)
  );

  const exercises = sortedExercises.map((exercise) => {
    const setIds = setsByExercise[exercise.tempId] || [];
    const targetDurations = setIds.map((setId) => {
      const set = sets[setId];
      // For time_only, planned_primary_value is the duration in seconds
      return set?.planned_primary_value || 30; // Default 30 seconds
    });

    return {
      exerciseInBlockId: exercise.tempId,
      exerciseId: exercise.exercise_id,
      name: exercise.exercise.name,
      setIds,
      targetDurations,
    };
  });

  // Get all completed set IDs
  const completedSetIds: string[] = [];
  for (const exercise of sortedExercises) {
    const exerciseSetIds = setsByExercise[exercise.tempId] || [];
    for (const setId of exerciseSetIds) {
      const set = sets[setId];
      if (set?.completed_at) {
        completedSetIds.push(setId);
      }
    }
  }

  return {
    blockId: block.tempId,
    totalRounds: maxSets,
    totalExercises: sortedExercises.length,
    restBetweenExercises: block.rest_between_exercises_seconds || 10,
    restBetweenRounds: block.rest_time_seconds || 60,
    exercises,
    completedSetIds,
  };
};

/**
 * Gets the next incomplete exercise/set in a circuit for the timer
 *
 * @param timerState - The circuit timer state
 * @param sets - All sets by ID
 * @returns Next item to execute or null if complete
 */
export const getNextCircuitTimerItem = (
  timerState: ReturnType<typeof getCircuitTimerState>,
  sets: Record<string, ActiveWorkoutSet>
): {
  exerciseIndex: number;
  roundIndex: number;
  setId: string;
  exerciseName: string;
  targetDuration: number;
  isLastInRound: boolean;
  isLastRound: boolean;
} | null => {
  if (!timerState) return null;

  const { exercises, totalRounds } = timerState;

  // Iterate through rounds and exercises in order
  for (let roundIndex = 0; roundIndex < totalRounds; roundIndex++) {
    for (
      let exerciseIndex = 0;
      exerciseIndex < exercises.length;
      exerciseIndex++
    ) {
      const exercise = exercises[exerciseIndex];
      const setId = exercise.setIds[roundIndex];

      if (!setId) continue;

      const set = sets[setId];
      if (!set?.completed_at) {
        // Found the next incomplete set
        return {
          exerciseIndex,
          roundIndex,
          setId,
          exerciseName: exercise.name,
          targetDuration: exercise.targetDurations[roundIndex] || 30,
          isLastInRound: exerciseIndex === exercises.length - 1,
          isLastRound: roundIndex === totalRounds - 1,
        };
      }
    }
  }

  // All sets completed
  return null;
};
