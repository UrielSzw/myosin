import { formatValue } from "@/features/tracker/utils/helpers";
import { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { icons, Settings, X } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  selectedMetric: TrackerMetricWithQuickActions;
  currentValue?: number;
  onClose: () => void;
  onOpenSettings?: () => void;
};

export const ModalHeader: React.FC<Props> = ({
  selectedMetric,
  currentValue,
  onClose,
  onOpenSettings,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  const IconComponent = (icons as any)[selectedMetric.icon];

  // Solo mostrar settings para métricas que tienen target o son eliminables
  const showSettings =
    selectedMetric.default_target !== null ||
    selectedMetric.input_type === "numeric_accumulative" ||
    selectedMetric.input_type === "numeric_single";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: selectedMetric.color + "20",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {IconComponent && (
            <IconComponent size={20} color={selectedMetric.color} />
          )}
        </View>
        <View>
          <Typography variant="h6" weight="semibold">
            {selectedMetric.name}
          </Typography>
          {currentValue !== undefined && (
            <Typography variant="caption" color="textMuted">
              Actual: {formatValue(currentValue)} {selectedMetric.unit}
            </Typography>
          )}
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {/* Settings Button */}
        {showSettings && onOpenSettings && (
          <TouchableOpacity
            onPress={onOpenSettings}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100],
            }}
          >
            <Settings size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Close Button */}
        <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
          <X size={24} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
