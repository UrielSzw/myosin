import { ANALYTICS_QUERY_KEY } from "@/features/analytics/hooks/use-analytics-data";
import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { routinesService } from "../service/routines";

export const useRoutineOptions = () => {
  const queryClient = useQueryClient();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRoutine = async (routine: RoutineWithMetrics) => {
    Alert.alert(
      "Eliminar Rutina",
      `¿Estás seguro que deseas eliminar "${routine.name}"?\n\nEsta acción eliminará todos los bloques, ejercicios y sets asociados y no se puede deshacer.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await routinesService.deleteRoutine(routine.id);
              queryClient.invalidateQueries({ queryKey: ["workouts"] });

              queryClient.invalidateQueries({
                queryKey: ANALYTICS_QUERY_KEY,
              });
            } catch (error) {
              console.error("Error deleting routine:", error);
              Alert.alert(
                "Error",
                "No se pudo eliminar la rutina. Intenta nuevamente."
              );
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
      "Quitar Días de Entrenamiento",
      `¿Estás seguro que deseas quitar los días de entrenamiento de "${routine.name}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Quitar",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await routinesService.clearRoutineTrainingDays(routine.id);

              queryClient.invalidateQueries({ queryKey: ["workouts"] });

              // Invalidar analíticas del dashboard
              queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEY });
            } catch (error) {
              console.error("Error removing training days:", error);
              Alert.alert(
                "Error",
                "No se pudieron quitar los días de entrenamiento. Intenta nuevamente."
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
