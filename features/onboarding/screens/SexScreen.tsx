import { toSupportedLanguage } from "@/shared/types/language";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
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
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingProgress } from "../components";
import {
  BiologicalSex,
  onboardingTranslations,
  useOnboardingStore,
} from "../hooks";

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-20, {
            duration: 3000 + delay,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(20, {
            duration: 3000 + delay,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        true
      );
      translateX.value = withRepeat(
        withSequence(
          withTiming(15, {
            duration: 4000 + delay,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(-15, {
            duration: 4000 + delay,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        true
      );
    }, delay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
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

// Sex Selection Card
const SexCard = ({
  sex,
  selected,
  onSelect,
  icon,
  title,
  color,
  delay,
}: {
  sex: BiologicalSex;
  selected: boolean;
  onSelect: () => void;
  icon: string;
  title: string;
  color: string;
  delay: number;
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify().damping(15)}
      style={[animatedStyle, styles.cardWrapper]}
    >
      <TouchableOpacity
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.cardTouchable}
      >
        <Animated.View
          style={[
            styles.sexCard,
            {
              borderColor: selected ? color : colors.border,
              backgroundColor: selected
                ? `${color}15`
                : isDarkMode
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
              borderWidth: selected ? 3 : 1,
            },
          ]}
        >
          <BlurView
            intensity={isDarkMode ? 15 : 25}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />

          {/* Glow effect when selected */}
          {selected && (
            <View
              style={[
                styles.cardGlow,
                { backgroundColor: color, opacity: 0.1 },
              ]}
            />
          )}

          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: selected
                  ? `${color}25`
                  : isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <Typography style={{ fontSize: 48 }}>{icon}</Typography>
          </View>

          {/* Title */}
          <Typography
            variant="h4"
            weight="bold"
            style={{ color: selected ? color : colors.text, marginTop: 16 }}
          >
            {title}
          </Typography>

          {/* Selection indicator */}
          {selected && (
            <Animated.View
              entering={FadeIn.duration(200)}
              style={[styles.checkIndicator, { backgroundColor: color }]}
            >
              <Typography style={{ color: "#fff", fontWeight: "700" }}>
                ✓
              </Typography>
            </Animated.View>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function SexScreen() {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = onboardingTranslations.sex;
  const tCommon = onboardingTranslations.common;
  const { biologicalSex, setBiologicalSex, nextStep } = useOnboardingStore();

  // Aurora animation
  const auroraPosition = useSharedValue(0);

  useEffect(() => {
    auroraPosition.value = withRepeat(
      withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const auroraStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(auroraPosition.value, [0, 1], [-50, 50]) },
      { translateY: interpolate(auroraPosition.value, [0, 1], [-30, 30]) },
    ],
  }));

  const handleContinue = () => {
    if (biologicalSex) {
      nextStep();
      router.push("/onboarding/birthdate" as any);
    }
  };

  const handleBack = () => {
    router.back();
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

        <Animated.View style={[StyleSheet.absoluteFill, auroraStyle]}>
          <LinearGradient
            colors={[
              "transparent",
              isDarkMode
                ? "rgba(14, 165, 233, 0.1)"
                : "rgba(14, 165, 233, 0.18)",
              isDarkMode
                ? "rgba(56, 189, 248, 0.06)"
                : "rgba(56, 189, 248, 0.12)",
              "transparent",
            ]}
            style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.6 }] }]}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 1, y: 0.8 }}
          />
        </Animated.View>

        <FloatingOrb
          size={180}
          color={
            isDarkMode ? "rgba(14, 165, 233, 0.07)" : "rgba(14, 165, 233, 0.1)"
          }
          initialX={-60}
          initialY={SCREEN_HEIGHT * 0.1}
          delay={0}
        />
        <FloatingOrb
          size={130}
          color={
            isDarkMode ? "rgba(56, 189, 248, 0.05)" : "rgba(56, 189, 248, 0.08)"
          }
          initialX={SCREEN_WIDTH - 50}
          initialY={SCREEN_HEIGHT * 0.4}
          delay={500}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View
          entering={FadeIn.delay(100).duration(500)}
          style={styles.header}
        >
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={28} color={colors.text} />
          </TouchableOpacity>
          <OnboardingProgress currentStep={0} totalSteps={5} />
          <View style={styles.backButton} />
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.titleSection}
          >
            <Typography
              variant="h2"
              weight="bold"
              align="center"
              style={{ color: colors.text }}
            >
              {t.title[lang]}
            </Typography>
            <Typography
              variant="body1"
              align="center"
              style={{ color: colors.textMuted, marginTop: 12, lineHeight: 24 }}
            >
              {t.subtitle[lang]}
            </Typography>
          </Animated.View>

          {/* Selection Cards */}
          <View style={styles.cardsContainer}>
            <SexCard
              sex="male"
              selected={biologicalSex === "male"}
              onSelect={() => setBiologicalSex("male")}
              icon="♂️"
              title={t.male[lang]}
              color="#3B82F6"
              delay={400}
            />
            <SexCard
              sex="female"
              selected={biologicalSex === "female"}
              onSelect={() => setBiologicalSex("female")}
              icon="♀️"
              title={t.female[lang]}
              color="#EC4899"
              delay={500}
            />
          </View>
        </View>

        {/* Footer */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(500)}
          style={styles.footer}
        >
          <View style={styles.ctaContainer}>
            {biologicalSex && (
              <View
                style={[
                  styles.ctaGlow,
                  { backgroundColor: colors.primary[500] },
                ]}
              />
            )}
            <Button
              onPress={handleContinue}
              disabled={!biologicalSex}
              size="lg"
              style={[
                styles.continueButton,
                biologicalSex && {
                  shadowColor: "#0ea5e9",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                  elevation: 12,
                },
              ]}
            >
              {tCommon.continue[lang]}
            </Button>
          </View>
        </Animated.View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleSection: {
    marginTop: 24,
    marginBottom: 40,
  },
  cardsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  cardWrapper: {
    flex: 1,
  },
  cardTouchable: {
    flex: 1,
  },
  sexCard: {
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    paddingHorizontal: 16,
    minHeight: 200,
  },
  cardGlow: {
    position: "absolute",
    width: "120%",
    height: "120%",
    borderRadius: 100,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  checkIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  ctaContainer: {
    position: "relative",
  },
  ctaGlow: {
    position: "absolute",
    top: 6,
    left: 16,
    right: 16,
    bottom: -4,
    borderRadius: 14,
    opacity: 0.15,
  },
  continueButton: {},
});
