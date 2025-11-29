import { usePRDetail } from "@/features/pr-detail-v2/hooks/use-pr-detail";
import { AuroraBackground } from "@/features/workouts-v2/components/AuroraBackground";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { prDetailTranslations } from "@/shared/translations/pr-detail";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PRChartV2 } from "./components/PRChartV2";
import { PRDetailHeaderV2 } from "./components/PRDetailHeaderV2";
import { PRHeroCardV2 } from "./components/PRHeroCardV2";
import { PRHistoryV2 } from "./components/PRHistoryV2";
import { PRStatsCardsV2 } from "./components/PRStatsCardsV2";

type Props = {
  exerciseId: string;
};

export const PRDetailFeatureV2: React.FC<Props> = ({ exerciseId }) => {
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = prDetailTranslations;
  const insets = useSafeAreaInsets();

  const { data, isLoading, error } = usePRDetail(exerciseId, user?.id);

  if (error) {
    console.error("[PRDetailFeatureV2] Error loading data:", error);
  }

  if (isLoading) {
    return (
      <View style={styles.fullscreen}>
        <AuroraBackground />
        <PRDetailHeaderV2 exerciseName={t.loading[lang]} lang={lang} />
        <View style={styles.loadingContainer}>
          <Typography variant="body2" color="textMuted">
            {t.loadingData[lang]}
          </Typography>
        </View>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.fullscreen}>
        <AuroraBackground />
        <PRDetailHeaderV2 exerciseName={t.error[lang]} lang={lang} />
        <View style={styles.loadingContainer}>
          <Typography variant="body2" color="textMuted">
            {t.couldNotLoadData[lang]}
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullscreen}>
      <AuroraBackground />
      <PRDetailHeaderV2 exerciseName={data.exerciseInfo.name} lang={lang} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Hero Card - Current PR destacado */}
        <PRHeroCardV2 currentPR={data.currentPR} lang={lang} />

        {/* Stats Cards - Progress, Period, Records */}
        {data.history.length >= 2 && (
          <PRStatsCardsV2
            totalProgress={data.progressStats.totalProgress}
            timeSpan={data.progressStats.timeSpan}
            totalPRs={data.history.length}
            lang={lang}
          />
        )}

        {/* Chart - 1RM Progression */}
        <PRChartV2 history={data.history} lang={lang} />

        {/* History - Timeline of all PRs */}
        <PRHistoryV2 history={data.history} lang={lang} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
  },
});
