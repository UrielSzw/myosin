import { AuroraBackground } from "@/features/workouts-v2/components/AuroraBackground";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { PlateCalculatorSheetV2 } from "@/shared/ui/sheets-v2";
import { ToastPortal } from "@/shared/ui/toast";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

// Elements
import {
  ActiveBlockItemV2,
  ActiveWorkoutHeaderV2,
  AddExerciseButtonV2,
  EmptyWorkoutStateV2,
  PlateCalculatorFloatingButton,
  RestTimerBannerV2,
} from "./elements";

// Sheets
import {
  PlateCalculatorProvider,
  useActiveWorkoutSheetsV2,
  usePlateCalculator,
} from "./hooks";
import { ActiveSheetsV2 } from "./sheets";

// Exercise Modal
import { BaseExercise } from "@/shared/db/schema";
import { ExerciseSelectorModalV2 } from "@/shared/ui/exercise-selector-modal-v2";

// Store hooks
import {
  useActiveBlockActions,
  useActiveExerciseActions,
  useActiveMainActions,
  useActiveWorkout,
  useActiveWorkoutState,
} from "@/features/active-workout-v2/hooks/use-active-workout-store";

// Inner component that uses the plate calculator context
const ActiveWorkoutContent: React.FC = () => {
  const { blocksBySession } = useActiveWorkout();
  const { exerciseModalMode, currentExerciseId } = useActiveWorkoutState();
  const { clearCurrentState, setExerciseModalMode } = useActiveMainActions();
  const { addIndividualBlock, addMultiBlock, addToBlock } =
    useActiveBlockActions();
  const { replaceExercise } = useActiveExerciseActions();

  const prefs = useUserPreferences();
  const keepScreenAwake = prefs?.keep_screen_awake ?? true;
  const weightUnit = prefs?.weight_unit ?? "kg";

  // Plate calculator context
  const {
    isButtonVisible,
    isSheetVisible,
    currentWeightKg,
    onApplyWeight,
    openSheet,
    closeSheet: closePlateCalcSheet,
    hideFloatingButton,
  } = usePlateCalculator();

  // Sheet management
  const {
    activeSheet,
    closeSheet,
    openSetTypeSheet,
    openRestTimeSheet,
    openBlockOptionsSheet,
    openExerciseOptionsSheet,
    openRPESelectorSheet,
    openTempoMetronomeSheet,
    openCircuitTimerModeSheet,
    openMeasurementTemplateSheet,
  } = useActiveWorkoutSheetsV2();

  // Keep screen awake during workout
  useEffect(() => {
    if (keepScreenAwake) {
      activateKeepAwakeAsync();
    }
    return () => {
      deactivateKeepAwake();
    };
  }, [keepScreenAwake]);

  const hasExercises = blocksBySession && blocksBySession.length > 0;

  // Exercise modal handlers
  const handleAddExercise = () => {
    setExerciseModalMode("add-new");
  };

  const handleReplaceExercise = (selectedExercises: BaseExercise[]) => {
    replaceExercise(selectedExercises);
    clearCurrentState();
  };

  const handleAddIndividualBlock = (selectedExercises: BaseExercise[]) => {
    addIndividualBlock(selectedExercises);
    clearCurrentState();
  };

  const handleAddMultiBlock = (selectedExercises: BaseExercise[]) => {
    addMultiBlock(selectedExercises);
    clearCurrentState();
  };

  const handleAddToBlock = (selectedExercises: BaseExercise[]) => {
    addToBlock(selectedExercises);
    clearCurrentState();
  };

  // Plate calculator handlers
  const handlePlateCalcApply = (weightKg: number) => {
    if (onApplyWeight) {
      onApplyWeight(weightKg);
    }
    closePlateCalcSheet();
  };

  const handleOpenPlateCalculator = () => {
    // This is triggered by the floating button - opens the sheet
    openSheet();
  };

  return (
    <View style={styles.container}>
      <AuroraBackground />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Floating Header */}
        <ActiveWorkoutHeaderV2 />

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {hasExercises ? (
            <Animated.View
              entering={FadeIn.duration(400)}
              style={styles.content}
            >
              {blocksBySession.map((blockId, index) => (
                <ActiveBlockItemV2
                  key={blockId}
                  blockId={blockId}
                  index={index}
                  onOpenBlockOptions={openBlockOptionsSheet}
                  onOpenExerciseOptions={openExerciseOptionsSheet}
                  onOpenSetType={openSetTypeSheet}
                  onOpenRestTime={openRestTimeSheet}
                  onOpenRPESelector={openRPESelectorSheet}
                  onOpenTempoMetronome={openTempoMetronomeSheet}
                  onOpenMeasurementTemplate={openMeasurementTemplateSheet}
                />
              ))}

              <View style={styles.addButtonContainer}>
                <AddExerciseButtonV2
                  onPress={handleAddExercise}
                  blocksCount={blocksBySession.length}
                />
              </View>
            </Animated.View>
          ) : (
            <EmptyWorkoutStateV2 onAddExercise={handleAddExercise} />
          )}

          {/* Bottom spacer */}
          <View style={{ height: 150 }} />
        </ScrollView>

        {/* Rest Timer Banner */}
        <RestTimerBannerV2 />
      </KeyboardAvoidingView>

      {/* Floating Plate Calculator Button - shows above keyboard when weight input is focused */}
      <PlateCalculatorFloatingButton
        visible={isButtonVisible}
        onPress={handleOpenPlateCalculator}
        onHide={hideFloatingButton}
      />

      {/* Exercise Selector Modal */}
      <ExerciseSelectorModalV2
        visible={!!exerciseModalMode}
        onClose={clearCurrentState}
        onAddAsIndividual={handleAddIndividualBlock}
        onAddAsBlock={handleAddMultiBlock}
        exerciseModalMode={exerciseModalMode}
        onReplaceExercise={handleReplaceExercise}
        onAddToBlock={handleAddToBlock}
        exerciseIdToExclude={currentExerciseId}
      />

      {/* All Sheets */}
      <ActiveSheetsV2
        activeSheet={activeSheet}
        closeSheet={closeSheet}
        openCircuitTimerModeSheet={openCircuitTimerModeSheet}
      />

      {/* Plate Calculator Sheet */}
      <PlateCalculatorSheetV2
        visible={isSheetVisible}
        currentWeight={currentWeightKg}
        weightUnit={weightUnit}
        onApply={handlePlateCalcApply}
        onClose={closePlateCalcSheet}
      />

      {/* PR Toast - placed here to ensure visibility above all content */}
      <ToastPortal />
    </View>
  );
};

// Main export with provider wrapper
export const ActiveWorkoutV2Feature: React.FC = () => {
  return (
    <PlateCalculatorProvider>
      <ActiveWorkoutContent />
    </PlateCalculatorProvider>
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
    paddingTop: 60,
  },
  addButtonContainer: {
    marginHorizontal: 12,
  },
});
