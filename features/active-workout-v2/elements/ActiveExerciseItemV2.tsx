import { ActiveWorkoutBlock } from "@/features/active-workout-v2/hooks/use-active-workout-store";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { Timer } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  exerciseInBlockId: string;
  block: ActiveWorkoutBlock;
  exercisesCount: number;
  exerciseIndex: number;
  children: React.ReactNode;
};

export const ActiveExerciseItemV2: React.FC<Props> = ({
  block,
  children,
  exercisesCount,
  exerciseIndex,
}) => {
  const { getBlockColors, formatRestTime } = useBlockStyles();
  const { isDarkMode } = useColorScheme();

  const blockColors = getBlockColors(block.type);
  const isLastExercise = exerciseIndex === exercisesCount - 1;
  const isMultiBlock = block.type !== "individual";

  // Show rest between exercises for circuits (not last exercise)
  const showRestBetween =
    block.type === "circuit" &&
    !isLastExercise &&
    block.rest_between_exercises_seconds > 0;

  return (
    <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.95 : 1 }]}>
      <View
        style={[
          styles.container,
          isMultiBlock && {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.03)"
              : "rgba(0,0,0,0.02)",
            borderRadius: 12,
            padding: 10,
          },
        ]}
      >
        {/* Exercise Content */}
        {children}

        {/* Rest Between Exercises Indicator (for circuits) */}
        {showRestBetween && (
          <View
            style={[
              styles.restIndicator,
              {
                backgroundColor: isDarkMode
                  ? `${blockColors.primary}10`
                  : `${blockColors.primary}15`,
              },
            ]}
          >
            <Timer size={14} color={blockColors.primary} />
            <Typography
              variant="caption"
              weight="medium"
              style={{ color: blockColors.primary, marginLeft: 4 }}
            >
              Descanso: {formatRestTime(block.rest_between_exercises_seconds)}
            </Typography>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  restIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginTop: 8,
    borderRadius: 8,
  },
});
