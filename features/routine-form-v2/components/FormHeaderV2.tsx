import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { queryKeys } from "@/shared/queries/query-keys";
import { useHaptic } from "@/shared/services/haptic-service";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import { Typography } from "@/shared/ui/typography";
import { useQueryClient } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { AlertCircle, Check, ChevronLeft, Loader2 } from "lucide-react-native";
import React, { useEffect } from "react";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useMainActions,
  useRoutineFormState,
} from "../hooks/use-routine-form-store";
import { useRoutineValidation } from "../hooks/use-routine-validation";
import { useSaveRoutine } from "../hooks/use-save-routine";

export const FormHeaderV2: React.FC = () => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const t = routineFormTranslations;
  const insets = useSafeAreaInsets();
  const haptic = useHaptic();

  const { saveRoutine, isLoading, error } = useSaveRoutine();
  const { clearForm } = useMainActions();
  const { mode } = useRoutineFormState();
  const routineValidation = useRoutineValidation();
  const queryClient = useQueryClient();

  const isEditMode = mode === "edit";
  const canSave = routineValidation.isValid && !isLoading;

  // Loading spinner animation
  const spinValue = useSharedValue(0);

  useEffect(() => {
    if (isLoading) {
      spinValue.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      spinValue.value = 0;
    }
  }, [isLoading, spinValue]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinValue.value}deg` }],
  }));

  const handleGoBack = () => {
    haptic.light();
    router.back();
  };

  const handleSave = async () => {
    if (!routineValidation.isValid) {
      haptic.warning();
      const firstError = Object.values(routineValidation.errors)[0];
      Alert.alert(t.validationError[lang], firstError);
      return;
    }

    haptic.medium();
    const savedRoutineId = await saveRoutine();

    if (savedRoutineId) {
      haptic.success();
      queryClient.invalidateQueries({ queryKey: queryKeys.workouts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
      clearForm();
      router.back();
    } else if (error) {
      haptic.error();
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
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          borderBottomColor: isDarkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.05)",
        },
      ]}
    >
      {/* Transparent blur background - like PRListHeaderV2 */}
      {Platform.OS === "ios" && (
        <BlurView
          intensity={isDarkMode ? 25 : 40}
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
                : "rgba(0,0,0,0.04)",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <ChevronLeft size={20} color={colors.text} />
        </Pressable>

        {/* Title - aligned left like PRListHeaderV2 */}
        <View style={styles.titleContainer}>
          <Typography variant="h4" weight="bold" style={{ color: colors.text }}>
            {isEditMode ? t.editRoutine[lang] : t.createRoutine[lang]}
          </Typography>
        </View>

        {/* Validation badge - separate from title */}
        {!routineValidation.isValid && (
          <Animated.View
            entering={FadeIn.duration(200)}
            style={[
              styles.validationBadge,
              { backgroundColor: `${colors.warning[500]}15` },
            ]}
          >
            <AlertCircle size={12} color={colors.warning[500]} />
            <Typography
              variant="caption"
              weight="semibold"
              style={{
                color: colors.warning[500],
                marginLeft: 4,
              }}
            >
              {Object.keys(routineValidation.errors).length}
            </Typography>
          </Animated.View>
        )}

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
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.04)",
              opacity: canSave ? (pressed ? 0.85 : 1) : 0.5,
            },
          ]}
        >
          {/* Button content */}
          <View style={styles.saveButtonContent}>
            {isLoading ? (
              <Animated.View style={spinStyle}>
                <Loader2 size={16} color="#fff" />
              </Animated.View>
            ) : canSave ? (
              <Check size={16} color="#fff" />
            ) : null}
            <Typography
              variant="body2"
              weight="semibold"
              style={{
                color: canSave ? "#fff" : colors.textMuted,
                marginLeft: isLoading || canSave ? 6 : 0,
              }}
            >
              {getButtonText()}
            </Typography>
          </View>
        </Pressable>
      </View>
    </Animated.View>
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
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
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
  },
  validationBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
