import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, Vibration, View } from "react-native";
import { IToogleSheet } from "../../hooks/use-form-routine-sheets";
import {
  useMainActions,
  useRoutineFormState,
} from "../../hooks/use-routine-form-store";
import { useReorderBlocks } from "../../shared/use-reorder-blocks";
import { ExerciseInBlockItem } from "../exercise-in-block-item";
import { ExerciseItem } from "../exercise-item";
import { BlockHeader } from "./block-header";

type Props = {
  blockId: string;
  onToggleSheet: (sheet?: IToogleSheet) => void;
};

export const BlockItem: React.FC<Props> = ({ blockId, onToggleSheet }) => {
  const { blocks, exercisesByBlock, exercisesInBlock } = useRoutineFormState();
  const { setCurrentState } = useMainActions();
  const { initializeReorder } = useReorderBlocks();
  const { getBlockColors } = useBlockStyles();
  const { colors } = useColorScheme();

  const block = blocks[blockId];
  const exercisesInBlockIds = exercisesByBlock[blockId] || [];

  const blockColors = getBlockColors(block.type);

  const handleLongPress = () => {
    Vibration.vibrate(50);
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

  const exerciseCount = exercisesInBlockIds.length;
  const blockTypeText =
    block.type === "individual"
      ? "individual"
      : block.type === "superset"
      ? "superserie"
      : "circuito";

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      delayLongPress={500}
      activeOpacity={1}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Bloque ${blockTypeText}: ${block.name}`}
      accessibilityHint={`Toca para configurar el bloque. Mantén presionado para reordenar. Contiene ${exerciseCount} ${
        exerciseCount === 1 ? "ejercicio" : "ejercicios"
      }`}
      accessibilityActions={[
        { name: "longpress", label: "Reordenar bloques" },
        { name: "activate", label: "Configurar bloque" },
      ]}
    >
      <View
        style={{
          borderLeftWidth: 4,
          borderLeftColor: blockColors.light,
        }}
      >
        {/* Block Header with Continuous Line */}
        <BlockHeader
          block={block}
          exercises={exercisesInBlockIds}
          onToggleSheet={onToggleSheet}
          onPress={handlePress}
        />

        {/* Exercises List with Continuous Visual Line */}
        <View
          style={{ position: "relative", backgroundColor: colors.background }}
        >
          {exercisesInBlockIds.map((exerciseInBlockId) => (
            <ExerciseInBlockItem
              key={exerciseInBlockId}
              exerciseInBlockId={exerciseInBlockId}
              block={block}
              exercisesCount={exercisesInBlockIds.length}
            >
              <ExerciseItem
                exerciseInBlockId={exerciseInBlockId}
                exerciseCount={exercisesInBlockIds.length}
                blockType={block.type}
                blockId={block.tempId}
                onToggleSheet={onToggleSheet}
                onPressIndividualBlock={handlePress}
              />
            </ExerciseInBlockItem>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};
