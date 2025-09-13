import { useMemo } from "react";
import { useRoutineFormState } from "./use-routine-form-store";

export interface RoutineValidation {
  isValid: boolean;
  errors: {
    routineName?: string;
    blocks?: string;
    exercises?: string;
    sets?: string;
  };
  details: {
    hasValidName: boolean;
    hasBlocks: boolean;
    hasExercises: boolean;
    hasSets: boolean;
    blocksWithoutExercises: string[];
    exercisesWithoutSets: string[];
  };
}

export const useRoutineValidation = (): RoutineValidation => {
  const {
    routine,
    blocksByRoutine,
    exercisesByBlock,
    setsByExercise,
    blocks,
    exercisesInBlock,
  } = useRoutineFormState();

  return useMemo(() => {
    const errors: RoutineValidation["errors"] = {};

    // 1. Validar nombre de rutina
    const routineName = routine.name?.trim();
    const hasValidName = !!(
      routineName &&
      routineName.length >= 2 &&
      routineName.length <= 100
    );

    if (!hasValidName) {
      if (!routineName) {
        errors.routineName = "El nombre de la rutina es requerido";
      } else if (routineName.length < 2) {
        errors.routineName = "El nombre debe tener al menos 2 caracteres";
      } else if (routineName.length > 100) {
        errors.routineName = "El nombre no puede exceder 100 caracteres";
      }
    }

    // 2. Validar que hay al menos un bloque
    const hasBlocks = blocksByRoutine.length > 0;
    if (!hasBlocks) {
      errors.blocks = "La rutina debe tener al menos un bloque";
    }

    // 3. Validar que cada bloque tiene al menos un ejercicio
    const blocksWithoutExercises: string[] = [];
    blocksByRoutine.forEach((blockId) => {
      const exerciseIds = exercisesByBlock[blockId] || [];
      if (exerciseIds.length === 0) {
        const block = blocks[blockId];
        blocksWithoutExercises.push(block?.name || "Bloque sin nombre");
      }
    });

    const hasExercises = blocksWithoutExercises.length === 0;
    if (!hasExercises) {
      errors.exercises = `Los siguientes bloques no tienen ejercicios: ${blocksWithoutExercises.join(
        ", "
      )}`;
    }

    // 4. Validar que cada ejercicio tiene al menos un set
    const exercisesWithoutSets: string[] = [];
    Object.entries(exercisesByBlock).forEach(([blockId, exerciseIds]) => {
      exerciseIds.forEach((exerciseId) => {
        const setIds = setsByExercise[exerciseId] || [];
        if (setIds.length === 0) {
          const exercise = exercisesInBlock[exerciseId];
          exercisesWithoutSets.push(
            exercise?.exercise?.name || "Ejercicio sin nombre"
          );
        }
      });
    });

    const hasSets = exercisesWithoutSets.length === 0;
    if (!hasSets) {
      errors.sets = `Los siguientes ejercicios no tienen sets: ${exercisesWithoutSets.join(
        ", "
      )}`;
    }

    // 5. Resultado final
    const isValid = hasValidName && hasBlocks && hasExercises && hasSets;

    return {
      isValid,
      errors,
      details: {
        hasValidName,
        hasBlocks,
        hasExercises,
        hasSets,
        blocksWithoutExercises,
        exercisesWithoutSets,
      },
    };
  }, [
    routine.name,
    blocksByRoutine,
    exercisesByBlock,
    setsByExercise,
    blocks,
    exercisesInBlock,
  ]);
};
