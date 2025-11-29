import { ANALYTICS_QUERY_KEY } from "@/features/analytics-v2/hooks/use-analytics-data";
import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useSyncEngine } from "@/shared/sync/sync-engine";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { routinesService } from "../service/routines";

export const useRoutineOptions = () => {
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutsTranslations;
  const queryClient = useQueryClient();
  const { sync } = useSyncEngine();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRoutine = async (routine: RoutineWithMetrics) => {
    Alert.alert(
      t.deleteRoutine[lang],
      t.deleteRoutineConfirmMessage[lang].replace("{name}", routine.name),
      [
        {
          text: t.cancelButton[lang],
          style: "cancel",
        },
        {
          text: t.deleteButton[lang],
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await routinesService.deleteRoutine(routine.id);

              // Sync to Supabase after deletion
              sync("ROUTINE_DELETE", { id: routine.id });

              queryClient.invalidateQueries({ queryKey: ["workouts"] });

              queryClient.invalidateQueries({
                queryKey: ANALYTICS_QUERY_KEY,
              });
            } catch (error) {
              console.error("Error deleting routine:", error);
              Alert.alert(t.errorTitle[lang], t.errorDeletingRoutine[lang]);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleEditRoutine = (routine: RoutineWithMetrics) => {
    router.push(`/routines/edit/${routine.id}` as any);
  };

  const handleRemoveTrainingDays = async (routine: RoutineWithMetrics) => {
    Alert.alert(
      t.removeTrainingDays[lang],
      t.removeTrainingDaysConfirmMessage[lang].replace("{name}", routine.name),
      [
        {
          text: t.cancelButton[lang],
          style: "cancel",
        },
        {
          text: t.removeButton[lang],
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await routinesService.clearRoutineTrainingDays(routine.id);

              // Sync to Supabase after clearing training days
              sync("ROUTINE_CLEAR_TRAINING_DAYS", {
                routineId: routine.id,
              });

              queryClient.invalidateQueries({ queryKey: ["workouts"] });

              // Invalidar analíticas del dashboard
              queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEY });
            } catch (error) {
              console.error("Error removing training days:", error);
              Alert.alert(
                t.errorTitle[lang],
                t.errorRemovingTrainingDays[lang]
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return {
    handleDeleteRoutine,
    handleEditRoutine,
    handleRemoveTrainingDays,
    isDeleting,
  };
};
