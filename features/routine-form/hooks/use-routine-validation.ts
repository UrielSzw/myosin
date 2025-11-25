import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
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
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = routineFormTranslations;

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
        errors.routineName = t.routineNameRequired[lang];
      } else if (routineName.length < 2) {
        errors.routineName = t.nameTooShort[lang];
      } else if (routineName.length > 100) {
        errors.routineName = t.nameTooLong[lang];
      }
    }

    // 2. Validar que hay al menos un bloque
    const hasBlocks = blocksByRoutine.length > 0;
    if (!hasBlocks) {
      errors.blocks = t.atLeastOneBlock[lang];
    }

    // 3. Validar que cada bloque tiene al menos un ejercicio
    const blocksWithoutExercises: string[] = [];
    blocksByRoutine.forEach((blockId) => {
      const exerciseIds = exercisesByBlock[blockId] || [];
      if (exerciseIds.length === 0) {
        const block = blocks[blockId];
        blocksWithoutExercises.push(block?.name || t.blockWithoutName[lang]);
      }
    });

    const hasExercises = blocksWithoutExercises.length === 0;
    if (!hasExercises) {
      errors.exercises = t.blocksWithoutExercises[lang].replace(
        "{blocks}",
        blocksWithoutExercises.join(", ")
      );
    }

    // 4. Validar que cada ejercicio tiene al menos un set
    const exercisesWithoutSets: string[] = [];
    Object.entries(exercisesByBlock).forEach(([blockId, exerciseIds]) => {
      exerciseIds.forEach((exerciseId) => {
        const setIds = setsByExercise[exerciseId] || [];
        if (setIds.length === 0) {
          const exercise = exercisesInBlock[exerciseId];
          exercisesWithoutSets.push(
            exercise?.exercise?.name || t.exerciseWithoutName[lang]
          );
        }
      });
    });

    const hasSets = exercisesWithoutSets.length === 0;
    if (!hasSets) {
      errors.sets = t.exercisesWithoutSets[lang].replace(
        "{exercises}",
        exercisesWithoutSets.join(", ")
      );
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
    lang,
    t,
  ]);
};
