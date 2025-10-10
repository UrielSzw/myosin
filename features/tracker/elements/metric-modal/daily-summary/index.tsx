import { formatValue } from "@/features/tracker/utils/helpers";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { View } from "react-native";

type Props = {
  currentValue?: number;
  unit: string;
  defaultTarget?: number | null;
  color: string;
};

export const DailySummary: React.FC<Props> = ({
  currentValue,
  unit,
  defaultTarget,
  color,
}) => {
  const { colors } = useColorScheme();

  if (!currentValue || !defaultTarget) return null;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 12 }}>
        Progreso del Día
      </Typography>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Typography variant="body2" color="textMuted">
          Actual
        </Typography>
        {currentValue && (
          <Typography variant="body2" weight="medium">
            {formatValue(currentValue)} {unit}
          </Typography>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Typography variant="body2" color="textMuted">
          Meta
        </Typography>
        <Typography variant="body2" weight="medium">
          {formatValue(defaultTarget)} {unit}
        </Typography>
      </View>

      {/* Progress Bar */}
      {currentValue && (
        <View
          style={{
            height: 8,
            backgroundColor: colors.gray[200],
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              backgroundColor: color,
              width: `${Math.min((currentValue / defaultTarget) * 100, 100)}%`,
            }}
          />
        </View>
      )}

      {currentValue && (
        <Typography
          variant="caption"
          color="textMuted"
          style={{ marginTop: 8, textAlign: "center" }}
        >
          {Math.round((currentValue / defaultTarget) * 100)}% completado
        </Typography>
      )}
    </View>
  );
};
