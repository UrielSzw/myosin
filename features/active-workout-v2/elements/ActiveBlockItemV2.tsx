import {
  useActiveMainActions,
  useActiveWorkout,
} from "@/features/active-workout-v2/hooks/use-active-workout-store";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { BlurView } from "expo-blur";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ActiveBlockHeaderV2 } from "./ActiveBlockHeaderV2";
import { ActiveExerciseDetailsV2 } from "./ActiveExerciseDetailsV2";
import { ActiveExerciseItemV2 } from "./ActiveExerciseItemV2";

type Props = {
  blockId: string;
  index: number;
  onOpenBlockOptions: () => void;
  onOpenExerciseOptions: () => void;
  onOpenSetType: () => void;
  onOpenRestTime: () => void;
  onOpenRPESelector: () => void;
  onOpenTempoMetronome: () => void;
};

export const ActiveBlockItemV2: React.FC<Props> = ({
  blockId,
  index,
  onOpenBlockOptions,
  onOpenExerciseOptions,
  onOpenSetType,
  onOpenRestTime,
  onOpenRPESelector,
  onOpenTempoMetronome,
}) => {
  const { blocks, exercisesByBlock, exercises, setsByExercise } =
    useActiveWorkout();
  const { getBlockColors } = useBlockStyles();
  const { setCurrentState } = useActiveMainActions();
  const { isDarkMode } = useColorScheme();

  const block = blocks[blockId];
  const blockColors = getBlockColors(block.type);
  const exercisesInBlockIds = exercisesByBlock[blockId] || [];

  // Check if multi-exercise block has balanced sets (circuit or superset)
  const hasBalancedSets = useMemo(() => {
    if (!block || block.type === "individual") return true;
    if (exercisesInBlockIds.length === 0) return true;

    const setCounts = exercisesInBlockIds.map(
      (exId) => (setsByExercise[exId] || []).length
    );

    return setCounts.every((count) => count === setCounts[0]);
  }, [block, exercisesInBlockIds, setsByExercise]);

  const handleBlockPress = () => {
    if (block.type === "individual") {
      const exerciseInBlockId = exercisesInBlockIds[0];
      const exerciseInBlock = exercises[exerciseInBlockId];

      setCurrentState({
        currentBlockId: block.tempId,
        currentExerciseInBlockId: exerciseInBlock?.tempId,
        currentExerciseName: exerciseInBlock?.exercise.name || "",
        currentExerciseId: exerciseInBlock?.exercise.id || null,
        isCurrentBlockMulti: false,
      });
    } else {
      setCurrentState({
        currentBlockId: block.tempId,
        isCurrentBlockMulti: true,
      });
    }

    onOpenBlockOptions();
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(400)}
      style={styles.container}
    >
      <Pressable
        onPress={handleBlockPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.98 : 1 }]}
      >
        <View style={styles.cardWrapper}>
          {/* Type indicator bar - same as RoutineFormV2 */}
          <View
            style={[
              styles.typeIndicator,
              { backgroundColor: blockColors.primary },
            ]}
          />

          <BlurView
            intensity={isDarkMode ? 25 : 20}
            tint={isDarkMode ? "dark" : "light"}
            style={[
              styles.card,
              {
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
          >
            {/* Subtle decorative glow */}
            <View
              style={[
                styles.decorativeGlow,
                { backgroundColor: blockColors.primary },
              ]}
            />

            {/* Block header */}
            <ActiveBlockHeaderV2
              block={block}
              exercisesCount={exercisesInBlockIds.length}
              onPress={handleBlockPress}
              onOpenRestTime={onOpenRestTime}
              hasBalancedSets={hasBalancedSets}
            />

            {/* Exercises in block */}
            <View style={styles.exercisesContainer}>
              {exercisesInBlockIds.map((exerciseInBlockId, exIndex) => (
                <View key={exerciseInBlockId}>
                  {exIndex > 0 && block.type !== "individual" && (
                    <View
                      style={[
                        styles.exerciseDivider,
                        {
                          backgroundColor: isDarkMode
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.04)",
                        },
                      ]}
                    />
                  )}
                  <ActiveExerciseItemV2
                    block={block}
                    exerciseInBlockId={exerciseInBlockId}
                    exercisesCount={exercisesInBlockIds.length}
                    exerciseIndex={exIndex}
                  >
                    <ActiveExerciseDetailsV2
                      exerciseInBlockId={exerciseInBlockId}
                      block={block}
                      onPressIndividualBlock={handleBlockPress}
                      onOpenExerciseOptions={onOpenExerciseOptions}
                      onOpenSetType={onOpenSetType}
                      onOpenRPESelector={onOpenRPESelector}
                      onOpenTempoMetronome={onOpenTempoMetronome}
                    />
                  </ActiveExerciseItemV2>
                </View>
              ))}
            </View>
          </BlurView>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 14,
  },
  cardWrapper: {
    position: "relative",
  },
  typeIndicator: {
    position: "absolute",
    left: 0,
    top: 12,
    bottom: 12,
    width: 3,
    borderRadius: 2,
    zIndex: 10,
  },
  decorativeGlow: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.08,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    paddingLeft: 8,
    paddingTop: 10,
    paddingRight: 10,
  },
  exercisesContainer: {
    padding: 12,
    paddingTop: 0,
  },
  exerciseDivider: {
    height: 1,
    marginVertical: 16,
    marginHorizontal: -4,
  },
});
