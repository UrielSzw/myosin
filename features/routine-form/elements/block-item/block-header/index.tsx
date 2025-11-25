import { IToogleSheet } from "@/features/routine-form/hooks/use-form-routine-sheets";
import { useMainActions } from "@/features/routine-form/hooks/use-routine-form-store";
import { BlockInsert } from "@/shared/db/schema";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import { Typography } from "@/shared/ui/typography";
import { EllipsisVertical, Timer } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

type Props = {
  block: BlockInsert & {
    tempId: string;
  };
  exercises: string[];
  onToggleSheet: (sheet?: IToogleSheet) => void;
  onPress: () => void;
};

export const BlockHeader: React.FC<Props> = ({
  block,
  exercises,
  onToggleSheet,
  onPress,
}) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = routineFormTranslations;

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
    const blockOrder = block.order_index + 1;
    const blockTypeLabel = getBlockTypeLabel(block.type, lang);

    if (block.type === "individual") {
      return t.exerciseNumber[lang].replace("{number}", blockOrder.toString());
    }

    return t.blockNumber[lang]
      .replace("{type}", blockTypeLabel)
      .replace("{number}", blockOrder.toString());
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
      <View style={{ flex: 1 }}>
        {/* First Row - Block Title and Main Controls */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
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
          {/* <Typography variant="caption" color="textMuted">
          {exercises.length} ejercicio
          {exercises.length !== 1 ? "s" : ""}
        </Typography> */}

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
                  accessibilityLabel={t.restBetweenExercises[lang]}
                  accessibilityHint={t.restBetweenExercisesHint[lang]}
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
                    {t.restBetween[lang]}{" "}
                    {formatRestTime(block.rest_between_exercises_seconds)}
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
                  accessibilityLabel={t.restBetweenRounds[lang]}
                  accessibilityHint={t.restBetweenRoundsHint[lang]}
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
                    {t.restRounds[lang]}{" "}
                    {formatRestTime(block.rest_time_seconds)}
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
                accessibilityLabel={t.restBetweenSets[lang]}
                accessibilityHint={t.restBetweenSetsHint[lang]}
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
