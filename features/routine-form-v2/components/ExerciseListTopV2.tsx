import { useMainActions } from "@/features/routine-form/hooks/use-routine-form-store";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Dumbbell, Plus } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  exercisesCount: number;
};

export const ExerciseListTopV2: React.FC<Props> = ({ exercisesCount }) => {
  const { isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const t = routineFormTranslations;
  const { setIsExerciseModalOpen, setExerciseModalMode } = useMainActions();

  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleOpenModal = () => {
    buttonScale.value = withSpring(0.95, { damping: 15 }, () => {
      buttonScale.value = withSpring(1);
    });
    setIsExerciseModalOpen(true);
    setExerciseModalMode("add-new");
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      {/* Left side - Count badge */}
      <View style={styles.countContainer}>
        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: isDarkMode
                ? "rgba(6, 182, 212, 0.15)"
                : "rgba(6, 182, 212, 0.1)",
            },
          ]}
        >
          <Dumbbell size={14} color="#06B6D4" />
          <Typography
            variant="body2"
            weight="bold"
            style={{ color: "#06B6D4" }}
          >
            {exercisesCount}
          </Typography>
        </View>
        <Typography variant="body2" weight="semibold" color="textMuted">
          {exercisesCount === 1
            ? lang === "es"
              ? "ejercicio"
              : "exercise"
            : lang === "es"
            ? "ejercicios"
            : "exercises"}
        </Typography>
      </View>

      {/* Right side - Add button */}
      <Animated.View style={buttonAnimatedStyle}>
        <Pressable
          onPress={handleOpenModal}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        >
          <BlurView
            intensity={isDarkMode ? 15 : 10}
            tint={isDarkMode ? "dark" : "light"}
            style={[
              styles.addButton,
              {
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.08)",
              },
            ]}
          >
            <Plus size={16} color="#06B6D4" />
            <Typography
              variant="caption"
              weight="semibold"
              style={{ color: "#06B6D4" }}
            >
              {t.addExercise[lang]}
            </Typography>
          </BlurView>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
});
