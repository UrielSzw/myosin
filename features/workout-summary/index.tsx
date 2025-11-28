import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { workoutSummaryTranslations } from "@/shared/translations/workout-summary";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  Check,
  Clock,
  Dumbbell,
  Flame,
  ListChecks,
  Trophy,
} from "lucide-react-native";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Animated checkmark circle
const CompletionCircle = () => {
  const { colors } = useColorScheme();
  const scale = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    checkScale.value = withDelay(
      300,
      withSpring(1, { damping: 10, stiffness: 150 })
    );
  }, [scale, checkScale]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  return (
    <Animated.View style={[styles.circleContainer, circleStyle]}>
      <View
        style={[
          styles.outerCircle,
          { backgroundColor: colors.success[500] + "15" },
        ]}
      >
        <View
          style={[
            styles.innerCircle,
            { backgroundColor: colors.success[500] + "25" },
          ]}
        >
          <View
            style={[
              styles.centerCircle,
              { backgroundColor: colors.success[500] },
            ]}
          >
            <Animated.View style={checkStyle}>
              <Check size={40} color="#fff" strokeWidth={3} />
            </Animated.View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

// Streak badge with flame
const StreakBadge: React.FC<{ streak: number; lang: "es" | "en" }> = ({
  streak,
  lang,
}) => {
  const { colors } = useColorScheme();
  const t = workoutSummaryTranslations;

  if (streak <= 0) return null;

  return (
    <View
      style={[
        styles.streakBadge,
        { backgroundColor: colors.warning[500] + "15" },
      ]}
    >
      <Flame size={16} color={colors.warning[500]} />
      <Typography
        variant="body2"
        weight="semibold"
        style={{ color: colors.warning[500] }}
      >
        {t.streak[lang]}: {streak} {t.days[lang]}
      </Typography>
    </View>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  delay: number;
}> = ({ icon, value, label, color, delay }) => {
  const { colors, isDarkMode } = useColorScheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(500)}
      style={[
        styles.statCard,
        {
          backgroundColor: isDarkMode
            ? colors.gray[800] + "80"
            : colors.gray[50],
          borderColor: isDarkMode ? colors.gray[700] : colors.gray[200],
        },
      ]}
    >
      <View
        style={[styles.statIconContainer, { backgroundColor: color + "15" }]}
      >
        {icon}
      </View>
      <Typography variant="h4" weight="bold" style={{ marginTop: 8 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="textMuted">
        {label}
      </Typography>
    </Animated.View>
  );
};

// PR Card
const PRCard: React.FC<{
  exerciseName: string;
  weight: number;
  reps: number;
  weightUnit: string;
  lang: "es" | "en";
}> = ({ exerciseName, weight, reps, weightUnit, lang }) => {
  const { colors } = useColorScheme();
  const t = workoutSummaryTranslations;

  return (
    <View
      style={[
        styles.prCard,
        {
          backgroundColor: colors.warning[500] + "10",
          borderColor: colors.warning[500] + "30",
        },
      ]}
    >
      <View style={styles.prHeader}>
        <Trophy size={18} color={colors.warning[500]} />
        <Typography
          variant="caption"
          weight="bold"
          style={{ color: colors.warning[500], marginLeft: 6 }}
        >
          {t.newPR[lang]}
        </Typography>
      </View>
      <Typography variant="body2" weight="semibold" numberOfLines={1}>
        {exerciseName}
      </Typography>
      <Typography variant="caption" color="textMuted">
        {weight} {weightUnit} × {reps}
      </Typography>
    </View>
  );
};

export const WorkoutSummaryFeature: React.FC = () => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const weightUnit = prefs?.weight_unit ?? "kg";
  const t = workoutSummaryTranslations;
  const haptic = useHaptic();

  // Get params from navigation
  const params = useLocalSearchParams<{
    routineName: string;
    workoutNumber: string;
    totalExercises: string;
    totalSetsCompleted: string;
    durationSeconds: string;
    currentStreak: string;
    prs: string; // JSON string
    improvements: string; // JSON string
    sessionId: string;
  }>();

  const routineName = params.routineName ?? "Workout";
  const workoutNumber = parseInt(params.workoutNumber ?? "1", 10);
  const totalExercises = parseInt(params.totalExercises ?? "0", 10);
  const totalSetsCompleted = parseInt(params.totalSetsCompleted ?? "0", 10);
  const durationSeconds = parseInt(params.durationSeconds ?? "0", 10);
  const currentStreak = parseInt(params.currentStreak ?? "0", 10);
  const sessionId = params.sessionId ?? "";

  // Format duration as mm:ss or hh:mm:ss
  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Parse PRs and improvements
  let prs: {
    exerciseName: string;
    weight: number;
    reps: number;
  }[] = [];
  let improvementsCount = 0;

  try {
    if (params.prs) {
      prs = JSON.parse(params.prs);
    }
    if (params.improvements) {
      improvementsCount = JSON.parse(params.improvements).length;
    }
  } catch {
    // Ignore parse errors
  }

  // Trigger success haptic on mount (closing ceremony)
  useEffect(() => {
    haptic.success();
  }, [haptic]);

  const handleDone = () => {
    // Dismiss all modals (active workout + summary) to go back to tabs
    router.dismissAll();
  };

  const hasHighlights = prs.length > 0 || improvementsCount > 0;

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={
          isDarkMode
            ? ["#050810", "#0a1428", "#071015"]
            : ["#f8fafc", "#ecfdf5", "#f0fdf4"]
        }
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.content}>
          {/* Hero Section - Completion Circle */}
          <Animated.View
            entering={FadeIn.delay(100).duration(600)}
            style={styles.heroSection}
          >
            <CompletionCircle />

            <Animated.View entering={FadeInDown.delay(400).duration(500)}>
              <Typography
                variant="h4"
                weight="bold"
                align="center"
                style={{ marginTop: 24 }}
              >
                {t.completed[lang]}
              </Typography>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500).duration(500)}>
              <Typography
                variant="body1"
                color="textMuted"
                align="center"
                style={{ marginTop: 4 }}
              >
                {t.workout[lang]} #{workoutNumber} · {routineName}
              </Typography>
            </Animated.View>

            {/* Streak Badge */}
            <Animated.View
              entering={FadeInDown.delay(600).duration(500)}
              style={{ marginTop: 16 }}
            >
              <StreakBadge streak={currentStreak} lang={lang} />
            </Animated.View>
          </Animated.View>

          {/* Stats Cards */}
          <View style={styles.statsCardsContainer}>
            <StatCard
              icon={<Dumbbell size={20} color={colors.primary[500]} />}
              value={totalExercises.toString()}
              label={t.exercises[lang]}
              color={colors.primary[500]}
              delay={700}
            />
            <StatCard
              icon={<ListChecks size={20} color={colors.success[500]} />}
              value={totalSetsCompleted.toString()}
              label={t.sets[lang]}
              color={colors.success[500]}
              delay={750}
            />
            <StatCard
              icon={<Clock size={20} color={colors.warning[500]} />}
              value={formatDuration(durationSeconds)}
              label={t.duration[lang]}
              color={colors.warning[500]}
              delay={800}
            />
          </View>

          {/* Highlights Section */}
          {hasHighlights && (
            <Animated.View
              entering={FadeInUp.delay(900).duration(500)}
              style={styles.highlightsSection}
            >
              <Typography
                variant="h6"
                weight="semibold"
                style={{ marginBottom: 12 }}
              >
                {t.highlights[lang]}
              </Typography>

              {/* PRs */}
              {prs.length > 0 && (
                <View style={styles.prsContainer}>
                  {prs.slice(0, 2).map((pr, index) => (
                    <PRCard
                      key={index}
                      exerciseName={pr.exerciseName}
                      weight={pr.weight}
                      reps={pr.reps}
                      weightUnit={weightUnit}
                      lang={lang}
                    />
                  ))}
                </View>
              )}

              {/* Improvements */}
              {improvementsCount > 0 && (
                <View
                  style={[
                    styles.improvementCard,
                    {
                      backgroundColor: colors.success[500] + "10",
                      borderColor: colors.success[500] + "30",
                    },
                  ]}
                >
                  <Typography variant="body2" color="success">
                    📈 {t.improved[lang]}{" "}
                    <Typography variant="body2" weight="bold" color="success">
                      {improvementsCount}
                    </Typography>{" "}
                    {improvementsCount === 1
                      ? t.exercisesCount[lang]
                      : t.exercisesCountPlural[lang]}{" "}
                    {t.vsLastTime[lang]}
                  </Typography>
                </View>
              )}
            </Animated.View>
          )}

          {/* Empty state for no highlights */}
          {!hasHighlights && (
            <Animated.View
              entering={FadeInUp.delay(900).duration(500)}
              style={styles.emptyHighlights}
            >
              <Typography variant="body1" weight="medium" align="center">
                {t.greatWorkout[lang]}
              </Typography>
              <Typography variant="body2" color="textMuted" align="center">
                {t.keepItUp[lang]}
              </Typography>
            </Animated.View>
          )}

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Actions */}
          <Animated.View
            entering={FadeInUp.delay(1000).duration(500)}
            style={styles.actionsSection}
          >
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleDone}
              style={styles.doneButton}
            >
              {t.done[lang]}
            </Button>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  centerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statsCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  highlightsSection: {
    marginBottom: 24,
  },
  prsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  prCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  prHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  improvementCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  emptyHighlights: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 4,
  },
  actionsSection: {
    gap: 12,
  },
  doneButton: {
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  detailsButton: {
    alignSelf: "center",
  },
});
