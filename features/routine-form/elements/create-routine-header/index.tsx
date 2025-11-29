import { ANALYTICS_QUERY_KEY } from "@/features/analytics/hooks/use-analytics-data";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import { Typography } from "@/shared/ui/typography";
import { useQueryClient } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useMainActions,
  useRoutineFormState,
} from "../../hooks/use-routine-form-store";
import { useRoutineValidation } from "../../hooks/use-routine-validation";
import { useSaveRoutine } from "../../hooks/use-save-routine";

export const CreateRoutineHeader = () => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = routineFormTranslations;
  const insets = useSafeAreaInsets();

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
      const firstError = Object.values(routineValidation.errors)[0];
      Alert.alert(t.validationError[lang], firstError);
      return;
    }

    const savedRoutineId = await saveRoutine();

    if (savedRoutineId) {
      queryClient.invalidateQueries({
        queryKey: ["workouts", "routines"],
      });

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
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: isDarkMode
            ? "rgba(10, 10, 15, 0.8)"
            : "rgba(255, 255, 255, 0.85)",
        },
      ]}
    >
      {Platform.OS === "ios" && (
        <BlurView
          intensity={isDarkMode ? 30 : 50}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}

      <View style={styles.content}>
        {/* Back Button */}
        <Pressable
          onPress={handleGoBack}
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.05)",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          accessible={true}
          accessibilityLabel={t.backAccessibility[lang]}
          accessibilityHint={t.backHint[lang]}
        >
          <ChevronLeft size={22} color={colors.text} />
        </Pressable>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Typography
            variant="body1"
            weight="bold"
            accessible={true}
            accessibilityRole="header"
            numberOfLines={1}
          >
            {isEditMode ? t.editRoutine[lang] : t.createRoutine[lang]}
          </Typography>
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          style={({ pressed }) => [
            styles.saveButton,
            {
              backgroundColor: canSave
                ? colors.primary[500]
                : isDarkMode
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.08)",
              opacity: pressed && canSave ? 0.8 : 1,
              transform: [{ scale: pressed && canSave ? 0.96 : 1 }],
            },
          ]}
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
          <Typography
            variant="body2"
            weight="semibold"
            style={{
              color: canSave ? "#fff" : colors.textMuted,
            }}
          >
            {getButtonText()}
          </Typography>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  saveButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
});
