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
    original_set_id: null,
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
    original_set_id: null,
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
    original_set_id: null,
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
      original_exercise_in_block_id: null,
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
