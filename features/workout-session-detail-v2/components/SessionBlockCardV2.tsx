import { WorkoutBlockWithExercises } from "@/shared/db/schema/workout-session";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { workoutSessionDetailTranslations as t } from "@/shared/translations/workout-session-detail";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { ChevronDown, ChevronRight, Layers } from "lucide-react-native";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SessionExerciseCardV2 } from "./SessionExerciseCardV2";

type Props = {
  block: WorkoutBlockWithExercises;
  index: number;
  showRpe: boolean;
  lang: "es" | "en";
};

export const SessionBlockCardV2: React.FC<Props> = ({
  block,
  index,
  showRpe,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { getBlockColors } = useBlockStyles();
  const [isExpanded, setIsExpanded] = useState(true);

  const blockColors = getBlockColors(block.type);
  const expandAnimation = useSharedValue(1);

  // Calculate completion stats
  const totalSets = block.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.length,
    0
  );
  const completedSets = block.exercises.reduce(
    (sum, exercise) =>
      sum + exercise.sets.filter((set) => set.completed).length,
    0
  );
  const completionRate =
    totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  const isCompleted = completionRate === 100;

  const handleToggle = () => {
    expandAnimation.value = withTiming(isExpanded ? 0 : 1, { duration: 200 });
    setIsExpanded(!isExpanded);
  };

  const contentStyle = useAnimatedStyle(() => ({
    opacity: expandAnimation.value,
    maxHeight: expandAnimation.value === 0 ? 0 : 9999,
  }));

  const getBlockTypeLabel = () => {
    switch (block.type) {
      case "superset":
        return t.superset[lang];
      case "circuit":
        return t.circuit[lang];
      default:
        return t.individual[lang];
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(600 + index * 100)}
      style={styles.container}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.85)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 15 : 30}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Block Header */}
        <Pressable onPress={handleToggle} style={styles.header}>
          {/* Block number badge */}
          <View
            style={[
              styles.blockBadge,
              { backgroundColor: blockColors.primary },
            ]}
          >
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: "#fff", fontSize: 11 }}
            >
              {block.order_index + 1}
            </Typography>
          </View>

          {/* Block info */}
          <View style={styles.blockInfo}>
            <View style={styles.blockTitleRow}>
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: colors.text }}
                numberOfLines={1}
              >
                {block.type === "individual"
                  ? block.exercises[0]?.exercise?.name || t.exerciseLabel[lang]
                  : block.name}
              </Typography>
              {block.type !== "individual" && (
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: `${blockColors.primary}20` },
                  ]}
                >
                  <Layers size={10} color={blockColors.primary} />
                  <Typography
                    variant="caption"
                    weight="semibold"
                    style={{
                      color: blockColors.primary,
                      fontSize: 10,
                      marginLeft: 4,
                    }}
                  >
                    {getBlockTypeLabel()}
                  </Typography>
                </View>
              )}
            </View>

            <View style={styles.blockMeta}>
              <Typography variant="caption" color="textMuted">
                {block.exercises.length}{" "}
                {block.exercises.length === 1
                  ? lang === "es"
                    ? "ejercicio"
                    : "exercise"
                  : lang === "es"
                  ? "ejercicios"
                  : "exercises"}
              </Typography>
              <View
                style={[styles.dot, { backgroundColor: colors.textMuted }]}
              />
              <Typography variant="caption" color="textMuted">
                {completedSets}/{totalSets} sets
              </Typography>
            </View>
          </View>

          {/* Completion badge */}
          <View
            style={[
              styles.completionBadge,
              {
                backgroundColor: isCompleted
                  ? `${colors.success[500]}15`
                  : `${colors.primary[500]}15`,
              },
            ]}
          >
            <Typography
              variant="caption"
              weight="bold"
              style={{
                color: isCompleted ? colors.success[500] : colors.primary[500],
                fontSize: 11,
              }}
            >
              {completionRate}%
            </Typography>
          </View>

          {/* Expand icon */}
          <View style={styles.expandIcon}>
            {isExpanded ? (
              <ChevronDown size={18} color={colors.textMuted} />
            ) : (
              <ChevronRight size={18} color={colors.textMuted} />
            )}
          </View>
        </Pressable>

        {/* Exercises Content */}
        <Animated.View style={[styles.content, contentStyle]}>
          {isExpanded && (
            <View style={styles.exercisesList}>
              {block.exercises.map((exercise, exerciseIndex) => (
                <SessionExerciseCardV2
                  key={exercise.id}
                  exercise={exercise}
                  isLast={exerciseIndex === block.exercises.length - 1}
                  showRpe={showRpe}
                  lang={lang}
                />
              ))}
            </View>
          )}
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  blockBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  blockInfo: {
    flex: 1,
  },
  blockTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  blockMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  completionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  expandIcon: {
    marginLeft: 4,
  },
  content: {
    overflow: "hidden",
  },
  exercisesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
