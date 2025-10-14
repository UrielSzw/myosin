import { BaseExercise } from "@/shared/db/schema";
import { IExerciseMuscle } from "@/shared/types/workout";
import { useCallback, useMemo, useState } from "react";

export const useExerciseSelector = (isReplaceMode: boolean) => {
  const [selectedExercises, setSelectedExercises] = useState<
    Record<string, BaseExercise>
  >({});
  const [infoExercise, setInfoExercise] = useState<BaseExercise | null>(null);

  // Estados para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<IExerciseMuscle | null>(null);

  // Función para filtrar ejercicios en memoria
  const getFilteredExercises = useCallback(
    (exercises: BaseExercise[]) => {
      let filtered = exercises;

      // Filtro por búsqueda de texto
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          (exercise) =>
            exercise.name.toLowerCase().includes(query) ||
            exercise.instructions?.some((instruction) =>
              instruction.toLowerCase().includes(query)
            )
        );
      }

      // Filtro por categoría
      if (selectedCategory) {
        filtered = filtered.filter(
          (exercise) => exercise.main_muscle_group === selectedCategory
        );
      }

      return filtered;
    },
    [searchQuery, selectedCategory]
  );

  // Computaciones memoizadas
  const selectedExercisesArray = useMemo(
    () => Object.values(selectedExercises),
    [selectedExercises]
  );

  const selectedExercisesLength = useMemo(
    () => Object.keys(selectedExercises).length,
    [selectedExercises]
  );

  // Handlers
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

  const handleSeeMoreInfo = useCallback((exercise: BaseExercise) => {
    setInfoExercise(exercise);
  }, []);

  const handleCloseExerciseDetail = useCallback(() => {
    setInfoExercise(null);
  }, []);

  const clearSelectedExercises = useCallback(() => {
    setSelectedExercises({});
  }, []);

  // Handlers para búsqueda y filtros
  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryPress = useCallback((category: IExerciseMuscle) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  }, []);

  const clearSearchAndFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(null);
  }, []);

  return {
    // Estado
    selectedExercises,
    selectedExercisesArray,
    selectedExercisesLength,
    infoExercise,

    // Estados de búsqueda y filtros
    searchQuery,
    selectedCategory,

    // Handlers
    handleSelectExercise,
    handleSeeMoreInfo,
    handleCloseExerciseDetail,
    clearSelectedExercises,

    // Handlers de búsqueda y filtros
    handleSearchQueryChange,
    handleCategoryPress,
    clearSearchAndFilters,
    getFilteredExercises,
  };
};
