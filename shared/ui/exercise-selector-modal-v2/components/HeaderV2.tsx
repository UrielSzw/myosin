import { BaseExercise } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseSelectorTranslations } from "@/shared/translations/exercise-selector";
import { BlurView } from "expo-blur";
import { ChevronLeft, Dumbbell, RotateCcw } from "lucide-react-native";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "../../typography";

type Props = {
  onClose: () => void;
  selectedExercises: Record<string, BaseExercise>;
  selectedExercisesLength: number;
  exerciseModalMode?: "add-new" | "add-to-block" | "replace" | null;
  exerciseToReplace?: BaseExercise | null;
};

export const HeaderV2: React.FC<Props> = ({
  onClose,
  selectedExercises,
  selectedExercisesLength,
  exerciseModalMode,
  exerciseToReplace,
}) => {
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = exerciseSelectorTranslations;
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const headerBg = isDark
    ? "rgba(20, 20, 25, 0.95)"
    : "rgba(255, 255, 255, 0.95)";

  // Determine title and subtitle based on mode
  const getHeaderContent = () => {
    if (exerciseModalMode === "replace") {
      return {
        title: t.replace[lang],
        subtitle: exerciseToReplace?.name || t.selectExerciseToReplace[lang],
        icon: <RotateCcw size={20} color={colors.primary[500]} />,
      };
    }
    if (exerciseModalMode === "add-to-block") {
      return {
        title: lang === "es" ? "Agregar al Superset" : "Add to Superset",
        subtitle:
          lang === "es" ? "Selecciona un ejercicio" : "Select an exercise",
        icon: <Dumbbell size={20} color={colors.primary[500]} />,
      };
    }
    return {
      title: t.selectExercises[lang],
      subtitle:
        selectedExercisesLength > 0
          ? `${selectedExercisesLength} ${
              selectedExercisesLength === 1
                ? t.exerciseSelected[lang]
                : t.exercisesSelected[lang]
            }`
          : lang === "es"
          ? "Selecciona uno o más ejercicios"
          : "Select one or more exercises",
      icon: <Dumbbell size={20} color={colors.primary[500]} />,
    };
  };

  const headerContent = getHeaderContent();

  return (
    <BlurView
      intensity={Platform.OS === "ios" ? 80 : 0}
      tint={isDark ? "dark" : "light"}
      style={{
        paddingTop: insets.top + 8,
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: Platform.OS === "android" ? headerBg : "transparent",
        borderBottomWidth: 1,
        borderBottomColor: isDark
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(0, 0, 0, 0.05)",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.05)",
            alignItems: "center",
            justifyContent: "center",
          }}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>

        {/* Title Section */}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: colors.primary[500] + "20",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {headerContent.icon}
            </View>
            <Typography variant="h5" weight="bold">
              {headerContent.title}
            </Typography>
          </View>
          <Typography
            variant="caption"
            color="textMuted"
            style={{ marginTop: 2, marginLeft: 36 }}
            numberOfLines={1}
          >
            {headerContent.subtitle}
          </Typography>
        </View>

        {/* Selection Badge (if any) */}
        {selectedExercisesLength > 0 && exerciseModalMode === "add-new" && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.primary[500],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body2"
              weight="bold"
              style={{ color: "#FFFFFF" }}
            >
              {selectedExercisesLength}
            </Typography>
          </View>
        )}
      </View>
    </BlurView>
  );
};
