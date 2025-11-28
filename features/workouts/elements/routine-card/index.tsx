import { useActiveMainActions } from "@/features/active-workout/hooks/use-active-workout-store";
import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { Calendar, Play } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

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

  const hasTrainingDays =
    routine.training_days && routine.training_days.length > 0;

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

  // Texto de stats: "3 bloques · 8 ejercicios"
  const statsText = `${routine.blocksCount} ${
    routine.blocksCount === 1 ? t.block[lang] : t.blocks[lang]
  } · ${routine.exercisesCount} ${
    routine.exercisesCount === 1 ? t.exercise[lang] : t.exercises[lang]
  }`;

  return (
    <Pressable
      onLongPress={onLongPress ? () => onLongPress(routine) : undefined}
      delayLongPress={500}
      onPress={handleSelectRoutine}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Card variant="outlined" padding="md" style={styles.card}>
        <View style={styles.content}>
          {/* Left: Info */}
          <View style={styles.info}>
            {/* Title row with scheduled indicator */}
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
                    styles.scheduledBadge,
                    { backgroundColor: colors.primary[500] + "20" },
                  ]}
                >
                  <View
                    style={[
                      styles.scheduledDot,
                      { backgroundColor: colors.primary[500] },
                    ]}
                  />
                </View>
              )}
            </View>

            {/* Stats: bloques · ejercicios */}
            <Typography
              variant="caption"
              color="textMuted"
              style={styles.statsText}
            >
              {statsText}
            </Typography>

            {/* Training days row (if scheduled) */}
            {hasTrainingDays && (
              <View style={styles.daysRow}>
                <Calendar size={12} color={colors.primary[500]} />
                <Typography
                  variant="caption"
                  style={{ color: colors.primary[500], marginLeft: 4 }}
                >
                  {formatDays(routine.training_days!)}
                </Typography>
              </View>
            )}
          </View>

          {/* Right: Play button */}
          <Pressable
            onPress={handleStartRoutine}
            style={({ pressed }) => [
              styles.playButton,
              {
                backgroundColor: colors.primary[500],
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
          >
            <Play size={18} color="#ffffff" fill="#ffffff" />
          </Pressable>
        </View>
      </Card>
    </Pressable>
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
    marginBottom: 4,
  },
  title: {
    flex: 1,
  },
  scheduledBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  scheduledDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsText: {
    marginBottom: 2,
  },
  daysRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  playButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
