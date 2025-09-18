import { BlockInsert } from "@/shared/db/schema";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { Typography } from "@/shared/ui/typography";
import { Timer } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useRoutineFormState } from "../../hooks/use-routine-form-store";

type Props = {
  exerciseInBlockId: string;
  children: React.ReactNode;
  block: BlockInsert & {
    tempId: string;
  };
  exercisesCount: number;
};

const ExerciseInBlockItemComponent: React.FC<Props> = ({
  exerciseInBlockId,
  children,
  exercisesCount,
  block,
}) => {
  const { exercisesInBlock } = useRoutineFormState();
  const { getBlockColors, formatRestTime } = useBlockStyles();

  const blockColors = getBlockColors(block.type);
  const exerciseInBlock = exercisesInBlock[exerciseInBlockId];

  return (
    <View style={{ position: "relative" }}>
      {/* Exercise Container */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          {/* Exercise Number with Connection to Line */}
          {/* <BlockLine
            block={block}
            exerciseIndex={exerciseInBlock.order_index}
            blockColors={blockColors}
            exercisesCount={exercisesCount}
          /> */}

          {/* Exercise Details */}
          {children}
        </View>
      </View>

      {/* Rest Between Exercises (for circuits) */}
      {block.type === "circuit" &&
        exerciseInBlock.order_index < exercisesCount - 1 &&
        block.rest_between_exercises_seconds > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 8,
              marginHorizontal: 16,
              backgroundColor: blockColors.light,
              borderRadius: 8,
              marginBottom: 8,
              position: "relative",
            }}
          >
            {/* Rest indicator on the line */}
            <View
              style={{
                position: "absolute",
                left: 16,
                width: 3,
                height: "100%",
                backgroundColor: blockColors.primary,
              }}
            />
            <Timer size={14} color={blockColors.primary} />
            <Typography
              variant="caption"
              style={{ color: blockColors.primary, marginLeft: 4 }}
            >
              Descanso: {formatRestTime(block.rest_between_exercises_seconds)}
            </Typography>
          </View>
        )}
    </View>
  );
};

export const ExerciseInBlockItem = React.memo(ExerciseInBlockItemComponent);
ExerciseInBlockItem.displayName = "ExerciseInBlockItem";
