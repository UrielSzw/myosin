import { ExerciseModal } from "@/features/routine-form/elements/exercise-modal";
import {
  useMainActions,
  useRoutineFormState,
} from "@/features/routine-form/hooks/use-routine-form-store";
import { AuroraBackground } from "@/features/workouts-v2/components/AuroraBackground";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { BlockItemV2 } from "./components/BlockItemV2";
import { BlocksListV2 } from "./components/BlocksListV2";
import { BottomSheetsV2 } from "./components/BottomSheetsV2";
import { ExerciseListTopV2 } from "./components/ExerciseListTopV2";
import { FormHeaderV2 } from "./components/FormHeaderV2";
import { ListHintV2 } from "./components/ListHintV2";
import { RoutineInfoV2 } from "./components/RoutineInfoV2";
import { VolumePreviewV2 } from "./components/VolumePreviewV2";
import {
  SheetTypeV2,
  useFormRoutineSheetsV2,
} from "./hooks/use-form-routine-sheets-v2";

export const RoutineFormV2Feature = () => {
  const { blocksByRoutine, exercisesInBlock, sets, exercisesByBlock, routine } =
    useRoutineFormState();

  const { setIsExerciseModalOpen, setExerciseModalMode } = useMainActions();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";

  // V2 sheets system - Modal-based
  const { activeSheet, openSheet, closeSheet } = useFormRoutineSheetsV2();

  // Legacy refs for components that still use BottomSheetModal
  const routineSettingsBottomSheetRef = useRef<BottomSheetModal>(null);

  // Combined handler for both V2 sheets and legacy refs
  const handleToggleSheet = (sheet?: string) => {
    switch (sheet) {
      case "setType":
      case "restTime":
      case "blockOptions":
      case "exerciseOptions":
      case "measurementTemplate":
      case "tempoSelector":
      case "rpeSelector":
        openSheet(sheet as SheetTypeV2);
        break;
      case "routineSettings":
        routineSettingsBottomSheetRef.current?.present();
        break;
      default:
        closeSheet();
        break;
    }
  };

  const exercisesInBlockCount = Object.values(exercisesByBlock).reduce(
    (total, exercises) => total + exercises.length,
    0
  );

  const handleAddExercise = () => {
    setIsExerciseModalOpen(true);
    setExerciseModalMode("add-new");
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <AuroraBackground />
        <FormHeaderV2 />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
            {/* Routine Info Card */}
            <View style={styles.infoSection}>
              <RoutineInfoV2
                onOpenSettings={() => handleToggleSheet("routineSettings")}
              />

              {/* Volume Preview */}
              <VolumePreviewV2
                exercisesInBlock={exercisesInBlock}
                sets={sets}
                trainingDays={routine.training_days || []}
                blocksByRoutine={blocksByRoutine}
                exercisesByBlock={exercisesByBlock}
                lang={lang}
              />

              {/* Exercise count & add button */}
              {exercisesInBlockCount > 0 && (
                <ExerciseListTopV2 exercisesCount={exercisesInBlockCount} />
              )}

              {/* Hint card */}
              {exercisesInBlockCount > 0 && <ListHintV2 />}
            </View>

            {/* Blocks List */}
            <BlocksListV2
              exercisesInBlockCount={exercisesInBlockCount}
              onAddExercise={handleAddExercise}
            >
              {blocksByRoutine.map((blockId, index) => (
                <BlockItemV2
                  key={blockId}
                  blockId={blockId}
                  onToggleSheet={handleToggleSheet}
                  index={index}
                />
              ))}
            </BlocksListV2>
          </Animated.View>

          {/* Bottom spacer */}
          <View style={{ height: 150 }} />
        </ScrollView>

        {/* Exercise Selection Modal */}
        <ExerciseModal onToggleSheet={handleToggleSheet} />

        {/* V2 Bottom Sheets */}
        <BottomSheetsV2
          activeSheet={activeSheet}
          closeSheet={closeSheet}
          routineSettingsBottomSheetRef={routineSettingsBottomSheetRef}
        />
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 75,
  },
  content: {
    flex: 1,
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingTop: 60,
  },
});

export default RoutineFormV2Feature;
