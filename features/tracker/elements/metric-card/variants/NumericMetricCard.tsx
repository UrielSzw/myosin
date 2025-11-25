import type { MetricDisplayData } from "@/features/tracker/types/visual-states";
import type { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { getMetricName } from "@/shared/translations/tracker";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import React from "react";
import { View } from "react-native";
import { MetricCardContainer } from "../shared/MetricCardContainer";
import { MetricIcon } from "../shared/MetricIcon";
import { MetricLabel } from "../shared/MetricLabel";

type NumericMetricCardProps = {
  metric: TrackerMetricWithQuickActions;
  displayData: MetricDisplayData;
  onPress: () => void;
  lang: "es" | "en";
};

export const NumericMetricCard: React.FC<NumericMetricCardProps> = React.memo(
  ({ metric, displayData, onPress, lang }) => {
    const isCompleted = displayData.state === "completed";

    // Get user's weight unit preference
    const prefs = useUserPreferences();
    const weightUnit = prefs?.weight_unit ?? "kg";

    // Check if this is a weight metric (stored in kg)
    const isWeightMetric = metric.slug === "weight";

    // Formatear valor numérico
    const formatValue = (value: number): string => {
      // If it's weight metric, convert from kg to user's preferred unit
      const displayValue = isWeightMetric
        ? fromKg(value, weightUnit, 1)
        : value;
      const rounded = Math.round(displayValue * 100) / 100;
      return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2);
    };

    // Get display unit (dynamic for weight metric)
    const displayUnit = isWeightMetric ? weightUnit : metric.unit;

    return (
      <MetricCardContainer
        onPress={onPress}
        backgroundColor={displayData.backgroundColor}
        borderColor={displayData.borderColor}
        isCompleted={isCompleted}
      >
        {/* Metric Label */}
        <MetricLabel name={getMetricName(metric, lang)} />

        {/* Icon with Progress Ring */}
        <MetricIcon
          iconName={displayData.iconName}
          iconColor={displayData.iconColor}
          showProgressRing={displayData.showProgressRing}
          progressPercentage={displayData.progressPercentage}
          isCompleted={isCompleted}
        />

        {/* Value and Unit */}
        <View
          style={{ alignItems: "center", flex: 1, justifyContent: "center" }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}
          >
            <Typography
              variant="h4"
              weight="bold"
              style={{ color: displayData.textColor }}
            >
              {formatValue(displayData.currentValue)}
            </Typography>
            <Typography variant="body2" color="textMuted">
              {displayUnit}
            </Typography>
          </View>

          {/* Goal info - only show if not completed and has goal */}
          {metric.default_target && !isCompleted && (
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginTop: 4 }}
            >
              / {formatValue(metric.default_target)}
            </Typography>
          )}
        </View>
      </MetricCardContainer>
    );
  }
);

NumericMetricCard.displayName = "NumericMetricCard";
