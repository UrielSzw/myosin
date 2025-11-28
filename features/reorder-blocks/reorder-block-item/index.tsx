import { BlockInsert } from "@/shared/db/schema";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useReorderBlocksState } from "@/shared/hooks/use-reorder-store";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { IBlockType } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { GripVertical } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

type Props = {
  blockData: BlockInsert & { tempId: string };
  drag: () => void;
  isActive: boolean;
};

export const ReorderBlockItem: React.FC<Props> = ({
  blockData,
  drag,
  isActive,
}) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = sharedUiTranslations;
  const { getBlockTypeLabel } = useBlockStyles();
  const { exercisesByBlock, exercisesInBlock } = useReorderBlocksState();
  const haptic = useHaptic();

  const getBlockTypeColor = (type: IBlockType) => {
    switch (type) {
      case "superset":
        return colors.warning[500];
      case "circuit":
        return colors.primary[500];
      default:
        return colors.textMuted;
    }
  };

  const exercisesIds = exercisesByBlock[blockData.tempId] || [];

  const exercisesNames = exercisesIds.map((ex) => {
    const exercise = exercisesInBlock[ex];
    return exercise ? exercise.exercise.name : t.deletedExercise[lang];
  });

  const exerciseNames = exercisesNames.length
    ? exercisesNames.join(", ")
    : t.noExercises[lang];

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

        {/* Block Info */}
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Typography variant="body1" weight="semibold">
              Bloque {blockData.order_index + 1}
            </Typography>
            <View
              style={{
                backgroundColor: getBlockTypeColor(blockData.type) + "20",
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 12,
                marginLeft: 8,
              }}
            >
              <Typography
                variant="caption"
                weight="medium"
                style={{ color: getBlockTypeColor(blockData.type) }}
              >
                {getBlockTypeLabel(blockData.type)}
              </Typography>
            </View>
          </View>

          {/* Exercise Info */}
          <Typography
            variant="body2"
            color="textMuted"
            numberOfLines={2}
            style={{ marginBottom: 4 }}
          >
            {exerciseNames}
          </Typography>

          {/* Stats */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Typography variant="caption" color="textMuted">
              {exercisesIds.length} ejercicio
              {exercisesIds.length > 1 ? "s" : ""}
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
