import { useActiveMainActions } from "@/features/active-workout-v2/hooks/use-active-workout-store";
import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { workoutsTranslations as t } from "@/shared/translations/workouts";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Calendar, Dumbbell, Play, Sparkles } from "lucide-react-native";
import React, { useEffect, useMemo } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  routines: RoutineWithMetrics[];
};

export const NextWorkoutCardV2 = ({ routines }: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const { initializeWorkout } = useActiveMainActions();
  const { user } = useAuth();

  // Find next scheduled workout
  const nextWorkout = useMemo(() => {
    const today = new Date();
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const todayName = dayNames[today.getDay()];

    // First check if any routine is scheduled for today
    const todayRoutine = routines.find((r) =>
      r.training_days?.includes(todayName)
    );

    if (todayRoutine) {
      return {
        routine: todayRoutine,
        isToday: true,
        dayLabel: t.today[lang],
      };
    }

    // Find next scheduled day
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const nextDayName = dayNames[nextDate.getDay()];

      const routine = routines.find((r) =>
        r.training_days?.includes(nextDayName)
      );
      if (routine) {
        const dayLabel =
          i === 1
            ? t.tomorrow[lang]
            : dayNames[nextDate.getDay()].charAt(0).toUpperCase() +
              dayNames[nextDate.getDay()].slice(1);
        return { routine, isToday: false, dayLabel };
      }
    }

    // No scheduled workout, suggest first routine
    if (routines.length > 0) {
      return {
        routine: routines[0],
        isToday: false,
        dayLabel: t.trainAnytime[lang],
      };
    }

    return null;
  }, [routines, lang]);

  const isToday = nextWorkout?.isToday ?? false;

  // Aurora animation - MUST be before any early returns
  const glowProgress = useSharedValue(0);

  useEffect(() => {
    if (isToday) {
      glowProgress.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [isToday, glowProgress]);

  const auroraStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: glowProgress.value * 40 - 20 },
      { translateY: glowProgress.value * 15 - 8 },
      { scale: 1 + glowProgress.value * 0.15 },
    ],
    opacity: 0.4 + glowProgress.value * 0.3,
  }));

  const aurora2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: -glowProgress.value * 30 + 15 },
      { translateY: -glowProgress.value * 12 + 6 },
      { scale: 1.1 - glowProgress.value * 0.1 },
    ],
    opacity: 0.3 + (1 - glowProgress.value) * 0.25,
  }));

  // Animated glowing border for "Today" card
  const animatedCardStyle = useAnimatedStyle(() => {
    if (!isToday) return {};

    const borderOpacity = 0.4 + glowProgress.value * 0.3;

    return {
      borderColor: `rgba(14, 165, 233, ${borderOpacity})`,
      shadowOpacity: 0.2 + glowProgress.value * 0.15,
      shadowRadius: 16 + glowProgress.value * 8,
    };
  });

  // Early return AFTER all hooks
  if (!nextWorkout) {
    return null;
  }

  const { routine, dayLabel } = nextWorkout;

  const handleStartWorkout = async () => {
    try {
      if (!user?.id) return;
      await initializeWorkout(routine.id, user.id);
      router.push("/workout/active");
    } catch (error) {
      console.error("Error starting workout:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Glass card */}
      <Animated.View
        style={[
          styles.card,
          {
            borderColor: isToday
              ? `${colors.primary[500]}40`
              : isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.8)",
            shadowColor: isToday ? colors.primary[500] : "transparent",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isToday ? 0.2 : 0,
            shadowRadius: 16,
            elevation: isToday ? 6 : 0,
          },
          isToday && animatedCardStyle,
        ]}
      >
        {/* Subtle aurora glow - only when isToday */}
        {isToday && (
          <View style={styles.auroraContainer}>
            <Animated.View style={[styles.aurora1, auroraStyle]}>
              <LinearGradient
                colors={[
                  `${colors.primary[500]}25`,
                  `${colors.primary[400]}10`,
                  "transparent",
                ]}
                style={styles.auroraGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
            <Animated.View style={[styles.aurora2, aurora2Style]}>
              <LinearGradient
                colors={[
                  `${colors.primary[600]}20`,
                  `${colors.primary[500]}08`,
                  "transparent",
                ]}
                style={styles.auroraGradient}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
            </Animated.View>
          </View>
        )}

        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 20 : 40}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Decorative glow - always visible */}
        <View
          style={[
            styles.decorativeGlow,
            { backgroundColor: colors.primary[500] },
          ]}
        />

        {/* Decorative icon watermark */}
        <View style={styles.watermarkContainer}>
          <Dumbbell
            size={80}
            color={colors.primary[500]}
            style={{ opacity: isDarkMode ? 0.04 : 0.06 }}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Header row with badge */}
          <View style={styles.headerRow}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: isToday
                    ? `${colors.primary[500]}20`
                    : isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            >
              {isToday ? (
                <Sparkles size={14} color={colors.primary[500]} />
              ) : (
                <Calendar size={14} color={colors.textMuted} />
              )}
              <Typography
                variant="caption"
                weight="semibold"
                style={{
                  color: isToday ? colors.primary[500] : colors.textMuted,
                  marginLeft: 6,
                }}
              >
                {dayLabel}
              </Typography>
            </View>

            {/* Ready indicator - only when isToday */}
            {isToday && (
              <View style={styles.readyIndicator}>
                <View
                  style={[
                    styles.readyDot,
                    { backgroundColor: colors.primary[500] },
                  ]}
                />
              </View>
            )}
          </View>

          {/* Main content */}
          <View style={styles.mainContent}>
            <View style={styles.textContent}>
              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginBottom: 4 }}
              >
                {t.nextWorkout[lang]}
              </Typography>
              <Typography
                variant="h4"
                weight="bold"
                style={{ color: colors.text }}
                numberOfLines={1}
              >
                {routine.name}
              </Typography>

              {/* Stats row */}
              <View style={styles.statsRow}>
                <Typography variant="caption" color="textMuted">
                  {routine.blocksCount}{" "}
                  {routine.blocksCount === 1 ? t.block[lang] : t.blocks[lang]}
                </Typography>
                <View
                  style={[
                    styles.statDot,
                    { backgroundColor: colors.textMuted },
                  ]}
                />
                <Typography variant="caption" color="textMuted">
                  {routine.exercisesCount}{" "}
                  {routine.exercisesCount === 1
                    ? sharedUiTranslations.exercise[lang]
                    : sharedUiTranslations.exercises[lang]}
                </Typography>
              </View>

              {/* Training days chips */}
              {routine.training_days && routine.training_days.length > 0 && (
                <View style={styles.trainingDaysRow}>
                  {routine.training_days.slice(0, 5).map((day) => (
                    <View
                      key={day}
                      style={[
                        styles.dayChip,
                        {
                          backgroundColor: `${colors.primary[500]}15`,
                        },
                      ]}
                    >
                      <Typography
                        variant="caption"
                        weight="semibold"
                        style={{
                          color: colors.primary[500],
                          fontSize: 10,
                        }}
                      >
                        {t.weekDaysShort[lang][
                          day as keyof (typeof t.weekDaysShort)["en"]
                        ]?.slice(0, 2) || day.slice(0, 2).toUpperCase()}
                      </Typography>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Play button */}
            <Pressable
              onPress={handleStartWorkout}
              style={({ pressed }) => [
                styles.playButton,
                {
                  backgroundColor: colors.primary[500],
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
            >
              <Play size={24} color="#fff" fill="#fff" />
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  decorativeGlow: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.12,
  },
  watermarkContainer: {
    position: "absolute",
    bottom: -15,
    right: -10,
    transform: [{ rotate: "-15deg" }],
  },
  auroraContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  aurora1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 150,
    height: 150,
  },
  aurora2: {
    position: "absolute",
    bottom: -40,
    left: -30,
    width: 120,
    height: 120,
  },
  auroraGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  content: {
    padding: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  readyIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  readyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContent: {
    flex: 1,
    marginRight: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  statDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 8,
    opacity: 0.5,
  },
  trainingDaysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  dayChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
