import {
  BaseExercise,
  ExerciseInBlockInsert,
  SetInsert,
} from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import type { SupportedLanguage } from "@/shared/types/language";
import { IExerciseMuscle } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { MuscleVolumeData, VolumeChart } from "@/shared/ui/volume-chart";
import { VolumeCalculator } from "@/shared/utils/volume-calculator";
import { BlurView } from "expo-blur";
import { ChevronRight, TrendingUp } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = {
  exercisesInBlock: Record<
    string,
    ExerciseInBlockInsert & {
      tempId: string;
      exercise: BaseExercise;
    }
  >;
  sets: Record<
    string,
    SetInsert & {
      tempId: string;
    }
  >;
  trainingDays: string[];
  blocksByRoutine: string[];
  exercisesByBlock: Record<string, string[]>;
  lang: SupportedLanguage;
};

export const VolumePreviewV2: React.FC<Props> = ({
  exercisesInBlock,
  sets,
  trainingDays,
  blocksByRoutine,
  exercisesByBlock,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const t = routineFormTranslations;
  const [isExpanded, setIsExpanded] = useState(false);

  // Animation
  const expandProgress = useSharedValue(0);
  const chevronRotation = useSharedValue(0);

  useEffect(() => {
    expandProgress.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
    chevronRotation.value = withSpring(isExpanded ? 90 : 0);
  }, [isExpanded, expandProgress, chevronRotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  // Calculate volume
  const volumeData = useMemo(() => {
    if (!blocksByRoutine.length) {
      return { volumeByCategory: [], totalSets: 0 };
    }

    try {
      const exercisesForCalculation: {
        exerciseId: string;
        mainMuscle: IExerciseMuscle;
        secondaryMuscles: IExerciseMuscle[];
        setsCount: number;
      }[] = [];

      blocksByRoutine.forEach((blockId) => {
        const exerciseIds = exercisesByBlock[blockId] || [];

        exerciseIds.forEach((exerciseId) => {
          const exerciseInBlockData = exercisesInBlock[exerciseId];
          if (!exerciseInBlockData?.exercise) return;

          const exerciseSets = Object.values(sets).filter(
            (set: any) => set.exercise_in_block_id === exerciseId
          );

          const setsCount = exerciseSets.length;
          if (setsCount === 0) return;

          const weeklySets = setsCount * (trainingDays.length || 1);

          exercisesForCalculation.push({
            exerciseId: exerciseInBlockData.exercise.id,
            mainMuscle: exerciseInBlockData.exercise
              .main_muscle_group as IExerciseMuscle,
            secondaryMuscles: exerciseInBlockData.exercise
              .secondary_muscle_groups
              ? (exerciseInBlockData.exercise
                  .secondary_muscle_groups as IExerciseMuscle[])
              : [],
            setsCount: weeklySets,
          });
        });
      });

      if (exercisesForCalculation.length === 0) {
        return { volumeByCategory: [], totalSets: 0 };
      }

      const categoryVolume = VolumeCalculator.quickCalculateVolume(
        exercisesForCalculation
      );
      const volumeByCategory =
        VolumeCalculator.formatVolumeForDisplay(categoryVolume);
      const totalSets = Object.values(categoryVolume).reduce(
        (sum, volume) => sum + volume,
        0
      );

      return { volumeByCategory, totalSets };
    } catch (error) {
      console.error("Error calculating volume preview:", error);
      return { volumeByCategory: [], totalSets: 0 };
    }
  }, [exercisesInBlock, sets, trainingDays, blocksByRoutine, exercisesByBlock]);

  const hasVolume = blocksByRoutine.length > 0 && volumeData.totalSets > 0;

  const volumeDataForDisplay: MuscleVolumeData[] =
    volumeData.volumeByCategory.map((item) => ({
      category: item.category,
      sets: item.sets,
      percentage: item.percentage,
    }));

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(200)}
      style={styles.container}
    >
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.04)"
                : "rgba(255,255,255,0.9)",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          {Platform.OS === "ios" && (
            <BlurView
              intensity={isDarkMode ? 15 : 25}
              tint={isDarkMode ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          )}

          {/* Subtle decorative glow */}
          {hasVolume && (
            <View
              style={[
                styles.decorativeGlow,
                { backgroundColor: colors.primary[500] },
              ]}
            />
          )}

          <View style={styles.cardContent}>
            {/* Icon */}
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: hasVolume
                    ? `${colors.primary[500]}15`
                    : isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            >
              <TrendingUp
                size={18}
                color={hasVolume ? colors.primary[500] : colors.textMuted}
              />
            </View>

            {/* Text */}
            <View style={styles.textContainer}>
              <Typography variant="body2" weight="semibold">
                {t.volumeAnalysis[lang]}
              </Typography>
              {hasVolume ? (
                <Typography
                  variant="caption"
                  style={{ color: colors.primary[500] }}
                >
                  {Math.round(volumeData.totalSets)} {t.sets[lang]}/
                  {t.week[lang]}
                </Typography>
              ) : (
                <Typography variant="caption" color="textMuted">
                  {t.volumeEmpty[lang]}
                </Typography>
              )}
            </View>

            {/* Chevron - only show when there's volume to expand */}
            {hasVolume && (
              <Animated.View style={chevronStyle}>
                <ChevronRight size={20} color={colors.textMuted} />
              </Animated.View>
            )}
          </View>
        </View>
      </Pressable>

      {/* Expanded content */}
      {isExpanded && hasVolume && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.expandedContent}
        >
          <VolumeChart
            volumeData={volumeDataForDisplay}
            totalSets={Math.round(volumeData.totalSets)}
            lang={lang}
            showHeader={false}
            animationDelay={0}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  decorativeGlow: {
    position: "absolute",
    top: -25,
    right: -25,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.1,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  expandedContent: {
    marginTop: 12,
  },
});
