import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import React, { useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActiveBlockItem } from "./elements/active-block-item";
import { ActiveBottomSheets } from "./elements/active-bottom-sheets";
import { ActiveExerciseModal } from "./elements/active-exercise-modal";
import { ActiveWorkoutHeader } from "./elements/active-workout-header";
import { AddExerciseButton } from "./elements/add-exercise-button";
import { EmptyWorkoutState } from "./elements/empty-workout-state";
import { RestTimerBanner } from "./elements/rest-timer-banner";
import { useActiveWorkoutSheets } from "./hooks/use-active-workout-sheets";
import { useActiveWorkout } from "./hooks/use-active-workout-store";

export const ActiveWorkoutFeature = () => {
  const { blocksBySession } = useActiveWorkout();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const keepScreenAwake = prefs?.keep_screen_awake ?? true;

  // Keep screen awake during workout based on user preference
  useEffect(() => {
    if (keepScreenAwake) {
      activateKeepAwakeAsync();
    }
    return () => {
      deactivateKeepAwake();
    };
  }, [keepScreenAwake]);

  const {
    handleToggleSheet,
    setTypeBottomSheetRef,
    restTimeBottomSheetRef,
    blockOptionsBottomSheetRef,
    exerciseOptionsBottomSheetRef,
    restTimerSheetRef,
    rpeSelectorBottomSheetRef,
    tempoMetronomeRef,
  } = useActiveWorkoutSheets();

  const hasExercises = blocksBySession && blocksBySession.length > 0;

  return (
    <BottomSheetModalProvider>
      <ScreenWrapper withSheets fullscreen>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 20}
        >
          <ActiveWorkoutHeader />

          {hasExercises ? (
            <ScrollView style={{ flex: 1 }}>
              {blocksBySession.map((blockId) => (
                <ActiveBlockItem
                  key={blockId}
                  blockId={blockId}
                  onToggleSheet={handleToggleSheet}
                />
              ))}

              <AddExerciseButton />

              <View style={{ height: 200 }} />
            </ScrollView>
          ) : (
            <EmptyWorkoutState />
          )}

          <RestTimerBanner />
        </KeyboardAvoidingView>

        <ActiveExerciseModal
          blockOptionsBottomSheetRef={blockOptionsBottomSheetRef}
        />

        <ActiveBottomSheets
          setTypeBottomSheetRef={setTypeBottomSheetRef}
          restTimeBottomSheetRef={restTimeBottomSheetRef}
          blockOptionsBottomSheetRef={blockOptionsBottomSheetRef}
          exerciseOptionsBottomSheetRef={exerciseOptionsBottomSheetRef}
          restTimerSheetRef={restTimerSheetRef}
          rpeSelectorBottomSheetRef={rpeSelectorBottomSheetRef}
          tempoMetronomeRef={tempoMetronomeRef}
        />
      </ScreenWrapper>
    </BottomSheetModalProvider>
  );
};
