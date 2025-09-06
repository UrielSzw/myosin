import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { View } from "react-native";
import { useMainActions } from "../../../hooks/use-routine-form-store";

export const EmptyList = () => {
  const { setIsExerciseModalOpen, setExerciseModalMode } = useMainActions();

  const handleOpenModal = () => {
    setIsExerciseModalOpen(true);
    setExerciseModalMode("add-new");
  };

  return (
    <Card variant="outlined" padding="lg">
      <View style={{ alignItems: "center", padding: 32 }}>
        <Typography
          variant="body2"
          color="textMuted"
          style={{ textAlign: "center" }}
        >
          Comienza agregando ejercicios a tu rutina
        </Typography>
        <Button
          variant="primary"
          size="sm"
          onPress={handleOpenModal}
          style={{ marginTop: 16 }}
        >
          Seleccionar Ejercicios
        </Button>
      </View>
    </Card>
  );
};
