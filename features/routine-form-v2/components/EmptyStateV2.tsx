import { toSupportedLanguage } from "@/shared/types/language";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Dumbbell, Plus, Sparkles } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  onAddExercise: () => void;
};

export const EmptyStateV2: React.FC<Props> = ({ onAddExercise }) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  // Animation values
  const iconScale = useSharedValue(1);
  const sparkleOpacity = useSharedValue(0.4);
  const buttonScale = useSharedValue(1);

  // Start animations
  React.useEffect(() => {
    // Gentle floating animation for icon
    iconScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      true
    );

    // Sparkle fade animation
    sparkleOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.4, { duration: 1500 })
      ),
      -1,
      true
    );
  }, [iconScale, sparkleOpacity]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const sparkle1Style = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
  }));

  const sparkle2Style = useAnimatedStyle(() => ({
    opacity: 1 - sparkleOpacity.value + 0.4,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePress = () => {
    buttonScale.value = withSpring(0.95, { damping: 15 }, () => {
      buttonScale.value = withSpring(1);
    });
    onAddExercise();
  };

  const content = {
    es: {
      title: "¡Empieza a crear!",
      subtitle: "Agrega ejercicios para diseñar tu rutina perfecta",
      button: "Agregar ejercicio",
    },
    en: {
      title: "Start building!",
      subtitle: "Add exercises to design your perfect routine",
      button: "Add exercise",
    },
  };

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <BlurView
        intensity={isDarkMode ? 25 : 20}
        tint={isDarkMode ? "dark" : "light"}
        style={[
          styles.card,
          {
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        {/* Icon Container */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          style={[styles.iconContainer, iconAnimatedStyle]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: `${colors.primary[500]}15`,
              },
            ]}
          >
            <View
              style={[
                styles.iconInnerCircle,
                {
                  backgroundColor: `${colors.primary[500]}20`,
                },
              ]}
            >
              <Dumbbell size={32} color={colors.primary[500]} />
            </View>
          </View>

          {/* Floating sparkles */}
          <Animated.View style={[styles.sparkle1, sparkle1Style]}>
            <Sparkles size={16} color={colors.primary[500]} />
          </Animated.View>
          <Animated.View style={[styles.sparkle2, sparkle2Style]}>
            <Sparkles size={12} color={colors.primary[400]} />
          </Animated.View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(500)}
          style={styles.textContainer}
        >
          <Typography variant="h4" weight="bold" style={styles.title}>
            {content[lang].title}
          </Typography>
          <Typography variant="body2" color="textMuted" style={styles.subtitle}>
            {content[lang].subtitle}
          </Typography>
        </Animated.View>

        {/* Add Button */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(500)}
          style={[styles.buttonContainer, buttonAnimatedStyle]}
        >
          <Pressable
            onPress={handlePress}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          >
            <View
              style={[styles.button, { backgroundColor: colors.primary[500] }]}
            >
              <Plus size={18} color="#FFFFFF" />
              <Typography
                variant="body2"
                weight="semibold"
                style={{ color: "#FFFFFF" }}
              >
                {content[lang].button}
              </Typography>
            </View>
          </Pressable>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  card: {
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    overflow: "hidden",
  },
  iconContainer: {
    position: "relative",
    marginBottom: 20,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  iconInnerCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkle1: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  sparkle2: {
    position: "absolute",
    bottom: 10,
    left: 0,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 20,
  },
  buttonContainer: {},
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
});
