import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { Typography } from "@/shared/ui/typography";
import { Timer } from "lucide-react-native";
import { View } from "react-native";
import {
  ActiveWorkoutBlock,
  useActiveWorkout,
} from "../../hooks/use-active-workout-store";

type Props = {
  exerciseInBlockId: string;
  block: ActiveWorkoutBlock;
  exercisesCount: number;
  children: React.ReactNode;
};

export const ActiveExerciseItem: React.FC<Props> = ({
  exerciseInBlockId,
  block,
  children,
  exercisesCount,
}) => {
  const { exercises } = useActiveWorkout();
  const { getBlockColors, formatRestTime } = useBlockStyles();

  const blockColors = getBlockColors(block.type);
  const exerciseInBlock = exercises[exerciseInBlockId];

  return (
    <View style={{ position: "relative" }}>
      {/* Exercise Container */}
      <View style={{ paddingVertical: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
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
