import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { MeasurementField } from "@/shared/types/measurement";
import { Typography } from "@/shared/ui/typography";
import {
  fromKg,
  toKg,
  type WeightUnit,
} from "@/shared/utils/weight-conversion";
import React, { useEffect, useState } from "react";
import {
  StyleProp,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

type MeasurementInputProps = {
  field: MeasurementField;
  value?: number | null;
  range?: { min: number; max: number } | null;
  onChange: (
    value: number | null,
    range?: { min: number; max: number } | null
  ) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  setNumber?: number;
  /**
   * Active workout mode: forces single input even for range fields
   * Range displays as placeholder string (e.g., "8-12") instead of dual inputs
   */
  activeWorkout?: boolean;
  /**
   * User's preferred weight unit (for conversion)
   * Only used when field.type === "weight"
   */
  weightUnit?: WeightUnit;
  /**
   * Disable input (e.g., when set is completed)
   */
  disabled?: boolean;
};

export const MeasurementInput: React.FC<MeasurementInputProps> = ({
  field,
  value,
  range,
  onChange,
  placeholder = "0",
  accessibilityLabel,
  accessibilityHint,
  setNumber = 1,
  activeWorkout = false,
  weightUnit = "kg",
  disabled = false,
}) => {
  const { colors } = useColorScheme();

  // Estado local para el texto del input
  const [inputText, setInputText] = useState<string>("");

  // Sincronizar inputText con el valor del prop cuando cambia externamente
  useEffect(() => {
    if (value !== null && value !== undefined) {
      // Si es weight field, mostrar en la unidad del usuario
      if (field.type === "weight" && weightUnit) {
        const displayValue = fromKg(value, weightUnit, 1);
        setInputText(displayValue.toString());
      } else {
        setInputText(value.toString());
      }
    } else {
      setInputText("");
    }
  }, [value, field.type, weightUnit]);

  // Format time for display (convert seconds to readable format)
  const formatTimeDisplay = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (secs === 0) {
      return `${mins}min`;
    }

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get appropriate keyboard type
  const getKeyboardType = (): "numeric" | "decimal-pad" => {
    if (field.type === "distance" && field.unit === "km") {
      return "decimal-pad"; // For decimal values like 5.5 km
    }
    if (field.type === "weight") {
      return "decimal-pad"; // For decimal values like 32.5 kg
    }
    return "numeric";
  };

  // Get placeholder based on field type
  const getPlaceholder = (): string => {
    // En activeWorkout mode, usar el placeholder prop que viene desde ActiveSetRow
    if (activeWorkout && placeholder !== "0") {
      return placeholder;
    }

    switch (field.type) {
      case "time":
        return field.unit === "min" ? "0" : "0"; // seconds or minutes
      case "distance":
        return field.unit === "km" ? "0.0" : "0";
      case "weight":
        return "0";
      case "reps":
        return "0";
      default:
        return placeholder;
    }
  };

  // Helper to determine if we should show range input
  const shouldShowRangeInput = (field: MeasurementField): boolean => {
    // En active workout mode, nunca mostrar range inputs - usar single input con placeholder
    if (activeWorkout) return false;

    return field.type === "range";
  };

  // Handle text input change
  const handleTextChange = (text: string) => {
    // Actualizar el estado local inmediatamente (preserva comas y puntos)
    setInputText(text);

    if (text === "") {
      onChange(null);
      return;
    }

    // Convertir coma a punto para parseFloat
    const normalizedText = text.replace(",", ".");
    const numValue = parseFloat(normalizedText);

    if (!isNaN(numValue) && numValue >= 0) {
      // Si es weight field, convertir a kg antes de guardar
      if (field.type === "weight" && weightUnit) {
        const kgValue = toKg(numValue, weightUnit);
        onChange(kgValue);
      } else {
        onChange(numValue);
      }
    }
  };

  // Handle range input changes - Independent inputs without cross-validation
  const handleRangeMinChange = (text: string) => {
    const minValue = text === "" ? null : parseFloat(text);
    const currentMax = range?.max || null;

    // Simple validation: just check if it's a valid number
    if (
      text === "" ||
      (minValue !== null && !isNaN(minValue) && minValue >= 0)
    ) {
      let finalMin = minValue || 0;
      let finalMax = currentMax || 0;

      // Convert to kg if weight field
      if (field.type === "weight" && weightUnit) {
        finalMin = finalMin ? toKg(finalMin, weightUnit) : 0;
        finalMax = finalMax ? toKg(finalMax, weightUnit) : 0;
      }

      // Only create range object if we have at least one valid value
      if (minValue === null && currentMax === null) {
        onChange(null, null);
      } else {
        onChange(null, { min: finalMin, max: finalMax });
      }
    }
  };

  const handleRangeMaxChange = (text: string) => {
    const maxValue = text === "" ? null : parseFloat(text);
    const currentMin = range?.min || null;

    // Simple validation: just check if it's a valid number
    if (
      text === "" ||
      (maxValue !== null && !isNaN(maxValue) && maxValue >= 0)
    ) {
      let finalMin = currentMin || 0;
      let finalMax = maxValue || 0;

      // Convert to kg if weight field
      if (field.type === "weight" && weightUnit) {
        finalMin = finalMin ? toKg(finalMin, weightUnit) : 0;
        finalMax = finalMax ? toKg(finalMax, weightUnit) : 0;
      }

      // Only create range object if we have at least one valid value
      if (currentMin === null && maxValue === null) {
        onChange(null, null);
      } else {
        onChange(null, { min: finalMin, max: finalMax });
      }
    }
  };

  // Base input styles (same as sets-item)
  const inputStyles: StyleProp<TextStyle> = {
    backgroundColor: "transparent" as const,
    borderWidth: 0,
    borderBottomWidth: disabled ? 0 : 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 6,
    textAlign: "center" as const,
    color: disabled ? colors.text : colors.text,
    fontSize: 16,
    fontWeight: "500" as const,
    width: "100%",
    minHeight: 32,
    opacity: disabled ? 0.8 : 1,
  };

  const rangeInputStyles: StyleProp<TextStyle> = {
    backgroundColor: "transparent" as const,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 4,
    paddingVertical: 4,
    textAlign: "center" as const,
    color: colors.text,
    fontSize: 14,
    fontWeight: "500" as const,
    width: "100%",
    minHeight: 28,
  };

  // Render range input (only for fields with type "range")
  if (shouldShowRangeInput(field)) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          minHeight: 44,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            minHeight: 44,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
            value={`${range?.min || ""}`}
            onChangeText={handleRangeMinChange}
            placeholder={getPlaceholder()}
            placeholderTextColor={colors.textMuted}
            keyboardType={getKeyboardType()}
            selectTextOnFocus={true}
            style={rangeInputStyles}
            accessible={true}
            accessibilityLabel={`${field.label} mínimo para set ${setNumber}`}
            accessibilityHint={`Ingresa el valor mínimo de ${field.label.toLowerCase()}`}
          />
        </TouchableOpacity>

        <Typography
          variant="caption"
          color="textMuted"
          style={{ fontSize: 12, paddingHorizontal: 2 }}
        >
          -
        </Typography>

        <TouchableOpacity
          activeOpacity={1}
          style={{
            flex: 1,
            minHeight: 44,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
            value={`${range?.max || ""}`}
            onChangeText={handleRangeMaxChange}
            placeholder={getPlaceholder()}
            placeholderTextColor={colors.textMuted}
            keyboardType={getKeyboardType()}
            selectTextOnFocus={true}
            style={rangeInputStyles}
            accessible={true}
            accessibilityLabel={`${field.label} máximo para set ${setNumber}`}
            accessibilityHint={`Ingresa el valor máximo de ${field.label.toLowerCase()}`}
          />
        </TouchableOpacity>
      </View>
    );
  }

  // Render time picker for time fields
  if (field.type === "time") {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          minHeight: 44,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          value={inputText}
          onChangeText={handleTextChange}
          placeholder={getPlaceholder()}
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          selectTextOnFocus={true}
          style={inputStyles}
          editable={!disabled}
          accessible={true}
          accessibilityLabel={
            accessibilityLabel || `${field.label} para set ${setNumber}`
          }
          accessibilityHint={
            accessibilityHint || `Ingresa el tiempo en ${field.unit}`
          }
          accessibilityValue={{
            text: value ? `${formatTimeDisplay(value)}` : `Sin tiempo asignado`,
          }}
        />
      </TouchableOpacity>
    );
  }

  // Render standard text input for other types
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        minHeight: 44,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        value={inputText}
        onChangeText={handleTextChange}
        placeholder={getPlaceholder()}
        placeholderTextColor={colors.textMuted}
        keyboardType={getKeyboardType()}
        selectTextOnFocus={true}
        style={inputStyles}
        editable={!disabled}
        accessible={true}
        accessibilityLabel={
          accessibilityLabel || `${field.label} para set ${setNumber}`
        }
        accessibilityHint={
          accessibilityHint ||
          `Ingresa el valor de ${field.label.toLowerCase()}`
        }
        accessibilityValue={{
          text: value
            ? `${value} ${field.unit}`
            : `Sin ${field.label.toLowerCase()} asignado`,
        }}
      />
    </TouchableOpacity>
  );
};
