import { toSupportedLanguage } from "@/shared/types/language";
import { useAnalyticsData } from "@/features/analytics-v2/hooks/use-analytics-data";
import { useTrackerAnalytics } from "@/features/analytics-v2/hooks/use-tracker-analytics";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { analyticsTranslations as t } from "@/shared/translations/analytics";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { AlertCircle, BarChart3 } from "lucide-react-native";
import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuroraBackground } from "../workouts-v2/components/AuroraBackground";
import { AnalyticsHeaderV2 } from "./components/AnalyticsHeaderV2";
import { PRHighlightsV2 } from "./components/PRHighlightsV2";
import { RecentActivityV2 } from "./components/RecentActivityV2";
import { StatsOverviewV2 } from "./components/StatsOverviewV2";
import { TrackerInsightsV2 } from "./components/TrackerInsightsV2";
import { VolumeChartV2 } from "./components/VolumeChartV2";
import { WeeklyScheduleV2 } from "./components/WeeklyScheduleV2";

export const AnalyticsFeatureV2 = () => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  // Data fetching
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useAnalyticsData(user?.id);

  const { data: trackerData, isLoading: trackerLoading } = useTrackerAnalytics(
    user?.id
  );

  const isLoading = analyticsLoading || trackerLoading;

  // Calculate header height
  const headerHeight = insets.top + 8 + 40 + 24;

  // Authentication check
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AuroraBackground />
        <View style={styles.centerContent}>
          <View
            style={[
              styles.errorIconContainer,
              { backgroundColor: `${colors.primary[500]}15` },
            ]}
          >
            <AlertCircle size={32} color={colors.primary[500]} />
          </View>
          <Typography variant="h6" weight="semibold" align="center">
            {t.signInRequired[lang]}
          </Typography>
          <Typography
            variant="body2"
            color="textMuted"
            align="center"
            style={{ marginTop: 8 }}
          >
            {t.signInRequiredDescription[lang]}
          </Typography>
        </View>
      </View>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <AnalyticsHeaderV2 />
        <View style={styles.centerContent}>
          <Animated.View
            entering={FadeIn.duration(300)}
            style={[
              styles.loadingCard,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.8)",
              },
            ]}
          >
            {Platform.OS === "ios" && (
              <BlurView
                intensity={isDarkMode ? 20 : 40}
                tint={isDarkMode ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            )}
            <BarChart3
              size={24}
              color={colors.primary[500]}
              style={{ marginBottom: 8 }}
            />
            <Typography
              variant="body1"
              weight="medium"
              style={{ color: colors.text }}
            >
              {t.loadingAnalytics[lang]}
            </Typography>
          </Animated.View>
        </View>
      </View>
    );
  }

  // Error state
  if (analyticsError) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <AnalyticsHeaderV2 />
        <View style={styles.centerContent}>
          <View
            style={[
              styles.errorIconContainer,
              { backgroundColor: `${colors.error[500]}15` },
            ]}
          >
            <AlertCircle size={32} color={colors.error[500]} />
          </View>
          <Typography variant="h6" weight="semibold" align="center">
            {t.errorLoading[lang]}
          </Typography>
          <Typography
            variant="body2"
            color="textMuted"
            align="center"
            style={{ marginTop: 8 }}
          >
            {analyticsError?.message || t.errorLoadingDescription[lang]}
          </Typography>
        </View>
      </View>
    );
  }

  // Empty state
  const hasWorkoutData =
    analyticsData &&
    (analyticsData.recentSessions.length > 0 ||
      analyticsData.activeRoutines.length > 0);
  const hasTrackerData =
    trackerData &&
    (trackerData.streaks.some((s) => s.currentStreak > 0) ||
      trackerData.weightProgress.hasWeightMetric ||
      trackerData.habits.length > 0);

  if (!hasWorkoutData && !hasTrackerData) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <AnalyticsHeaderV2 />
        <View style={styles.centerContent}>
          <Animated.View
            entering={FadeInDown.duration(400).delay(100)}
            style={[
              styles.emptyCard,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(255,255,255,0.85)",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              },
            ]}
          >
            {Platform.OS === "ios" && (
              <BlurView
                intensity={isDarkMode ? 20 : 40}
                tint={isDarkMode ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            )}
            <View style={styles.emptyContent}>
              <View
                style={[
                  styles.emptyIconContainer,
                  { backgroundColor: `${colors.primary[500]}15` },
                ]}
              >
                <BarChart3 size={40} color={colors.primary[500]} />
              </View>
              <Typography
                variant="h5"
                weight="bold"
                align="center"
                style={{ color: colors.text, marginTop: 20 }}
              >
                {t.noDataYet[lang]}
              </Typography>
              <Typography
                variant="body2"
                color="textMuted"
                align="center"
                style={{ marginTop: 8, paddingHorizontal: 20 }}
              >
                {t.noDataYetDescription[lang]}
              </Typography>
            </View>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AuroraBackground />
      <AnalyticsHeaderV2 />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + 16,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview - Hero Section */}
        {analyticsData && <StatsOverviewV2 data={analyticsData} lang={lang} />}

        {/* Weekly Schedule */}
        {analyticsData && analyticsData.activeRoutines.length > 0 && (
          <View style={styles.section}>
            <WeeklyScheduleV2
              activeRoutines={analyticsData.activeRoutines}
              lang={lang}
            />
          </View>
        )}

        {/* Volume Chart */}
        {analyticsData &&
          Object.keys(analyticsData.weeklyVolume).length > 0 && (
            <View style={styles.section}>
              <VolumeChartV2
                weeklyVolume={analyticsData.weeklyVolume}
                lang={lang}
              />
            </View>
          )}

        {/* PR Highlights */}
        {analyticsData && analyticsData.topPRs.length > 0 && (
          <View style={styles.section}>
            <PRHighlightsV2 prs={analyticsData.topPRs} lang={lang} />
          </View>
        )}

        {/* Recent Activity */}
        {analyticsData && (
          <View style={styles.section}>
            <RecentActivityV2
              sessions={analyticsData.recentSessions}
              lang={lang}
            />
          </View>
        )}

        {/* Tracker Insights */}
        {trackerData && hasTrackerData && (
          <View style={styles.section}>
            <TrackerInsightsV2 data={trackerData} lang={lang} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  loadingCard: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
  },
  emptyCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    marginHorizontal: 20,
    width: "100%",
    maxWidth: 340,
  },
  emptyContent: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
});

export default AnalyticsFeatureV2;
