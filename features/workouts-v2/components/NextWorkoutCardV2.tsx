import { RoutineWithMetrics } from "@/shared/db/repository/routines";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Calendar, Play, Sparkles } from "lucide-react-native";
import React, { useMemo } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

type Props = {
  routines: RoutineWithMetrics[];
};

export const NextWorkoutCardV2 = ({ routines }: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";

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
        dayLabel: lang === "es" ? "Hoy" : "Today",
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
            ? lang === "es"
              ? "Mañana"
              : "Tomorrow"
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
        dayLabel: lang === "es" ? "Entrena cuando quieras" : "Train anytime",
      };
    }

    return null;
  }, [routines, lang]);

  if (!nextWorkout) {
    return null;
  }

  const { routine, isToday, dayLabel } = nextWorkout;

  const handleStartWorkout = () => {
    console.log("Start workout:", routine.id);
  };

  return (
    <View style={styles.container}>
      {/* Glass card */}
      <View
        style={[
          styles.card,
          {
            borderColor: isToday
              ? `${colors.primary[500]}40`
              : isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.03)"
              : "rgba(255,255,255,0.7)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 20 : 40}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Header row */}
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
          </View>

          {/* Main content */}
          <View style={styles.mainContent}>
            <View style={styles.textContent}>
              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginBottom: 4 }}
              >
                {lang === "es" ? "Próximo entrenamiento" : "Next workout"}
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
                <View style={styles.stat}>
                  <Typography variant="caption" color="textMuted">
                    {routine.blocksCount}{" "}
                    {routine.blocksCount === 1 ? "bloque" : "bloques"}
                  </Typography>
                </View>
                <View
                  style={[
                    styles.statDot,
                    { backgroundColor: colors.textMuted },
                  ]}
                />
                <View style={styles.stat}>
                  <Typography variant="caption" color="textMuted">
                    {routine.exercisesCount}{" "}
                    {routine.exercisesCount === 1 ? "ejercicio" : "ejercicios"}
                  </Typography>
                </View>
              </View>
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
              <Play size={26} color="#fff" fill="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Subtle glow for today's workout */}
        {isToday && (
          <View
            style={[styles.glow, { backgroundColor: colors.primary[500] }]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  content: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
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
    marginTop: 8,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
  },
  statDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 8,
    opacity: 0.5,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  glow: {
    position: "absolute",
    bottom: -20,
    left: "20%",
    right: "20%",
    height: 40,
    borderRadius: 20,
    opacity: 0.15,
  },
});
