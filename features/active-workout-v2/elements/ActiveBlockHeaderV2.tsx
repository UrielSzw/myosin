import {
  ActiveWorkoutBlock,
  useActiveMainActions,
} from "@/features/active-workout-v2/hooks/use-active-workout-store";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { activeWorkoutTranslations } from "@/shared/translations/active-workout";
import { IBlockType } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import {
  Clock,
  Layers,
  MoreVertical,
  RefreshCw,
  Repeat,
  Zap,
} from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  block: ActiveWorkoutBlock;
  exercisesCount: number;
  onPress: () => void;
  onOpenRestTime: () => void;
};

const BLOCK_ICONS: Record<IBlockType, React.ReactNode> = {
  individual: <Layers size={14} color="#fff" />,
  superset: <RefreshCw size={14} color="#fff" />,
  circuit: <Repeat size={14} color="#fff" />,
};

export const ActiveBlockHeaderV2: React.FC<Props> = ({
  block,
  exercisesCount,
  onPress,
  onOpenRestTime,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = activeWorkoutTranslations;
  const { getBlockTypeLabel, formatRestTime, getBlockColors } =
    useBlockStyles();
  const blockColors = getBlockColors(block.type);
  const { setCurrentState } = useActiveMainActions();

  const blockLabel = getBlockTypeLabel(block.type);
  const isMultiExercise = exercisesCount > 1;

  const handleRestBetweenExercisesPress = () => {
    setCurrentState({
      currentBlockId: block.tempId,
      currentRestTime: block.rest_between_exercises_seconds,
      currentRestTimeType: "between-exercises",
    });
    onOpenRestTime();
  };

  const handleRestBetweenRoundsPress = () => {
    setCurrentState({
      currentBlockId: block.tempId,
      currentRestTime: block.rest_time_seconds,
      currentRestTimeType: "between-rounds",
    });
    onOpenRestTime();
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {/* Block Type Badge */}
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
              ? t.exercise[lang as "es" | "en"]
              : t.exercises[lang as "es" | "en"]}
          </Typography>
        )}
      </View>

      <View style={styles.rightSection}>
        {/* Rest Time Buttons */}
        {isMultiExercise ? (
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
                {t.between[lang as "es" | "en"]}{" "}
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
                {t.sets[lang as "es" | "en"]}{" "}
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

        {/* Options button (only for multi-exercise blocks) */}
        {block.type !== "individual" && (
          <Pressable
            onPress={onPress}
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
        )}
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
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
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
