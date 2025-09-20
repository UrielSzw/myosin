import { useSelectedFolderStore } from "@/shared/hooks/use-selected-folder-store";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import React, { useEffect, useState } from "react";
import Animated, {
  Easing,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { Header } from "./elements/header";
import { RoutineOptionsBottomSheet } from "./elements/routine-options-sheet";
import { useWorkouts } from "./hooks/use-workouts";
import { FolderDetailView } from "./views/folder-detail-view";
import { MainWorkoutsView } from "./views/main-workouts-view";

export const WorkoutsFeature = () => {
  const selectedFolder = useSelectedFolderStore(
    (state) => state.selectedFolder
  );
  const {
    routineOptionsBottomSheetRef,
    routineToMove,
    selectedRoutine,
    setRoutineToMove,
    handleRoutineOptions,
    handleDelete,
    handleEdit,
    handleClearTrainingDays,
  } = useWorkouts();

  // Fix para el bug de layout inicial
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

  return (
    <ScreenWrapper withSheets>
      <Header selectedFolder={selectedFolder} />

      {selectedFolder ? (
        <Animated.View
          key="folder-detail"
          entering={slideInFromRight}
          exiting={slideOutToRight}
          style={{ flex: 1 }}
        >
          <FolderDetailView
            handleRoutineOptions={handleRoutineOptions}
            selectedFolder={selectedFolder}
            setRoutineToMove={setRoutineToMove}
            routineToMove={routineToMove}
          />
        </Animated.View>
      ) : (
        <Animated.View
          key="main-workouts"
          entering={slideInFromLeft}
          exiting={slideOutToLeft}
          style={{ flex: 1 }}
        >
          <MainWorkoutsView
            handleRoutineOptions={handleRoutineOptions}
            routineToMove={routineToMove}
            setRoutineToMove={setRoutineToMove}
          />
        </Animated.View>
      )}

      <RoutineOptionsBottomSheet
        ref={routineOptionsBottomSheetRef}
        routine={selectedRoutine}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onClearTrainingDays={handleClearTrainingDays}
      />
    </ScreenWrapper>
  );
};
