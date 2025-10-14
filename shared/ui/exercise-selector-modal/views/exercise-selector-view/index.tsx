import {
  ExerciseFilterData,
  ExerciseFilterHandlers,
  ExerciseFilters,
} from "@/shared/constants/exercise-filters";
import { BaseExercise } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import { ExerciseCard } from "../../exercise-card";
import { ExerciseSelectorFooter } from "../../exercise-selector-footer";
import { ExerciseSelectorHeader } from "../../exercise-selector-header";
import { ExerciseSelectorSearch } from "../../exercise-selector-search";

type Props = {
  exercises: BaseExercise[];
  loading: boolean;
  selectedExercises: Record<string, BaseExercise>;
  selectedExercisesLength: number;
  exerciseModalMode?: "add-new" | "add-to-block" | "replace" | null;
  onClose: () => void;
  onSelectExercise: (exercise: BaseExercise) => void;
  onSeeMoreInfo: (exercise: BaseExercise) => void;
  onAddAsIndividual: () => void;
  onAddMultiBlock: () => void;
  onAddToReplace: () => void;
  onAddToBlock: () => void;
  // Props de filtros
  filters: ExerciseFilters;
  filterHandlers: ExerciseFilterHandlers;
  filterData: ExerciseFilterData;
};

export const ExerciseSelectorView: React.FC<Props> = ({
  loading,
  selectedExercises,
  selectedExercisesLength,
  exerciseModalMode,
  onClose,
  onSelectExercise,
  onSeeMoreInfo,
  onAddAsIndividual,
  onAddMultiBlock,
  onAddToReplace,
  onAddToBlock,
  // Props de filtros
  filters,
  filterHandlers,
  filterData,
}) => {
  const { colors } = useColorScheme();

  const { updateFilter, toggleQuickFilter, clearAllFilters } = filterHandlers;
  const { filteredExercises, activeFiltersList, replaceData } = filterData;

  // Construir lista simplificada para replace mode
  const structuredData = useMemo(() => {
    if (exerciseModalMode !== "replace" || !replaceData) {
      // Modo normal: solo ejercicios sin badges especiales
      return filteredExercises.map((exercise, index) => ({
        exercise,
        index,
        isRecommended: false,
      }));
    }

    const items: {
      exercise: BaseExercise;
      index: number;
      isRecommended: boolean;
    }[] = [];

    // Ejercicios similares con badge "Recomendado" primero
    replaceData.similarExercises.forEach((exercise, idx) => {
      items.push({
        exercise,
        index: idx,
        isRecommended: true,
      });
    });

    // Otros ejercicios sin badge especial
    const otherExercises = filteredExercises.filter(
      (ex) =>
        ex.id !== replaceData.exerciseToReplace.id &&
        !replaceData.similarExercises.some((sim) => sim.id === ex.id)
    );

    otherExercises.forEach((exercise, idx) => {
      items.push({
        exercise,
        index: idx + replaceData.similarExercises.length,
        isRecommended: false,
      });
    });

    return items;
  }, [exerciseModalMode, replaceData, filteredExercises]);

  const renderItem = useCallback(
    ({ item }: { item: (typeof structuredData)[0] }) => (
      <ExerciseCard
        exercise={item.exercise}
        index={item.index}
        isSelected={selectedExercises[item.exercise.id] !== undefined}
        isRecommended={item.isRecommended}
        onSelectExercise={onSelectExercise}
        onSeeMoreInfo={onSeeMoreInfo}
        colors={colors}
        exerciseModalMode={exerciseModalMode}
      />
    ),
    [
      selectedExercises,
      onSelectExercise,
      onSeeMoreInfo,
      colors,
      exerciseModalMode,
    ]
  );

  const getItemType = useCallback(() => "exercise", []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* TODO: Agregar loading component */}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <ExerciseSelectorHeader
        onClose={onClose}
        selectedExercises={selectedExercises}
        exerciseModalMode={exerciseModalMode}
        exerciseToReplace={replaceData?.exerciseToReplace}
      />

      <ExerciseSelectorSearch
        searchQuery={filters.searchQuery}
        selectedCategory={filters.mainCategory}
        selectedQuickFilters={filters.quickFilters}
        activeFiltersList={activeFiltersList}
        onSearchQueryChange={(query) => updateFilter("searchQuery", query)}
        onCategorySelect={(category) => updateFilter("mainCategory", category)}
        onQuickFilterToggle={toggleQuickFilter}
        onClearAllFilters={clearAllFilters}
      />

      {/* Exercises List */}
      <FlashList
        data={structuredData}
        key={`${filters.mainCategory}-${filters.quickFilters.join("-")}`}
        keyExtractor={(item, index) => `exercise-${item.exercise.id}`}
        renderItem={renderItem}
        getItemType={getItemType}
        extraData={selectedExercises}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
        style={{ flex: 1 }}
        drawDistance={800}
      />

      {/* Footer */}
      <ExerciseSelectorFooter
        exerciseModalMode={exerciseModalMode}
        selectedExercisesLength={selectedExercisesLength}
        onAddMultiBlock={onAddMultiBlock}
        onAddAsIndividual={onAddAsIndividual}
        onAddToReplace={onAddToReplace}
        onAddToBlock={onAddToBlock}
      />
    </View>
  );
};
