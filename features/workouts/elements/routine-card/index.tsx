import { useActiveMainActions } from "@/features/active-workout/hooks/use-active-workout-store";
import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { Calendar, ChevronRight, Dumbbell, Hash, Play } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  routine: RoutineWithMetrics;
  onLongPress?: (routine: RoutineWithMetrics | null) => void;
  onPress: (routine: RoutineWithMetrics | null) => void;
};

export const RoutineCard: React.FC<Props> = ({
  routine,
  onLongPress,
  onPress,
}) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutsTranslations;
  const { initializeWorkout } = useActiveMainActions();
  const { user } = useAuth();

  const hasTrainingDays = routine.training_days && routine.training_days.length > 0;

  const handleSelectRoutine = () => {
    onPress(routine);
  };

  const handleStartRoutine = async () => {
    try {
      if (!user?.id) {
        console.error("No user ID available");
        return;
      }
      await initializeWorkout(routine.id, user.id);
      router.push("/workout/active");
    } catch (error) {
      console.error(t.errorStartingWorkout[lang], error);
    }
  };

  const formatDays = (days: string[]) => {
    return days
      .map((day) => {
        const weekDay = t.weekDays[lang][day as keyof typeof t.weekDays.es];
        return weekDay ? weekDay.short : day;
      })
      .join(" · ");
  };

  return (
    <TouchableOpacity
      onLongPress={onLongPress ? () => onLongPress(routine) : undefined}
      delayLongPress={500}
      activeOpacity={0.7}
      onPress={handleSelectRoutine}
    >
      <Card
        variant="outlined"
        padding="md"
        style={styles.card}
      >
        <View style={styles.content}>
          {/* Left: Info */}
          <View style={styles.info}>
            {/* Title row */}
            <View style={styles.titleRow}>
              <Typography
                variant="body1"
                weight="semibold"
                style={styles.title}
                numberOfLines={1}
              >
                {routine.name}
              </Typography>
              {hasTrainingDays && (
                <View
                  style={[
                    styles.scheduledDot,
                    { backgroundColor: colors.primary[500] },
                  ]}
                />
              )}
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Hash size={12} color={colors.textMuted} />
                <Typography variant="caption" color="textMuted">
                  {routine.blocksCount}
                </Typography>
              </View>

              <View style={styles.stat}>
                <Dumbbell size={12} color={colors.textMuted} />
                <Typography variant="caption" color="textMuted">
                  {routine.exercisesCount}
                </Typography>
              </View>

              {hasTrainingDays && (
                <View style={styles.stat}>
                  <Calendar size={12} color={colors.textMuted} />
                  <Typography variant="caption" color="textMuted">
                    {formatDays(routine.training_days!)}
                  </Typography>
                </View>
              )}
            </View>
          </View>

          {/* Right: Play button */}
          <TouchableOpacity
            onPress={handleStartRoutine}
            activeOpacity={0.8}
            style={[styles.playButton, { backgroundColor: colors.primary[500] }]}
          >
            <Play size={18} color="#ffffff" fill="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Tap hint */}
        <View style={styles.tapHint}>
          <Typography variant="caption" color="textMuted" style={styles.tapHintText}>
            {t.routineOptions[lang]}
          </Typography>
          <ChevronRight size={12} color={colors.textMuted} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  title: {
    flex: 1,
  },
  scheduledDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tapHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(128,128,128,0.1)",
    gap: 4,
  },
  tapHintText: {
    fontSize: 11,
  },
});
