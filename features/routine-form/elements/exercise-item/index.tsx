import { IBlockType } from "@/shared/types/workout";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { IToogleSheet } from "../../hooks/use-form-routine-sheets";
import {
  useMainActions,
  useRoutineFormState,
} from "../../hooks/use-routine-form-store";
import { useReorderExercises } from "../../shared/use-reorder-exercises";
import { SetsTable } from "../sets-table";
import { SetsItem } from "../sets-table/sets-item";
import { ExerciseHeader } from "./exercise-header";

type Props = {
  exerciseInBlockId: string;
  exerciseCount: number;
  blockType: IBlockType;
  blockId: string;
  onToggleSheet: (sheet?: IToogleSheet) => void;
  onPressIndividualBlock: () => void;
};

export const ExerciseItem: React.FC<Props> = ({
  exerciseInBlockId,
  exerciseCount,
  blockType,
  blockId,
  onToggleSheet,
  onPressIndividualBlock,
}) => {
  const { exercisesInBlock, setsByExercise } = useRoutineFormState();
  const { setCurrentState } = useMainActions();
  const { initializeReorder } = useReorderExercises();

  const exerciseInBlock = exercisesInBlock[exerciseInBlockId];

  const handlePress = () => {
    if (blockType === "individual") {
      onPressIndividualBlock();
      return;
    }

    setCurrentState({
      currentBlockId: blockId,
      currentExerciseInBlockId: exerciseInBlock.tempId,
      isCurrentBlockMulti: exerciseCount > 1,
      currentExerciseName: exerciseInBlock.exercise.name,
    });
    onToggleSheet("exerciseOptions");
  };

  const handleLongPressExercise = () => {
    initializeReorder(blockId);
    router.push("/routines/reorder-exercises");
  };

  const setIds = setsByExercise[exerciseInBlockId] || [];

  if (!exerciseInBlock) return null;

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onLongPress={exerciseCount > 1 ? handleLongPressExercise : undefined}
      delayLongPress={500}
      onPress={handlePress}
      activeOpacity={exerciseCount > 1 ? 0.8 : 1}
    >
      <ExerciseHeader
        exerciseName={exerciseInBlock.exercise.name}
        exerciseMainMuscle={exerciseInBlock.exercise.main_muscle_group}
      />

      <SetsTable
        blockType={blockType}
        exerciseInBlockId={exerciseInBlock.tempId}
        onToggleSheet={onToggleSheet}
      >
        {setIds.map((set) => (
          <SetsItem
            key={set}
            setId={set}
            exerciseInBlockId={exerciseInBlock.tempId}
            onToggleSheet={onToggleSheet}
          />
        ))}
      </SetsTable>
    </TouchableOpacity>
  );
};
