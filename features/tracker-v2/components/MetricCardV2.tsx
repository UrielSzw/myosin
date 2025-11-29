import type { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useAuth } from "@/shared/providers/auth-provider";
import React, { useMemo } from "react";
import { useDayData } from "../../tracker/hooks/use-tracker-data";
import { getMetricDisplayData } from "../../tracker/types/visual-states";
import { BooleanMetricCardV2 } from "./metric-cards/BooleanMetricCardV2";
import { NumericMetricCardV2 } from "./metric-cards/NumericMetricCardV2";
import { ScaleMetricCardV2 } from "./metric-cards/ScaleMetricCardV2";

type Props = {
  metric: TrackerMetricWithQuickActions;
  date: string;
  onPress: () => void;
  lang: "es" | "en";
};

export const MetricCardV2: React.FC<Props> = ({
  metric,
  date,
  onPress,
  lang,
}) => {
  const { colors } = useColorScheme();
  const { user } = useAuth();

  // Get day data using React Query
  const { data: dayData } = useDayData(date, user?.id || "");

  // Find specific metric in day data
  const metricData = dayData?.metrics.find((m) => m.id === metric.id);

  // Calculate display data optimized with memoization
  const displayData = useMemo(
    () => getMetricDisplayData(metric, metricData, colors, lang),
    [metric, metricData, colors, lang]
  );

  // Render specific component based on input_type
  switch (metric.input_type) {
    case "boolean_toggle":
      return (
        <BooleanMetricCardV2
          metric={metric}
          displayData={displayData}
          onPress={onPress}
          lang={lang}
        />
      );

    case "scale_discrete":
      return (
        <ScaleMetricCardV2
          metric={metric}
          displayData={displayData}
          onPress={onPress}
          lang={lang}
        />
      );

    default:
      return (
        <NumericMetricCardV2
          metric={metric}
          displayData={displayData}
          onPress={onPress}
          lang={lang}
        />
      );
  }
};
