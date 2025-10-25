import { MainMetric } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import * as Icons from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { getInputConfig } from "../../../constants/templates";

interface DiscreteScaleInputProps {
  metric: MainMetric;
  onValueSelect: (value: number, displayValue: string) => void;
  defaultValue?: number;
}

export const DiscreteScaleInput: React.FC<DiscreteScaleInputProps> = ({
  metric,
  onValueSelect,
  defaultValue,
}) => {
  const { colors } = useColorScheme();
  const [selectedValue, setSelectedValue] = useState<number | null>(
    defaultValue || null
  );

  const inputConfig = getInputConfig(metric.slug);

  if (
    !inputConfig ||
    !("scaleLabels" in inputConfig) ||
    !("scaleIcons" in inputConfig)
  ) {
    return null;
  }

  const { scaleLabels, scaleIcons, min = 1 } = inputConfig;

  const handleValueSelect = (index: number) => {
    const value = min + index;
    setSelectedValue(value);
  };

  const handleConfirm = () => {
    if (selectedValue === null) return;

    const index = selectedValue - min;
    const iconName = scaleIcons[index] || "";
    const label = scaleLabels[index] || "";
    const displayValue = `${iconName} ${label}`;

    onValueSelect(selectedValue, displayValue);
  };

  return (
    <View style={{ marginBottom: 32 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        {metric.name}
      </Typography>

      <View style={{ flexDirection: "column", gap: 8 }}>
        {scaleLabels.map((label: string, index: number) => {
          const value = min + index;
          const isSelected = selectedValue === value;
          const iconName = scaleIcons[index] || "";
          const isAlreadySelected = defaultValue === value;

          // Helper para renderizar el icono
          const renderIcon = () => {
            if (!iconName) return null;
            const IconComponent = (Icons as any)[iconName];
            if (!IconComponent) return null;
            return (
              <IconComponent
                size={24}
                color={isSelected ? metric.color : colors.text}
              />
            );
          };

          return (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: isSelected
                  ? metric.color + "10"
                  : isAlreadySelected
                  ? colors.surface + "80"
                  : colors.surface,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: isSelected
                  ? metric.color
                  : isAlreadySelected
                  ? colors.border + "80"
                  : colors.border,
                opacity: isAlreadySelected && !isSelected ? 0.7 : 1,
              }}
              onPress={() => handleValueSelect(index)}
              activeOpacity={0.7}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {renderIcon()}
                <View style={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    weight="medium"
                    style={{
                      color: isSelected ? metric.color : colors.text,
                      marginBottom: 2,
                    }}
                  >
                    {label}
                    {isAlreadySelected && !isSelected && (
                      <Typography variant="caption" color="textMuted">
                        {" "}
                        (actual)
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="caption" color="textMuted">
                    Nivel {value}
                  </Typography>
                </View>
                {isSelected && (
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: metric.color,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="caption" color="white">
                      ✓
                    </Typography>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {selectedValue !== null && selectedValue !== defaultValue && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleConfirm}
            style={{ marginTop: 8 }}
          >
            {defaultValue && selectedValue !== defaultValue
              ? "Remplazar con"
              : "Registrar"}
            : {scaleLabels[selectedValue - min]}
          </Button>
        )}
      </View>
    </View>
  );
};
