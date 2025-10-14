import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import React from "react";
import { View } from "react-native";
import { IActiveToggleSheet } from "../../hooks/use-active-workout-sheets";
import {
  useActiveMainActions,
  useActiveWorkout,
} from "../../hooks/use-active-workout-store";
import { ActiveExerciseDetails } from "../active-exercise-details";
import { ActiveExerciseItem } from "../active-exercise-item";
import { BlockHeader } from "./active-block-header";

type Props = {
  blockId: string;
  onToggleSheet: (sheet?: IActiveToggleSheet) => void;
};

export const ActiveBlockItem: React.FC<Props> = ({
  onToggleSheet,
  blockId,
}) => {
  const { blocks, exercisesByBlock, exercises } = useActiveWorkout();
  const { getBlockColors } = useBlockStyles();
  const { setCurrentState } = useActiveMainActions();

  const block = blocks[blockId];
  const blockColors = getBlockColors(block.type);
  const exercisesInBlockIds = exercisesByBlock[blockId] || [];

  const handlePress = () => {
    if (block.type === "individual") {
      const exercisesInBlockIds = exercisesByBlock[block.tempId] || [];
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

    onToggleSheet("blockOptions");
  };

  return (
    <View>
      <View style={{ borderLeftWidth: 4, borderLeftColor: blockColors.light }}>
        <BlockHeader
          block={block}
          onToggleSheet={onToggleSheet}
          exercisesIds={exercisesInBlockIds}
          onPress={handlePress}
        />

        <View>
          {exercisesInBlockIds.map((exerciseInBlockId) => (
            <ActiveExerciseItem
              key={exerciseInBlockId}
              block={block}
              exerciseInBlockId={exerciseInBlockId}
              exercisesCount={exercisesInBlockIds.length}
            >
              <ActiveExerciseDetails
                exerciseInBlockId={exerciseInBlockId}
                onToggleSheet={onToggleSheet}
                block={block}
                onPressIndividualBlock={handlePress}
              />
            </ActiveExerciseItem>
          ))}
        </View>
      </View>
    </View>
  );
};
