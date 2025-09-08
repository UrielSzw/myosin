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

  return {
    handleDeleteRoutine,
    handleEditRoutine,
    isDeleting,
  };
};
