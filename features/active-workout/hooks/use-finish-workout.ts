import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { activeWorkoutTranslations } from "@/shared/translations/active-workout";
import { router } from "expo-router";
import { Alert } from "react-native";
import {
  useActiveMainActions,
  useActiveWorkoutStats,
} from "./use-active-workout-store";
import { useSaveWorkoutSession } from "./use-save-workout-session";
import { useUpdateRoutine } from "./use-update-routine";

export const useFinishWorkout = () => {
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = activeWorkoutTranslations;
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
      Alert.alert(t.updateRoutineTitle[lang], t.updateRoutineMessage[lang], [
        {
          text: t.no[lang],
          style: "cancel",
          onPress: async () => {
            await saveWorkoutSession();
            clearWorkout();
            router.back();
          },
        },
        {
          text: t.yesSave[lang],
          style: "destructive",
          onPress: async () => {
            await updateRoutine();
            await saveWorkoutSession();
            clearWorkout();
            router.back();
          },
        },
      ]);
    }
  };

  const handleFinishWorkout = () => {
    if (totalSetsCompleted < totalSetsPlanned) {
      Alert.alert(t.confirmTitle[lang], t.incompleteSetsMessage[lang], [
        { text: t.no[lang], style: "cancel" },
        {
          text: t.yesFinish[lang],
          style: "destructive",
          onPress: () => {
            handleValidateWorkout();
          },
        },
      ]);
    } else {
      handleValidateWorkout();
    }
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

  return { handleFinishWorkout, handleExitWorkout };
};
