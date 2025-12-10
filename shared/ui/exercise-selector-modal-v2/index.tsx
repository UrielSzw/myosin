import { BaseExercise } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useExerciseFilters } from "@/shared/hooks/use-exercise-filters";
import { useExercises } from "@/shared/hooks/use-exercises";
import { ExerciseDetailViewV2 } from "@/shared/ui/exercise-detail-v2";
import React, { useCallback, useEffect, useState } from "react";
import { Modal, StatusBar } from "react-native";
import Animated, {
  Easing,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { useExerciseSelector } from "./hooks/use-exercise-selector";
import { ExerciseSelectorViewV2 } from "./views/ExerciseSelectorViewV2";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAddAsIndividual: (selectedExercises: BaseExercise[]) => void;
  onAddAsBlock: (selectedExercises: BaseExercise[]) => void;
  onReplaceExercise: (selectedExercises: BaseExercise[]) => void;
  onAddToBlock: (selectedExercises: BaseExercise[]) => void;
  exerciseModalMode?: "add-new" | "add-to-block" | "replace" | null;
  exerciseIdToExclude?: string | null;
};

export const ExerciseSelectorModalV2: React.FC<Props> = ({
  visible,
  onClose,
  onAddAsIndividual,
  onAddAsBlock,
  exerciseModalMode,
  onReplaceExercise,
  onAddToBlock,
  exerciseIdToExclude = null,
}) => {
  const { exercises, loading, error } = useExercises();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const idToExclude =
    exerciseModalMode === "replace" ? exerciseIdToExclude : null;

  // Hook de filtros elevado al modal padre
  const filtersHook = useExerciseFilters(exercises || [], idToExclude);

  const {
    selectedExercises,
    selectedExercisesArray,
    selectedExercisesLength,
    infoExercise,
    handleSelectExercise,
    handleSeeMoreInfo,
    handleCloseExerciseDetail,
    clearSelectedExercises,
  } = useExerciseSelector(exerciseModalMode === "replace");

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

  // V2 Background color
  const screenBg = isDark ? "rgba(10, 10, 12, 1)" : "rgba(250, 250, 252, 1)";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      backdropColor={screenBg}
      onRequestClose={handleCloseModal}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={screenBg}
      />
      {infoExercise ? (
        <Animated.View
          key="exercise-detail"
          entering={slideInFromRight}
          exiting={slideOutToRight}
          style={{ flex: 1 }}
        >
          <ExerciseDetailViewV2
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
          <ExerciseSelectorViewV2
            exercises={filtersHook.filteredExercises}
            allExercises={exercises}
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
              replaceData: filtersHook.replaceData,
            }}
          />
        </Animated.View>
      )}
    </Modal>
  );
};
