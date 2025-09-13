import {
  ActiveWorkoutBlock,
  useActiveMainActions,
} from "@/features/active-workout/hooks/use-active-workout-store";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { Timer } from "lucide-react-native";
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
      {/* First Row - Block Title and Main Controls */}
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
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {getBlockTypeIcon(block.type)}
          <Typography
            variant="body2"
            weight="semibold"
            style={{ color: blockColors.primary }}
          >
            {block.name ||
              `${getBlockTypeLabel(block.type)} ${block.order_index + 1}`}
          </Typography>
        </View>
      </View>

      {/* Second Row - Exercise Count and Rest Times */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left - Exercise Count */}
        <Typography variant="caption" color="textMuted">
          {exercisesIds.length} ejercicio
          {exercisesIds.length !== 1 ? "s" : ""}
        </Typography>

        {/* Right - Rest Time Buttons */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {exercisesIds.length > 1 ? (
            // Multi-exercise blocks: show 2 buttons
            <>
              {/* Rest Between Exercises */}
              <TouchableOpacity
                onPress={handleUpdateRestBetweenExercises}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  // Área clickeable mínima para accesibilidad
                  minHeight: 36,
                  minWidth: 36,
                  paddingVertical: 6,
                  paddingHorizontal: 8,
                  backgroundColor: blockColors.primary + "10",
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: blockColors.border,
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Configurar tiempo de descanso entre ejercicios"
                accessibilityHint="Toca para ajustar el tiempo de descanso entre ejercicios"
                accessibilityValue={{
                  text: formatRestTime(block.rest_between_exercises_seconds),
                }}
              >
                <Timer size={12} color={blockColors.primary} />
                <Typography
                  variant="caption"
                  weight="medium"
                  style={{
                    color: blockColors.primary,
                    marginLeft: 3,
                    fontSize: 10,
                  }}
                >
                  Entre: {formatRestTime(block.rest_between_exercises_seconds)}
                </Typography>
              </TouchableOpacity>

              {/* Rest Between Rounds */}
              <TouchableOpacity
                onPress={handleUpdateRestBetweenRounds}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  // Área clickeable mínima para accesibilidad
                  minHeight: 36,
                  minWidth: 36,
                  paddingVertical: 6,
                  paddingHorizontal: 8,
                  backgroundColor: blockColors.primary + "15",
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: blockColors.border,
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Configurar tiempo de descanso entre vueltas"
                accessibilityHint="Toca para ajustar el tiempo de descanso entre vueltas del bloque"
                accessibilityValue={{
                  text: formatRestTime(block.rest_time_seconds),
                }}
              >
                <Timer size={12} color={blockColors.primary} />
                <Typography
                  variant="caption"
                  weight="medium"
                  style={{
                    color: blockColors.primary,
                    marginLeft: 3,
                    fontSize: 10,
                  }}
                >
                  Vueltas: {formatRestTime(block.rest_time_seconds)}
                </Typography>
              </TouchableOpacity>
            </>
          ) : (
            // Individual exercises: show 1 button (between sets)
            <TouchableOpacity
              onPress={handleUpdateRestBetweenRounds}
              style={{
                flexDirection: "row",
                alignItems: "center",
                // Área clickeable mínima para accesibilidad
                minHeight: 36,
                minWidth: 36,
                paddingVertical: 6,
                paddingHorizontal: 8,
                backgroundColor: blockColors.primary + "15",
                borderRadius: 4,
                borderWidth: 1,
                borderColor: blockColors.border,
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Configurar tiempo de descanso entre series"
              accessibilityHint="Toca para ajustar el tiempo de descanso entre series"
              accessibilityValue={{
                text: formatRestTime(block.rest_time_seconds),
              }}
            >
              <Timer size={12} color={blockColors.primary} />
              <Typography
                variant="caption"
                weight="medium"
                style={{
                  color: blockColors.primary,
                  marginLeft: 3,
                  fontSize: 10,
                }}
              >
                {formatRestTime(block.rest_time_seconds)}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
