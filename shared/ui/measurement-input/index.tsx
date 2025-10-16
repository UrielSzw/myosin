import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { MeasurementField } from "@/shared/types/measurement";
import { Typography } from "@/shared/ui/typography";
import React from "react";
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
}) => {
  const { colors } = useColorScheme();

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
    if (text === "") {
      onChange(null);
      return;
    }

    const numValue = parseFloat(text);
    if (!isNaN(numValue) && numValue >= 0) {
      onChange(numValue);
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
      // Only create range object if we have at least one valid value
      if (minValue === null && currentMax === null) {
        onChange(null, null);
      } else {
        onChange(null, {
          min: minValue || 0,
          max: currentMax || 0,
        });
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
      // Only create range object if we have at least one valid value
      if (currentMin === null && maxValue === null) {
        onChange(null, null);
      } else {
        onChange(null, {
          min: currentMin || 0,
          max: maxValue || 0,
        });
      }
    }
  };

  // Base input styles (same as sets-item)
  const inputStyles: StyleProp<TextStyle> = {
    backgroundColor: "transparent" as const,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 6,
    textAlign: "center" as const,
    color: colors.text,
    fontSize: 16,
    fontWeight: "500" as const,
    width: "100%",
    minHeight: 32,
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
          value={`${value || ""}`}
          onChangeText={handleTextChange}
          placeholder={getPlaceholder()}
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          style={inputStyles}
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
        value={`${value || ""}`}
        onChangeText={handleTextChange}
        placeholder={getPlaceholder()}
        placeholderTextColor={colors.textMuted}
        keyboardType={getKeyboardType()}
        style={inputStyles}
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
