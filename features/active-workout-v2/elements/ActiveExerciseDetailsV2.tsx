import {
  ActiveWorkoutBlock,
  useActiveMainActions,
  useActiveWorkout,
} from "@/features/active-workout-v2/hooks/use-active-workout-store";
import React from "react";
import { View } from "react-native";
import { ActiveExerciseHeaderV2 } from "./ActiveExerciseHeaderV2";
import { ActiveSetRowV2 } from "./ActiveSetRowV2";
import { ActiveSetsTableV2 } from "./ActiveSetsTableV2";

type Props = {
  exerciseInBlockId: string;
  block: ActiveWorkoutBlock;
  onPressIndividualBlock: () => void;
  onOpenExerciseOptions: () => void;
  onOpenSetType: () => void;
  onOpenRPESelector: () => void;
  onOpenTempoMetronome: () => void;
};

export const ActiveExerciseDetailsV2: React.FC<Props> = ({
  exerciseInBlockId,
  block,
  onPressIndividualBlock,
  onOpenExerciseOptions,
  onOpenSetType,
  onOpenRPESelector,
  onOpenTempoMetronome,
}) => {
  const { setCurrentState } = useActiveMainActions();
  const { exercises, setsByExercise } = useActiveWorkout();

  const exerciseInBlock = exercises[exerciseInBlockId];
  const sets = setsByExercise[exerciseInBlockId] || [];

  const handlePress = () => {
    if (block.type === "individual") {
      onPressIndividualBlock();
      return;
    }

    setCurrentState({
      currentBlockId: block.tempId,
      currentExerciseInBlockId: exerciseInBlock.tempId,
      isCurrentBlockMulti: true,
      currentExerciseName: exerciseInBlock.exercise.name,
      currentExerciseId: exerciseInBlock?.exercise.id || null,
    });
    onOpenExerciseOptions();
  };

  return (
    <View style={{ flex: 1 }}>
      <ActiveExerciseHeaderV2
        onPress={handlePress}
        exerciseName={exerciseInBlock.exercise.name}
        exerciseMainMuscle={exerciseInBlock.exercise.main_muscle_group}
        exerciseImageUrl={
          exerciseInBlock.exercise.primary_media_url || undefined
        }
        exerciseImageType={
          exerciseInBlock.exercise.primary_media_type || undefined
        }
      />

      <ActiveSetsTableV2
        exerciseInBlockId={exerciseInBlock.tempId}
        blockType={block.type}
      >
        {sets.map((setId, index) => (
          <ActiveSetRowV2
            key={setId}
            setId={setId}
            exerciseInBlock={exerciseInBlock}
            blockType={block.type}
            blockId={block.tempId}
            onOpenSetType={onOpenSetType}
            onOpenRPESelector={onOpenRPESelector}
            onOpenTempoMetronome={onOpenTempoMetronome}
            index={index}
          />
        ))}
      </ActiveSetsTableV2>
    </View>
  );
};
