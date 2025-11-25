import { MainMetric } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { trackerTranslations } from "@/shared/translations/tracker";
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
  lang?: "es" | "en";
}

export const DiscreteScaleInput: React.FC<DiscreteScaleInputProps> = ({
  metric,
  onValueSelect,
  defaultValue,
  lang = "es",
}) => {
  const { colors } = useColorScheme();
  const t = trackerTranslations;
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

  // Get translated labels if available
  const getTranslatedLabel = (value: number): string => {
    const metricSlug = metric.slug;
    if (metricSlug && (t.scaleLabels as any)[metricSlug]) {
      const scaleLabelsForMetric = (t.scaleLabels as any)[metricSlug];
      return (
        scaleLabelsForMetric[value]?.[lang] || scaleLabels[value - min] || ""
      );
    }
    return scaleLabels[value - min] || "";
  };

  const handleValueSelect = (index: number) => {
    const value = min + index;
    setSelectedValue(value);
  };

  const handleConfirm = () => {
    if (selectedValue === null) return;

    const index = selectedValue - min;
    const iconName = scaleIcons[index] || "";
    const label = getTranslatedLabel(selectedValue);
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
          const translatedLabel = getTranslatedLabel(value);

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
                    {translatedLabel}
                    {isAlreadySelected && !isSelected && (
                      <Typography variant="caption" color="textMuted">
                        {" "}
                        ({t.states.notRecorded[lang]})
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="caption" color="textMuted">
                    {t.states.level[lang]} {value}
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
              ? `${t.manualInput.addButton[lang]}: `
              : `${t.manualInput.addButton[lang]}: `}
            {getTranslatedLabel(selectedValue)}
          </Button>
        )}
      </View>
    </View>
  );
};
