import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import React from "react";
import { ScrollView, View } from "react-native";
import { ActiveBlockItem } from "./elements/active-block-item";
import { ActiveBottomSheets } from "./elements/active-bottom-sheets";
import { ActiveExerciseModal } from "./elements/active-exercise-modal";
import { ActiveWorkoutHeader } from "./elements/active-workout-header";
import { AddExerciseButton } from "./elements/add-exercise-button";
import { useActiveWorkoutSheets } from "./hooks/use-active-workout-sheets";
import { useActiveWorkout } from "./hooks/use-active-workout-store";

export const ActiveWorkoutFeature = () => {
  const { blocksBySession } = useActiveWorkout();

  const {
    handleToggleSheet,
    setTypeBottomSheetRef,
    restTimeBottomSheetRef,
    blockOptionsBottomSheetRef,
    exerciseOptionsBottomSheetRef,
    restTimerSheetRef,
  } = useActiveWorkoutSheets();

  return (
    <ScreenWrapper withSheets fullscreen>
      <ActiveWorkoutHeader />

      <ScrollView style={{ flex: 1 }}>
        {blocksBySession?.map((blockId) => (
          <ActiveBlockItem
            key={blockId}
            blockId={blockId}
            onToggleSheet={handleToggleSheet}
          />
        ))}

        <AddExerciseButton />

        <View style={{ height: 200 }} />
      </ScrollView>

      <ActiveExerciseModal
        blockOptionsBottomSheetRef={blockOptionsBottomSheetRef}
      />

      <ActiveBottomSheets
        setTypeBottomSheetRef={setTypeBottomSheetRef}
        restTimeBottomSheetRef={restTimeBottomSheetRef}
        blockOptionsBottomSheetRef={blockOptionsBottomSheetRef}
        exerciseOptionsBottomSheetRef={exerciseOptionsBottomSheetRef}
        restTimerSheetRef={restTimerSheetRef}
      />
    </ScreenWrapper>
  );
};
