import { WorkoutBlockWithExercises } from "@/shared/db/schema/workout-session";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { SessionExerciseItem } from "../session-exercise-item";

type Props = {
  block: WorkoutBlockWithExercises;
  isLast: boolean;
  showRpe: boolean;
};

export const SessionBlockItem: React.FC<Props> = ({
  block,
  isLast,
  showRpe,
}) => {
  const { colors } = useColorScheme();
  const { getBlockColors } = useBlockStyles();
  const [isExpanded, setIsExpanded] = useState(true);

  const blockColors = getBlockColors(block.type);

  // Calculate completion stats
  const totalSets = block.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.length,
    0
  );
  const completedSets = block.exercises.reduce(
    (sum, exercise) =>
      sum + exercise.sets.filter((set) => set.completed).length,
    0
  );

  const getBlockTypeLabel = (type: string) => {
    switch (type) {
      case "superset":
        return "Superset";
      case "circuit":
        return "Circuito";
      default:
        return "Individual";
    }
  };

  return (
    <View style={{ marginBottom: isLast ? 0 : 16 }}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={`${isExpanded ? "Contraer" : "Expandir"} bloque ${
          block.name
        }`}
      >
        <Card variant="outlined" padding="none">
          {/* Block Header - Similar to routine-form */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              backgroundColor: blockColors.light,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderBottomLeftRadius: isExpanded ? 0 : 8,
              borderBottomRightRadius: isExpanded ? 0 : 8,
            }}
          >
            {/* Block type indicator */}
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: blockColors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Typography
                variant="caption"
                weight="bold"
                style={{ color: "#ffffff", fontSize: 10 }}
              >
                {block.order_index + 1}
              </Typography>
            </View>

            {/* Block info */}
            <View style={{ flex: 1 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Typography variant="body1" weight="semibold">
                  {block.type === "individual"
                    ? "Ejercicio Individual"
                    : block.name}
                </Typography>
              </View>

              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginTop: 2 }}
              >
                {block.exercises.length} ejercicio
                {block.exercises.length !== 1 ? "s" : ""} • {completedSets}/
                {totalSets} sets
              </Typography>
            </View>

            {/* Expand/Collapse icon */}
            <View style={{ marginLeft: 8 }}>
              {isExpanded ? (
                <ChevronDown size={20} color={colors.textMuted} />
              ) : (
                <ChevronRight size={20} color={colors.textMuted} />
              )}
            </View>
          </View>

          {/* Exercises List */}
          {isExpanded && (
            <View style={{ position: "relative" }}>
              {block.exercises.map((exercise, index) => (
                <SessionExerciseItem
                  key={exercise.id}
                  exercise={exercise}
                  isLast={index === block.exercises.length - 1}
                  showRpe={showRpe}
                />
              ))}
            </View>
          )}
        </Card>
      </TouchableOpacity>
    </View>
  );
};
