import { toSupportedLanguage } from "@/shared/types/language";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Plus, Sparkles } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  onPress: () => void;
  isFirstExercise?: boolean;
};

export const AddExerciseButtonV2: React.FC<Props> = ({
  onPress,
  isFirstExercise = false,
}) => {
  const { isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.97, { damping: 15 }, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  const content = {
    es: {
      add: "Agregar ejercicio",
      addFirst: "Agregar primer ejercicio",
    },
    en: {
      add: "Add exercise",
      addFirst: "Add first exercise",
    },
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      style={[styles.container, animatedStyle]}
    >
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
      >
        <BlurView
          intensity={isDarkMode ? 20 : 15}
          tint={isDarkMode ? "dark" : "light"}
          style={[
            styles.button,
            {
              borderColor: isDarkMode
                ? "rgba(6, 182, 212, 0.3)"
                : "rgba(6, 182, 212, 0.2)",
              backgroundColor: isDarkMode
                ? "rgba(6, 182, 212, 0.08)"
                : "rgba(6, 182, 212, 0.05)",
            },
          ]}
        >
          {/* Decorative gradient bar on left */}
          <View style={[styles.gradientBar, { backgroundColor: "#06B6D4" }]} />

          {/* Content */}
          <View style={styles.content}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(6, 182, 212, 0.2)"
                    : "rgba(6, 182, 212, 0.15)",
                },
              ]}
            >
              <Plus size={18} color="#06B6D4" />
            </View>

            <Typography
              variant="body2"
              weight="semibold"
              style={{ color: "#06B6D4" }}
            >
              {isFirstExercise ? content[lang].addFirst : content[lang].add}
            </Typography>

            {isFirstExercise && (
              <Sparkles size={14} color="#06B6D4" style={{ marginLeft: 4 }} />
            )}
          </View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 16,
    overflow: "hidden",
  },
  gradientBar: {
    width: 4,
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
