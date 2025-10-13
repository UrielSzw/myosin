import { BaseExercise } from "@/shared/db/schema";
import { useExerciseFilters } from "@/shared/hooks/use-exercise-filters";
import { useExercises } from "@/shared/hooks/use-exercises";
import React, { useCallback, useEffect, useState } from "react";
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

  // Hook de filtros elevado al modal padre
  const filtersHook = useExerciseFilters(exercises || []);

  const {
    selectedExercises,
    selectedExercisesArray,
    selectedExercisesLength,
    infoExercise,
    handleSelectExercise,
    handleSeeMoreInfo,
    handleCloseExerciseDetail,
    clearSelectedExercises,
  } = useExerciseSelector();

  // Aplicar filtros a los ejercicios

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
    filtersHook.clearAllFilters(); // Reset filtros al cerrar
  }, [
    onAddAsIndividual,
    selectedExercisesArray,
    clearSelectedExercises,
    filtersHook,
  ]);

  const handleAddMultiBlock = useCallback(() => {
    onAddAsBlock(selectedExercisesArray);
    clearSelectedExercises();
    filtersHook.clearAllFilters(); // Reset filtros al cerrar
  }, [
    onAddAsBlock,
    selectedExercisesArray,
    clearSelectedExercises,
    filtersHook,
  ]);

  const handleAddToReplace = useCallback(() => {
    onReplaceExercise(selectedExercisesArray);
    clearSelectedExercises();
    filtersHook.clearAllFilters(); // Reset filtros al cerrar
  }, [
    onReplaceExercise,
    selectedExercisesArray,
    clearSelectedExercises,
    filtersHook,
  ]);

  const handleAddToBlockAction = useCallback(() => {
    onAddToBlock(selectedExercisesArray);
    clearSelectedExercises();
    filtersHook.clearAllFilters(); // Reset filtros al cerrar
  }, [
    onAddToBlock,
    selectedExercisesArray,
    clearSelectedExercises,
    filtersHook,
  ]);

  // Handler para cerrar modal
  const handleCloseModal = useCallback(() => {
    onClose();
    filtersHook.clearAllFilters(); // Reset filtros al cerrar
  }, [onClose, filtersHook]);

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
            exercises={filtersHook.filteredExercises}
            loading={loading}
            selectedExercises={selectedExercises}
            selectedExercisesLength={selectedExercisesLength}
            exerciseModalMode={exerciseModalMode}
            onClose={handleCloseModal}
            onSelectExercise={handleSelectExercise}
            onSeeMoreInfo={handleSeeMoreInfo}
            onAddAsIndividual={handleAddAsIndividualAction}
            onAddMultiBlock={handleAddMultiBlock}
            onAddToReplace={handleAddToReplace}
            onAddToBlock={handleAddToBlockAction}
            filters={filtersHook.filters}
            filterHandlers={{
              updateFilter: filtersHook.updateFilter,
              toggleQuickFilter: filtersHook.toggleQuickFilter,
              toggleSpecificMuscle: filtersHook.toggleSpecificMuscle,
              toggleSpecificEquipment: filtersHook.toggleSpecificEquipment,
              clearAllFilters: filtersHook.clearAllFilters,
            }}
            filterData={{
              filteredExercises: filtersHook.filteredExercises,
              activeFiltersCount: filtersHook.activeFiltersCount,
              activeFiltersList: filtersHook.activeFiltersList,
            }}
          />
        </Animated.View>
      )}
    </Modal>
  );
};
