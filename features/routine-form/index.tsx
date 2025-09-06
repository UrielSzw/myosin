import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import React from "react";
import { ScrollView, View } from "react-native";
import { BlockItem } from "./elements/block-item";
import { BlocksList } from "./elements/blocks-list";
import { BottomSheets } from "./elements/bottom-sheets";
import { CreateRoutineHeader } from "./elements/create-routine-header";
import { ExerciseModal } from "./elements/exercise-modal";
import { RoutineInfo } from "./elements/routine-info";
import { useFormRoutineSheets } from "./hooks/use-form-routine-sheets";
import { useRoutineFormState } from "./hooks/use-routine-form-store";

export const RoutineFormFeature = () => {
  const { blocksByRoutine } = useRoutineFormState();

  const {
    handleToggleSheet,
    setTypeBottomSheetRef,
    repsTypeBottomSheetRef,
    restTimeBottomSheetRef,
    blockOptionsBottomSheetRef,
    exerciseOptionsBottomSheetRef,
  } = useFormRoutineSheets();

  return (
    <ScreenWrapper withSheets fullscreen>
      <CreateRoutineHeader />

      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 20 }}>
          <RoutineInfo />

          <BlocksList>
            {blocksByRoutine.map((blockId) => (
              <BlockItem
                key={blockId}
                blockId={blockId}
                onToggleSheet={handleToggleSheet}
              />
            ))}
          </BlocksList>
        </View>

        <View style={{ height: 200 }} />
      </ScrollView>

      <ExerciseModal onToggleSheet={handleToggleSheet} />

      <BottomSheets
        blockOptionsBottomSheetRef={blockOptionsBottomSheetRef}
        exerciseOptionsBottomSheetRef={exerciseOptionsBottomSheetRef}
        restTimeBottomSheetRef={restTimeBottomSheetRef}
        repsTypeBottomSheetRef={repsTypeBottomSheetRef}
        setTypeBottomSheetRef={setTypeBottomSheetRef}
      />
    </ScreenWrapper>
  );
};
