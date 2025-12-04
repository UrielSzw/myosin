import { WorkoutExerciseWithSets } from "@/shared/db/schema/workout-session";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { exerciseMuscleTranslations } from "@/shared/translations/exercise-labels";
import { supportsPRCalculation } from "@/shared/types/measurement";
import { IExerciseMuscle } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { Dumbbell, Trophy } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SessionSetRowV2 } from "./SessionSetRowV2";

type Props = {
  exercise: WorkoutExerciseWithSets;
  isLast: boolean;
  showRpe: boolean;
  lang: "es" | "en";
};

export const SessionExerciseCardV2: React.FC<Props> = ({
  exercise,
  isLast,
  showRpe,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const muscleT = exerciseMuscleTranslations;

  // Check for PR
  const hasPR = exercise.sets.some((set) => {
    if (!set.completed || !supportsPRCalculation(set.measurement_template))
      return false;
    if (!set.actual_primary_value || !set.actual_secondary_value) return false;

    const weight = set.actual_primary_value;
    const reps = set.actual_secondary_value;
    const estimatedOneRM = weight * (1 + reps / 30);
    return estimatedOneRM > weight * 1.2;
  });

  const completedSets = exercise.sets.filter((set) => set.completed).length;
  const totalSets = exercise.sets.length;

  const getMuscleLabel = () => {
    const key = exercise.exercise.main_muscle_group as IExerciseMuscle;
    return (
      muscleT[key]?.[lang as "es" | "en"] || exercise.exercise.main_muscle_group
    );
  };

  return (
    <View
      style={[
        styles.container,
        !isLast && {
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.04)",
          paddingBottom: 16,
          marginBottom: 16,
        },
      ]}
    >
      {/* Exercise Header */}
      <View style={styles.header}>
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${colors.primary[500]}15` },
          ]}
        >
          <Dumbbell size={18} color={colors.primary[500]} />
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Typography
              variant="body2"
              weight="semibold"
              style={{ color: colors.text, flex: 1 }}
              numberOfLines={1}
            >
              {exercise.exercise.name}
            </Typography>
            {hasPR && (
              <View
                style={[
                  styles.prBadge,
                  { backgroundColor: `${colors.warning[500]}15` },
                ]}
              >
                <Trophy size={10} color={colors.warning[500]} />
                <Typography
                  variant="caption"
                  weight="bold"
                  style={{
                    color: colors.warning[500],
                    fontSize: 9,
                    marginLeft: 3,
                  }}
                >
                  PR
                </Typography>
              </View>
            )}
          </View>

          <View style={styles.metaRow}>
            <Typography
              variant="caption"
              color="textMuted"
              style={{ fontSize: 11 }}
            >
              {getMuscleLabel()}
            </Typography>
            <View style={[styles.dot, { backgroundColor: colors.textMuted }]} />
            <Typography
              variant="caption"
              color="textMuted"
              style={{ fontSize: 11 }}
            >
              {completedSets}/{totalSets} sets
            </Typography>
          </View>
        </View>
      </View>

      {/* Sets */}
      <View style={styles.setsContainer}>
        {exercise.sets.map((set, index) => (
          <SessionSetRowV2
            key={set.id}
            set={set}
            index={index}
            showRpe={showRpe}
            lang={lang}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  prBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 6,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  setsContainer: {
    gap: 6,
  },
});
