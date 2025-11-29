import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChevronLeft, Flame, Scale, TrendingUp } from "lucide-react-native";
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
  FitnessGoal,
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

const GOALS: {
  id: FitnessGoal;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    id: "lose_weight",
    icon: <Flame size={32} color="#EF4444" />,
    color: "#EF4444",
  },
  {
    id: "maintain",
    icon: <Scale size={32} color="#3B82F6" />,
    color: "#3B82F6",
  },
  {
    id: "build_muscle",
    icon: <TrendingUp size={32} color="#10B981" />,
    color: "#10B981",
  },
];

// Goal Card Component
type GoalCardProps = {
  goal: FitnessGoal;
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  delay: number;
};

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  selected,
  onSelect,
  icon,
  title,
  subtitle,
  color,
  delay,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
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
      style={animatedStyle}
    >
      <TouchableOpacity
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View
          style={[
            styles.goalCard,
            {
              borderColor: selected ? color : colors.border,
              borderWidth: selected ? 2 : 1,
              backgroundColor: selected
                ? `${color}12`
                : isDarkMode
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.02)",
            },
          ]}
        >
          <BlurView
            intensity={isDarkMode ? 15 : 25}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />

          {/* Icon */}
          <View
            style={[
              styles.goalIconContainer,
              {
                backgroundColor: selected
                  ? `${color}20`
                  : isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            {icon}
          </View>

          {/* Text */}
          <View style={styles.goalTextContainer}>
            <Typography
              variant="body1"
              weight="bold"
              style={{ color: selected ? color : colors.text }}
            >
              {title}
            </Typography>
            <Typography
              variant="caption"
              style={{ color: colors.textMuted, marginTop: 2 }}
            >
              {subtitle}
            </Typography>
          </View>

          {/* Check indicator */}
          {selected && (
            <Animated.View
              entering={FadeIn.duration(200)}
              style={[styles.checkIndicator, { backgroundColor: color }]}
            >
              <Typography
                style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}
              >
                ✓
              </Typography>
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function GoalScreen() {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = onboardingTranslations.goal;
  const tCommon = onboardingTranslations.common;
  const { fitnessGoal, setFitnessGoal, nextStep } = useOnboardingStore();

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
    if (fitnessGoal) {
      nextStep();
      router.push("/onboarding/activity" as any);
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
          size={160}
          color={
            isDarkMode ? "rgba(14, 165, 233, 0.07)" : "rgba(14, 165, 233, 0.1)"
          }
          initialX={SCREEN_WIDTH - 60}
          initialY={SCREEN_HEIGHT * 0.08}
          delay={0}
        />
        <FloatingOrb
          size={120}
          color={
            isDarkMode ? "rgba(56, 189, 248, 0.05)" : "rgba(56, 189, 248, 0.08)"
          }
          initialX={-30}
          initialY={SCREEN_HEIGHT * 0.45}
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
          <OnboardingProgress currentStep={3} totalSteps={5} />
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

          {/* Goal Cards */}
          <View style={styles.cardsContainer}>
            {GOALS.map((goal, index) => (
              <GoalCard
                key={goal.id}
                goal={goal.id}
                selected={fitnessGoal === goal.id}
                onSelect={() => setFitnessGoal(goal.id)}
                icon={goal.icon}
                title={t[goal.id].title[lang]}
                subtitle={t[goal.id].subtitle[lang]}
                color={goal.color}
                delay={400 + index * 100}
              />
            ))}
          </View>
        </View>

        {/* Footer */}
        <Animated.View
          entering={FadeInUp.delay(700).duration(500)}
          style={styles.footer}
        >
          <View style={styles.ctaContainer}>
            {fitnessGoal && (
              <View
                style={[
                  styles.ctaGlow,
                  { backgroundColor: colors.primary[500] },
                ]}
              />
            )}
            <Button
              onPress={handleContinue}
              disabled={!fitnessGoal}
              size="lg"
              style={[
                styles.continueButton,
                fitnessGoal && {
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
    marginBottom: 32,
  },
  cardsContainer: {
    gap: 16,
  },
  goalCard: {
    borderRadius: 22,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 16,
  },
  goalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  goalTextContainer: {
    flex: 1,
  },
  checkIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
