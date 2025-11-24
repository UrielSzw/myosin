import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React from "react";
import { ScrollView, View } from "react-native";
import { BlockItem } from "./elements/block-item";
import { BlocksList } from "./elements/blocks-list";
import { ExerciseListTop } from "./elements/blocks-list/exercise-list-top";
import { ListHint } from "./elements/blocks-list/list-hint";
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

  const { colors } = useColorScheme();

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

  const exercisesInBlockCount = Object.values(exercisesByBlock).reduce(
    (total, exercises) => total + exercises.length,
    0
  );

  return (
    <BottomSheetModalProvider>
      <ScreenWrapper withSheets fullscreen>
        <CreateRoutineHeader />

        <ScrollView
          style={{ flex: 1 }}
          accessible={true}
          accessibilityLabel="Contenido de la rutina"
          contentInsetAdjustmentBehavior="automatic"
        >
          <View
            style={{ flex: 1 }}
            accessible={true}
            accessibilityLabel={`Rutina con ${blockCount} ${
              blockCount === 1 ? "bloque" : "bloques"
            }`}
          >
            <View
              style={{
                paddingHorizontal: 16,
                position: "relative",
                paddingTop: 20,
              }}
            >
              {/* Decorative vertical rail limited to the top content (RoutineInfo + VolumePreview)
                so it doesn't overlap the BlocksList below. Non-interactive. */}
              <View
                accessible={false}
                importantForAccessibility="no"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  backgroundColor: colors.border,
                  opacity: 0.2,
                  borderRadius: 2,
                }}
              />
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

              <ExerciseListTop exercisesInBlockCount={exercisesInBlockCount} />

              <ListHint />
            </View>

            <BlocksList exercisesInBlockCount={exercisesInBlockCount}>
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
    </BottomSheetModalProvider>
  );
};
