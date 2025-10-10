import {
  METRIC_ICON_OPTIONS,
  MetricIconKey,
} from "@/shared/constants/metric-icons";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { EnhancedInput } from "@/shared/ui/enhanced-input";
import { Typography } from "@/shared/ui/typography";
import * as Icons from "lucide-react-native";
import { Trash2 } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { QuickActionFormItem } from "../../../types";
import {
  validateQuickActionLabel,
  validateQuickActionValue,
} from "../../../utils/validation";

interface QuickActionItemProps {
  quickAction: QuickActionFormItem;
  metricUnit: string;
  onUpdate: (updates: Partial<QuickActionFormItem>) => void;
  onRemove: () => void;
}

export const QuickActionItem: React.FC<QuickActionItemProps> = ({
  quickAction,
  metricUnit,
  onUpdate,
  onRemove,
}) => {
  const { colors } = useColorScheme();

  const handleLabelChange = (label: string) => {
    onUpdate({ label });
  };

  const handleValueChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onUpdate({ value: numValue });
    } else if (value === "") {
      onUpdate({ value: 0 });
    }
  };

  const handleIconChange = (icon: MetricIconKey) => {
    onUpdate({ icon });
  };

  // Validation
  const labelError = validateQuickActionLabel(quickAction.label);
  const valueError = validateQuickActionValue(quickAction.value);

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 12,
      }}
    >
      {/* Header with remove button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Typography variant="body2" weight="medium">
          Quick Action #{quickAction.position}
        </Typography>
        <TouchableOpacity
          onPress={onRemove}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: colors.error[50],
          }}
          activeOpacity={0.7}
        >
          <Trash2 size={16} color={colors.error[500]} />
        </TouchableOpacity>
      </View>

      {/* Label input */}
      <View style={{ marginBottom: 16 }}>
        <EnhancedInput
          label="Etiqueta"
          placeholder="Ej: Vaso grande (300ml)"
          value={quickAction.label}
          onChangeText={handleLabelChange}
          error={labelError}
          maxLength={50}
        />
      </View>

      {/* Value input */}
      <View style={{ marginBottom: 16 }}>
        <EnhancedInput
          label={`Valor (${metricUnit})`}
          placeholder="Ej: 0.3"
          value={quickAction.value.toString()}
          onChangeText={handleValueChange}
          error={valueError}
          keyboardType="numeric"
        />
      </View>

      {/* Icon selector */}
      <View>
        <Typography variant="body2" weight="medium" style={{ marginBottom: 8 }}>
          Icono (Opcional)
        </Typography>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -4 }}
        >
          {METRIC_ICON_OPTIONS.slice(0, 12).map((iconKey) => {
            const IconComponent = (Icons as any)[iconKey];
            const isSelected = quickAction.icon === iconKey;

            return (
              <TouchableOpacity
                key={iconKey}
                onPress={() => handleIconChange(iconKey)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  marginHorizontal: 4,
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? colors.primary[500] : colors.border,
                  backgroundColor: isSelected
                    ? colors.primary[50]
                    : "transparent",
                }}
                activeOpacity={0.7}
              >
                {IconComponent && (
                  <IconComponent
                    size={20}
                    color={isSelected ? colors.primary[500] : colors.text}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};
