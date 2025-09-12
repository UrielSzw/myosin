import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import React from "react";
import { View } from "react-native";
import { IActiveToggleSheet } from "../../hooks/use-active-workout-sheets";
import { useActiveWorkout } from "../../hooks/use-active-workout-store";
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
  const { blocks, exercisesByBlock } = useActiveWorkout();
  const { getBlockColors } = useBlockStyles();

  const block = blocks[blockId];
  const blockColors = getBlockColors(block.type);
  const exercisesInBlockIds = exercisesByBlock[blockId] || [];

  return (
    <View>
      <View style={{ borderLeftWidth: 4, borderLeftColor: blockColors.light }}>
        <BlockHeader
          block={block}
          onToggleSheet={onToggleSheet}
          exercisesIds={exercisesInBlockIds}
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
              />
            </ActiveExerciseItem>
          ))}
        </View>
      </View>
    </View>
  );
};
