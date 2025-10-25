import { MainMetric } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Check, X } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { getInputConfig } from "../../../constants/templates";

interface BooleanToggleInputProps {
  metric: MainMetric;
  onValueSelect: (value: number, displayValue: string) => void;
}

export const BooleanToggleInput: React.FC<BooleanToggleInputProps> = ({
  metric,
  onValueSelect,
}) => {
  const { colors } = useColorScheme();
  const [selectedValue, setSelectedValue] = useState<boolean | null>(null);

  const inputConfig = getInputConfig(metric.slug);

  if (!inputConfig || !("booleanLabels" in inputConfig)) {
    return null;
  }

  const { booleanLabels } = inputConfig;

  const handleValueSelect = (value: boolean) => {
    setSelectedValue(value);
  };

  const handleConfirm = () => {
    if (selectedValue === null) return;

    const displayValue = selectedValue
      ? `✓ ${booleanLabels.true}`
      : `✗ ${booleanLabels.false}`;
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
                {booleanLabels.true}
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
                {booleanLabels.false}
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
            Registrar: {booleanLabels[selectedValue ? "true" : "false"]}
          </Button>
        )}
      </View>
    </View>
  );
};
