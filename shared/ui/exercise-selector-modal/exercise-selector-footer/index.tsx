import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseSelectorTranslations } from "@/shared/translations/exercise-selector";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button } from "../../button";
import { Typography } from "../../typography";

type Props = {
  exerciseModalMode?: "add-new" | "add-to-block" | "replace" | null;
  selectedExercisesLength: number;
  onAddMultiBlock: () => void;
  onAddAsIndividual: () => void;
  onAddToReplace: () => void;
  onAddToBlock: () => void;
};

export const ExerciseSelectorFooter: React.FC<Props> = ({
  exerciseModalMode,
  selectedExercisesLength,
  onAddMultiBlock,
  onAddAsIndividual,
  onAddToReplace,
  onAddToBlock,
}) => {
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = exerciseSelectorTranslations;
  const { colors, isDarkMode } = useColorScheme();

  // Animation for showing/hiding footer
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  const hasContent =
    (exerciseModalMode === "add-new" && selectedExercisesLength > 0) ||
    (exerciseModalMode === "replace" && selectedExercisesLength > 0) ||
    exerciseModalMode === "add-to-block";

  const timingConfig = {
    duration: 250,
    easing: Easing.out(Easing.cubic),
  };

  useEffect(() => {
    if (hasContent) {
      translateY.value = withTiming(0, timingConfig);
      opacity.value = withTiming(1, timingConfig);
    } else {
      translateY.value = withTiming(100, timingConfig);
      opacity.value = withTiming(0, timingConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasContent]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!hasContent) {
    return null;
  }

  const renderAddNewFooter = () => (
    <View style={{ gap: 10 }}>
      {/* Selection indicator */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          paddingBottom: 4,
        }}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: colors.primary[500],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption" weight="bold" color="white">
            {selectedExercisesLength}
          </Typography>
        </View>
        <Typography variant="body2" color="textMuted">
          {selectedExercisesLength === 1
            ? t.exerciseSelected?.[lang] || "ejercicio seleccionado"
            : t.exercisesSelected?.[lang] || "ejercicios seleccionados"}
        </Typography>
      </View>

      {/* Primary action - Superset if multiple */}
      {selectedExercisesLength > 1 && (
        <Button variant="primary" fullWidth onPress={onAddMultiBlock}>
          {t.addAsSuperset[lang]}
        </Button>
      )}

      {/* Secondary action */}
      <Button
        variant={selectedExercisesLength > 1 ? "outline" : "primary"}
        fullWidth
        onPress={onAddAsIndividual}
      >
        {selectedExercisesLength > 1
          ? t.addSeparately[lang]
          : t.addExercise[lang]}
      </Button>
    </View>
  );

  const renderReplaceFooter = () => (
    <Button variant="primary" fullWidth onPress={onAddToReplace}>
      {t.replaceExercise[lang]}
    </Button>
  );

  const renderAddToBlockFooter = () => (
    <Button variant="primary" fullWidth onPress={onAddToBlock}>
      {t.addToSuperset[lang]}
    </Button>
  );

  return (
    <Animated.View
      style={[
        {
          padding: 20,
          paddingBottom: 28,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
          // Subtle top shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDarkMode ? 0.3 : 0.08,
          shadowRadius: 8,
          elevation: 8,
        },
        animatedStyle,
      ]}
    >
      {exerciseModalMode === "add-new" && renderAddNewFooter()}
      {exerciseModalMode === "replace" && renderReplaceFooter()}
      {exerciseModalMode === "add-to-block" && renderAddToBlockFooter()}
    </Animated.View>
  );
};
