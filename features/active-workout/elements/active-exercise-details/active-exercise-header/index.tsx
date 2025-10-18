import { EXERCISE_CATEGORY_LABELS } from "@/shared/constants/exercise";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { IExerciseMuscle } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { Dumbbell, EllipsisVertical } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

type Props = {
  exerciseName: string;
  exerciseMainMuscle: string;
  onPress: () => void;
};

export const ActiveExerciseHeader: React.FC<Props> = ({
  exerciseName,
  exerciseMainMuscle,
  onPress,
}) => {
  const { colors } = useColorScheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 8,
        alignItems: "center",
      }}
    >
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
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Typography variant="body1" weight="semibold" numberOfLines={2}>
            {exerciseName}
          </Typography>
        </View>
        <Typography variant="caption" color="textMuted">
          {EXERCISE_CATEGORY_LABELS[exerciseMainMuscle as IExerciseMuscle]}
        </Typography>
      </View>

      <TouchableOpacity
        onPress={onPress}
        style={{
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <EllipsisVertical size={28} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};
