import { ANALYTICS_QUERY_KEY } from "@/features/analytics/hooks/use-analytics-data";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import {
  finishWorkout,
  prepareFinishData,
} from "@/shared/services/finish-workout";
import { activeWorkoutTranslations } from "@/shared/translations/active-workout";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import {
  useActiveMainActions,
  useActiveWorkout,
  useActiveWorkoutStats,
} from "./use-active-workout-store";

export const useFinishWorkout = () => {
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = activeWorkoutTranslations;
  const { clearWorkout, detectWorkoutChanges } = useActiveMainActions();
  const { totalSetsCompleted, totalSetsPlanned } = useActiveWorkoutStats();
  const activeWorkout = useActiveWorkout();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

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

      // Step 4: Clear state and navigate
      clearWorkout();

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["workouts", "routines"] });
      queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["workout-sessions"] });

      router.back();
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

    if (!hasChanges) {
      // No changes - just save the workout session
      await executeFinishWorkout(false);
    } else {
      // Has changes - ask user if they want to update routine
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
    }
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
        onPress: () => {
          clearWorkout();
          router.back();
        },
      },
    ]);
  };

  return { handleFinishWorkout, handleExitWorkout, isLoading };
};
