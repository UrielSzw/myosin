import { toSupportedLanguage } from "@/shared/types/language";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActionButtonV2 } from "./components/ActionButtonV2";
import { CelebrationBackground } from "./components/CelebrationBackground";
import { ImprovementsCardV2 } from "./components/ImprovementsCardV2";
import { MotivationalCardV2 } from "./components/MotivationalCardV2";
import { PRShowcaseV2 } from "./components/PRShowcaseV2";
import { StreakFireV2 } from "./components/StreakFireV2";
import { VictoryBadgeV2 } from "./components/VictoryBadgeV2";
import { WorkoutStatsCounterV2 } from "./components/WorkoutStatsCounterV2";

export const WorkoutSummaryV2: React.FC = () => {
  useColorScheme(); // For theme context
  const insets = useSafeAreaInsets();
  const haptic = useHaptic();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const weightUnit = prefs?.weight_unit ?? "kg";

  // Parse params from navigation
  const params = useLocalSearchParams<{
    routineName: string;
    workoutNumber: string;
    totalExercises: string;
    totalSetsCompleted: string;
    durationSeconds: string;
    currentStreak: string;
    prs: string;
    improvements: string;
    sessionId: string;
    totalVolume?: string;
  }>();

  const routineName = params.routineName ?? "Workout";
  const workoutNumber = parseInt(params.workoutNumber ?? "1", 10);
  const totalExercises = parseInt(params.totalExercises ?? "0", 10);
  const totalSetsCompleted = parseInt(params.totalSetsCompleted ?? "0", 10);
  const durationSeconds = parseInt(params.durationSeconds ?? "0", 10);
  const currentStreak = parseInt(params.currentStreak ?? "0", 10);
  const totalVolume = parseInt(params.totalVolume ?? "0", 10);

  // Parse PRs and improvements
  let prs: { exerciseName: string; weight: number; reps: number }[] = [];
  let improvementsCount = 0;

  try {
    if (params.prs) {
      prs = JSON.parse(params.prs);
    }
    if (params.improvements) {
      improvementsCount = JSON.parse(params.improvements).length;
    }
  } catch {
    // Ignore parse errors
  }

  // Calculate estimated volume if not provided (rough estimate)
  const estimatedVolume =
    totalVolume > 0 ? totalVolume : totalSetsCompleted * 60; // Rough estimate: 60kg avg per set

  // Trigger celebration haptic on mount
  const [hasTriggeredHaptic, setHasTriggeredHaptic] = useState(false);

  useEffect(() => {
    if (!hasTriggeredHaptic) {
      // Delay the haptic to sync with victory badge animation
      const timeout = setTimeout(() => {
        haptic.success();
        setHasTriggeredHaptic(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [haptic, hasTriggeredHaptic]);

  // Additional haptic for PRs
  useEffect(() => {
    if (prs.length > 0) {
      const timeout = setTimeout(() => {
        haptic.success();
      }, 1600);
      return () => clearTimeout(timeout);
    }
  }, [prs.length, haptic]);

  const handleDone = () => {
    haptic.light();
    router.dismissAll();
  };

  const hasPRs = prs.length > 0;
  const hasImprovements = improvementsCount > 0;

  return (
    <View style={styles.container}>
      {/* Celebration background with confetti and sparkles */}
      <CelebrationBackground />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero - Victory Badge */}
        <VictoryBadgeV2
          workoutNumber={workoutNumber}
          routineName={routineName}
          lang={lang}
        />

        {/* Stats with animated counters */}
        <WorkoutStatsCounterV2
          totalExercises={totalExercises}
          totalSets={totalSetsCompleted}
          durationSeconds={durationSeconds}
          totalVolume={estimatedVolume}
          lang={lang}
          baseDelay={600}
        />

        {/* Streak Fire (if streak > 0) */}
        <StreakFireV2 streak={currentStreak} lang={lang} baseDelay={1100} />

        {/* PR Showcase (if any PRs) */}
        {hasPRs && (
          <PRShowcaseV2
            prs={prs}
            lang={lang}
            weightUnit={weightUnit}
            baseDelay={1400}
          />
        )}

        {/* Improvements Card (if any improvements) */}
        {hasImprovements && (
          <ImprovementsCardV2
            improvementsCount={improvementsCount}
            lang={lang}
            baseDelay={hasPRs ? 1800 : 1400}
          />
        )}

        {/* Motivational Message */}
        <MotivationalCardV2
          lang={lang}
          hasPRs={hasPRs}
          hasImprovements={hasImprovements}
          streak={currentStreak}
          baseDelay={hasPRs || hasImprovements ? 2100 : 1600}
        />

        {/* Spacer to push button down */}
        <View style={styles.spacer} />

        {/* Action Button */}
        <ActionButtonV2
          onPress={handleDone}
          lang={lang}
          baseDelay={hasPRs || hasImprovements ? 2400 : 1900}
        />
      </ScrollView>
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
  contentContainer: {
    paddingHorizontal: 20,
    minHeight: "100%",
  },
  spacer: {
    flex: 1,
    minHeight: 20,
  },
});

export default WorkoutSummaryV2;
