import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert, View } from "react-native";
import {
  useMainActions,
  useRoutineFormState,
} from "../../hooks/use-routine-form-store";
import { useRoutineValidation } from "../../hooks/use-routine-validation";
import { useSaveRoutine } from "../../hooks/use-save-routine";

export const CreateRoutineHeader = () => {
  const { colors } = useColorScheme();
  const { saveRoutine, isLoading, error } = useSaveRoutine();
  const { clearForm } = useMainActions();
  const { mode } = useRoutineFormState();
  const routineValidation = useRoutineValidation();
  const queryClient = useQueryClient();

  const isEditMode = mode === "edit";
  const canSave = routineValidation.isValid && !isLoading;

  const handleGoBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!routineValidation.isValid) {
      // Mostrar primer error encontrado
      const firstError = Object.values(routineValidation.errors)[0];
      Alert.alert("Error de validación", firstError);
      return;
    }

    const savedRoutineId = await saveRoutine();

    if (savedRoutineId) {
      queryClient.invalidateQueries({
        queryKey: ["workouts", "routines"],
      });

      clearForm();
      router.back();
    } else if (error) {
      Alert.alert("Error", error);
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return isEditMode ? "Actualizando..." : "Guardando...";
    }
    return isEditMode ? "Actualizar" : "Guardar";
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
      accessible={true}
      accessibilityRole="toolbar"
      accessibilityLabel="Barra de navegación de rutina"
    >
      <Button
        variant="ghost"
        size="sm"
        onPress={handleGoBack}
        accessible={true}
        accessibilityLabel="Volver atrás"
        accessibilityHint="Regresa a la pantalla anterior"
      >
        ← Atrás
      </Button>

      <Typography
        variant="h6"
        weight="semibold"
        accessible={true}
        accessibilityRole="header"
      >
        {isEditMode ? "Editar Rutina" : "Crear Rutina"}
      </Typography>

      <Button
        variant="primary"
        size="sm"
        onPress={handleSave}
        disabled={!canSave}
        accessible={true}
        accessibilityLabel={getButtonText()}
        accessibilityHint={
          canSave
            ? `${
                isEditMode ? "Actualizar" : "Guardar"
              } la rutina con los datos ingresados`
            : "Botón deshabilitado. Completa todos los campos requeridos para guardar"
        }
        accessibilityState={{ disabled: !canSave }}
      >
        {getButtonText()}
      </Button>
    </View>
  );
};
