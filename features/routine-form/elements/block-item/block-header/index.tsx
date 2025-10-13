import { IToogleSheet } from "@/features/routine-form/hooks/use-form-routine-sheets";
import { useMainActions } from "@/features/routine-form/hooks/use-routine-form-store";
import { BlockInsert } from "@/shared/db/schema";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { Timer } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

type Props = {
  block: BlockInsert & {
    tempId: string;
  };
  exercises: string[];
  onToggleSheet: (sheet?: IToogleSheet) => void;
};

export const BlockHeader: React.FC<Props> = ({
  block,
  exercises,
  onToggleSheet,
}) => {
  const { colors } = useColorScheme();
  const { setCurrentState } = useMainActions();
  const {
    getBlockColors,
    getBlockTypeLabel,
    getBlockTypeIcon,
    formatRestTime,
  } = useBlockStyles();

  const blockColors = getBlockColors(block.type);

  const showRestTimeBetweenExercises = () => {
    setCurrentState({
      currentRestTime: block.rest_between_exercises_seconds,
      currentRestTimeType: "between-exercises",
      currentBlockId: block.tempId,
    });
    onToggleSheet("restTime");
  };

  const showRestTimeBetweenRounds = () => {
    setCurrentState({
      currentRestTime: block.rest_time_seconds,
      currentRestTimeType: "between-rounds",
      currentBlockId: block.tempId,
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
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: blockColors.light,
        borderBottomWidth: 1,
        borderTopEndRadius: 12,
        borderTopStartRadius: 12,
        borderEndEndRadius: 0,
        borderEndStartRadius: 0,
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
            {getBlockTitle()}
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
          {exercises.length} ejercicio
          {exercises.length !== 1 ? "s" : ""}
        </Typography>

        {/* Right - Rest Time Buttons */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {exercises.length > 1 ? (
            // Multi-exercise blocks: show 2 buttons
            <>
              {/* Rest Between Exercises */}
              <TouchableOpacity
                onPress={showRestTimeBetweenExercises}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: blockColors.primary + "10",
                  borderRadius: 6,
                  minHeight: 32,
                  minWidth: 60,
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Configurar tiempo de descanso entre ejercicios"
                accessibilityHint="Toca para ajustar el tiempo de descanso entre ejercicios"
                accessibilityValue={{
                  text: formatRestTime(block.rest_between_exercises_seconds),
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
                  Entre: {formatRestTime(block.rest_between_exercises_seconds)}
                </Typography>
              </TouchableOpacity>

              {/* Rest Between Rounds */}
              <TouchableOpacity
                onPress={showRestTimeBetweenRounds}
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
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Configurar tiempo de descanso entre vueltas"
                accessibilityHint="Toca para ajustar el tiempo de descanso entre vueltas del bloque"
                accessibilityValue={{
                  text: formatRestTime(block.rest_time_seconds),
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
                  Vueltas: {formatRestTime(block.rest_time_seconds)}
                </Typography>
              </TouchableOpacity>
            </>
          ) : (
            // Individual exercises: show 1 button (between sets)
            <TouchableOpacity
              onPress={showRestTimeBetweenRounds}
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
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Configurar tiempo de descanso entre series"
              accessibilityHint="Toca para ajustar el tiempo de descanso entre series"
              accessibilityValue={{
                text: formatRestTime(block.rest_time_seconds),
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
                {formatRestTime(block.rest_time_seconds)}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
