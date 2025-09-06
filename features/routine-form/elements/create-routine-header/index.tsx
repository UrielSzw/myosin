import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { Alert, View } from "react-native";
import {
  useMainActions,
  useRoutineFormState,
} from "../../hooks/use-routine-form-store";
import { useSaveRoutine } from "../../hooks/use-save-routine";

export const CreateRoutineHeader = () => {
  const { colors } = useColorScheme();
  const { saveRoutine, isLoading, error } = useSaveRoutine();
  const { clearForm } = useMainActions();
  const { mode } = useRoutineFormState();

  const isEditMode = mode === "edit";

  const handleGoBack = () => {
    router.back();
  };

  const handleSave = async () => {
    const savedRoutineId = await saveRoutine();

    if (savedRoutineId) {
      Alert.alert(
        isEditMode ? "¡Rutina actualizada!" : "¡Rutina guardada!",
        isEditMode
          ? "Tu rutina se ha actualizado exitosamente."
          : "Tu rutina se ha guardado exitosamente.",
        [
          {
            text: "OK",
            onPress: () => {
              clearForm();
              router.back();
            },
          },
        ]
      );
    } else if (error) {
      Alert.alert("Error", error);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        zIndex: 1,
      }}
    >
      <Button variant="ghost" size="sm" onPress={handleGoBack}>
        ← Atrás
      </Button>

      <Typography variant="h6" weight="semibold">
        {isEditMode ? "Editar Rutina" : "Crear Rutina"}
      </Typography>

      <Button
        variant="primary"
        size="sm"
        onPress={handleSave}
        disabled={isLoading}
      >
        {isLoading
          ? isEditMode
            ? "Actualizando..."
            : "Guardando..."
          : isEditMode
          ? "Actualizar"
          : "Guardar"}
      </Button>
    </View>
  );
};
