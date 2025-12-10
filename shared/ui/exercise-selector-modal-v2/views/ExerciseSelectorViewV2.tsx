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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExerciseCardV2 } from "../components/ExerciseCardV2";
import { FooterV2 } from "../components/FooterV2";
import { HeaderV2 } from "../components/HeaderV2";
import { SearchAndFiltersV2 } from "../components/SearchAndFiltersV2";

type Props = {
  exercises: BaseExercise[];
  allExercises: BaseExercise[];
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

export const ExerciseSelectorViewV2: React.FC<Props> = ({
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
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const { updateFilter, toggleQuickFilter, clearAllFilters } = filterHandlers;
  const { filteredExercises, activeFiltersList, replaceData } = filterData;

  // V2 Background
  const screenBg = isDark ? "rgba(10, 10, 12, 1)" : "rgba(250, 250, 252, 1)";

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
      <ExerciseCardV2
        exercise={item.exercise}
        index={item.index}
        isSelected={selectedExercises[item.exercise.id] !== undefined}
        isRecommended={item.isRecommended}
        onSelectExercise={onSelectExercise}
        onSeeMoreInfo={onSeeMoreInfo}
        colors={colors}
        isDark={isDark}
        exerciseModalMode={exerciseModalMode}
      />
    ),
    [
      selectedExercises,
      onSelectExercise,
      onSeeMoreInfo,
      colors,
      isDark,
      exerciseModalMode,
    ]
  );

  const getItemType = useCallback(() => "exercise", []);

  // Calculate footer padding for list
  const hasFooterContent =
    (exerciseModalMode === "add-new" && selectedExercisesLength > 0) ||
    (exerciseModalMode === "replace" && selectedExercisesLength > 0) ||
    exerciseModalMode === "add-to-block";

  const footerHeight = hasFooterContent
    ? selectedExercisesLength > 1 && exerciseModalMode === "add-new"
      ? 200
      : 140
    : 40;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: screenBg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* TODO: Agregar loading component */}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: screenBg }}>
      {/* Header */}
      <HeaderV2
        onClose={onClose}
        selectedExercises={selectedExercises}
        selectedExercisesLength={selectedExercisesLength}
        exerciseModalMode={exerciseModalMode}
        exerciseToReplace={replaceData?.exerciseToReplace}
      />

      {/* Search and Filters */}
      <View style={{ paddingTop: 16 }}>
        <SearchAndFiltersV2
          searchQuery={filters.searchQuery}
          selectedCategory={filters.mainCategory}
          selectedQuickFilters={filters.quickFilters}
          activeFiltersList={activeFiltersList}
          onSearchQueryChange={(query) => updateFilter("searchQuery", query)}
          onCategorySelect={(category) =>
            updateFilter("mainCategory", category)
          }
          onQuickFilterToggle={toggleQuickFilter}
          onClearAllFilters={clearAllFilters}
        />
      </View>

      {/* Exercises List */}
      <FlashList
        data={structuredData}
        key={`${filters.mainCategory}-${filters.quickFilters.join("-")}`}
        keyExtractor={(item) => `exercise-${item.exercise.id}`}
        renderItem={renderItem}
        getItemType={getItemType}
        extraData={selectedExercises}
        contentContainerStyle={{
          paddingBottom: footerHeight + insets.bottom,
          paddingHorizontal: 20,
        }}
        style={{ flex: 1 }}
        drawDistance={800}
      />

      {/* Footer */}
      <FooterV2
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
