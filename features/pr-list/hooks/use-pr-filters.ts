import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_PR_LIST_FILTERS,
  MUSCLE_CATEGORY_MAP,
  PRListFilters,
  PRListItem,
} from "../types/pr-list";

export const usePRFilters = (allPRs: PRListItem[]) => {
  const [filters, setFilters] = useState<PRListFilters>(
    DEFAULT_PR_LIST_FILTERS
  );

  // Función para actualizar filtros individuales
  const updateFilter = <K extends keyof PRListFilters>(
    key: K,
    value: PRListFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Función para toggle de muscle group categories
  const toggleMuscleGroup = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      muscleGroups: prev.muscleGroups.includes(category)
        ? prev.muscleGroups.filter((c) => c !== category)
        : [...prev.muscleGroups, category],
    }));
  }, []);

  // Función para limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_PR_LIST_FILTERS);
  }, []);

  // PRs filtrados con ordenamiento por fecha por defecto
  const filteredPRs = useMemo(() => {
    let result = [...allPRs];

    // Filtro de búsqueda por texto
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter((pr) =>
        pr.exercise_name.toLowerCase().includes(query)
      );
    }

    // Filtro por muscle group categories - ARREGLADO EL BUG
    if (filters.muscleGroups.length > 0) {
      result = result.filter((pr) => {
        const category =
          pr.exercise_muscle_category ||
          MUSCLE_CATEGORY_MAP[pr.exercise_muscle];
        return filters.muscleGroups.includes(category);
      });
    }

    // Filtro por PRs recientes
    if (filters.showRecent) {
      result = result.filter((pr) => pr.is_recent);
    }

    // Ordenamiento por defecto: fecha descendente (más nuevos primero)
    result.sort(
      (a, b) =>
        new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime()
    );

    return result;
  }, [allPRs, filters]);

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim()) count++;
    count += filters.muscleGroups.length;
    if (filters.showRecent) count++;
    return count;
  }, [filters]);

  return {
    filters,
    filteredPRs,
    activeFiltersCount,
    updateFilter,
    toggleMuscleGroup,
    clearAllFilters,
  };
};
