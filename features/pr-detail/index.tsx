import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { ScrollView, View } from "react-native";
import { PRChartSection } from "./elements/pr-chart-section";
import { PRDetailHeader } from "./elements/pr-detail-header";
import { PRStatsCards } from "./elements/pr-stats-cards";
import { usePRDetail } from "./hooks/use-pr-detail";

type Props = {
  exerciseId: string;
};

export const PRDetailFeature: React.FC<Props> = ({ exerciseId }) => {
  const { data, isLoading, error } = usePRDetail(exerciseId);

  // Usar los progressStats que vienen del hook (ya calculados correctamente)
  const progressStats = React.useMemo(() => {
    if (!data || data.history.length < 2) {
      return null;
    }

    const firstPR = data.history[data.history.length - 1]; // Más antiguo
    const lastPR = data.currentPR; // El current PR es el más reciente

    return {
      firstPR,
      lastPR,
      totalProgress: data.progressStats.totalProgress,
      timeSpan: data.progressStats.timeSpan,
    };
  }, [data]);

  if (error) {
    console.error("[PRDetailFeature] Error loading data:", error);
  }

  if (isLoading) {
    return (
      <ScreenWrapper fullscreen>
        <PRDetailHeader exerciseName="Cargando..." />
        <View style={{ padding: 16, alignItems: "center" }}>
          <Typography variant="body2" color="textMuted">
            Cargando datos del PR...
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  if (!data) {
    return (
      <ScreenWrapper fullscreen>
        <PRDetailHeader exerciseName="Error" />
        <View style={{ padding: 16, alignItems: "center" }}>
          <Typography variant="body2" color="textMuted">
            No se pudieron cargar los datos del PR
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper fullscreen>
      <PRDetailHeader exerciseName={data.exerciseInfo.name} />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
      >
        {/* Stats Cards */}
        {progressStats && (
          <PRStatsCards
            firstPR={progressStats.firstPR}
            lastPR={progressStats.lastPR}
            totalProgress={progressStats.totalProgress}
            timeSpan={progressStats.timeSpan}
          />
        )}

        {/* Chart Section */}
        <PRChartSection history={data.history} />
      </ScrollView>
    </ScreenWrapper>
  );
};
