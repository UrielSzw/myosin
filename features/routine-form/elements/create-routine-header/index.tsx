import { ANALYTICS_QUERY_KEY } from "@/features/analytics/hooks/use-analytics-data";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert, View } from "react-native";
import {
  useMainActions,
  useRoutineFormState,
} from "../../hooks/use-routine-form-store";
import { useRoutineValidation } from "../../hooks/use-routine-validation";
import { useSaveRoutine } from "../../hooks/use-save-routine";

export const CreateRoutineHeader = () => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = routineFormTranslations;

  const { saveRoutine, isLoading, error } = useSaveRoutine();
  const { clearForm } = useMainActions();
  const { mode } = useRoutineFormState();
  const routineValidation = useRoutineValidation();
  const queryClient = useQueryClient();

  const isEditMode = mode === "edit";
  const canSave = routineValidation.isValid && !isLoading;

  const handleGoBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!routineValidation.isValid) {
      // Mostrar primer error encontrado
      const firstError = Object.values(routineValidation.errors)[0];
      Alert.alert(t.validationError[lang], firstError);
      return;
    }

    const savedRoutineId = await saveRoutine();

    if (savedRoutineId) {
      queryClient.invalidateQueries({
        queryKey: ["workouts", "routines"],
      });

      // Invalidar analíticas del dashboard
      queryClient.invalidateQueries({
        queryKey: ANALYTICS_QUERY_KEY,
      });

      clearForm();
      router.back();
    } else if (error) {
      Alert.alert(t.error[lang], error);
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return isEditMode ? t.updating[lang] : t.saving[lang];
    }
    return isEditMode ? t.update[lang] : t.save[lang];
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        zIndex: 1,
      }}
      accessible={true}
      accessibilityRole="toolbar"
      accessibilityLabel={t.routineNavBar[lang]}
    >
      <Button
        variant="ghost"
        size="sm"
        onPress={handleGoBack}
        accessible={true}
        accessibilityLabel={t.backAccessibility[lang]}
        accessibilityHint={t.backHint[lang]}
      >
        {t.back[lang]}
      </Button>

      <Typography
        variant="h6"
        weight="semibold"
        accessible={true}
        accessibilityRole="header"
      >
        {isEditMode ? t.editRoutine[lang] : t.createRoutine[lang]}
      </Typography>

      <Button
        variant="primary"
        size="sm"
        onPress={handleSave}
        disabled={!canSave}
        accessible={true}
        accessibilityLabel={getButtonText()}
        accessibilityHint={
          canSave
            ? t.saveHintEnabled[lang].replace(
                "{action}",
                isEditMode ? t.update[lang] : t.save[lang]
              )
            : t.saveHintDisabled[lang]
        }
        accessibilityState={{ disabled: !canSave }}
      >
        {getButtonText()}
      </Button>
    </View>
  );
};
