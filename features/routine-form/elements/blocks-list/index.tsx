import { View } from "react-native";
import { AddExerciseButton } from "./add-exercise-button";
import { EmptyList } from "./empty-list";

type Props = {
  children: React.ReactNode;
  exercisesInBlockCount: number;
};

export const BlocksList: React.FC<Props> = ({
  children,
  exercisesInBlockCount,
}) => {
  return (
    <View style={{ marginBottom: 24 }}>
      {exercisesInBlockCount === 0 ? (
        <EmptyList />
      ) : (
        <View style={{ gap: 0 }}>
          {children}

          <AddExerciseButton />
        </View>
      )}
    </View>
  );
};
