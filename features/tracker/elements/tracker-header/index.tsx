import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { getDayKey } from "@/shared/utils/date-utils";
import { Zap } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { useDayDataSummary } from "../../hooks/use-tracker-data";

type Props = {
  selectedDate: string;
};

export const TrackerHeader: React.FC<Props> = ({ selectedDate }) => {
  const { colors } = useColorScheme();

  // Obtener resumen del día seleccionado usando React Query
  const { data: daySummary } = useDayDataSummary(selectedDate);

  // Helper para calcular progreso ponderado
  const calculateOverallProgress = (summary: typeof daySummary) => {
    if (!summary || !summary.summary.length) return 0;

    const metricsWithTargets = summary.summary.filter(
      (s) => s.metric.default_target && s.metric.default_target > 0
    );

    if (metricsWithTargets.length === 0) return 0;

    const totalProgress = metricsWithTargets.reduce(
      (acc, metricSummary) => acc + Math.min(metricSummary.progress, 100),
      0
    );

    return Math.round(totalProgress / metricsWithTargets.length);
  };

  // Calcular progreso total del día usando promedio ponderado del progreso real
  const totalMetrics = daySummary?.summary.length || 0;
  const metricsWithTargets =
    daySummary?.summary.filter(
      (s) => s.metric.default_target && s.metric.default_target > 0
    ).length || 0;
  const progressPercentage = calculateOverallProgress(daySummary);

  // Determinar el texto descriptivo
  const getProgressLabel = () => {
    if (totalMetrics === 0) return "Sin métricas";
    if (metricsWithTargets === 0) return "Sin objetivos definidos";

    const isToday = selectedDate === getDayKey();
    return isToday ? "Progreso del día" : `Progreso del ${selectedDate}`;
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        width: "100%",
        paddingHorizontal: 20,
        paddingTop: 20,
      }}
    >
      <View style={{ flex: 1 }}>
        <Typography variant="h2" weight="bold" style={{ marginBottom: 4 }}>
          Tracker
        </Typography>
        {totalMetrics > 0 && (
          <View
            style={{
              width: "100%",
            }}
          >
            {/* Progress Overview */}
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Typography variant="body2" color="textMuted">
                  {getProgressLabel()}
                </Typography>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Zap size={16} color={colors.secondary[500]} />
                  <Typography
                    variant="h4"
                    weight="bold"
                    style={{ color: colors.secondary[500] }}
                  >
                    {progressPercentage}%
                  </Typography>
                </View>
              </View>

              {/* Progress Bar */}
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
                    width: `${progressPercentage}%`,
                    backgroundColor: colors.secondary[500],
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
