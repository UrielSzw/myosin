import { BaseExercise } from "@/shared/db/schema";
import { useCallback, useMemo, useState } from "react";

/**
 * Hook para manejar la selección de ejercicios y navegación al detalle.
 * Los filtros se manejan en useExerciseFilters (shared/hooks).
 */
export const useExerciseSelector = (isReplaceMode: boolean) => {
  const [selectedExercises, setSelectedExercises] = useState<
    Record<string, BaseExercise>
  >({});
  const [infoExercise, setInfoExercise] = useState<BaseExercise | null>(null);

  // Computaciones memoizadas
  const selectedExercisesArray = useMemo(
    () => Object.values(selectedExercises),
    [selectedExercises]
  );

  const selectedExercisesLength = useMemo(
    () => Object.keys(selectedExercises).length,
    [selectedExercises]
  );

  // Handlers de selección
  const handleSelectExercise = useCallback(
    (exercise: BaseExercise) => {
      setSelectedExercises((prev) => {
        if (prev[exercise.id]) {
          // Si ya está seleccionado, lo removemos
          const newState = { ...prev };
          delete newState[exercise.id];
          return newState;
        } else {
          if (isReplaceMode) {
            // En modo replace, solo permitimos uno
            return { [exercise.id]: exercise };
          }
          // Si no está seleccionado, lo agregamos
          return { ...prev, [exercise.id]: exercise };
        }
      });
    },
    [isReplaceMode]
  );

  // Handlers de navegación al detalle
  const handleSeeMoreInfo = useCallback((exercise: BaseExercise) => {
    setInfoExercise(exercise);
  }, []);

  const handleCloseExerciseDetail = useCallback(() => {
    setInfoExercise(null);
  }, []);

  // Reset de selección
  const clearSelectedExercises = useCallback(() => {
    setSelectedExercises({});
  }, []);

  return {
    // Estado de selección
    selectedExercises,
    selectedExercisesArray,
    selectedExercisesLength,

    // Estado de navegación
    infoExercise,

    // Handlers
    handleSelectExercise,
    handleSeeMoreInfo,
    handleCloseExerciseDetail,
    clearSelectedExercises,
  };
};
