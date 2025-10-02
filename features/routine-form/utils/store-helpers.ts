import {
  BaseExercise,
  BlockInsert,
  ExerciseInBlockInsert,
  SetInsert,
} from "@/shared/db/schema";
import { IRepsType, ISetType } from "@/shared/types/workout";

const generateTempId = () => `temp_${Date.now()}_${Math.random()}`;

const createDefaultSets = (
  exerciseInBlockId: string
): (SetInsert & { tempId: string })[] => [
  {
    tempId: generateTempId(),
    user_id: "default-user",
    id: "",
    order_index: 0,
    weight: null,
    reps: null,
    set_type: "normal",
    reps_type: "reps",
    exercise_in_block_id: exerciseInBlockId,
    reps_range: null,
    rpe: null,
    tempo: null,
  },
  {
    tempId: generateTempId(),
    user_id: "default-user",
    id: "",
    order_index: 1,
    weight: null,
    reps: null,
    set_type: "normal",
    reps_type: "reps",
    exercise_in_block_id: exerciseInBlockId,
    reps_range: null,
    rpe: null,
    tempo: null,
  },
  {
    tempId: generateTempId(),
    user_id: "default-user",
    id: "",
    order_index: 2,
    weight: null,
    reps: null,
    set_type: "normal",
    reps_type: "reps",
    exercise_in_block_id: exerciseInBlockId,
    reps_range: null,
    rpe: null,
    tempo: null,
  },
];

type CreateIndividualBlocksParams = {
  newBlocks: (BlockInsert & { tempId: string })[];
  newExercisesInBlock: (ExerciseInBlockInsert & {
    tempId: string;
    exercise: BaseExercise;
  })[];
  newSets: (SetInsert & { tempId: string })[];

  exercisesByBlock: Record<string, string[]>;
  setsByExercise: Record<string, string[]>;
};

export const createIndividualBlocks = (
  exercises: BaseExercise[],
  totalBlocks: number
): CreateIndividualBlocksParams => {
  const newBlocks: (BlockInsert & {
    tempId: string;
  })[] = [];
  const newExercisesInBlock: (ExerciseInBlockInsert & {
    tempId: string;
    exercise: BaseExercise;
  })[] = [];
  const newSets: (SetInsert & { tempId: string })[] = [];

  const exercisesByBlock: Record<string, string[]> = {};
  const setsByExercise: Record<string, string[]> = {};

  exercises.forEach((exercise, index) => {
    const blockTempId = generateTempId();
    const exerciseInBlockTempId = generateTempId();

    // Crear bloque individual
    const newBlock = {
      tempId: blockTempId,
      user_id: "default-user",
      type: "individual" as const,
      name: exercise.name,
      order_index: totalBlocks + index,
      rest_between_exercises_seconds: 0,
      rest_time_seconds: 60,
      routine_id: "",
      id: "",
    };

    // Crear exerciseInBlock
    const newExerciseInBlock = {
      tempId: exerciseInBlockTempId,
      user_id: "default-user",
      exercise_id: exercise.id,
      block_id: "", // Se asigna al guardar
      blockTempId: blockTempId, // Para relacionar temporalmente
      order_index: 0, // Único ejercicio en el bloque
      notes: null, // Campo requerido por el schema
      id: "",
      exercise,
    };

    const defaultSets = createDefaultSets(exerciseInBlockTempId);

    newBlocks.push(newBlock);
    newExercisesInBlock.push(newExerciseInBlock);
    newSets.push(...defaultSets);

    // Configurar índices
    exercisesByBlock[blockTempId] = [exerciseInBlockTempId];
    setsByExercise[exerciseInBlockTempId] = defaultSets.map((s) => s.tempId);
  });

  return {
    newBlocks,
    newExercisesInBlock,
    newSets,
    exercisesByBlock,
    setsByExercise,
  };
};

type CreateMultiBlockParams = {
  newBlock: BlockInsert & { tempId: string };
  newExercisesInBlock: (ExerciseInBlockInsert & {
    tempId: string;
    exercise: BaseExercise;
  })[];
  newSets: (SetInsert & { tempId: string })[];

  exercisesByBlock: Record<string, string[]>;
  setsByExercise: Record<string, string[]>;
};

export const createMultiBlock = (
  exercises: BaseExercise[],
  totalBlocks: number
): CreateMultiBlockParams => {
  const blockTempId = generateTempId();
  const newExercisesInBlock: (ExerciseInBlockInsert & {
    tempId: string;
    exercise: BaseExercise;
  })[] = [];
  const newSets: (SetInsert & { tempId: string })[] = [];

  const exerciseInBlockTempIds: string[] = [];
  const setsByExercise: Record<string, string[]> = {};

  // Crear el bloque multi (superset)
  const newBlock = {
    tempId: blockTempId,
    user_id: "default-user",
    type: "superset" as const,
    name: "Superserie",
    order_index: totalBlocks,
    rest_between_exercises_seconds: 0, // No rest = superset
    rest_time_seconds: 90,
    routine_id: "",
    id: "",
  };

  // Crear exercisesInBlock para cada ejercicio seleccionado
  exercises.forEach((exercise, index) => {
    const exerciseInBlockTempId = generateTempId();
    exerciseInBlockTempIds.push(exerciseInBlockTempId);

    const newExerciseInBlock = {
      tempId: exerciseInBlockTempId,
      user_id: "default-user",
      exercise_id: exercise.id,
      block_id: "", // Se asigna al guardar
      blockTempId: blockTempId, // Para relacionar temporalmente
      order_index: index, // Orden dentro del bloque
      notes: null,
      id: "",
      exercise,
    };

    newExercisesInBlock.push(newExerciseInBlock);

    const defaultSets = createDefaultSets(exerciseInBlockTempId);
    newSets.push(...defaultSets);

    // Inicializar sets vacíos para cada ejercicio
    setsByExercise[exerciseInBlockTempId] = defaultSets.map((s) => s.tempId);
  });

  // Configurar índices
  const exercisesByBlock: Record<string, string[]> = {
    [blockTempId]: exerciseInBlockTempIds,
  };

  return {
    newBlock,
    newExercisesInBlock,
    newSets,
    exercisesByBlock,
    setsByExercise,
  };
};

