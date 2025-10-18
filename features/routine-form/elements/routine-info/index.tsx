import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { EnhancedInput } from "@/shared/ui/enhanced-input";
import { Typography } from "@/shared/ui/typography";
import { WeekDaySelector } from "@/shared/ui/week-day-selector";
import { Settings as SettingsIcon } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import {
  useMainActions,
  useRoutineInfoState,
} from "../../hooks/use-routine-form-store";

export const RoutineInfo: React.FC<{ onOpenSettings?: () => void }> = ({
  onOpenSettings,
}) => {
  const { colors } = useColorScheme();
  const { name, training_days } = useRoutineInfoState();
  const { setRoutineName, setTrainingDays } = useMainActions();

  // Estado para rastrear si el usuario ha interactuado con el campo
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // Validación del nombre de rutina
  const validateRoutineName = useCallback((value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return { isValid: false, error: "El nombre de la rutina es requerido" };
    }

    if (trimmedValue.length < 2) {
      return {
        isValid: false,
        error: "El nombre debe tener al menos 2 caracteres",
      };
    }

    if (trimmedValue.length > 100) {
      return {
        isValid: false,
        error: "El nombre no puede exceder 100 caracteres",
      };
    }

    // Verificar caracteres especiales problemáticos
    const invalidCharsRegex = /[<>:"\/\\|?*]/;
    if (invalidCharsRegex.test(trimmedValue)) {
      return {
        isValid: false,
        error: "El nombre contiene caracteres no permitidos",
      };
    }

    return { isValid: true, error: null };
  }, []);

  const validation = useMemo(
    () => validateRoutineName(name || ""),
    [name, validateRoutineName]
  );

  // Solo mostrar errores si el usuario ha interactuado con el campo
  const shouldShowError = hasInteracted && isTouched && !validation.isValid;
  const displayError = shouldShowError ? validation.error : null;
  const displayIsValid = hasInteracted ? validation.isValid : true;

  const handleNameChange = useCallback(
    (newName: string) => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
      setRoutineName(newName);
    },
    [hasInteracted, setRoutineName]
  );

  const handleBlur = useCallback(() => {
    setIsTouched(true);
  }, []);

  const handleFocus = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [hasInteracted]);

  return (
    <View
      style={{ marginBottom: 24 }}
      accessible={true}
      accessibilityLabel="Información de la rutina"
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Typography
          variant="h6"
          weight="semibold"
          accessible={true}
          accessibilityRole="header"
        >
          Información de la Rutina
        </Typography>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ajustes de la rutina"
          onPress={() => onOpenSettings?.()}
          style={{ padding: 8 }}
        >
          <SettingsIcon size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      <EnhancedInput
        value={name || ""}
        onChangeText={handleNameChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="Ej: Push Pull Legs"
        label="Nombre de la rutina"
        error={displayError}
        isValid={displayIsValid}
        maxLength={100}
        autoCapitalize="words"
        required={true}
        accessibilityLabel="Nombre de la rutina"
        accessibilityHint="Ingresa un nombre descriptivo para tu rutina de ejercicios"
      />

      <WeekDaySelector
        selectedDays={training_days || []}
        onDaysChange={setTrainingDays}
      />
    </View>
  );
};
