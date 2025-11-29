import { usersRepository } from "@/shared/db/repository/user";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import {
  useUserPreferences,
  useUserPreferencesStore,
} from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Activity,
  CheckCircle2,
  Flame,
  Scale,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react-native";
import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
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
    const timeout = setTimeout(() => {
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
          withTiming(1.2, {
            duration: 3000 + delay,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(0.9, {
            duration: 3000 + delay,
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

// Success checkmark with animation
const SuccessCheck = () => {
  const { colors } = useColorScheme();
  const scale = useSharedValue(0);
  const rotate = useSharedValue(-30);

  useEffect(() => {
    scale.value = withDelay(
      300,
      withSpring(1, { damping: 12, stiffness: 200 })
    );
    rotate.value = withDelay(
      300,
      withSpring(0, { damping: 12, stiffness: 200 })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.successCheckContainer, animatedStyle]}>
      <View
        style={[
          styles.successCheckGlow,
          { backgroundColor: colors.primary[500] },
        ]}
      />
      <View
        style={[
          styles.successCheckCircle,
          {
            backgroundColor: colors.primary[500],
            borderColor: `${colors.primary[400]}50`,
          },
        ]}
      >
        <CheckCircle2 size={48} color="#fff" strokeWidth={2.5} />
      </View>
    </Animated.View>
  );
};

// Stat Card Component
const StatCard = ({
  icon,
  label,
  value,
  unit,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  color: string;
  delay: number;
}) => {
  const { isDarkMode } = useColorScheme();
  const displayValue = useSharedValue(0);

  useEffect(() => {
    displayValue.value = withDelay(
      delay,
      withTiming(value, { duration: 1200, easing: Easing.out(Easing.quad) })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify().damping(15)}
      style={[
        styles.statCard,
        {
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.04)"
            : "rgba(0,0,0,0.02)",
          borderColor: `${color}30`,
        },
      ]}
    >
      <BlurView
        intensity={isDarkMode ? 10 : 20}
        tint={isDarkMode ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}
      >
        {icon}
      </View>

      <Typography variant="caption" weight="medium" color="textMuted">
        {label}
      </Typography>

      <View style={styles.statValueRow}>
        <Typography variant="h3" weight="bold" style={{ color }}>
          {Math.round(value)}
        </Typography>
        <Typography
          variant="body2"
          weight="medium"
          style={{ color: `${color}99`, marginLeft: 4 }}
        >
          {unit}
        </Typography>
      </View>
    </Animated.View>
  );
};

export default function CompleteScreen() {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = onboardingTranslations.complete;
  const { user } = useAuth();

  const {
    biologicalSex,
    birthDate,
    heightCm,
    weightKg,
    fitnessGoal,
    activityLevel,
    calculateBMR,
    calculateTDEE,
    reset,
    setIsCompleting,
    isCompleting,
  } = useOnboardingStore();

  const bmr = calculateBMR() || 0;
  const tdee = calculateTDEE() || 0;

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
      { translateX: interpolate(auroraPosition.value, [0, 1], [-60, 60]) },
      { translateY: interpolate(auroraPosition.value, [0, 1], [-40, 40]) },
    ],
  }));

  // Goal icon mapping
  const goalInfo = useMemo(() => {
    switch (fitnessGoal) {
      case "lose_weight":
        return {
          icon: <Flame size={20} color="#EF4444" />,
          label: lang === "es" ? "Perder peso" : "Lose weight",
          color: "#EF4444",
        };
      case "maintain":
        return {
          icon: <Scale size={20} color="#3B82F6" />,
          label: lang === "es" ? "Mantener" : "Maintain",
          color: "#3B82F6",
        };
      case "build_muscle":
        return {
          icon: <TrendingUp size={20} color="#10B981" />,
          label: lang === "es" ? "Ganar músculo" : "Build muscle",
          color: "#10B981",
        };
      default:
        return {
          icon: <Target size={20} color={colors.primary[500]} />,
          label: "",
          color: colors.primary[500],
        };
    }
  }, [fitnessGoal, lang, colors]);

  const handleComplete = async () => {
    if (!user?.id) return;

    setIsCompleting(true);

    try {
      const updateData = {
        biological_sex: biologicalSex ?? undefined,
        birth_date: birthDate?.toISOString().split("T")[0],
        height_cm: heightCm ?? undefined,
        initial_weight_kg: weightKg ?? undefined,
        fitness_goal:
          fitnessGoal === "lose_weight"
            ? "lose_fat"
            : fitnessGoal === "build_muscle"
            ? "gain_muscle"
            : fitnessGoal ?? undefined,
        activity_level: activityLevel ?? undefined,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      };

      // Save onboarding data to local DB
      await usersRepository.updateUserPreferences(user.id, updateData);

      // Update Zustand store immediately so route guard sees onboarding_completed
      useUserPreferencesStore.setState((state) => ({
        prefs: state.prefs
          ? { ...state.prefs, onboarding_completed: true }
          : null,
      }));

      // TODO: Sync to Supabase

      // Reset store and navigate
      reset();
      router.replace("/(authenticated)/(tabs)/" as any);
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Aurora Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={
            isDarkMode
              ? ["#030508", "#081420", "#0d1a30", "#030508"]
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
                ? "rgba(14, 165, 233, 0.15)"
                : "rgba(14, 165, 233, 0.22)",
              isDarkMode
                ? "rgba(56, 189, 248, 0.1)"
                : "rgba(56, 189, 248, 0.15)",
              "transparent",
            ]}
            style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.8 }] }]}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 1, y: 0.8 }}
          />
        </Animated.View>

        <FloatingOrb
          size={200}
          color={
            isDarkMode ? "rgba(14, 165, 233, 0.1)" : "rgba(14, 165, 233, 0.15)"
          }
          initialX={-70}
          initialY={SCREEN_HEIGHT * 0.05}
          delay={0}
        />
        <FloatingOrb
          size={150}
          color={
            isDarkMode ? "rgba(56, 189, 248, 0.08)" : "rgba(56, 189, 248, 0.12)"
          }
          initialX={SCREEN_WIDTH - 50}
          initialY={SCREEN_HEIGHT * 0.35}
          delay={600}
        />
        <FloatingOrb
          size={100}
          color={
            isDarkMode ? "rgba(14, 165, 233, 0.06)" : "rgba(14, 165, 233, 0.1)"
          }
          initialX={SCREEN_WIDTH * 0.2}
          initialY={SCREEN_HEIGHT * 0.7}
          delay={1200}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Content */}
        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <SuccessCheck />

            <Animated.View entering={FadeInDown.delay(500).duration(600)}>
              <Typography
                variant="h1"
                weight="bold"
                align="center"
                style={{ color: colors.text, marginTop: 24 }}
              >
                {t.title[lang]}
              </Typography>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600).duration(600)}>
              <Typography
                variant="body1"
                align="center"
                style={{ color: colors.textMuted, marginTop: 8 }}
              >
                {t.subtitle[lang]}
              </Typography>
            </Animated.View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard
              icon={<Zap size={22} color="#F59E0B" />}
              label={t.bmrLabel[lang]}
              value={bmr}
              unit={t.kcalDay[lang]}
              color="#F59E0B"
              delay={700}
            />
            <StatCard
              icon={<Activity size={22} color="#10B981" />}
              label={t.tdeeLabel[lang]}
              value={tdee}
              unit={t.kcalDay[lang]}
              color="#10B981"
              delay={800}
            />
          </View>

          {/* Goal Badge */}
          <Animated.View
            entering={FadeIn.delay(900).duration(500)}
            style={[
              styles.goalBadge,
              {
                backgroundColor: `${goalInfo.color}15`,
                borderColor: `${goalInfo.color}30`,
              },
            ]}
          >
            <BlurView
              intensity={isDarkMode ? 10 : 20}
              tint={isDarkMode ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
            {goalInfo.icon}
            <Typography
              variant="body2"
              weight="semibold"
              style={{ color: goalInfo.color, marginLeft: 8 }}
            >
              {goalInfo.label}
            </Typography>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View
          entering={FadeInUp.delay(1000).duration(500)}
          style={styles.footer}
        >
          <View style={styles.ctaContainer}>
            <View
              style={[styles.ctaGlow, { backgroundColor: colors.primary[500] }]}
            />
            <Button
              onPress={handleComplete}
              disabled={isCompleting}
              size="lg"
              style={styles.completeButton}
            >
              <View style={styles.buttonContent}>
                <Sparkles size={20} color="#fff" style={{ marginRight: 8 }} />
                <Typography
                  variant="body1"
                  weight="bold"
                  style={{ color: "#fff" }}
                >
                  {isCompleting
                    ? lang === "es"
                      ? "Guardando..."
                      : "Saving..."
                    : t.button[lang]}
                </Typography>
              </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  successCheckContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  successCheckGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.2,
  },
  successCheckCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    overflow: "hidden",
    gap: 8,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  goalBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    overflow: "hidden",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
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
    opacity: 0.25,
  },
  completeButton: {
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 18,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
