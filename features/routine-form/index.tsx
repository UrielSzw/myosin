import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import React from "react";
import { ScrollView, View } from "react-native";
import { BlockItem } from "./elements/block-item";
import { BlocksList } from "./elements/blocks-list";
import { BottomSheets } from "./elements/bottom-sheets";
import { CreateRoutineHeader } from "./elements/create-routine-header";
import { ExerciseModal } from "./elements/exercise-modal";
import { RoutineInfo } from "./elements/routine-info";
import { VolumePreview } from "./elements/volume-preview";
import { useFormRoutineSheets } from "./hooks/use-form-routine-sheets";
import { useRoutineFormState } from "./hooks/use-routine-form-store";

export const RoutineFormFeature = () => {
  const { blocksByRoutine, exercisesInBlock, sets, exercisesByBlock, routine } =
    useRoutineFormState();

  const {
    handleToggleSheet,
    setTypeBottomSheetRef,
    measurementTemplateBottomSheetRef,
    restTimeBottomSheetRef,
    blockOptionsBottomSheetRef,
    exerciseOptionsBottomSheetRef,
    rpeSelectorBottomSheetRef,
    tempoSelectorBottomSheetRef,
    routineSettingsBottomSheetRef,
  } = useFormRoutineSheets();

  const blockCount = blocksByRoutine.length;

  return (
    <ScreenWrapper withSheets fullscreen>
      <CreateRoutineHeader />

      <ScrollView
        style={{ flex: 1 }}
        accessible={true}
        accessibilityLabel="Contenido de la rutina"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View
          style={{ flex: 1, padding: 20 }}
          accessible={true}
          accessibilityLabel={`Rutina con ${blockCount} ${
            blockCount === 1 ? "bloque" : "bloques"
          }`}
        >
          <RoutineInfo
            onOpenSettings={() => handleToggleSheet("routineSettings")}
          />

          <VolumePreview
            exercisesInBlock={exercisesInBlock}
            sets={sets}
            trainingDays={routine.training_days || []}
            blocksByRoutine={blocksByRoutine}
            exercisesByBlock={exercisesByBlock}
          />

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
        measurementTemplateBottomSheetRef={measurementTemplateBottomSheetRef}
        setTypeBottomSheetRef={setTypeBottomSheetRef}
        rpeSelectorBottomSheetRef={rpeSelectorBottomSheetRef}
        tempoSelectorBottomSheetRef={tempoSelectorBottomSheetRef}
        routineSettingsBottomSheetRef={routineSettingsBottomSheetRef}
      />
    </ScreenWrapper>
  );
};
