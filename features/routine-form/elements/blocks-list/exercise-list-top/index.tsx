import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { View } from "react-native";
import { useMainActions } from "../../../hooks/use-routine-form-store";

type Props = {
  exercisesInBlockCount: number;
};

export const ExerciseListTop = ({ exercisesInBlockCount }: Props) => {
  const { setIsExerciseModalOpen, setExerciseModalMode } = useMainActions();

  const handleOpenModal = () => {
    setIsExerciseModalOpen(true);
    setExerciseModalMode("add-new");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <Typography variant="h6" weight="semibold">
        Ejercicios ({exercisesInBlockCount})
      </Typography>

      <Button variant="ghost" size="sm" onPress={handleOpenModal}>
        + Agregar Ejercicio
      </Button>
    </View>
  );
};
