import { AuroraBackground } from "@/features/workouts-v2/components/AuroraBackground";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Elements
import {
  ActiveBlockItemV2,
  ActiveWorkoutHeaderV2,
  AddExerciseButtonV2,
  EmptyWorkoutStateV2,
  RestTimerBannerV2,
} from "./elements";

// Sheets
import { useActiveWorkoutSheetsV2 } from "./hooks";
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
} from "@/features/active-workout/hooks/use-active-workout-store";

export const ActiveWorkoutV2Feature: React.FC = () => {
  const { blocksBySession } = useActiveWorkout();
  const { exerciseModalMode, currentExerciseId } = useActiveWorkoutState();
  const { clearCurrentState, setExerciseModalMode } = useActiveMainActions();
  const { addIndividualBlock, addMultiBlock, addToBlock } =
    useActiveBlockActions();
  const { replaceExercise } = useActiveExerciseActions();

  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const keepScreenAwake = prefs?.keep_screen_awake ?? true;

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
      <ActiveSheetsV2 activeSheet={activeSheet} closeSheet={closeSheet} />
    </View>
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
