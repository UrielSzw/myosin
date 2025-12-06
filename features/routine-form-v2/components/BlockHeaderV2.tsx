import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import { toSupportedLanguage } from "@/shared/types/language";
import { IBlockType } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import {
  AlertTriangle,
  Clock,
  Layers,
  MoreVertical,
  RefreshCw,
  Repeat,
  Zap,
} from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { IToogleSheet } from "../hooks/use-form-routine-sheets";
import { useMainActions } from "../hooks/use-routine-form-store";

type BlockData = {
  tempId: string;
  name: string;
  type: IBlockType;
  rest_between_exercises_seconds?: number | null;
  rest_time_seconds?: number | null;
};

type Props = {
  block: BlockData;
  exercisesCount: number;
  onToggleSheet: (sheet?: IToogleSheet) => void;
  onOptionsPress: () => void;
  hasBalancedSets?: boolean;
};

const BLOCK_ICONS: Record<IBlockType, React.ReactNode> = {
  individual: <Layers size={14} color="#fff" />,
  superset: <RefreshCw size={14} color="#fff" />,
  circuit: <Repeat size={14} color="#fff" />,
};

export const BlockHeaderV2: React.FC<Props> = ({
  block,
  exercisesCount,
  onToggleSheet,
  onOptionsPress,
  hasBalancedSets = true,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { getBlockTypeLabel, getBlockColors, formatRestTime } =
    useBlockStyles();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = routineFormTranslations;

  const { setCurrentState } = useMainActions();

  const blockColors = getBlockColors(block.type);
  const blockLabel = getBlockTypeLabel(block.type);

  // Multi-exercise = more than 1 exercise in the block
  const isMultiExercise = exercisesCount > 1;

  // Handler for rest between exercises (only multi-exercise blocks)
  const handleRestBetweenExercisesPress = () => {
    setCurrentState({
      currentBlockId: block.tempId,
      currentRestTime: block.rest_between_exercises_seconds ?? 0,
      currentRestTimeType: "between-exercises",
    });
    onToggleSheet("restTime");
  };

  // Handler for rest between rounds/sets
  const handleRestBetweenRoundsPress = () => {
    setCurrentState({
      currentBlockId: block.tempId,
      currentRestTime: block.rest_time_seconds ?? 60,
      currentRestTimeType: "between-rounds",
    });
    onToggleSheet("restTime");
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {/* Block Type Badge */}
        <View style={styles.badgeRow}>
          <View
            style={[styles.typeBadge, { backgroundColor: blockColors.primary }]}
          >
            {BLOCK_ICONS[block.type]}
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: "#fff", marginLeft: 4, fontSize: 10 }}
            >
              {blockLabel.toUpperCase()}
            </Typography>
          </View>

          {/* Unbalanced Sets Warning */}
          {block.type !== "individual" && !hasBalancedSets && (
            <View
              style={[
                styles.warningBadge,
                {
                  backgroundColor: `${colors.warning[500]}15`,
                  borderColor: `${colors.warning[500]}30`,
                },
              ]}
            >
              <AlertTriangle size={10} color={colors.warning[500]} />
              <Typography
                variant="caption"
                weight="medium"
                style={{
                  color: colors.warning[500],
                  marginLeft: 3,
                  fontSize: 9,
                }}
              >
                {t.unbalancedSets[lang]}
              </Typography>
            </View>
          )}
        </View>

        {/* Block Name */}
        {block.type !== "individual" && block.name && (
          <Typography
            variant="body2"
            weight="semibold"
            numberOfLines={1}
            style={{ marginTop: 6 }}
          >
            {block.name}
          </Typography>
        )}

        {/* Exercise count for multi-blocks */}
        {block.type !== "individual" && (
          <Typography
            variant="caption"
            color="textMuted"
            style={{ marginTop: 2 }}
          >
            {exercisesCount}{" "}
            {exercisesCount === 1
              ? sharedUiTranslations.exercise[lang]
              : sharedUiTranslations.exercises[lang]}
          </Typography>
        )}
      </View>

      <View style={styles.rightSection}>
        {/* Rest Time Buttons */}
        {isMultiExercise ? (
          // Multi-exercise: 2 buttons
          <>
            {/* Rest Between Exercises */}
            <Pressable
              onPress={handleRestBetweenExercisesPress}
              style={({ pressed }) => [
                styles.restButton,
                {
                  backgroundColor: `${blockColors.primary}15`,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Zap size={12} color={blockColors.primary} />
              <Typography
                variant="caption"
                weight="medium"
                style={{
                  marginLeft: 4,
                  fontSize: 10,
                  color: blockColors.primary,
                }}
              >
                {t.restBetween[lang]}{" "}
                {formatRestTime(block.rest_between_exercises_seconds || 0)}
              </Typography>
            </Pressable>

            {/* Rest Between Rounds */}
            <Pressable
              onPress={handleRestBetweenRoundsPress}
              style={({ pressed }) => [
                styles.restButton,
                {
                  backgroundColor: `${blockColors.primary}15`,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Clock size={12} color={blockColors.primary} />
              <Typography
                variant="caption"
                weight="medium"
                style={{
                  marginLeft: 4,
                  fontSize: 10,
                  color: blockColors.primary,
                }}
              >
                {t.restRounds[lang]}{" "}
                {formatRestTime(block.rest_time_seconds || 60)}
              </Typography>
            </Pressable>
          </>
        ) : (
          // Individual: 1 button (rest between sets)
          <Pressable
            onPress={handleRestBetweenRoundsPress}
            style={({ pressed }) => [
              styles.restButton,
              {
                backgroundColor: `${blockColors.primary}15`,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Clock size={12} color={blockColors.primary} />
            <Typography
              variant="caption"
              weight="medium"
              style={{
                marginLeft: 4,
                fontSize: 10,
                color: blockColors.primary,
              }}
            >
              {formatRestTime(block.rest_time_seconds || 60)}
            </Typography>
          </Pressable>
        )}

        {/* Options button (all blocks) */}
        <Pressable
          onPress={onOptionsPress}
          style={({ pressed }) => [
            styles.optionsButton,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.04)",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <MoreVertical size={18} color={colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  leftSection: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  warningBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "flex-end",
    maxWidth: "55%",
  },
  restButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  optionsButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
