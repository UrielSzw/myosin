import { toSupportedLanguage } from "@/shared/types/language";
import { useReorderExercises } from "@/features/routine-form-v2/shared/use-reorder-exercises";

import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseMuscleTranslations } from "@/shared/translations/exercise-labels";
import { IBlockType, IExerciseMuscle } from "@/shared/types/workout";
import { ExerciseMedia } from "@/shared/ui/exercise-media";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { EllipsisVertical } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { IToogleSheet } from "../hooks/use-form-routine-sheets";
import {
  useMainActions,
  useRoutineFormState,
} from "../hooks/use-routine-form-store";
import { SetsTableV2 } from "./SetsTableV2";

type BlockData = {
  tempId: string;
  name: string;
  type: IBlockType;
};

type Props = {
  exerciseInBlockId: string;
  block: BlockData;
  exerciseIndex: number;
  exercisesCount: number;
  onToggleSheet: (sheet?: IToogleSheet) => void;
  onPressIndividualBlock: () => void;
};

export const ExerciseCardV2: React.FC<Props> = ({
  exerciseInBlockId,
  block,
  exerciseIndex,
  exercisesCount,
  onToggleSheet,
  onPressIndividualBlock,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const muscleT = exerciseMuscleTranslations;

  const { exercisesInBlock, setsByExercise } = useRoutineFormState();
  const { setCurrentState } = useMainActions();
  const { initializeReorder } = useReorderExercises();

  const exerciseData = exercisesInBlock[exerciseInBlockId];

  const handlePress = () => {
    if (block.type === "individual") {
      onPressIndividualBlock();
      return;
    }

    setCurrentState({
      currentBlockId: block.tempId,
      currentExerciseInBlockId: exerciseData.tempId,
      isCurrentBlockMulti: exercisesCount > 1,
      currentExerciseName: exerciseData.exercise.name,
      currentExerciseId: exerciseData.exercise.id || null,
    });
    onToggleSheet("exerciseOptions");
  };

  const handleLongPress = () => {
    if (exercisesCount > 1) {
      initializeReorder(block.tempId);
      router.push("/routines/reorder-exercises");
    }
  };

  const setIds = setsByExercise[exerciseInBlockId] || [];

  if (!exerciseData) return null;

  const isMultiBlock = block.type !== "individual";

  return (
    <Pressable
      onLongPress={exercisesCount > 1 ? handleLongPress : undefined}
      delayLongPress={500}
      style={({ pressed }) => [{ opacity: pressed ? 0.95 : 1 }]}
    >
      <View
        style={[
          styles.container,
          isMultiBlock && {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.03)"
              : "rgba(0,0,0,0.02)",
            borderRadius: 12,
            padding: 10,
          },
        ]}
      >
        {/* Exercise Header */}
        <View style={styles.header}>
          <ExerciseMedia
            primaryMediaUrl={
              exerciseData.exercise.primary_media_url || undefined
            }
            primaryMediaType={
              exerciseData.exercise.primary_media_type || undefined
            }
            variant="thumbnail"
            exerciseName={exerciseData.exercise.name}
          />

          <View style={styles.exerciseInfo}>
            <Typography variant="body2" weight="semibold" numberOfLines={2}>
              {exerciseData.exercise.name}
            </Typography>

            <View style={styles.muscleRow}>
              <View
                style={[
                  styles.muscleBadge,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ fontSize: 10 }}
                >
                  {
                    muscleT[
                      exerciseData.exercise.main_muscle_group as IExerciseMuscle
                    ]?.[lang]
                  }
                </Typography>
              </View>
            </View>
          </View>

          {/* Options button (for multi-blocks) */}
          {isMultiBlock && (
            <Pressable
              onPress={handlePress}
              style={({ pressed }) => [
                styles.optionsButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <EllipsisVertical size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        {/* Sets Table */}
        <SetsTableV2
          blockType={block.type}
          exerciseInBlockId={exerciseData.tempId}
          setIds={setIds}
          onToggleSheet={onToggleSheet}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  exerciseInfo: {
    flex: 1,
    gap: 4,
  },
  muscleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  muscleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  optionsButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
