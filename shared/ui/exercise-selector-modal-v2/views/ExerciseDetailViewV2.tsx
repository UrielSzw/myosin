import { BaseExercise } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseSelectorTranslations } from "@/shared/translations/exercise-selector";
import { ExerciseDetail } from "@/shared/ui/exercise-detail";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { ChevronLeft, Info } from "lucide-react-native";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  exercise: BaseExercise;
  onClose: () => void;
};

export const ExerciseDetailViewV2: React.FC<Props> = ({
  exercise,
  onClose,
}) => {
  const { colors, colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = exerciseSelectorTranslations;

  const screenBg = isDark ? "rgba(10, 10, 12, 1)" : "rgba(250, 250, 252, 1)";
  const headerBg = isDark
    ? "rgba(20, 20, 25, 0.95)"
    : "rgba(255, 255, 255, 0.95)";

  return (
    <View style={{ flex: 1, backgroundColor: screenBg }}>
      {/* Premium Header */}
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
        <Animated.View
          entering={FadeInUp.duration(300)}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Back Button */}
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
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
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
                <Info size={16} color={colors.primary[500]} />
              </View>
              <Typography variant="h5" weight="bold">
                {t.exerciseDetail[lang]}
              </Typography>
            </View>
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginTop: 2, marginLeft: 36 }}
              numberOfLines={1}
            >
              {exercise.name}
            </Typography>
          </View>
        </Animated.View>
      </BlurView>

      {/* Content */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(100)}
        style={{ flex: 1 }}
      >
        <ExerciseDetail exercise={exercise} />
      </Animated.View>
    </View>
  );
};
