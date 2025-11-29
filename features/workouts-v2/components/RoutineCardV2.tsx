import { useActiveMainActions } from "@/features/active-workout-v2/hooks/use-active-workout-store";
import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { workoutsTranslations as t } from "@/shared/translations/workouts";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { Calendar, Play } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

type Props = {
  routine: RoutineWithMetrics;
  onLongPress: (routine: RoutineWithMetrics) => void;
};

export const RoutineCardV2 = ({ routine, onLongPress }: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const { initializeWorkout } = useActiveMainActions();
  const { user } = useAuth();

  const hasTrainingDays =
    routine.training_days && routine.training_days.length > 0;

  const handleStartWorkout = async () => {
    try {
      if (!user?.id) return;
      await initializeWorkout(routine.id, user.id);
      router.push("/workout/active");
    } catch (error) {
      console.error("Error starting workout:", error);
    }
  };

  const formatDays = (days: string[]) => {
    const dayMap = t.weekDaysShort[lang];
    return days.map((d) => dayMap[d as keyof typeof dayMap] || d).join(" · ");
  };

  const statsText = `${routine.blocksCount} ${
    routine.blocksCount === 1 ? t.block[lang] : t.blocks[lang]
  } · ${routine.exercisesCount} ${
    routine.exercisesCount === 1 ? t.exercise[lang] : t.exercises[lang]
  }`;

  return (
    <Pressable
      onPress={() => onLongPress(routine)}
      delayLongPress={300}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.8)",
            borderColor: hasTrainingDays
              ? `${colors.primary[500]}30`
              : isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.04)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 15 : 30}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.content}>
          {/* Left: Routine info */}
          <View style={styles.infoSection}>
            {/* Title row */}
            <View style={styles.titleRow}>
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: colors.text, flex: 1 }}
                numberOfLines={1}
              >
                {routine.name}
              </Typography>

              {hasTrainingDays && (
                <View
                  style={[
                    styles.scheduledIndicator,
                    { backgroundColor: `${colors.primary[500]}20` },
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

            {/* Stats */}
            <Typography
              variant="caption"
              color="textMuted"
              style={styles.statsText}
            >
              {statsText}
            </Typography>

            {/* Training days */}
            {hasTrainingDays && (
              <View style={styles.daysRow}>
                <Calendar size={12} color={colors.primary[500]} />
                <Typography
                  variant="caption"
                  weight="medium"
                  style={{ color: colors.primary[500], marginLeft: 6 }}
                >
                  {formatDays(routine.training_days!)}
                </Typography>
              </View>
            )}
          </View>

          {/* Right: Play button */}
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
            <Play size={18} color="#fff" fill="#fff" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  infoSection: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  scheduledIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
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
    marginTop: 6,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
