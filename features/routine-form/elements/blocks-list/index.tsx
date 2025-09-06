import { View } from "react-native";
import { useRoutineFormState } from "../../hooks/use-routine-form-store";
import { AddExerciseButton } from "./add-exercise-button";
import { EmptyList } from "./empty-list";
import { ExerciseListTop } from "./exercise-list-top";
import { ListHint } from "./list-hint";

type Props = {
  children: React.ReactNode;
};

export const BlocksList: React.FC<Props> = ({ children }) => {
  const { exercisesByBlock } = useRoutineFormState();

  const exercisesInBlockCount = Object.values(exercisesByBlock).reduce(
    (total, exercises) => total + exercises.length,
    0
  );

  return (
    <View style={{ marginBottom: 24 }}>
      <ExerciseListTop exercisesInBlockCount={exercisesInBlockCount} />

      {exercisesInBlockCount === 0 ? (
        <EmptyList />
      ) : (
        <View style={{ gap: 16 }}>
          <ListHint />

          {children}

          <AddExerciseButton />
        </View>
      )}
    </View>
  );
};