export const createNewSetForExercise = (
  currentSetsCount: number,
  lastSetWeight: number | null,
  lastSetReps: number | null,
  lastSetRepsRange: {
    min: number | null;
    max: number | null;
  } | null,
  repsType: IRepsType
) => {
  const newSet: SetInsert & { tempId: string } = {
    tempId: generateTempId(),
    user_id: "default-user",
    exercise_in_block_id: "",
    id: "",
    order_index: currentSetsCount,
    reps: lastSetReps || null,
    weight: lastSetWeight || null,
    reps_range: lastSetRepsRange || null,
    reps_type: repsType,
    set_type: "normal" as ISetType,
    rpe: null,
    tempo: null,
  };

  return newSet;
};

export const convertBlockToIndividualBlocks = (
  originalBlock: BlockInsert & { tempId: string },
  exercisesInBlock: (ExerciseInBlockInsert & {
    tempId: string;
    exercise: BaseExercise;
  })[],
  sets: Record<string, SetInsert & { tempId: string }>,
  setsByExercise: Record<string, string[]>
) => {
  const newBlocks: (BlockInsert & { tempId: string })[] = [];
  const newExercisesInBlock: (ExerciseInBlockInsert & {
    tempId: string;
    exercise: BaseExercise;
  })[] = [];
  const newSets: (SetInsert & { tempId: string })[] = [];
  const newExercisesByBlock: Record<string, string[]> = {};
  const newSetsByExercise: Record<string, string[]> = {};

  exercisesInBlock.forEach((exerciseInBlock, index) => {
    const newBlockTempId = generateTempId();
    const newExerciseInBlockTempId = generateTempId();

    // Crear nuevo bloque individual
    const newBlock: BlockInsert & { tempId: string } = {
      tempId: newBlockTempId,
      user_id: "default-user",
      type: "individual",
      name: exerciseInBlock.exercise.name,
      order_index: originalBlock.order_index + index,
      rest_between_exercises_seconds: 0,
      rest_time_seconds: originalBlock.rest_time_seconds,
      routine_id: originalBlock.routine_id,
      id: "",
    };

    // Crear nuevo exerciseInBlock
    const newExerciseInBlock: ExerciseInBlockInsert & {
      tempId: string;
      exercise: BaseExercise;
    } = {
      tempId: newExerciseInBlockTempId,
      user_id: "default-user",
      exercise_id: exerciseInBlock.exercise_id,
      block_id: newBlockTempId,
      order_index: 0, // Único ejercicio en el bloque
      notes: exerciseInBlock.notes,
      id: "",
      exercise: exerciseInBlock.exercise,
    };

    // Copiar sets del ejercicio original
    const originalSetIds = setsByExercise[exerciseInBlock.tempId] || [];
    const copiedSets: (SetInsert & { tempId: string })[] = [];
    const copiedSetIds: string[] = [];

    originalSetIds.forEach((setId) => {
      const originalSet = sets[setId];
      if (originalSet) {
        const newSetTempId = generateTempId();
        const copiedSet: SetInsert & { tempId: string } = {
          ...originalSet,
          tempId: newSetTempId,
          exercise_in_block_id: newExerciseInBlockTempId,
          id: "",
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

type CreateExercisesReturn = {
  newExercisesInBlock: (ExerciseInBlockInsert & {
    tempId: string;
    exercise: BaseExercise;
  })[];
  newSets: (SetInsert & { tempId: string })[];

  setsByExercise: Record<string, string[]>;
};

export const createExercises = (
  exercises: BaseExercise[],
  blockId: string,
  startOrderIndex: number = 0
): CreateExercisesReturn => {
  const newExercisesInBlock: (ExerciseInBlockInsert & {
    tempId: string;
    exercise: BaseExercise;
  })[] = [];
  const newSets: (SetInsert & { tempId: string })[] = [];

  const setsByExercise: Record<string, string[]> = {};

  exercises.forEach((exercise, index) => {
    const exerciseInBlockTempId = generateTempId();

    const newExerciseInBlock: ExerciseInBlockInsert & {
      tempId: string;
      exercise: BaseExercise;
    } = {
      tempId: exerciseInBlockTempId,
      user_id: "default-user",
      exercise,
      block_id: blockId,
      order_index: startOrderIndex + index,
      notes: null,
      id: "",
      exercise_id: exercise.id,
    };

    newExercisesInBlock.push(newExerciseInBlock);

    // Crear sets por defecto para cada ejercicio
    const defaultSets = createDefaultSets(exerciseInBlockTempId);
    newSets.push(...defaultSets);
    setsByExercise[exerciseInBlockTempId] = defaultSets.map((s) => s.tempId);
  });

  return {
    newExercisesInBlock,
    newSets,
    setsByExercise,
  };
};
