import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
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
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = routineFormTranslations;

  const { name, training_days } = useRoutineInfoState();
  const { setRoutineName, setTrainingDays } = useMainActions();

  // Estado para rastrear si el usuario ha interactuado con el campo
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // Validación del nombre de rutina
  const validateRoutineName = useCallback(
    (value: string) => {
      const trimmedValue = value.trim();

      if (!trimmedValue) {
        return { isValid: false, error: t.nameRequired[lang] };
      }

      if (trimmedValue.length < 2) {
        return {
          isValid: false,
          error: t.nameTooShort[lang],
        };
      }

      if (trimmedValue.length > 100) {
        return {
          isValid: false,
          error: t.nameTooLong[lang],
        };
      }

      // Verificar caracteres especiales problemáticos
      const invalidCharsRegex = /[<>:"\/\\|?*]/;
      if (invalidCharsRegex.test(trimmedValue)) {
        return {
          isValid: false,
          error: t.invalidCharacters[lang],
        };
      }

      return { isValid: true, error: null };
    },
    [lang, t]
  );

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
      accessibilityLabel={t.routineInfo[lang]}
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
          {t.routineInformation[lang]}
        </Typography>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.routineSettings[lang]}
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
        placeholder={t.routineNamePlaceholder[lang]}
        label={t.routineName[lang]}
        error={displayError}
        isValid={displayIsValid}
        maxLength={100}
        autoCapitalize="words"
        required={true}
        accessibilityLabel={t.routineName[lang]}
        accessibilityHint={t.routineNameHint[lang]}
      />

      <WeekDaySelector
        selectedDays={training_days || []}
        onDaysChange={setTrainingDays}
      />
    </View>
  );
};
