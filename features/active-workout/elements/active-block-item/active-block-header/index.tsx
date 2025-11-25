import {
  ActiveWorkoutBlock,
  useActiveMainActions,
} from "@/features/active-workout/hooks/use-active-workout-store";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { activeWorkoutTranslations } from "@/shared/translations/active-workout";
import { Typography } from "@/shared/ui/typography";
import { EllipsisVertical, Timer, Zap } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { IActiveToggleSheet } from "../../../hooks/use-active-workout-sheets";

type Props = {
  block: ActiveWorkoutBlock;
  exercisesIds: string[];
  onToggleSheet: (sheet?: IActiveToggleSheet) => void;
  onPress: () => void;
};

export const BlockHeader: React.FC<Props> = ({
  block,
  exercisesIds,
  onToggleSheet,
  onPress,
}) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = activeWorkoutTranslations;
  const {
    getBlockTypeIcon,
    getBlockTypeLabel,
    formatRestTime,
    getBlockColors,
  } = useBlockStyles();
  const blockColors = getBlockColors(block.type);
  const { setCurrentState } = useActiveMainActions();

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
    const blockOrder = block.order_index + 1;
    const blockTypeLabel = getBlockTypeLabel(block.type);

    if (block.type === "individual") {
      return `${t.exercise[lang]} ${blockOrder}`;
    }

    return `${blockTypeLabel} ${blockOrder}`;
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: blockColors.light,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* First Row - Block Title and Timer */}
      <View>
        {/* Left - Block Title */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            flex: 1,
            marginBottom: 14,
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
                : `${t.sets[lang]} ${formatRestTime(block.rest_time_seconds)}`}
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
                {t.between[lang]}{" "}
                {formatRestTime(block.rest_between_exercises_seconds)}
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {block.type !== "individual" && (
        <TouchableOpacity
          onPress={onPress}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EllipsisVertical size={28} color={blockColors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};
