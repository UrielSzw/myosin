import { getSummaryStats } from "@/features/active-workout-v2/hooks/summary-stats";
import { ANALYTICS_QUERY_KEY } from "@/features/analytics-v2/hooks/use-analytics-data";
import { routinesRepository } from "@/shared/db/repository/routines";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import {
  finishWorkout,
  prepareFinishData,
} from "@/shared/services/finish-workout";
import { useHaptic } from "@/shared/services/haptic-service";
import TimerService from "@/shared/services/timer-service";
import { useSyncEngine } from "@/shared/sync/sync-engine";
import { activeWorkoutTranslations } from "@/shared/translations/active-workout";
import { fromKg } from "@/shared/utils/weight-conversion";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import {
  useActiveMainActions,
  useActiveRestTimerActions,
  useActiveWorkout,
  useActiveWorkoutStats,
} from "./use-active-workout-store";

export const useFinishWorkout = () => {
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const weightUnit = prefs?.weight_unit ?? "kg";
  const t = activeWorkoutTranslations;
  const { clearWorkout, detectWorkoutChanges } = useActiveMainActions();
  const { skipRestTimer } = useActiveRestTimerActions();
  const { totalSetsCompleted, totalSetsPlanned } = useActiveWorkoutStats();
  const activeWorkout = useActiveWorkout();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const { sync } = useSyncEngine();
  const haptic = useHaptic();

  /**
   * Executes the complete finish workout flow:
   * 1. Prepare all data with real IDs
   * 2. Save locally in a single transaction
   * 3. Sync to Supabase in background
   * 4. Clear state and navigate back
   */
  const executeFinishWorkout = async (
    shouldUpdateRoutine: boolean
  ): Promise<void> => {
    if (!user || !activeWorkout?.session) {
      Alert.alert("Error", "No hay workout activo para guardar");
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Prepare all data with real IDs
      const payload = prepareFinishData(activeWorkout as any, {
        shouldUpdateRoutine,
        userId: user.id,
      });

      // Step 2 & 3: Save locally and sync to Supabase
      const result = await finishWorkout(payload);

      if (!result.success) {
        throw new Error(result.error || "Error al guardar el workout");
      }

      // Prepare summary data BEFORE clearing workout state
      const routineName = activeWorkout.session?.routine?.name ?? "Workout";
      const totalExercises = Object.keys(activeWorkout.exercises).length;
      const sessionId = result.sessionId ?? "";

      // Calculate workout duration in seconds
      const startedAt = activeWorkout.session?.started_at;
      const durationSeconds = startedAt
        ? Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
        : 0;

      // Get PRs from this session
      const prs = Object.values(activeWorkout.sessionBestPRs || {}).map(
        (pr) => {
          const exercise = Object.values(activeWorkout.exercises).find(
            (ex) => ex.exercise_id === pr.exercise_id
          );
          return {
            exerciseName: exercise?.exercise?.name ?? "Exercise",
            weight:
              weightUnit === "kg"
                ? pr.weight
                : fromKg(pr.weight, weightUnit, 1),
            reps: pr.reps,
          };
        }
      );

      // Get summary stats (workout number, streak)
      const summaryStats = await getSummaryStats(user.id);

      // Stop rest timer if running (prevents sound/vibration after leaving)
      // Clear both Zustand state AND TimerService (singleton)
      skipRestTimer();
      await TimerService.getInstance().clearTimer();

      // Clear workout state BEFORE navigation
      // The summary screen has all data it needs via params
      clearWorkout();

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["workouts", "routines"] });
      queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["workout-sessions"] });

      // Push summary screen on top of active workout
      // The summary will dismiss the entire stack when closed
      router.push({
        pathname: "/workout/summary",
        params: {
          routineName,
          workoutNumber: summaryStats.workoutNumber.toString(),
          totalExercises: totalExercises.toString(),
          totalSetsCompleted: totalSetsCompleted.toString(),
          durationSeconds: durationSeconds.toString(),
          currentStreak: summaryStats.currentStreak.toString(),
          prs: JSON.stringify(prs),
          improvements: JSON.stringify([]), // For future use
          sessionId,
        },
      } as any);
    } catch (error) {
      console.error("Error finishing workout:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateWorkout = async (): Promise<void> => {
    const hasChanges = detectWorkoutChanges();
    const isQuickWorkout = activeWorkout?.session?.routine?.is_quick_workout;

    // CASO 1: Quick Workout - preguntar si guardar como rutina
    if (isQuickWorkout) {
      return new Promise((resolve) => {
        Alert.alert(t.saveAsRoutineTitle[lang], t.saveAsRoutineMessage[lang], [
          {
            text: t.noJustSave[lang],
            style: "cancel",
            onPress: async () => {
              // Guardar workout, rutina queda oculta (is_quick_workout=true)
              // shouldUpdateRoutine=true porque el workout ES la rutina ahora
              await executeFinishWorkout(true);
              resolve();
            },
          },
          {
            text: t.yesCreateRoutine[lang],
            onPress: async () => {
              // Convertir a rutina normal (is_quick_workout=false)
              if (activeWorkout?.session?.routine_id) {
                const routineId = activeWorkout.session.routine_id;
                await routinesRepository.convertQuickWorkoutToRoutine(
                  routineId
                );
                // Sync conversión a Supabase en background
                sync("ROUTINE_CONVERT_FROM_QUICK", { routineId }).catch(
                  (err: unknown) => {
                    console.warn("Failed to sync convert quick workout:", err);
                  }
                );
              }
              await executeFinishWorkout(true);
              resolve();
            },
          },
        ]);
      });
    }

    // CASO 2: Rutina normal sin cambios
    if (!hasChanges) {
      await executeFinishWorkout(false);
      return;
    }

    // CASO 3: Rutina normal con cambios - preguntar si actualizar
    return new Promise((resolve) => {
      Alert.alert(t.updateRoutineTitle[lang], t.updateRoutineMessage[lang], [
        {
          text: t.no[lang],
          style: "cancel",
          onPress: async () => {
            await executeFinishWorkout(false);
            resolve();
          },
        },
        {
          text: t.yesSave[lang],
          style: "destructive",
          onPress: async () => {
            await executeFinishWorkout(true);
            resolve();
          },
        },
      ]);
    });
  };

  const handleFinishWorkout = (): Promise<void> => {
    return new Promise((resolve) => {
      if (totalSetsCompleted < totalSetsPlanned) {
        Alert.alert(t.confirmTitle[lang], t.incompleteSetsMessage[lang], [
          {
            text: t.no[lang],
            style: "cancel",
            onPress: () => resolve(),
          },
          {
            text: t.yesFinish[lang],
            style: "destructive",
            onPress: async () => {
              await handleValidateWorkout();
              resolve();
            },
          },
        ]);
      } else {
        handleValidateWorkout().then(resolve);
      }
    });
  };

  const handleExitWorkout = () => {
    Alert.alert(t.confirmTitle[lang], t.exitWorkoutMessage[lang], [
      { text: t.no[lang], style: "cancel" },
      {
        text: t.yesDelete[lang],
        style: "destructive",
        onPress: async () => {
          haptic.warning(); // Warning haptic for discarding
          // Stop rest timer - both Zustand state AND TimerService
          skipRestTimer();
          await TimerService.getInstance().clearTimer();
          clearWorkout();
          router.back();
        },
      },
    ]);
  };

  return { handleFinishWorkout, handleExitWorkout, isLoading };
};
