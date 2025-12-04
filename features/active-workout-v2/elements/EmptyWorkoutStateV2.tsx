import { toSupportedLanguage } from "@/shared/types/language";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { activeWorkoutTranslations } from "@/shared/translations/active-workout";
import { Typography } from "@/shared/ui/typography";
import { Dumbbell, Plus, Zap } from "lucide-react-native";
import React, { useEffect } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
// Approximate header height + safe area + some padding
const HEADER_OFFSET = 140;

type Props = {
  onAddExercise: () => void;
};

export const EmptyWorkoutStateV2: React.FC<Props> = ({ onAddExercise }) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = activeWorkoutTranslations;

  // Animation values
  const pulseValue = useSharedValue(0);
  const floatValue = useSharedValue(0);

  useEffect(() => {
    // Pulse animation for the ring
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    // Floating animation
    floatValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, [pulseValue, floatValue]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseValue.value, [0, 1], [0.3, 0.6]),
    transform: [{ scale: interpolate(pulseValue.value, [0, 1], [1, 1.15]) }],
  }));

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(floatValue.value, [0, 1], [0, -8]) }],
  }));

  return (
    <View style={styles.container}>
      {/* Animated Illustration */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(500).springify()}
        style={[styles.illustrationContainer, floatingStyle]}
      >
        <View style={styles.illustrationWrapper}>
          {/* Pulsing outer ring */}
          <Animated.View
            style={[
              styles.pulseRing,
              { backgroundColor: `${colors.primary[500]}15` },
              pulseStyle,
            ]}
          />

          {/* Main circle with icon */}
          <View
            style={[
              styles.mainCircle,
              {
                backgroundColor: `${colors.primary[500]}20`,
                borderColor: `${colors.primary[500]}30`,
              },
            ]}
          >
            <View
              style={[
                styles.innerCircle,
                { backgroundColor: `${colors.primary[500]}30` },
              ]}
            >
              <Dumbbell size={36} color={colors.primary[500]} strokeWidth={2} />
            </View>
          </View>

          {/* Decorative element */}
          <Animated.View
            entering={FadeIn.delay(400).duration(400)}
            style={[
              styles.decorativeBadge,
              { backgroundColor: colors.success[500] },
            ]}
          >
            <Zap size={14} color="#fff" fill="#fff" />
          </Animated.View>
        </View>
      </Animated.View>

      {/* Text content */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(500)}
        style={styles.textContainer}
      >
        <Typography
          variant="h5"
          weight="bold"
          align="center"
          style={{ marginBottom: 12 }}
        >
          {t.emptyWorkoutTitle[lang]}
        </Typography>

        <Typography
          variant="body2"
          color="textMuted"
          align="center"
          style={styles.subtitle}
        >
          {t.emptyWorkoutSubtitle[lang]}
        </Typography>
      </Animated.View>

      {/* CTA Button */}
      <Animated.View entering={FadeInUp.delay(500).duration(500)}>
        <Pressable
          onPress={onAddExercise}
          style={({ pressed }) => [
            styles.ctaButton,
            {
              backgroundColor: colors.primary[500],
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
        >
          <Plus size={22} color="#fff" strokeWidth={2.5} />
          <Typography
            variant="body1"
            weight="semibold"
            style={{ color: "#fff" }}
          >
            {t.emptyWorkoutCTA[lang]}
          </Typography>
        </Pressable>
      </Animated.View>

      {/* Hint text */}
      <Animated.View entering={FadeIn.delay(700).duration(400)}>
        <Typography
          variant="caption"
          color="textMuted"
          align="center"
          style={styles.hintText}
        >
          {t.emptyWorkoutHint[lang]}
        </Typography>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: SCREEN_HEIGHT - HEADER_OFFSET - 150, // 150 for bottom spacer/tabbar
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  illustrationContainer: {
    marginBottom: 32,
  },
  illustrationWrapper: {
    position: "relative",
    alignItems: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  mainCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  innerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  decorativeBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    borderRadius: 14,
    padding: 8,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  subtitle: {
    lineHeight: 22,
    maxWidth: 280,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 10,
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  hintText: {
    marginTop: 20,
    opacity: 0.7,
  },
});
