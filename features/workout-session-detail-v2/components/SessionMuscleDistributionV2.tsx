import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { exerciseMuscleTranslations } from "@/shared/translations/exercise-labels";
import { workoutSessionDetailTranslations as t } from "@/shared/translations/workout-session-detail";
import type { SupportedLanguage } from "@/shared/types/language";
import { IExerciseMuscle } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Activity } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type MuscleGroupData = {
  group: string;
  sets: number;
  percentage: number;
};

type Props = {
  muscleGroups: MuscleGroupData[];
  lang: SupportedLanguage;
};

// Muscle group colors
const MUSCLE_COLORS: Record<string, string> = {
  chest: "#ef4444",
  back: "#3b82f6",
  shoulders: "#8b5cf6",
  biceps: "#f59e0b",
  triceps: "#f97316",
  legs: "#10b981",
  core: "#ec4899",
  glutes: "#14b8a6",
  forearms: "#6366f1",
  calves: "#84cc16",
};

const getMuscleColor = (group: string): string => {
  const normalizedGroup = group.toLowerCase();
  return MUSCLE_COLORS[normalizedGroup] || "#6b7280";
};

export const SessionMuscleDistributionV2: React.FC<Props> = ({
  muscleGroups,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const muscleT = exerciseMuscleTranslations;

  if (muscleGroups.length === 0) {
    return null;
  }

  // Sort by percentage
  const sortedGroups = [...muscleGroups].sort(
    (a, b) => b.percentage - a.percentage
  );

  // Get translated muscle name
  const getMuscleLabel = (group: string): string => {
    const key = group.toLowerCase() as IExerciseMuscle;
    return muscleT[key]?.[lang] || group;
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(500)}
      style={styles.container}
    >
      {/* Section Title */}
      <View style={styles.titleRow}>
        <Activity size={16} color={colors.primary[500]} />
        <Typography
          variant="body1"
          weight="semibold"
          style={{ color: colors.text, marginLeft: 8 }}
        >
          {t.muscleGroups[lang]}
        </Typography>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.85)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
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
          {/* Visual bar chart */}
          <View style={styles.barsContainer}>
            {sortedGroups.map((group, index) => {
              const color = getMuscleColor(group.group);
              return (
                <Animated.View
                  key={group.group}
                  entering={FadeInDown.duration(300).delay(600 + index * 50)}
                  style={styles.barRow}
                >
                  {/* Label and Sets */}
                  <View style={styles.barLabelRow}>
                    <View style={styles.labelContainer}>
                      <View
                        style={[styles.colorDot, { backgroundColor: color }]}
                      />
                      <Typography
                        variant="body2"
                        weight="medium"
                        style={{ color: colors.text }}
                      >
                        {getMuscleLabel(group.group)}
                      </Typography>
                    </View>
                    <Typography variant="caption" color="textMuted">
                      {group.sets} sets
                    </Typography>
                  </View>

                  {/* Progress Bar */}
                  <View
                    style={[
                      styles.progressBarBg,
                      {
                        backgroundColor: isDarkMode
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.06)",
                      },
                    ]}
                  >
                    <Animated.View
                      style={[
                        styles.progressBarFill,
                        {
                          backgroundColor: color,
                          width: `${group.percentage}%`,
                        },
                      ]}
                    />
                    <View style={styles.percentageOverlay}>
                      <Typography
                        variant="caption"
                        weight="bold"
                        style={{
                          color:
                            group.percentage > 50
                              ? "#fff"
                              : isDarkMode
                              ? colors.text
                              : colors.textMuted,
                          fontSize: 10,
                        }}
                      >
                        {group.percentage}%
                      </Typography>
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          </View>

          {/* Total sets summary */}
          <View
            style={[
              styles.totalRow,
              {
                borderTopColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
          >
            <Typography variant="caption" color="textMuted">
              {t.totalSets[lang]}
            </Typography>
            <Typography
              variant="body2"
              weight="bold"
              style={{ color: colors.text }}
            >
              {muscleGroups.reduce((sum, g) => sum + g.sets, 0)}
            </Typography>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    padding: 16,
  },
  barsContainer: {
    gap: 14,
  },
  barRow: {
    gap: 8,
  },
  barLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressBarBg: {
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 12,
    minWidth: 40,
  },
  percentageOverlay: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 14,
    marginTop: 14,
    borderTopWidth: 1,
  },
});
