import { BaseExercise } from "@/shared/db/schema";
import { useExercises } from "@/shared/hooks/use-exercises";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "react-native";
import Animated, {
  Easing,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { useExerciseSelector } from "./hooks/use-exercise-selector";
import { ExerciseDetailView } from "./views/exercise-detail-view";
import { ExerciseSelectorView } from "./views/exercise-selector-view";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddAsIndividual: (selectedExercises: BaseExercise[]) => void;
  onAddAsBlock: (selectedExercises: BaseExercise[]) => void;
  onReplaceExercise: (selectedExercises: BaseExercise[]) => void;
  onAddToBlock: (selectedExercises: BaseExercise[]) => void;
  exerciseModalMode?: "add-new" | "add-to-block" | "replace" | null;
};

export const ExerciseSelectorModal: React.FC<Props> = ({
  visible,
  onClose,
  onAddAsIndividual,
  onAddAsBlock,
  exerciseModalMode,
  onReplaceExercise,
  onAddToBlock,
}) => {
  const { exercises, loading, error } = useExercises();
  const {
    selectedExercises,
    selectedExercisesArray,
    selectedExercisesLength,
    infoExercise,
    searchQuery,
    selectedCategory,
    handleSelectExercise,
    handleSeeMoreInfo,
    handleCloseExerciseDetail,
    clearSelectedExercises,
    handleSearchQueryChange,
    handleCategoryPress,
    getFilteredExercises,
  } = useExerciseSelector();

  // Aplicar filtros a los ejercicios
  const filteredExercises = useMemo(
    () => getFilteredExercises(exercises),
    [exercises, getFilteredExercises]
  );

  // Fix para el bug de layout inicial (similar a WorkoutsFeature)
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    // Marcar como no-inicial después del primer render
    setIsInitialMount(false);
  }, []);

  // Animation configurations
  const slideInFromRight = SlideInRight.duration(300).easing(
    Easing.bezier(0.25, 0.1, 0.25, 1)
  );
  const slideInFromLeft = !isInitialMount
    ? SlideInLeft.duration(300).easing(Easing.bezier(0.25, 0.1, 0.25, 1))
    : undefined;
  const slideOutToLeft = SlideOutLeft.duration(300).easing(
    Easing.bezier(0.25, 0.1, 0.25, 1)
  );
  const slideOutToRight = SlideOutRight.duration(300).easing(
    Easing.bezier(0.25, 0.1, 0.25, 1)
  );

  // Handlers para las acciones del footer
  const handleAddAsIndividualAction = useCallback(() => {
    onAddAsIndividual(selectedExercisesArray);
    clearSelectedExercises();
  }, [onAddAsIndividual, selectedExercisesArray, clearSelectedExercises]);

  const handleAddMultiBlock = useCallback(() => {
    onAddAsBlock(selectedExercisesArray);
    clearSelectedExercises();
  }, [onAddAsBlock, selectedExercisesArray, clearSelectedExercises]);

  const handleAddToReplace = useCallback(() => {
    onReplaceExercise(selectedExercisesArray);
    clearSelectedExercises();
  }, [onReplaceExercise, selectedExercisesArray, clearSelectedExercises]);

  const handleAddToBlockAction = useCallback(() => {
    onAddToBlock(selectedExercisesArray);
    clearSelectedExercises();
  }, [onAddToBlock, selectedExercisesArray, clearSelectedExercises]);

  // Early return para error state
  if (error) {
    // TODO: Agregar ErrorView component
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      {infoExercise ? (
        <Animated.View
          key="exercise-detail"
          entering={slideInFromRight}
          exiting={slideOutToRight}
          style={{ flex: 1 }}
        >
          <ExerciseDetailView
            exercise={infoExercise}
            onClose={handleCloseExerciseDetail}
          />
        </Animated.View>
      ) : (
        <Animated.View
          key="exercise-selector"
          entering={slideInFromLeft}
          exiting={slideOutToLeft}
          style={{ flex: 1 }}
        >
          <ExerciseSelectorView
            exercises={filteredExercises}
            loading={loading}
            selectedExercises={selectedExercises}
            selectedExercisesLength={selectedExercisesLength}
            exerciseModalMode={exerciseModalMode}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onClose={onClose}
            onSelectExercise={handleSelectExercise}
            onSeeMoreInfo={handleSeeMoreInfo}
            onSearchQueryChange={handleSearchQueryChange}
            onCategoryPress={handleCategoryPress}
            onAddAsIndividual={handleAddAsIndividualAction}
            onAddMultiBlock={handleAddMultiBlock}
            onAddToReplace={handleAddToReplace}
            onAddToBlock={handleAddToBlockAction}
          />
        </Animated.View>
      )}
    </Modal>
  );
};
