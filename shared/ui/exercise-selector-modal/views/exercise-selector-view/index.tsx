import {
  ExerciseFilterData,
  ExerciseFilterHandlers,
  ExerciseFilters,
} from "@/shared/constants/exercise-filters";
import { BaseExercise } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback } from "react";
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
  const { filteredExercises, activeFiltersList } = filterData;

  const renderExerciseCard = useCallback(
    ({ item, index }: { item: BaseExercise; index: number }) => (
      <ExerciseCard
        exercise={item}
        index={index}
        isSelected={selectedExercises[item.id] !== undefined}
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
        data={filteredExercises}
        key={`${filters.mainCategory}-${filters.quickFilters.join("-")}`}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseCard}
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
