import { IToogleSheet } from "@/features/routine-form/hooks/use-form-routine-sheets";
import {
  useMainActions,
  useRoutineFormState,
} from "@/features/routine-form/hooks/use-routine-form-store";
import { useReorderBlocks } from "@/features/routine-form/shared/use-reorder-blocks";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useHaptic } from "@/shared/services/haptic-service";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { BlockHeaderV2 } from "./BlockHeaderV2";
import { ExerciseCardV2 } from "./ExerciseCardV2";

type Props = {
  blockId: string;
  onToggleSheet: (sheet?: IToogleSheet) => void;
  index: number;
};

export const BlockItemV2: React.FC<Props> = ({
  blockId,
  onToggleSheet,
  index,
}) => {
  const { blocks, exercisesByBlock, exercisesInBlock } = useRoutineFormState();
  const { setCurrentState } = useMainActions();
  const { initializeReorder } = useReorderBlocks();
  const { getBlockColors } = useBlockStyles();
  const { isDarkMode } = useColorScheme();
  const haptic = useHaptic();

  const block = blocks[blockId];
  const exercisesInBlockIds = exercisesByBlock[blockId] || [];
  const blockColors = getBlockColors(block?.type);

  const handleLongPress = () => {
    haptic.drag();
    initializeReorder();
    router.push("/routines/reorder-blocks");
  };

  const handlePress = () => {
    if (block.type === "individual") {
      const exerciseInBlockId = exercisesInBlockIds[0];
      const exerciseInBlock = exercisesInBlock[exerciseInBlockId];

      setCurrentState({
        currentBlockId: blockId,
        currentExerciseInBlockId: exerciseInBlock?.tempId,
        currentExerciseName: exerciseInBlock?.exercise.name || "",
        currentExerciseId: exerciseInBlock?.exercise.id || null,
        isCurrentBlockMulti: false,
      });
    } else {
      setCurrentState({
        currentBlockId: blockId,
        isCurrentBlockMulti: true,
      });
    }

    onToggleSheet("blockOptions");
  };

  if (!block || !exercisesInBlockIds.length) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(400)}
      style={styles.container}
    >
      <Pressable
        onLongPress={handleLongPress}
        delayLongPress={500}
        style={({ pressed }) => [{ opacity: pressed ? 0.98 : 1 }]}
      >
        {/* Block Card */}
        <View style={styles.cardWrapper}>
          {/* Type indicator bar */}
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

            {/* Block Header */}
            <BlockHeaderV2
              block={block}
              exercisesCount={exercisesInBlockIds.length}
              onToggleSheet={onToggleSheet}
              onOptionsPress={handlePress}
            />

            {/* Exercises */}
            <View style={styles.exercisesContainer}>
              {exercisesInBlockIds.map((exerciseInBlockId, exerciseIndex) => (
                <View key={exerciseInBlockId}>
                  {exerciseIndex > 0 && block.type !== "individual" && (
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
                  <ExerciseCardV2
                    exerciseInBlockId={exerciseInBlockId}
                    block={{
                      tempId: block.tempId,
                      name: block.name,
                      type: block.type,
                    }}
                    exerciseIndex={exerciseIndex}
                    exercisesCount={exercisesInBlockIds.length}
                    onToggleSheet={onToggleSheet}
                    onPressIndividualBlock={handlePress}
                  />
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
