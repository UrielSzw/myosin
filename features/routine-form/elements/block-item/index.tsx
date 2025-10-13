import { Card } from "@/shared/ui/card";
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
  const { blocks, exercisesByBlock } = useRoutineFormState();
  const { setCurrentState } = useMainActions();
  const { initializeReorder } = useReorderBlocks();

  const block = blocks[blockId];
  const exercisesInBlockIds = exercisesByBlock[blockId] || [];

  const handleLongPress = () => {
    Vibration.vibrate(50);
    initializeReorder();
    router.push("/routines/reorder-blocks");
  };

  const handlePress = () => {
    setCurrentState({
      currentBlockId: blockId,
      isCurrentBlockMulti: block.type !== "individual",
    });
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
      onPress={handlePress}
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
      <Card variant="outlined" padding="none">
        {/* Block Header with Continuous Line */}
        <BlockHeader
          block={block}
          exercises={exercisesInBlockIds}
          onToggleSheet={onToggleSheet}
        />

        {/* Exercises List with Continuous Visual Line */}
        <View style={{ position: "relative" }}>
          {/* {exercisesInBlockIds.length > 1 && (
            <View
              style={{
                position: "absolute",
                left: 32,
                top: 0,
                bottom: 0,
                width: 3,
                backgroundColor: blockColors.primary,
                borderRadius: 1.5,
                zIndex: 1,
              }}
            />
          )} */}

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
              />
            </ExerciseInBlockItem>
          ))}
        </View>
      </Card>
    </TouchableOpacity>
  );
};
