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

  // Calcular stats básicos del progreso
  const progressStats = React.useMemo(() => {
    if (!data || data.history.length < 2) {
      return null;
    }

    const firstPR = data.history[data.history.length - 1]; // Más antiguo
    const lastPR = data.currentPR; // El current PR es el más reciente
    const totalProgress = lastPR.best_weight - firstPR.weight;

    // Calcular tiempo transcurrido
    const firstDate = new Date(firstPR.created_at || new Date());
    const lastDate = new Date(lastPR.achieved_at);
    const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);

    const timeSpan =
      diffMonths > 0
        ? `${diffMonths} ${diffMonths === 1 ? "mes" : "meses"}`
        : `${diffDays} días`;

    return {
      firstPR,
      lastPR,
      totalProgress,
      timeSpan,
    };
  }, [data]);

  // Logging temporal para análisis
  React.useEffect(() => {
    if (data) {
      console.log("=== PR DETAIL ANALYSIS ===");
      console.log("Exercise ID:", exerciseId);
      console.log("Exercise Info:", data.exerciseInfo);
      console.log("Current PR:", data.currentPR);
      console.log("History Count:", data.history.length);
      console.log("Progress Stats:", data.progressStats);
      console.log("Full History:", JSON.stringify(data.history, null, 2));
      console.log("=========================");
    }
  }, [data, exerciseId]);

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
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
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
        <PRChartSection
          history={data.history}
          exerciseName={data.exerciseInfo.name}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};
