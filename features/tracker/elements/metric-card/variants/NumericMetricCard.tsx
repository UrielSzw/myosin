import type { MetricDisplayData } from "@/features/tracker/types/visual-states";
import type { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { View } from "react-native";
import { MetricCardContainer } from "../shared/MetricCardContainer";
import { MetricIcon } from "../shared/MetricIcon";
import { MetricLabel } from "../shared/MetricLabel";

type NumericMetricCardProps = {
  metric: TrackerMetricWithQuickActions;
  displayData: MetricDisplayData;
  onPress: () => void;
};

export const NumericMetricCard: React.FC<NumericMetricCardProps> = React.memo(
  ({ metric, displayData, onPress }) => {
    const isCompleted = displayData.state === "completed";

    // Formatear valor numérico
    const formatValue = (value: number): string => {
      const rounded = Math.round(value * 100) / 100;
      return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2);
    };

    return (
      <MetricCardContainer
        onPress={onPress}
        backgroundColor={displayData.backgroundColor}
        borderColor={displayData.borderColor}
        isCompleted={isCompleted}
      >
        {/* Metric Label */}
        <MetricLabel name={metric.name} />

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
              {metric.unit}
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
