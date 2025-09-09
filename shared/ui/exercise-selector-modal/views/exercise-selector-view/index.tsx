import { BaseExercise } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { IExerciseMuscle } from "@/shared/types/workout";
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
  searchQuery: string;
  selectedCategory: IExerciseMuscle | null;
  onClose: () => void;
  onSelectExercise: (exercise: BaseExercise) => void;
  onSeeMoreInfo: (exercise: BaseExercise) => void;
  onSearchQueryChange: (query: string) => void;
  onCategoryPress: (category: IExerciseMuscle) => void;
  onAddAsIndividual: () => void;
  onAddMultiBlock: () => void;
  onAddToReplace: () => void;
  onAddToBlock: () => void;
};

export const ExerciseSelectorView: React.FC<Props> = ({
  exercises,
  loading,
  selectedExercises,
  selectedExercisesLength,
  exerciseModalMode,
  searchQuery,
  selectedCategory,
  onClose,
  onSelectExercise,
  onSeeMoreInfo,
  onSearchQueryChange,
  onCategoryPress,
  onAddAsIndividual,
  onAddMultiBlock,
  onAddToReplace,
  onAddToBlock,
}) => {
  const { colors } = useColorScheme();

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
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSearchQueryChange={onSearchQueryChange}
        onCategoryPress={onCategoryPress}
      />

      {/* Exercises List */}
      <FlashList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseCard}
        getItemType={getItemType}
        extraData={selectedExercises}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
        style={{ flex: 1 }}
        estimatedItemSize={100}
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
