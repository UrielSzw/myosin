import { useActiveMainActions } from "@/features/active-workout/hooks/use-active-workout-store";
import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { Typography } from "@/shared/ui/typography";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Calendar, Play } from "lucide-react-native";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

type Props = {
  routines: RoutineWithMetrics[];
};

// Map day names to day numbers (0 = Sunday, 1 = Monday, etc.)
const DAY_MAP: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

/**
 * Find the next scheduled workout based on training_days
 */
const findNextWorkout = (
  routines: RoutineWithMetrics[]
): { routine: RoutineWithMetrics; dayKey: string; isToday: boolean } | null => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday

  // Get all routines with training days
  const scheduledRoutines = routines.filter(
    (r) => r.training_days && r.training_days.length > 0
  );

  if (scheduledRoutines.length === 0) return null;

  let closestRoutine: RoutineWithMetrics | null = null;
  let closestDayKey: string = "";
  let minDaysAway = 8; // More than a week
  let isToday = false;

  for (const routine of scheduledRoutines) {
    for (const dayKey of routine.training_days!) {
      const targetDay = DAY_MAP[dayKey.toLowerCase()];
      if (targetDay === undefined) continue;

      let daysAway = targetDay - currentDay;
      if (daysAway < 0) daysAway += 7;
      if (daysAway === 0) {
        // Today! Return immediately
        return { routine, dayKey, isToday: true };
      }

      if (daysAway < minDaysAway) {
        minDaysAway = daysAway;
        closestRoutine = routine;
        closestDayKey = dayKey;
      }
    }
  }

  if (closestRoutine) {
    return { routine: closestRoutine, dayKey: closestDayKey, isToday };
  }

  return null;
};

export const NextWorkoutCard: React.FC<Props> = ({ routines }) => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutsTranslations;
  const { initializeWorkout } = useActiveMainActions();

  const nextWorkout = useMemo(() => findNextWorkout(routines), [routines]);

  const handleStartWorkout = async () => {
    if (!nextWorkout || !user?.id) return;

    try {
      await initializeWorkout(nextWorkout.routine.id, user.id);
      router.push("/workout/active");
    } catch (error) {
      console.error("Error starting workout:", error);
    }
  };

  // No scheduled workouts - don't show the card
  if (!nextWorkout) {
    return null;
  }

  const { routine, dayKey, isToday } = nextWorkout;
  const dayFull =
    t.weekDays[lang][dayKey.toLowerCase() as keyof typeof t.weekDays.es]?.full || dayKey;

  return (
    <Animated.View
      entering={FadeInUp.delay(100).duration(500)}
      style={styles.container}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleStartWorkout}
        style={styles.touchable}
      >
        <LinearGradient
          colors={
            isDarkMode
              ? [colors.primary[500], colors.primary[700]]
              : [colors.primary[400], colors.primary[600]]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Content */}
          <View style={styles.content}>
            <View style={styles.info}>
              <View style={styles.labelContainer}>
                <Calendar size={12} color="rgba(255,255,255,0.9)" />
                <Typography
                  variant="caption"
                  weight="medium"
                  style={styles.label}
                >
                  {isToday ? t.todayWorkout[lang] : `${t.nextWorkout[lang]} · ${dayFull}`}
                </Typography>
              </View>
              <Typography
                variant="h5"
                weight="bold"
                style={styles.routineName}
                numberOfLines={1}
              >
                {routine.name}
              </Typography>
              <Typography variant="body2" style={styles.stats}>
                {routine.blocksCount}{" "}
                {routine.blocksCount === 1 ? t.block[lang] : t.blocks[lang]} •{" "}
                {routine.exercisesCount}{" "}
                {routine.exercisesCount === 1
                  ? t.exercise[lang]
                  : t.exercises[lang]}
              </Typography>
            </View>

            {/* Play button */}
            <View style={styles.playButton}>
              <Play size={20} color={colors.primary[600]} fill={colors.primary[600]} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 4,
  },
  touchable: {
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    padding: 16,
    borderRadius: 16,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },
  label: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  routineName: {
    color: "#ffffff",
    marginBottom: 2,
    fontSize: 18,
  },
  stats: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
});
