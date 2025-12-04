import { BaseExercise } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseSelectorTranslations } from "@/shared/translations/exercise-selector";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { toSupportedLanguage } from "@/shared/types/language";
import { BlurView } from "expo-blur";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
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
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
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
      };
    }
    if (exerciseModalMode === "add-to-block") {
      return {
        title: sharedUiTranslations.addToSuperset[lang],
        subtitle: sharedUiTranslations.selectAnExercise[lang],
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
          : sharedUiTranslations.selectOneOrMoreExercises[lang],
    };
  };

  const headerContent = getHeaderContent();

  return (
    <BlurView
      intensity={Platform.OS === "ios" ? 80 : 0}
      tint={isDark ? "dark" : "light"}
      style={{
        paddingTop: 16,
        paddingBottom: 12,
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
          gap: 12,
        }}
      >
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.04)",
            alignItems: "center",
            justifyContent: "center",
          }}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={colors.text} />
        </TouchableOpacity>

        {/* Title Section */}
        <View style={{ flex: 1 }}>
          <Typography variant="h4" weight="bold">
            {headerContent.title}
          </Typography>
          <Typography
            variant="caption"
            color="textMuted"
            style={{ marginTop: 2 }}
            numberOfLines={1}
          >
            {headerContent.subtitle}
          </Typography>
        </View>

        {/* Selection Badge (if any) */}
        {selectedExercisesLength > 0 && exerciseModalMode === "add-new" && (
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              backgroundColor: colors.primary[500],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
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
