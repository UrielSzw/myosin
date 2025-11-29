import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { activeWorkoutTranslations } from "@/shared/translations/active-workout";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Plus } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  onPress: () => void;
  blocksCount: number;
};

export const AddExerciseButtonV2: React.FC<Props> = ({
  onPress,
  blocksCount,
}) => {
  const { isDarkMode, colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = activeWorkoutTranslations;

  return (
    <Animated.View
      entering={FadeInDown.delay(blocksCount * 100 + 100).duration(400)}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      >
        <BlurView
          intensity={isDarkMode ? 20 : 15}
          tint={isDarkMode ? "dark" : "light"}
          style={[
            styles.button,
            {
              borderColor: colors.primary[500],
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${colors.primary[500]}15`,
              },
            ]}
          >
            <Plus size={18} color={colors.primary[500]} strokeWidth={2.5} />
          </View>
          <Typography
            variant="body2"
            weight="semibold"
            style={{ color: colors.primary[500] }}
          >
            {t.addExercise[lang]}
          </Typography>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    marginBottom: 16,
    overflow: "hidden",
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
