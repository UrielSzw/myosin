import type { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import React, { useMemo } from "react";
import { useDayData } from "../../hooks/use-tracker-data";
import { getMetricDisplayData } from "../../types/visual-states";
import { BooleanMetricCard } from "./variants/BooleanMetricCard";
import { NumericMetricCard } from "./variants/NumericMetricCard";
import { ScaleMetricCard } from "./variants/ScaleMetricCard";

type Props = {
  metric: TrackerMetricWithQuickActions;
  date: string;
  onPress: () => void;
};

export const MetricCard: React.FC<Props> = ({ metric, date, onPress }) => {
  const { colors } = useColorScheme();

  // Obtener datos del día usando React Query
  const { data: dayData } = useDayData(date);

  // Encontrar la métrica específica en los datos del día
  const metricData = dayData?.metrics.find((m) => m.id === metric.id);

  // Calcular display data optimizado con memoización
  const displayData = useMemo(
    () => getMetricDisplayData(metric, metricData, colors),
    [metric, metricData, colors]
  );

  // Renderizar componente específico según input_type
  switch (metric.input_type) {
    case "boolean_toggle":
      return (
        <BooleanMetricCard
          metric={metric}
          displayData={displayData}
          onPress={onPress}
        />
      );

    case "scale_discrete":
      return (
        <ScaleMetricCard
          metric={metric}
          displayData={displayData}
          onPress={onPress}
        />
      );

    default:
      // numeric_accumulative, numeric_single, o legacy sin tipo
      return (
        <NumericMetricCard
          metric={metric}
          displayData={displayData}
          onPress={onPress}
        />
      );
  }
};
