import { formatValue } from "@/features/tracker/utils/helpers";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import React from "react";
import { View } from "react-native";

type Props = {
  currentValue?: number;
  unit: string;
  defaultTarget?: number | null;
  color: string;
  metricSlug?: string | null;
};

export const DailySummary: React.FC<Props> = ({
  currentValue,
  unit,
  defaultTarget,
  color,
  metricSlug,
}) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";

  const isWeightMetric = metricSlug === "weight";
  const displayUnit = isWeightMetric ? weightUnit : unit;
  const displayCurrent =
    isWeightMetric && currentValue
      ? fromKg(currentValue, weightUnit, 1)
      : currentValue;
  const displayTarget =
    isWeightMetric && defaultTarget
      ? fromKg(defaultTarget, weightUnit, 1)
      : defaultTarget;

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
        {displayCurrent && (
          <Typography variant="body2" weight="medium">
            {formatValue(displayCurrent)} {displayUnit}
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
        {displayTarget && (
          <Typography variant="body2" weight="medium">
            {formatValue(displayTarget)} {displayUnit}
          </Typography>
        )}
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
