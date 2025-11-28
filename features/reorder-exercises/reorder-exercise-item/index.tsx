import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useHaptic } from "@/shared/services/haptic-service";
import { ReorderExercise } from "@/shared/types/reorder";
import { IBlockType } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { Dumbbell, GripVertical } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

type Props = {
  exercise: ReorderExercise;
  index: number;
  drag: () => void;
  isActive: boolean;
  blockType: IBlockType;
};

export const ReorderExerciseItem: React.FC<Props> = ({
  exercise,
  index,
  drag,
  isActive,
  blockType,
}) => {
  const { colors } = useColorScheme();
  const haptic = useHaptic();

  const getBlockTypeColor = (type: IBlockType) => {
    switch (type) {
      case "superset":
        return "#FF6B35"; // Orange
      case "circuit":
        return "#4A90E2"; // Blue
      default:
        return colors.primary[500];
    }
  };

  const blockColor = getBlockTypeColor(blockType);

  return (
    <TouchableOpacity
      onLongPress={() => {
        haptic.drag();
        drag();
      }}
      delayLongPress={300}
      style={{
        backgroundColor: isActive ? colors.primary[100] : colors.surface,
        borderWidth: 1,
        borderColor: isActive ? colors.primary[300] : colors.border,
        borderRadius: 12,
        padding: 16,
        marginVertical: 4,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isActive ? 0.2 : 0.1,
        shadowRadius: 4,
        elevation: isActive ? 4 : 2,
      }}
      activeOpacity={0.9}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Drag Handle */}
        <View style={{ marginRight: 12 }}>
          <GripVertical size={20} color={colors.textMuted} />
        </View>

        {/* Exercise Number */}
        <View style={{ marginRight: 12 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: blockColor,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: colors.background,
            }}
          >
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: "white" }}
            >
              {index + 1}
            </Typography>
          </View>
        </View>

        {/* Exercise Image */}
        <View style={{ marginRight: 12 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              backgroundColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Dumbbell size={24} color={colors.textMuted} />
          </View>
        </View>

        {/* Exercise Info */}
        <View style={{ flex: 1 }}>
          <Typography variant="body1" weight="semibold">
            {exercise.exercise.name}
          </Typography>
          <Typography variant="caption" color="textMuted">
            {exercise.exercise.main_muscle_group}
          </Typography>
          <Typography variant="caption" color="textMuted">
            {exercise.exercise.primary_equipment}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};
