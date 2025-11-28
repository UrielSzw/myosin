import { MainMetric } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useHaptic } from "@/shared/services/haptic-service";
import { trackerTranslations } from "@/shared/translations/tracker";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Check, X } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { getInputConfig } from "../../../constants/templates";

interface BooleanToggleInputProps {
  metric: MainMetric;
  onValueSelect: (value: number, displayValue: string) => void;
  lang?: "es" | "en";
}

export const BooleanToggleInput: React.FC<BooleanToggleInputProps> = ({
  metric,
  onValueSelect,
  lang = "es",
}) => {
  const { colors } = useColorScheme();
  const haptic = useHaptic();
  const t = trackerTranslations;
  const [selectedValue, setSelectedValue] = useState<boolean | null>(null);

  const inputConfig = getInputConfig(metric.slug);

  if (!inputConfig || !("booleanLabels" in inputConfig)) {
    return null;
  }

  const { booleanLabels } = inputConfig;

  // Get translated labels if available
  const getTrueLabel = (): string => {
    const metricSlug = metric.slug;
    if (metricSlug && (t.booleanLabels as any)[metricSlug]) {
      return (t.booleanLabels as any)[metricSlug].true[lang];
    }
    return booleanLabels.true;
  };

  const getFalseLabel = (): string => {
    const metricSlug = metric.slug;
    if (metricSlug && (t.booleanLabels as any)[metricSlug]) {
      return (t.booleanLabels as any)[metricSlug].false[lang];
    }
    return booleanLabels.false;
  };

  const handleValueSelect = (value: boolean) => {
    haptic.light();
    setSelectedValue(value);
  };

  const handleConfirm = () => {
    if (selectedValue === null) return;

    haptic.success();
    const displayValue = selectedValue
      ? `✓ ${getTrueLabel()}`
      : `✗ ${getFalseLabel()}`;
    onValueSelect(selectedValue ? 1 : 0, displayValue);
  };

  return (
    <View style={{ marginBottom: 32 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        {metric.name}
      </Typography>

      <View style={{ flexDirection: "column", gap: 8 }}>
        {/* TRUE Option */}
        <TouchableOpacity
          style={{
            backgroundColor:
              selectedValue === true ? "#10B98120" : colors.surface, // Verde suave
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: selectedValue === true ? "#10B981" : colors.border, // Verde
          }}
          onPress={() => handleValueSelect(true)}
          activeOpacity={0.7}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor:
                  selectedValue === true ? "#10B981" : colors.gray[200],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check
                size={20}
                color={selectedValue === true ? "#ffffff" : colors.gray[400]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Typography
                variant="body2"
                weight="medium"
                style={{
                  color: selectedValue === true ? "#10B981" : colors.text,
                }}
              >
                {getTrueLabel()}
              </Typography>
            </View>
            {selectedValue === true && (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "#10B981",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={12} color="#ffffff" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* FALSE Option */}
        <TouchableOpacity
          style={{
            backgroundColor:
              selectedValue === false ? "#EF444420" : colors.surface, // Rojo suave
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: selectedValue === false ? "#EF4444" : colors.border, // Rojo
          }}
          onPress={() => handleValueSelect(false)}
          activeOpacity={0.7}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor:
                  selectedValue === false ? "#EF4444" : colors.gray[200],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X
                size={20}
                color={selectedValue === false ? "#ffffff" : colors.gray[400]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Typography
                variant="body2"
                weight="medium"
                style={{
                  color: selectedValue === false ? "#EF4444" : colors.text,
                }}
              >
                {getFalseLabel()}
              </Typography>
            </View>
            {selectedValue === false && (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "#EF4444",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={12} color="#ffffff" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        {selectedValue !== null && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleConfirm}
            style={{ marginTop: 8 }}
            icon={
              selectedValue ? (
                <Check size={20} color="#ffffff" />
              ) : (
                <X size={20} color="#ffffff" />
              )
            }
          >
            {t.manualInput.addButton[lang]}:{" "}
            {selectedValue ? getTrueLabel() : getFalseLabel()}
          </Button>
        )}
      </View>
    </View>
  );
};
