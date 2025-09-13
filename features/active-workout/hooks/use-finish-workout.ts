import { router } from "expo-router";
import { Alert } from "react-native";
import {
  useActiveMainActions,
  useActiveWorkoutStats,
} from "./use-active-workout-store";
import { useSaveWorkoutSession } from "./use-save-workout-session";
import { useUpdateRoutine } from "./use-update-routine";

export const useFinishWorkout = () => {
  const { clearWorkout } = useActiveMainActions();
  const { totalSetsCompleted, totalSetsPlanned } = useActiveWorkoutStats();
  const { detectWorkoutChanges } = useActiveMainActions();
  const { updateRoutine } = useUpdateRoutine();
  const { saveWorkoutSession } = useSaveWorkoutSession();

  const handleValidateWorkout = async () => {
    const changes = detectWorkoutChanges();

    if (!changes) {
      await saveWorkoutSession();
      clearWorkout();
      router.back();
    } else {
      Alert.alert(
        "Actualizar rutina",
        "¿Quieres guardar los cambios realizados en esta rutina para futuras sesiones?",
        [
          {
            text: "No",
            style: "cancel",
            onPress: async () => {
              await saveWorkoutSession();
              clearWorkout();
              router.back();
            },
          },
          {
            text: "Sí, guardar",
            style: "destructive",
            onPress: async () => {
              await updateRoutine();
              await saveWorkoutSession();
              clearWorkout();
              router.back();
            },
          },
        ]
      );
    }
  };

  const handleFinishWorkout = () => {
    if (totalSetsCompleted < totalSetsPlanned) {
      Alert.alert(
        "Confirmar",
        "Aún no has completado todos los sets planeados. ¿Estás seguro de que quieres finalizar el entrenamiento?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Sí, finalizar",
            style: "destructive",
            onPress: () => {
              handleValidateWorkout();
            },
          },
        ]
      );
    } else {
      handleValidateWorkout();
    }
  };

  const handleExitWorkout = () => {
    Alert.alert(
      "Confirmar",
      "Esto eliminará todo el progreso del entrenamiento. ¿Estás seguro?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, eliminar",
          style: "destructive",
          onPress: () => {
            clearWorkout();
            router.back();
          },
        },
      ]
    );
  };

  return { handleFinishWorkout, handleExitWorkout };
};
