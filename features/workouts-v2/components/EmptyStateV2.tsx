import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutsTranslations as t } from "@/shared/translations/workouts";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import {
  Dumbbell,
  Flame,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const EmptyStateV2 = () => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  // Animation values
  const mainIconScale = useSharedValue(0);
  const pulseValue = useSharedValue(0);
  const floatValue = useSharedValue(0);
  const orbitsRotation = useSharedValue(0);
  const sparkle1Opacity = useSharedValue(0);
  const sparkle2Opacity = useSharedValue(0);
  const sparkle3Opacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // Main icon entrance with spring
    mainIconScale.value = withDelay(
      200,
      withSpring(1, { damping: 12, stiffness: 100 })
    );

    // Pulse animation for outer ring - smooth breathing effect
    pulseValue.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true // reverse: true makes it go 0→1→0→1 smoothly without jumps
    );

    // Floating animation
    floatValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    // Orbits rotation
    orbitsRotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );

    // Sparkles staggered animation
    sparkle1Opacity.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      )
    );

    sparkle2Opacity.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1200 }),
          withTiming(0.3, { duration: 1200 })
        ),
        -1,
        true
      )
    );

    sparkle3Opacity.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1,
        true
      )
    );
  }, []);

  const mainIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mainIconScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseValue.value, [0, 1], [0.2, 0.5]),
    transform: [{ scale: interpolate(pulseValue.value, [0, 1], [1, 1.3]) }],
  }));

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatValue.value, [0, 1], [0, -12]) },
    ],
  }));

  const orbitsStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbitsRotation.value}deg` }],
  }));

  const sparkle1Style = useAnimatedStyle(() => ({
    opacity: sparkle1Opacity.value,
    transform: [{ scale: sparkle1Opacity.value }],
  }));

  const sparkle2Style = useAnimatedStyle(() => ({
    opacity: sparkle2Opacity.value,
    transform: [{ scale: sparkle2Opacity.value }],
  }));

  const sparkle3Style = useAnimatedStyle(() => ({
    opacity: sparkle3Opacity.value,
    transform: [{ scale: sparkle3Opacity.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleCreateRoutine = () => {
    buttonScale.value = withSpring(0.95, { damping: 15 }, () => {
      buttonScale.value = withSpring(1);
    });
    router.push("/routines/create" as any);
  };

  return (
    <View style={styles.container}>
      {/* Hero Illustration */}
      <Animated.View
        entering={FadeIn.duration(600)}
        style={[styles.illustrationContainer, floatingStyle]}
      >
        {/* Pulsing outer glow */}
        <Animated.View
          style={[
            styles.pulseRing,
            { backgroundColor: colors.primary[500] },
            pulseStyle,
          ]}
        />

        {/* Orbiting elements */}
        <Animated.View style={[styles.orbitsContainer, orbitsStyle]}>
          <View
            style={[
              styles.orbitDot,
              styles.orbitDot1,
              { backgroundColor: colors.primary[400] },
            ]}
          />
          <View
            style={[
              styles.orbitDot,
              styles.orbitDot2,
              { backgroundColor: colors.secondary[500] },
            ]}
          />
          <View
            style={[
              styles.orbitDot,
              styles.orbitDot3,
              { backgroundColor: colors.success[500] },
            ]}
          />
        </Animated.View>

        {/* Main icon circle */}
        <Animated.View style={[styles.mainIconWrapper, mainIconStyle]}>
          <View
            style={[
              styles.iconOuterCircle,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(255,255,255,0.9)",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
          >
            {Platform.OS === "ios" && (
              <BlurView
                intensity={isDarkMode ? 30 : 50}
                tint={isDarkMode ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            )}
            <View
              style={[
                styles.iconInnerCircle,
                { backgroundColor: `${colors.primary[500]}20` },
              ]}
            >
              <Dumbbell
                size={48}
                color={colors.primary[500]}
                strokeWidth={1.8}
              />
            </View>
          </View>

          {/* Achievement badge */}
          <Animated.View
            entering={FadeIn.delay(500).duration(400)}
            style={[
              styles.achievementBadge,
              { backgroundColor: colors.success[500] },
            ]}
          >
            <Zap size={14} color="#fff" fill="#fff" />
          </Animated.View>
        </Animated.View>

        {/* Floating sparkles */}
        <Animated.View style={[styles.sparkle, styles.sparkle1, sparkle1Style]}>
          <Sparkles size={18} color={colors.primary[400]} />
        </Animated.View>
        <Animated.View style={[styles.sparkle, styles.sparkle2, sparkle2Style]}>
          <Flame size={16} color={colors.warning[500]} />
        </Animated.View>
        <Animated.View style={[styles.sparkle, styles.sparkle3, sparkle3Style]}>
          <Target size={14} color={colors.secondary[500]} />
        </Animated.View>
      </Animated.View>

      {/* Text Content */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(500)}
        style={styles.textContent}
      >
        <Typography
          variant="h2"
          weight="bold"
          align="center"
          style={{ color: colors.text }}
        >
          {t.emptyStateTitle[lang]}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          style={{ color: colors.textMuted, marginTop: 12, lineHeight: 26 }}
        >
          {t.emptyStateSubtitle[lang]}
        </Typography>
      </Animated.View>

      {/* Feature Pills */}
      <Animated.View
        entering={FadeInUp.delay(450).duration(500)}
        style={styles.featurePills}
      >
        <View
          style={[
            styles.featurePill,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)",
            },
          ]}
        >
          <TrendingUp size={14} color={colors.success[500]} />
          <Typography
            variant="caption"
            style={{ color: colors.textMuted, marginLeft: 6 }}
          >
            {lang === "es" ? "Trackea tu progreso" : "Track your progress"}
          </Typography>
        </View>
        <View
          style={[
            styles.featurePill,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)",
            },
          ]}
        >
          <Target size={14} color={colors.primary[500]} />
          <Typography
            variant="caption"
            style={{ color: colors.textMuted, marginLeft: 6 }}
          >
            {lang === "es" ? "Alcanza tus metas" : "Reach your goals"}
          </Typography>
        </View>
      </Animated.View>

      {/* CTA Button */}
      <Animated.View
        entering={FadeInUp.delay(600).duration(500)}
        style={styles.ctaContainer}
      >
        <View
          style={[styles.ctaGlow, { backgroundColor: colors.primary[500] }]}
        />
        <Animated.View style={buttonAnimatedStyle}>
          <Pressable
            onPress={handleCreateRoutine}
            style={({ pressed }) => [
              styles.ctaButton,
              {
                backgroundColor: colors.primary[500],
                opacity: pressed ? 0.95 : 1,
              },
            ]}
          >
            <View style={styles.ctaIconContainer}>
              <Plus size={22} color="#fff" strokeWidth={2.5} />
            </View>
            <Typography variant="body1" weight="bold" style={{ color: "#fff" }}>
              {t.createRoutineLabel[lang]}
            </Typography>
            <Sparkles
              size={18}
              color="rgba(255,255,255,0.6)"
              style={{ marginLeft: 8 }}
            />
          </Pressable>
        </Animated.View>
      </Animated.View>

      {/* Hint text */}
      <Animated.View entering={FadeIn.delay(800).duration(400)}>
        <Typography
          variant="caption"
          align="center"
          color="textMuted"
          style={{ marginTop: 20, opacity: 0.6 }}
        >
          {t.emptyStateHint[lang]}
        </Typography>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: SCREEN_HEIGHT * 0.05,
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    width: 200,
    height: 200,
  },
  pulseRing: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  orbitsContainer: {
    position: "absolute",
    width: 180,
    height: 180,
  },
  orbitDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  orbitDot1: {
    top: 0,
    left: "50%",
    marginLeft: -5,
  },
  orbitDot2: {
    bottom: 20,
    left: 10,
  },
  orbitDot3: {
    bottom: 20,
    right: 10,
  },
  mainIconWrapper: {
    position: "relative",
  },
  iconOuterCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  iconInnerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  sparkle: {
    position: "absolute",
  },
  sparkle1: {
    top: 10,
    right: 10,
  },
  sparkle2: {
    bottom: 30,
    left: 5,
  },
  sparkle3: {
    top: 40,
    left: 15,
  },
  textContent: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  featurePills: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ctaContainer: {
    position: "relative",
    width: "100%",
  },
  ctaGlow: {
    position: "absolute",
    top: 10,
    left: 16,
    right: 16,
    bottom: -6,
    borderRadius: 18,
    opacity: 0.25,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 18,
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  ctaIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});
