import type { MetricDisplayData } from "@/features/tracker/types/visual-states";
import type { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import React from "react";
import { MetricCardContainer } from "../shared/MetricCardContainer";
import { MetricIcon } from "../shared/MetricIcon";
import { MetricLabel } from "../shared/MetricLabel";
import { MetricValue } from "../shared/MetricValue";

type ScaleMetricCardProps = {
  metric: TrackerMetricWithQuickActions;
  displayData: MetricDisplayData;
  onPress: () => void;
};

export const ScaleMetricCard: React.FC<ScaleMetricCardProps> = React.memo(
  ({ metric, displayData, onPress }) => {
    // Para scale metrics, mostramos el nivel actual como subtitle
    const subtitle = displayData.hasEntry
      ? `Nivel ${Math.round(displayData.currentValue)}`
      : undefined;

    return (
      <MetricCardContainer
        onPress={onPress}
        backgroundColor={displayData.backgroundColor}
        borderColor={displayData.borderColor}
      >
        {/* Metric Label */}
        <MetricLabel name={metric.name} />

        {/* Icon (sin progress ring) */}
        <MetricIcon
          iconName={displayData.iconName}
          iconColor={displayData.iconColor}
          showProgressRing={false}
        />

        {/* Value Display */}
        <MetricValue
          displayText={displayData.displayText}
          textColor={displayData.textColor}
          subtitle={subtitle}
        />
      </MetricCardContainer>
    );
  }
);

ScaleMetricCard.displayName = "ScaleMetricCard";
