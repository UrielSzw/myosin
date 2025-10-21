import { EXERCISE_CATEGORY_LABELS } from "@/shared/constants/exercise";
import { WorkoutExerciseWithSets } from "@/shared/db/schema/workout-session";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { supportsPRCalculation } from "@/shared/types/measurement";
import { IExerciseMuscle } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { Dumbbell, Trophy } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { SessionSetsTable } from "../session-sets-table";

type Props = {
  exercise: WorkoutExerciseWithSets;
  isLast: boolean;
  showRpe: boolean;
};

export const SessionExerciseItem: React.FC<Props> = ({
  exercise,
  isLast,
  showRpe,
}) => {
  const { colors } = useColorScheme();

  // Check if any set is a PR based on high estimated 1RM - only for exercises that support PR calculation
  const hasPR = exercise.sets.some((set) => {
    if (!set.completed || !supportsPRCalculation(set.measurement_template))
      return false;
    if (!set.actual_primary_value || !set.actual_secondary_value) return false;

    const weight = set.actual_primary_value;
    const reps = set.actual_secondary_value;
    const estimatedOneRM = weight * (1 + reps / 30);
    return estimatedOneRM > weight * 1.2; // Simple heuristic
  });

  const completedSets = exercise.sets.filter((set) => set.completed).length;
  const totalSets = exercise.sets.length;

  return (
    <View
      style={{
        marginBottom: isLast ? 0 : 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
        paddingBottom: isLast ? 0 : 8,
        paddingHorizontal: 10,
      }}
    >
      {/* Exercise Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 8,
        }}
      >
        {/* Exercise Icon */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            backgroundColor: colors.border,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Dumbbell size={24} color={colors.textMuted} />
        </View>

        {/* Exercise Info */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Typography variant="body1" weight="semibold" style={{ flex: 1 }}>
              {exercise.exercise.name}
            </Typography>
            {hasPR && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: "#FFD70020",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 8,
                }}
              >
                <Trophy size={12} color="#FFD700" />
                <Typography
                  variant="caption"
                  style={{ color: "#FFD700", fontSize: 10 }}
                  weight="semibold"
                >
                  PR
                </Typography>
              </View>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginTop: 2,
            }}
          >
            <Typography variant="caption" color="textMuted">
              {
                EXERCISE_CATEGORY_LABELS[
                  exercise.exercise.main_muscle_group as IExerciseMuscle
                ]
              }
            </Typography>
            <Typography variant="caption" color="textMuted">
              {completedSets}/{totalSets} sets
            </Typography>
            {exercise.execution_order !== null && (
              <Typography variant="caption" color="textMuted">
                Orden: {exercise.execution_order + 1}
              </Typography>
            )}
          </View>
        </View>
      </View>

      {/* Sets Table */}
      <SessionSetsTable sets={exercise.sets} showRpe={showRpe} />
    </View>
  );
};
