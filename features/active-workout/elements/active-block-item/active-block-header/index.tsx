import {
  ActiveWorkoutBlock,
  useActiveMainActions,
} from "@/features/active-workout/hooks/use-active-workout-store";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { Timer, Zap } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { IActiveToggleSheet } from "../../../hooks/use-active-workout-sheets";

type Props = {
  block: ActiveWorkoutBlock;
  onToggleSheet: (sheet?: IActiveToggleSheet) => void;
  exercisesIds: string[];
};

export const BlockHeader: React.FC<Props> = ({
  block,
  onToggleSheet,
  exercisesIds,
}) => {
  const { colors } = useColorScheme();
  const {
    getBlockTypeIcon,
    getBlockTypeLabel,
    formatRestTime,
    getBlockColors,
  } = useBlockStyles();
  const blockColors = getBlockColors(block.type);
  const { setCurrentState } = useActiveMainActions();

  const handlePress = () => {
    setCurrentState({
      currentBlockId: block.tempId,
      isCurrentBlockMulti: block.type !== "individual",
    });
    onToggleSheet("blockOptions");
  };

  const handleUpdateRestBetweenExercises = () => {
    setCurrentState({
      currentBlockId: block.tempId,
      currentRestTime: block.rest_between_exercises_seconds,
      currentRestTimeType: "between-exercises",
    });
    onToggleSheet("restTime");
  };

  const handleUpdateRestBetweenRounds = () => {
    setCurrentState({
      currentBlockId: block.tempId,
      currentRestTime: block.rest_time_seconds,
      currentRestTimeType: "between-rounds",
    });
    onToggleSheet("restTime");
  };

  const getBlockTitle = () => {
    const blockLetter = String.fromCharCode(65 + block.order_index); // A, B, C...
    const blockTypeLabel = getBlockTypeLabel(block.type);

    if (block.type === "individual") {
      return `Bloque ${blockLetter}`;
    }

    return `${blockTypeLabel} ${blockLetter}`;
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: blockColors.light,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      {/* First Row - Block Title and Timer */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        {/* Left - Block Title */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            flex: 1,
          }}
        >
          {getBlockTypeIcon(block.type)}
          <Typography
            variant="body2"
            weight="semibold"
            style={{ color: blockColors.primary }}
          >
            {getBlockTitle()}
          </Typography>
        </View>

        {/* Right - Timer Buttons (estandarizados) */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          {/* Timer Principal (siempre visible) */}
          <TouchableOpacity
            onPress={handleUpdateRestBetweenRounds}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 6,
              backgroundColor: blockColors.primary + "15",
              borderRadius: 6,
              minHeight: 32,
              minWidth: 60,
            }}
          >
            <Timer size={14} color={blockColors.primary} />
            <Typography
              variant="caption"
              weight="medium"
              style={{
                color: blockColors.primary,
                marginLeft: 4,
              }}
            >
              {block.type === "individual"
                ? formatRestTime(block.rest_time_seconds)
                : `Sets: ${formatRestTime(block.rest_time_seconds)}`}
            </Typography>
          </TouchableOpacity>

          {/* Timer Secundario (solo para multi-ejercicios) */}
          {block.type !== "individual" && (
            <TouchableOpacity
              onPress={handleUpdateRestBetweenExercises}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: blockColors.primary + "15",
                borderRadius: 6,
                minHeight: 32,
                minWidth: 60,
              }}
            >
              <Zap size={14} color={blockColors.primary} />
              <Typography
                variant="caption"
                weight="medium"
                style={{
                  color: blockColors.primary,
                  marginLeft: 4,
                }}
              >
                Entre: {formatRestTime(block.rest_between_exercises_seconds)}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Second Row - Exercise Count Only */}
      <View>
        <Typography variant="caption" color="textMuted">
          {exercisesIds.length > 1
            ? `${exercisesIds.length} ejercicios`
            : "Individual"}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};
