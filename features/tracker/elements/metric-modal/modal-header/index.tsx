import { formatValue } from "@/features/tracker/utils/helpers";
import { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { icons, X } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  selectedMetric: TrackerMetricWithQuickActions;
  currentValue?: number;
  onClose: () => void;
};

export const ModalHeader: React.FC<Props> = ({
  selectedMetric,
  currentValue,
  onClose,
}) => {
  const { colors } = useColorScheme();

  const IconComponent = (icons as any)[selectedMetric.icon];

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
      <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
        <X size={24} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};
