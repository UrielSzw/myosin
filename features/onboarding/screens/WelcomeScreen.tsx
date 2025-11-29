import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Button } from "@/shared/ui/button";
import { Logo } from "@/shared/ui/logo";
import { Typography } from "@/shared/ui/typography";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Sparkles } from "lucide-react-native";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { onboardingTranslations, useOnboardingStore } from "../hooks";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Floating Orb Component
const FloatingOrb = ({
  size,
  color,
  initialX,
  initialY,
  delay = 0,
}: {
  size: number;
  color: string;
  initialX: number;
  initialY: number;
  delay?: number;
}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const startAnimation = () => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-25, {
            duration: 3500 + delay,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(25, {
            duration: 3500 + delay,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        true
      );
      translateX.value = withRepeat(
        withSequence(
          withTiming(20, {
            duration: 4500 + delay,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(-20, {
            duration: 4500 + delay,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        true
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, {
            duration: 3000 + delay,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(0.85, {
            duration: 3000 + delay,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        true
      );
    };

    const timeout = setTimeout(startAnimation, delay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: initialX,
          top: initialY,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

// Glowing Logo Component
const GlowingLogo = ({ size }: { size: number }) => {
  const { colors } = useColorScheme();
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: size * 2.5,
            height: size * 2.5,
            borderRadius: size * 1.25,
            backgroundColor: colors.primary[500],
          },
          glowStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            position: "absolute",
            width: size * 1.8,
            height: size * 1.8,
            borderRadius: size * 0.9,
            backgroundColor: colors.primary[400],
          },
          glowStyle,
        ]}
      />
      <Logo size={size} animated />
    </View>
  );
};

export default function WelcomeScreen() {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = onboardingTranslations.welcome;
  const { nextStep, reset } = useOnboardingStore();

  // Aurora animation
  const auroraPosition = useSharedValue(0);

  useEffect(() => {
    // Reset store when entering welcome
    reset();

    auroraPosition.value = withRepeat(
      withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const auroraStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(auroraPosition.value, [0, 1], [-60, 60]) },
      { translateY: interpolate(auroraPosition.value, [0, 1], [-40, 40]) },
    ],
  }));

  const handleStart = () => {
    nextStep();
    router.push("/onboarding/sex" as any);
  };

  return (
    <View style={styles.container}>
      {/* Aurora Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={
            isDarkMode
              ? ["#030508", "#0a1525", "#0d1a30", "#030508"]
              : ["#f0f9ff", "#e0f2fe", "#bae6fd", "#f0f9ff"]
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Animated Aurora */}
        <Animated.View style={[StyleSheet.absoluteFill, auroraStyle]}>
          <LinearGradient
            colors={[
              "transparent",
              isDarkMode
                ? "rgba(14, 165, 233, 0.12)"
                : "rgba(14, 165, 233, 0.2)",
              isDarkMode
                ? "rgba(56, 189, 248, 0.08)"
                : "rgba(56, 189, 248, 0.15)",
              "transparent",
            ]}
            style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.8 }] }]}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 1, y: 0.8 }}
          />
        </Animated.View>

        {/* Floating Orbs */}
        <FloatingOrb
          size={220}
          color={
            isDarkMode ? "rgba(14, 165, 233, 0.08)" : "rgba(14, 165, 233, 0.12)"
          }
          initialX={-80}
          initialY={SCREEN_HEIGHT * 0.08}
          delay={0}
        />
        <FloatingOrb
          size={160}
          color={
            isDarkMode ? "rgba(56, 189, 248, 0.06)" : "rgba(56, 189, 248, 0.1)"
          }
          initialX={SCREEN_WIDTH - 60}
          initialY={SCREEN_HEIGHT * 0.3}
          delay={600}
        />
        <FloatingOrb
          size={120}
          color={
            isDarkMode ? "rgba(14, 165, 233, 0.07)" : "rgba(14, 165, 233, 0.1)"
          }
          initialX={SCREEN_WIDTH * 0.15}
          initialY={SCREEN_HEIGHT * 0.65}
          delay={1200}
        />
        <FloatingOrb
          size={90}
          color={
            isDarkMode ? "rgba(56, 189, 248, 0.05)" : "rgba(56, 189, 248, 0.08)"
          }
          initialX={SCREEN_WIDTH * 0.7}
          initialY={SCREEN_HEIGHT * 0.75}
          delay={800}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Animated.View
              entering={FadeIn.delay(200).duration(800)}
              style={styles.logoContainer}
            >
              <GlowingLogo size={100} />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(600)}>
              <Typography
                variant="body1"
                weight="medium"
                align="center"
                style={{ color: colors.textMuted, marginTop: 32 }}
              >
                {t.title[lang]}
              </Typography>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500).duration(600)}>
              <Typography
                variant="h1"
                weight="bold"
                align="center"
                style={[styles.brandName, { color: colors.text }]}
              >
                MYOSIN
              </Typography>
            </Animated.View>
          </View>

          {/* Description Section */}
          <Animated.View
            entering={FadeInDown.delay(700).duration(600)}
            style={styles.descriptionSection}
          >
            <View style={styles.sparkleContainer}>
              <Sparkles size={20} color={colors.primary[500]} />
            </View>
            <Typography
              variant="h4"
              weight="semibold"
              align="center"
              style={{ color: colors.text }}
            >
              {t.subtitle[lang]}
            </Typography>
            <Typography
              variant="body1"
              align="center"
              style={{ color: colors.textMuted, marginTop: 12, lineHeight: 24 }}
            >
              {t.description[lang]}
            </Typography>
          </Animated.View>

          {/* CTA Section */}
          <Animated.View
            entering={FadeInDown.delay(900).duration(600)}
            style={styles.ctaSection}
          >
            <View style={styles.ctaContainer}>
              <View
                style={[
                  styles.ctaGlow,
                  { backgroundColor: colors.primary[500] },
                ]}
              />
              <Button
                onPress={handleStart}
                size="lg"
                style={styles.startButton}
              >
                {t.button[lang]}
              </Button>
            </View>

            {/* Progress Indicator Preview */}
            <View style={styles.stepsPreview}>
              <Typography variant="caption" color="textMuted">
                5 {lang === "es" ? "pasos rápidos" : "quick steps"}
              </Typography>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  heroSection: {
    alignItems: "center",
    paddingTop: SCREEN_HEIGHT * 0.12,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: 44,
    letterSpacing: 10,
    marginTop: 8,
  },
  descriptionSection: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  sparkleContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 20,
    backgroundColor: "rgba(14, 165, 233, 0.1)",
  },
  ctaSection: {
    paddingBottom: 32,
    gap: 20,
  },
  ctaContainer: {
    position: "relative",
  },
  ctaGlow: {
    position: "absolute",
    top: 8,
    left: 20,
    right: 20,
    bottom: -4,
    borderRadius: 16,
    opacity: 0.2,
  },
  startButton: {
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  stepsPreview: {
    alignItems: "center",
  },
});
