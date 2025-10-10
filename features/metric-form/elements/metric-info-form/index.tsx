import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { EnhancedInput } from "@/shared/ui/enhanced-input";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { MetricValidationResult } from "../../types";

interface MetricInfoFormProps {
  metricName: string;
  metricType: "counter" | "value";
  unit: string;
  defaultTarget?: number;
  nameValidation: MetricValidationResult;
  onNameChange: (name: string) => void;
  onTypeChange: (type: "counter" | "value") => void;
  onUnitChange: (unit: string) => void;
  onTargetChange: (target?: number) => void;
}

export const MetricInfoForm: React.FC<MetricInfoFormProps> = ({
  metricName,
  metricType,
  unit,
  defaultTarget,
  nameValidation,
  onNameChange,
  onTypeChange,
  onUnitChange,
  onTargetChange,
}) => {
  const { colors } = useColorScheme();

  const handleTargetChange = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || value === "") {
      onTargetChange(undefined);
    } else {
      onTargetChange(numValue);
    }
  };

  return (
    <View style={{ marginBottom: 24 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        Información Básica
      </Typography>

      {/* Metric Name */}
      <View style={{ marginBottom: 16 }}>
        <EnhancedInput
          label="Nombre de la Métrica"
          placeholder="Ej: Mi Métrica Personalizada"
          value={metricName}
          onChangeText={onNameChange}
          error={nameValidation.errors.name}
          maxLength={50}
          autoCapitalize="words"
        />
      </View>

      {/* Metric Type */}
      <View style={{ marginBottom: 16 }}>
        <Typography variant="body2" weight="medium" style={{ marginBottom: 8 }}>
          Tipo de Métrica
        </Typography>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => onTypeChange("counter")}
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 12,
              borderWidth: 2,
              borderColor:
                metricType === "counter" ? colors.primary[500] : colors.border,
              backgroundColor:
                metricType === "counter" ? colors.primary[50] : colors.surface,
            }}
            activeOpacity={0.7}
          >
            <Typography
              variant="body2"
              weight="semibold"
              style={{
                color:
                  metricType === "counter" ? colors.primary[500] : colors.text,
                marginBottom: 4,
              }}
            >
              📊 Contador
            </Typography>
            <Typography
              variant="caption"
              color="textMuted"
              style={{ lineHeight: 16 }}
            >
              Se acumula durante el día (ej: agua, calorías, pasos)
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onTypeChange("value")}
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 12,
              borderWidth: 2,
              borderColor:
                metricType === "value" ? colors.primary[500] : colors.border,
              backgroundColor:
                metricType === "value" ? colors.primary[50] : colors.surface,
            }}
            activeOpacity={0.7}
          >
            <Typography
              variant="body2"
              weight="semibold"
              style={{
                color:
                  metricType === "value" ? colors.primary[500] : colors.text,
                marginBottom: 4,
              }}
            >
              📈 Valor
            </Typography>
            <Typography
              variant="caption"
              color="textMuted"
              style={{ lineHeight: 16 }}
            >
              Valor único del día (ej: peso, estado de ánimo)
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* Unit */}
      <View style={{ marginBottom: 16 }}>
        <EnhancedInput
          label="Unidad de Medida"
          placeholder="Ej: kg, ml, reps, %"
          value={unit}
          onChangeText={onUnitChange}
          error={nameValidation.errors.unit}
          maxLength={10}
          autoCapitalize="none"
        />
      </View>

      {/* Default Target (Optional) */}
      <View style={{ marginBottom: 0 }}>
        <EnhancedInput
          label="Objetivo Diario (Opcional)"
          placeholder="Ej: 100"
          value={defaultTarget?.toString() || ""}
          onChangeText={handleTargetChange}
          error={nameValidation.errors.target}
          keyboardType="numeric"
          helpText="Si estableces un objetivo, verás tu progreso en la tarjeta de la métrica"
        />
      </View>
    </View>
  );
};
