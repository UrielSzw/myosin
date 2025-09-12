import { View } from "react-native";
import { IActiveToggleSheet } from "../../hooks/use-active-workout-sheets";
import {
  ActiveWorkoutBlock,
  useActiveMainActions,
  useActiveWorkout,
} from "../../hooks/use-active-workout-store";
import { ActiveSetsTable } from "../active-sets-table";
import { ActiveSetRow } from "../active-sets-table/active-sets-row";
import { ActiveExerciseHeader } from "./active-exercise-header";

type Props = {
  exerciseInBlockId: string;
  block: ActiveWorkoutBlock;
  onToggleSheet: (sheet?: IActiveToggleSheet) => void;
};

export const ActiveExerciseDetails: React.FC<Props> = ({
  exerciseInBlockId,
  block,
  onToggleSheet,
}) => {
  const { setCurrentState } = useActiveMainActions();
  const { exercises, setsByExercise } = useActiveWorkout();

  const exerciseInBlock = exercises[exerciseInBlockId];
  const sets = setsByExercise[exerciseInBlockId] || [];

  const handlePress = () => {
    setCurrentState({
      currentBlockId: block.id,
      currentExerciseInBlockId: exerciseInBlock.id,
      isCurrentBlockMulti: block.type !== "individual",
      currentExerciseName: exerciseInBlock.exercise.name,
    });
    onToggleSheet("exerciseOptions");
  };

  return (
    <View style={{ flex: 1 }}>
      <ActiveExerciseHeader
        onPress={handlePress}
        exerciseName={exerciseInBlock.exercise.name}
        exerciseMainMuscle={exerciseInBlock.exercise.main_muscle_group}
      />

      <ActiveSetsTable
        exerciseInBlockId={exerciseInBlock.id}
        blockType={block.type}
      >
        {sets.map((setId) => (
          <ActiveSetRow
            key={setId}
            setId={setId}
            exerciseInBlock={exerciseInBlock}
            blockType={block.type}
            blockId={block.id}
            onToggleSheet={onToggleSheet}
          />
        ))}
      </ActiveSetsTable>
    </View>
  );
};
