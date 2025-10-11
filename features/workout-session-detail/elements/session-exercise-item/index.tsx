import { WorkoutExerciseWithSets } from "@/shared/db/schema/workout-session";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { Dumbbell, Trophy } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { SessionSetsTable } from "../session-sets-table";

type Props = {
  exercise: WorkoutExerciseWithSets;
  blockType: "individual" | "superset" | "circuit";
  isLast: boolean;
};

export const SessionExerciseItem: React.FC<Props> = ({
  exercise,
  blockType,
  isLast,
}) => {
  const { colors } = useColorScheme();

  // Check if any set is a PR based on high estimated 1RM
  const hasPR = exercise.sets.some((set) => {
    if (!set.completed || !set.actual_weight || !set.actual_reps) return false;
    const estimatedOneRM = set.actual_weight * (1 + set.actual_reps / 30);
    return estimatedOneRM > set.actual_weight * 1.2; // Simple heuristic
  });

  const completedSets = exercise.sets.filter((set) => set.completed).length;
  const totalSets = exercise.sets.length;

  return (
    <View style={{ marginBottom: isLast ? 0 : 24 }}>
      {/* Exercise Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
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
              {exercise.exercise.main_muscle_group}
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
      <SessionSetsTable
        sets={exercise.sets}
        exerciseName={exercise.exercise.name}
      />
    </View>
  );
};
