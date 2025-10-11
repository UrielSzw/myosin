import {
  DEFAULT_FILTERS,
  EQUIPMENT_GROUPS,
  ExerciseFilters,
  MAIN_CATEGORY_LABELS,
  MUSCLE_TO_CATEGORY,
  QUICK_FILTERS,
  QuickFilterType,
} from "@/shared/constants/exercise-filters";
import { BaseExercise } from "@/shared/db/schema";
import { IExerciseEquipment, IExerciseMuscle } from "@/shared/types/workout";
import { useCallback, useMemo, useState } from "react";

export const useExerciseFilters = (allExercises: BaseExercise[]) => {
  const [filters, setFilters] = useState<ExerciseFilters>(DEFAULT_FILTERS);

  // Función para actualizar filtros individuales
  const updateFilter = <K extends keyof ExerciseFilters>(
    key: K,
    value: ExerciseFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Función para toggle de filtros rápidos
  const toggleQuickFilter = (filterId: QuickFilterType) => {
    setFilters((prev) => ({
      ...prev,
      quickFilters: prev.quickFilters.includes(filterId)
        ? prev.quickFilters.filter((f) => f !== filterId)
        : [...prev.quickFilters, filterId],
    }));
  };

  // Función para toggle de músculos específicos
  const toggleSpecificMuscle = (muscle: IExerciseMuscle) => {
    setFilters((prev) => ({
      ...prev,
      specificMuscles: prev.specificMuscles.includes(muscle)
        ? prev.specificMuscles.filter((m) => m !== muscle)
        : [...prev.specificMuscles, muscle],
    }));
  };

  // Función para toggle de equipamiento específico
  const toggleSpecificEquipment = (equipment: IExerciseEquipment) => {
    setFilters((prev) => ({
      ...prev,
      specificEquipment: prev.specificEquipment.includes(equipment)
        ? prev.specificEquipment.filter((e) => e !== equipment)
        : [...prev.specificEquipment, equipment],
    }));
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Función para verificar si un ejercicio pasa los filtros de equipamiento
  const passesEquipmentFilter = useCallback(
    (exercise: BaseExercise): boolean => {
      const { quickFilters, specificEquipment } = filters;

      // Filtrar solo los filtros de equipamiento (no compound/isolation)
      const equipmentQuickFilters = quickFilters.filter((f) =>
        ["bodyweight", "free_weights", "machines"].includes(f)
      );

      // Si no hay filtros de equipamiento, pasa
      if (
        equipmentQuickFilters.length === 0 &&
        specificEquipment.length === 0
      ) {
        return true;
      }

      let passes = false;

      // Verificar filtros rápidos de equipamiento
      for (const quickFilter of equipmentQuickFilters) {
        if (quickFilter === "bodyweight") {
          if (
            EQUIPMENT_GROUPS.bodyweight.includes(exercise.primary_equipment)
          ) {
            passes = true;
            break;
          }
        } else if (quickFilter === "free_weights") {
          if (
            EQUIPMENT_GROUPS.free_weights.includes(exercise.primary_equipment)
          ) {
            passes = true;
            break;
          }
        } else if (quickFilter === "machines") {
          if (EQUIPMENT_GROUPS.machines.includes(exercise.primary_equipment)) {
            passes = true;
            break;
          }
        }
      }

      // Verificar equipamiento específico
      if (specificEquipment.length > 0) {
        if (
          specificEquipment.includes(exercise.primary_equipment) ||
          exercise.equipment.some((eq) => specificEquipment.includes(eq))
        ) {
          passes = true;
        }
      }

      return passes;
    },
    [filters]
  );

  // Ejercicios filtrados
  const filteredExercises = useMemo(() => {
    return allExercises.filter((exercise) => {
      // Filtro de búsqueda por texto
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!exercise.name.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Filtro por categoría principal
      if (filters.mainCategory !== "all") {
        const exerciseCategory = MUSCLE_TO_CATEGORY[exercise.main_muscle_group];
        if (exerciseCategory !== filters.mainCategory) {
          return false;
        }
      }

      // Filtro por tipo de ejercicio (compound/isolation)
      const exerciseTypeFilters = filters.quickFilters.filter((f) =>
        ["compound", "isolation"].includes(f)
      );
      if (exerciseTypeFilters.length > 0) {
        if (!exerciseTypeFilters.includes(exercise.exercise_type)) {
          return false;
        }
      }

      // Filtro por equipamiento
      if (!passesEquipmentFilter(exercise)) {
        return false;
      }

      // Filtro por músculos específicos
      if (filters.specificMuscles.length > 0) {
        const hasMatchingMuscle =
          filters.specificMuscles.includes(exercise.main_muscle_group) ||
          exercise.secondary_muscle_groups.some((muscle) =>
            filters.specificMuscles.includes(muscle)
          );
        if (!hasMatchingMuscle) {
          return false;
        }
      }

      return true;
    });
  }, [allExercises, filters, passesEquipmentFilter]);

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.mainCategory !== "all") count++;
    count += filters.quickFilters.length;
    count += filters.specificMuscles.length;
    count += filters.specificEquipment.length;
    return count;
  }, [filters]);

  // Lista de filtros activos para mostrar como pills
  const activeFiltersList = useMemo(() => {
    const activeFilters: {
      id: string;
      label: string;
      type: "category" | "quick" | "muscle" | "equipment";
      onRemove: () => void;
    }[] = [];

    // Categoría principal
    if (filters.mainCategory !== "all") {
      activeFilters.push({
        id: `category-${filters.mainCategory}`,
        label: MAIN_CATEGORY_LABELS[filters.mainCategory],
        type: "category",
        onRemove: () => updateFilter("mainCategory", "all"),
      });
    }

    // Filtros rápidos
    filters.quickFilters.forEach((filter) => {
      const quickFilter = QUICK_FILTERS.find((qf) => qf.id === filter);
      activeFilters.push({
        id: `quick-${filter}`,
        label: quickFilter?.label || filter,
        type: "quick",
        onRemove: () => toggleQuickFilter(filter),
      });
    });

    // Músculos específicos
    filters.specificMuscles.forEach((muscle) => {
      activeFilters.push({
        id: `muscle-${muscle}`,
        label: muscle.replace(/_/g, " "),
        type: "muscle",
        onRemove: () => toggleSpecificMuscle(muscle),
      });
    });

    // Equipamiento específico
    filters.specificEquipment.forEach((equipment) => {
      activeFilters.push({
        id: `equipment-${equipment}`,
        label: equipment.replace(/_/g, " "),
        type: "equipment",
        onRemove: () => toggleSpecificEquipment(equipment),
      });
    });

    return activeFilters;
  }, [filters]);

  return {
    filters,
    filteredExercises,
    activeFiltersCount,
    activeFiltersList,
    updateFilter,
    toggleQuickFilter,
    toggleSpecificMuscle,
    toggleSpecificEquipment,
    clearAllFilters,
  };
};
