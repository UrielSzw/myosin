import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { prDetailTranslations } from "@/shared/translations/pr-detail";
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
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = prDetailTranslations;

  const { data, isLoading, error } = usePRDetail(exerciseId, user?.id);

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
        <PRDetailHeader exerciseName={t.loading[lang]} lang={lang} />
        <View style={{ padding: 16, alignItems: "center" }}>
          <Typography variant="body2" color="textMuted">
            {t.loadingData[lang]}
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  if (!data) {
    return (
      <ScreenWrapper fullscreen>
        <PRDetailHeader exerciseName={t.error[lang]} lang={lang} />
        <View style={{ padding: 16, alignItems: "center" }}>
          <Typography variant="body2" color="textMuted">
            {t.couldNotLoadData[lang]}
          </Typography>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper fullscreen>
      <PRDetailHeader exerciseName={data.exerciseInfo.name} lang={lang} />

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
            lang={lang}
          />
        )}

        {/* Chart Section */}
        <PRChartSection history={data.history} lang={lang} />
      </ScrollView>
    </ScreenWrapper>
  );
};
